/**
 * Crunchyroll Watchlist Organizer - content.js (v1.1.0)
 * Destaca visualmente ("pinta somente o texto") e organiza os animes que estão
 * em andamento ou para começar ("Continuar", "Começar a Assistir", "A Seguir").
 */

(function () {
  'use strict';

  // Configurações padrão
  const DEFAULT_SETTINGS = {
    enabled: true,
    highlightColor: '#f47521',
    paintOnlyText: true,     // Pinte somente o texto (sem bordas/caixas pesadas no card)
    paintTitle: true,        // Pintar o título do anime
    paintSubtitle: true,     // Pintar o subtítulo (status) do anime
    cardBorder: false,       // Borda externa desativada por padrão (foco no texto)
    showBadge: false,        // Badge desativada por padrão para não poluir
    dimCompleted: false,     // NÃO deixar tudo escuro! Mantém 100% visível por padrão
    includeNext: true,       // "A Seguir"
    includeStart: true,      // "Começar a Assistir"
    includeContinue: true,   // "Continuar"
    showToolbar: true,
    reorderMode: 'slots'     // 'slots' (Início global) ou 'highlight_only'
  };

  let currentSettings = { ...DEFAULT_SETTINGS };
  let debounceTimer = null;
  let isProcessing = false;
  let isReordering = false;
  let originalIndexCounter = 0;

  // Carregar configurações salvas
  function loadSettings(callback) {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.get(DEFAULT_SETTINGS, function (items) {
        currentSettings = { ...DEFAULT_SETTINGS, ...items };
        applySettingsToStyles();
        if (callback) callback();
      });
    } else {
      try {
        const saved = localStorage.getItem('cr_organizer_settings');
        if (saved) {
          currentSettings = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
        }
      } catch (e) {
        console.warn('[CR Organizer] Erro ao carregar localStorage:', e);
      }
      applySettingsToStyles();
      if (callback) callback();
    }
  }

  // Atualiza as variáveis CSS globais de acordo com a cor escolhida
  function applySettingsToStyles() {
    const hex = currentSettings.highlightColor || '#f47521';
    document.documentElement.style.setProperty('--cr-highlight-color', hex);

    const rgb = hexToRgb(hex);
    if (rgb) {
      document.documentElement.style.setProperty(
        '--cr-glow-color',
        `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.35)`
      );
    }

    // 1. NÃO DEIXAR TUDO ESCURO
    // Apenas aplica classe de esmaecimento se o usuário explicitamente ativar no popup
    if (currentSettings.dimCompleted) {
      document.body.classList.add('cr-dim-completed');
    } else {
      document.body.classList.remove('cr-dim-completed');
    }
  }

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  // Verifica se estamos em uma página de Watchlist
  function isWatchlistPage() {
    return window.location.pathname.includes('/watchlist');
  }

  /**
   * Encontra EXCLUSIVAMENTE os elementos raiz dos cards da watchlist,
   * sem selecionar sub-elementos internos (imagem, body, título, subtítulo).
   */
  function findWatchlistCards() {
    // 1. Seletor oficial da Crunchyroll
    let candidates = Array.from(document.querySelectorAll('[data-t="watch-list-card"], [data-t="watchlist-card"]'));

    // 2. Seletor por estrutura da lista
    if (!candidates || candidates.length === 0) {
      candidates = Array.from(document.querySelectorAll('.erc-my-lists-item > div > [class*="watchlist-card"]'));
    }

    // 3. Fallback genérico por classe BEM raiz
    if (!candidates || candidates.length === 0) {
      candidates = Array.from(document.querySelectorAll('div[class*="watchlist-card--"]'));
    }

    // 4. Fallback heurístico
    if (!candidates || candidates.length === 0) {
      const textElements = Array.from(document.querySelectorAll('span, div, p')).filter(el => {
        const text = el.textContent ? el.textContent.toLowerCase() : '';
        return (
          text.includes('assistir de novo') ||
          text.includes('começar a assistir') ||
          text.includes('continuar:') ||
          text.includes('a seguir:')
        );
      });
      const cardSet = new Set();
      textElements.forEach(el => {
        const card = el.closest('[data-t="watch-list-card"]') ||
                     el.closest('[class*="watchlist-card--"]') ||
                     el.closest('.erc-my-lists-item');
        if (card && card !== document.body) {
          cardSet.add(card);
        }
      });
      candidates = Array.from(cardSet);
    }

    // FILTRO RIGOROSO:
    // Nunca selecionar partes internas do card (como -image, -body, -title, -subtitle, -actions)
    // e nunca selecionar um elemento se ele for filho de outro card já detectado.
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

  /**
   * Encontra o container/célula correspondente a este card dentro da grade ou fileira.
   */
  function getItemContainer(card) {
    const ercItem = card.closest('.erc-my-lists-item');
    if (ercItem) return ercItem;

    let curr = card;
    while (curr.parentElement && curr.parentElement !== document.body) {
      const parent = curr.parentElement;
      if (parent.children.length > 1) {
        return curr;
      }
      curr = parent;
    }
    return card;
  }

  /**
   * Reordena os cards nos slots físicos da página (atravessando fileiras)
   * para que TODOS os prioritários ocupem as primeiras posições da grade/lista,
   * sem ficarem presos na fileira de origem.
   */
  function reorderSlots(orderedCards) {
    if (!orderedCards || orderedCards.length === 0) return;

    // 1. Mapeia cada card para seu container de item na grade
    const allContainers = [];
    const containerToCard = new Map();

    orderedCards.forEach(card => {
      const container = getItemContainer(card);
      if (!containerToCard.has(container)) {
        containerToCard.set(container, card);
        allContainers.push(container);
      }
    });

    if (allContainers.length <= 1) return;

    // 2. Obtém a ordem atual dos containers no DOM (da esquerda para direita, de cima para baixo)
    const currentDomContainers = [...allContainers].sort((a, b) => {
      if (a === b) return 0;
      const pos = a.compareDocumentPosition(b);
      return (pos & Node.DOCUMENT_POSITION_FOLLOWING) ? -1 : 1;
    });

    // 3. Os containers ordenados desejados seguem a lista de cards ordenada (prioritários primeiro)
    const targetContainers = allContainers;

    // 4. Verifica se já está exatamente na ordem desejada
    let alreadySorted = (currentDomContainers.length === targetContainers.length);
    if (alreadySorted) {
      for (let i = 0; i < currentDomContainers.length; i++) {
        if (currentDomContainers[i] !== targetContainers[i]) {
          alreadySorted = false;
          break;
        }
      }
    }

    if (alreadySorted) {
      return; // Já ordenado, nenhuma mutação no DOM
    }

    // 5. Executa a reorganização por slots usando marcadores de comentário (placeholders)
    isReordering = true;
    try {
      const placeholders = [];
      for (let i = 0; i < currentDomContainers.length; i++) {
        const ph = document.createComment('cr-slot-' + i);
        const slotEl = currentDomContainers[i];
        if (slotEl && slotEl.parentNode) {
          slotEl.parentNode.insertBefore(ph, slotEl);
          placeholders.push(ph);
        } else {
          placeholders.push(null);
        }
      }

      for (let i = 0; i < targetContainers.length; i++) {
        const ph = placeholders[i];
        const container = targetContainers[i];
        if (ph && ph.parentNode && container) {
          ph.parentNode.insertBefore(container, ph);
        }
      }

      placeholders.forEach(ph => {
        if (ph && ph.parentNode) ph.remove();
      });
    } catch (e) {
      console.warn('[CR Organizer] Erro ao reorganizar slots:', e);
    } finally {
      setTimeout(() => {
        isReordering = false;
      }, 150);
    }
  }

  /**
   * Analisa um card e determina seu status
   */
  function inspectCardStatus(card) {
    // Busca elemento de subtítulo dentro deste card
    let subtitleEl = card.querySelector('[class*="watchlist-card-subtitle--"], [class*="watchlist-card-subtitle"], [class*="subtitle"]');
    let text = subtitleEl ? subtitleEl.textContent : '';

    if (!text || text.trim() === '') {
      text = card.innerText || card.textContent || '';
    }

    text = text.toLowerCase().trim();

    // 1. Concluído / Já assistido
    if (text.includes('assistir de novo') || text.includes('watch again') || text.includes('volver a ver')) {
      return { type: 'COMPLETED', label: 'Assistir de Novo', rawText: text };
    }

    // 2. Prioritários
    // A) Começar a Assistir
    if (
      currentSettings.includeStart &&
      (text.includes('começar a assistir') || text.includes('start watching') || text.includes('empezar a ver'))
    ) {
      return { type: 'START', label: 'COMEÇAR', rawText: text };
    }

    // B) Continuar
    if (
      currentSettings.includeContinue &&
      (text.includes('continuar') || text.includes('continue'))
    ) {
      return { type: 'CONTINUE', label: 'CONTINUAR', rawText: text };
    }

    // C) A Seguir (Novos episódios)
    if (
      currentSettings.includeNext &&
      (text.includes('a seguir') || text.includes('up next') || text.includes('siguiente'))
    ) {
      return { type: 'NEXT', label: 'A SEGUIR', rawText: text };
    }

    // D) Assistir genérico
    if (text.includes('assistir') && !text.includes('de novo')) {
      return { type: 'WATCH', label: 'ASSISTIR', rawText: text };
    }

    return { type: 'OTHER', label: '', rawText: text };
  }

  /**
   * Processa os cards: pinta o texto dos prioritários e organiza a lista
   */
  function processWatchlist() {
    if (!isWatchlistPage() || !currentSettings.enabled) {
      clearModifications();
      return;
    }

    const cards = findWatchlistCards();
    if (!cards || cards.length === 0) return;

    let priorityCards = [];
    let completedCards = [];
    let otherCards = [];

    cards.forEach(card => {
      if (!card.dataset.crOriginalIndex) {
        card.dataset.crOriginalIndex = String(originalIndexCounter++);
      }

      const status = inspectCardStatus(card);

      if (['START', 'CONTINUE', 'NEXT', 'WATCH'].includes(status.type)) {
        priorityCards.push({ card, status });
      } else if (status.type === 'COMPLETED') {
        completedCards.push({ card, status });
      } else {
        otherCards.push({ card, status });
      }
    });

    // 1. Aplicar destaque aos prioritários (PINTE SOMENTE O TEXTO)
    priorityCards.forEach(({ card, status }) => {
      card.classList.add('cr-card-priority');
      card.classList.remove('cr-card-completed');

      if (currentSettings.cardBorder) {
        card.classList.add('cr-card-border-active');
      } else {
        card.classList.remove('cr-card-border-active');
      }

      const itemContainer = getItemContainer(card);
      itemContainer.style.order = ''; // Limpa order CSS para não prender em fileiras

      // Injeta badge somente se o usuário tiver configurado
      if (currentSettings.showBadge) {
        injectBadge(card, status.label);
      } else {
        removeBadge(card);
      }
    });

    // 2. Tratar cards concluídos ("Assistir de Novo")
    // (NÃO DEIXAR TUDO ESCURO - visibilidade 100% normal por padrão)
    completedCards.forEach(({ card }) => {
      card.classList.add('cr-card-completed');
      card.classList.remove('cr-card-priority');
      card.classList.remove('cr-card-border-active');

      const itemContainer = getItemContainer(card);
      itemContainer.style.order = '';
      removeBadge(card);
    });

    // 3. Outros cards
    otherCards.forEach(({ card }) => {
      card.classList.remove('cr-card-priority');
      card.classList.remove('cr-card-completed');
      card.classList.remove('cr-card-border-active');

      const itemContainer = getItemContainer(card);
      itemContainer.style.order = '';
      removeBadge(card);
    });

    // 4. Reordenação Real por Slots (Leva TODOS os prioritários para o início da lista)
    if (currentSettings.reorderMode !== 'highlight_only') {
      const sortedCards = [
        ...priorityCards.map(p => p.card),
        ...completedCards.map(c => c.card),
        ...otherCards.map(o => o.card)
      ];
      reorderSlots(sortedCards);
    }

    // 5. Barra de estatísticas no topo da watchlist
    if (currentSettings.showToolbar) {
      updateToolbar(priorityCards.length, completedCards.length, cards.length);
    } else {
      removeToolbar();
    }
  }

  /**
   * Injeta a badge visual no card (se habilitado)
   */
  function injectBadge(card, text) {
    if (!currentSettings.showBadge || !text) {
      removeBadge(card);
      return;
    }

    // Garante que não haja duplicatas
    const existingBadges = card.querySelectorAll('.cr-priority-badge');
    if (existingBadges.length > 1) {
      for (let i = 1; i < existingBadges.length; i++) {
        existingBadges[i].remove();
      }
    }

    let badge = card.querySelector('.cr-priority-badge');
    if (!badge) {
      badge = document.createElement('div');
      badge.className = 'cr-priority-badge';
      badge.innerHTML = `
        <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        <span class="cr-badge-text"></span>
      `;
      card.appendChild(badge);
    }

    const textSpan = badge.querySelector('.cr-badge-text');
    if (textSpan) {
      textSpan.textContent = text;
    }
  }

  function removeBadge(card) {
    const badges = card.querySelectorAll('.cr-priority-badge');
    badges.forEach(b => b.remove());
  }

  /**
   * Cria ou atualiza a barra de status no topo da watchlist
   * (posicionada ACIMA da grade, sem ocupar slot de card)
   */
  function updateToolbar(priorityCount, completedCount, totalCount) {
    let toolbar = document.querySelector('.cr-organizer-toolbar');

    // Inserir antes do container principal do grid da watchlist
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
        <button id="cr-reorder-btn" title="Reorganizar e reordenar itens agora">⚡ Reordenar</button>
      </div>
    `;

    const btn = toolbar.querySelector('#cr-reorder-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        btn.textContent = '⏳ Organizando...';
        processWatchlist();
        setTimeout(() => {
          btn.textContent = '⚡ Reordenar';
        }, 350);
      });
    }
  }

  function removeToolbar() {
    const toolbar = document.querySelector('.cr-organizer-toolbar');
    if (toolbar) toolbar.remove();
  }

  /**
   * Limpa todas as modificações quando desativado
   */
  function clearModifications() {
    const cards = findWatchlistCards();
    cards.forEach(card => {
      card.classList.remove('cr-card-priority');
      card.classList.remove('cr-card-completed');
      card.classList.remove('cr-card-border-active');
      const itemContainer = getItemContainer(card);
      itemContainer.style.order = '';
      removeBadge(card);
    });

    // Se houver índice original salvo, restaura a ordem original
    const cardsWithOriginal = cards.filter(c => c.dataset.crOriginalIndex !== undefined);
    if (cardsWithOriginal.length === cards.length && cardsWithOriginal.length > 1) {
      cardsWithOriginal.sort((a, b) => {
        return parseInt(a.dataset.crOriginalIndex, 10) - parseInt(b.dataset.crOriginalIndex, 10);
      });
      reorderSlots(cardsWithOriginal);
    }

    removeToolbar();
    document.body.classList.remove('cr-dim-completed');
  }

  /**
   * Debounce para executar o reprocessamento com performance
   */
  function triggerProcessWatchlist() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      if (!isProcessing && !isReordering) {
        isProcessing = true;
        try {
          processWatchlist();
        } finally {
          isProcessing = false;
        }
      }
    }, 120);
  }

  // Configuração do MutationObserver
  const observer = new MutationObserver(mutations => {
    if (isReordering) return;
    if (!isWatchlistPage()) return;

    let shouldUpdate = false;
    for (const m of mutations) {
      // Ignora mutações provocadas pela própria barra, badges ou comentários de slot
      if (m.target && m.target.classList &&
         (m.target.classList.contains('cr-organizer-toolbar') || m.target.classList.contains('cr-priority-badge'))) {
        continue;
      }
      if (m.target && m.target.nodeType === Node.COMMENT_NODE) {
        continue;
      }
      if (m.addedNodes.length > 0) {
        shouldUpdate = true;
        break;
      }
    }

    if (shouldUpdate) {
      triggerProcessWatchlist();
    }
  });

  // Escuta mudanças de URL da SPA (Single Page Application)
  function setupNavigationListener() {
    let lastUrl = location.href;

    const checkUrlChange = () => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        if (isWatchlistPage()) {
          setTimeout(triggerProcessWatchlist, 300);
        } else {
          clearModifications();
        }
      }
    };

    const origPush = history.pushState;
    history.pushState = function () {
      origPush.apply(this, arguments);
      checkUrlChange();
    };

    const origReplace = history.replaceState;
    history.replaceState = function () {
      origReplace.apply(this, arguments);
      checkUrlChange();
    };

    window.addEventListener('popstate', checkUrlChange);
  }

  // Ouvir mensagens enviadas pelo popup da extensão
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'updateSettings') {
        currentSettings = { ...currentSettings, ...request.settings };
        applySettingsToStyles();
        processWatchlist();
        sendResponse({ success: true });
      } else if (request.action === 'getStats') {
        const cards = findWatchlistCards();
        let priority = 0;
        let completed = 0;
        cards.forEach(c => {
          const st = inspectCardStatus(c);
          if (['START', 'CONTINUE', 'NEXT', 'WATCH'].includes(st.type)) priority++;
          else if (st.type === 'COMPLETED') completed++;
        });
        sendResponse({
          total: cards.length,
          priority: priority,
          completed: completed
        });
      }
      return true;
    });
  }

  // Inicialização
  function init() {
    loadSettings(() => {
      if (isWatchlistPage()) {
        triggerProcessWatchlist();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    setupNavigationListener();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
