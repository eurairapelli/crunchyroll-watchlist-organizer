// ==UserScript==
// @name         Crunchyroll Watchlist Organizer
// @namespace    https://github.com/crunchyroll-watchlist-organizer
// @version      1.1.0
// @description  Pinta o texto e move para o topo da Watchlist da Crunchyroll os animes que estão em andamento ou para começar ("Continuar", "Começar a Assistir", "A Seguir").
// @author       Antigravity
// @match        *://*.crunchyroll.com/*/watchlist*
// @match        *://*.crunchyroll.com/watchlist*
// @grant        GM_addStyle
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  const STYLES = `
    :root {
      --cr-highlight-color: #f47521;
      --cr-glow-color: rgba(244, 117, 33, 0.35);
    }

    /* 1. NÃO DEIXA TUDO ESCURO: itens concluídos mantêm visibilidade 100% normal */
    .cr-card-completed {
      opacity: 1 !important;
      filter: none !important;
    }

    /* 2. PINTE SOMENTE O TEXTO: sem bordas pesadas ou caixas brilhantes no card */
    .cr-card-priority {
      position: relative !important;
      border: none !important;
      box-shadow: none !important;
      outline: none !important;
      transition: transform 0.2s ease !important;
    }

    .cr-card-priority:hover {
      transform: translateY(-2px) !important;
    }

    /* Pinte o texto do subtítulo de status */
    .cr-card-priority [class*="watchlist-card-subtitle"],
    .cr-card-priority [class*="subtitle"],
    .cr-card-priority .watchlist-card-subtitle--IROsU {
      color: var(--cr-highlight-color, #f47521) !important;
      font-weight: 700 !important;
      letter-spacing: 0.2px !important;
    }

    /* Pinte o título do anime */
    .cr-card-priority [class*="watchlist-card-title"] h3,
    .cr-card-priority [class*="watchlist-card-title__text"],
    .cr-card-priority .watchlist-card-title__text--chGlt {
      color: var(--cr-highlight-color, #f47521) !important;
      font-weight: 800 !important;
      transition: color 0.2s ease, text-shadow 0.2s ease !important;
    }

    .cr-card-priority:hover [class*="watchlist-card-title__text"] {
      text-shadow: 0 0 10px var(--cr-glow-color, rgba(244, 117, 33, 0.45)) !important;
    }

    /* Barra de estatísticas no topo da Watchlist */
    .cr-organizer-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      box-sizing: border-box;
      background: #141519;
      border: 1px solid #23252b;
      border-left: 4px solid var(--cr-highlight-color);
      border-radius: 6px;
      padding: 10px 16px;
      margin: 12px 0 20px 0;
      color: #e0e0e0;
      font-family: 'Lato', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 13px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    .cr-organizer-toolbar .cr-stats {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .cr-organizer-toolbar .cr-stats-count {
      background: var(--cr-highlight-color);
      color: #fff;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
    }

    .cr-organizer-toolbar button {
      background: #23252b;
      color: #fff;
      border: 1px solid #3d404a;
      border-radius: 4px;
      padding: 6px 14px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .cr-organizer-toolbar button:hover {
      background: var(--cr-highlight-color);
      border-color: var(--cr-highlight-color);
    }
  `;

  if (typeof GM_addStyle !== 'undefined') {
    GM_addStyle(STYLES);
  } else {
    const styleEl = document.createElement('style');
    styleEl.textContent = STYLES;
    document.head.appendChild(styleEl);
  }

  function isWatchlistPage() {
    return window.location.pathname.includes('/watchlist');
  }

  function findWatchlistCards() {
    let candidates = Array.from(document.querySelectorAll('[data-t="watch-list-card"], [data-t="watchlist-card"]'));

    if (!candidates || candidates.length === 0) {
      candidates = Array.from(document.querySelectorAll('.erc-my-lists-item > div > [class*="watchlist-card"]'));
    }

    if (!candidates || candidates.length === 0) {
      candidates = Array.from(document.querySelectorAll('div[class*="watchlist-card--"]'));
    }

    // Filtra exclusivamente cards raiz
    const cards = candidates.filter(el => {
      const cls = el.className || '';
      if (typeof cls === 'string') {
        if (cls.includes('-image') ||
            cls.includes('-body') ||
            cls.includes('-title') ||
            cls.includes('-subtitle') ||
            cls.includes('-actions') ||
            cls.includes('__content-link')) {
          return false;
        }
      }
      return !el.parentElement?.closest('[data-t="watch-list-card"], [data-t="watchlist-card"]');
    });

    return cards;
  }

  function inspectCardStatus(card) {
    let subtitleEl = card.querySelector('[class*="watchlist-card-subtitle--"], [class*="watchlist-card-subtitle"], [class*="subtitle"]');
    let text = subtitleEl ? subtitleEl.textContent : (card.innerText || card.textContent || '');
    text = text.toLowerCase().trim();

    if (text.includes('assistir de novo') || text.includes('watch again')) {
      return { type: 'COMPLETED', label: 'Assistir de Novo' };
    }

    if (text.includes('começar a assistir') || text.includes('start watching')) {
      return { type: 'START', label: 'COMEÇAR' };
    }

    if (text.includes('continuar') || text.includes('continue')) {
      return { type: 'CONTINUE', label: 'CONTINUAR' };
    }

    if (text.includes('a seguir') || text.includes('up next')) {
      return { type: 'NEXT', label: 'A SEGUIR' };
    }

    if (text.includes('assistir') && !text.includes('de novo')) {
      return { type: 'WATCH', label: 'ASSISTIR' };
    }

    return { type: 'OTHER', label: '' };
  }

  function updateToolbar(priorityCount, completedCount, totalCount) {
    let toolbar = document.querySelector('.cr-organizer-toolbar');
    const target = document.querySelector('.watchlist-body') ||
                   document.querySelector('[role="list"]') ||
                   document.querySelector('.erc-watchlist');

    if (!target || !target.parentElement) return;

    if (!toolbar) {
      toolbar = document.createElement('div');
      toolbar.className = 'cr-organizer-toolbar';
      target.parentElement.insertBefore(toolbar, target);
    }

    toolbar.innerHTML = `
      <div class="cr-stats">
        <span>🎯 <strong>Para Assistir:</strong> <span class="cr-stats-count">${priorityCount}</span></span>
        <span>✔️ <strong>Em dia / Já vistos:</strong> ${completedCount}</span>
        <span>📁 <strong>Total na tela:</strong> ${totalCount}</span>
      </div>
      <div class="cr-actions">
        <button id="cr-reorder-btn" title="Reorganizar itens agora">⚡ Reordenar</button>
      </div>
    `;

    const btn = toolbar.querySelector('#cr-reorder-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        btn.textContent = '⏳ Organizando...';
        processWatchlist();
        setTimeout(() => { btn.textContent = '⚡ Reordenar'; }, 350);
      });
    }
  }

  function processWatchlist() {
    if (!isWatchlistPage()) return;
    const cards = findWatchlistCards();
    if (!cards || cards.length === 0) return;

    let priorityCards = [];
    let completedCards = [];

    cards.forEach(card => {
      const status = inspectCardStatus(card);
      if (['START', 'CONTINUE', 'NEXT', 'WATCH'].includes(status.type)) {
        priorityCards.push({ card, status });
      } else if (status.type === 'COMPLETED') {
        completedCards.push({ card, status });
      }
    });

    priorityCards.forEach(({ card }, index) => {
      card.classList.add('cr-card-priority');
      card.classList.remove('cr-card-completed');
      const itemContainer = card.closest('.erc-my-lists-item') || card;
      itemContainer.style.order = String(-1000 + index);
    });

    completedCards.forEach(({ card }, index) => {
      card.classList.add('cr-card-completed');
      card.classList.remove('cr-card-priority');
      const itemContainer = card.closest('.erc-my-lists-item') || card;
      itemContainer.style.order = String(10 + index);
    });

    updateToolbar(priorityCards.length, completedCards.length, cards.length);
  }

  let debounceTimer = null;
  function triggerProcess() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(processWatchlist, 120);
  }

  const observer = new MutationObserver(mutations => {
    if (!isWatchlistPage()) return;
    let shouldUpdate = false;
    for (const m of mutations) {
      if (m.target && m.target.classList &&
         (m.target.classList.contains('cr-organizer-toolbar') || m.target.classList.contains('cr-priority-badge'))) {
        continue;
      }
      if (m.addedNodes.length > 0) {
        shouldUpdate = true;
        break;
      }
    }
    if (shouldUpdate) triggerProcess();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  const origPush = history.pushState;
  history.pushState = function () {
    origPush.apply(this, arguments);
    if (isWatchlistPage()) setTimeout(triggerProcess, 300);
  };

  window.addEventListener('popstate', () => {
    if (isWatchlistPage()) setTimeout(triggerProcess, 300);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', triggerProcess);
  } else {
    triggerProcess();
  }
})();
