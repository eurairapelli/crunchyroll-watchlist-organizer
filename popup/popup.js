/**
 * Crunchyroll Watchlist Organizer - popup.js (v1.1.0)
 */

document.addEventListener('DOMContentLoaded', () => {
  const DEFAULT_SETTINGS = {
    enabled: true,
    highlightColor: '#f47521',
    paintOnlyText: true,
    cardBorder: false,
    showBadge: false,
    dimCompleted: false,
    includeNext: true,
    includeStart: true,
    includeContinue: true,
    showToolbar: true,
    reorderMode: 'slots'
  };

  // Elementos do DOM
  const toggleEnabled = document.getElementById('toggle-enabled');
  const optPaintOnlyText = document.getElementById('opt-paint-only-text');
  const optCardBorder = document.getElementById('opt-card-border');
  const optBadge = document.getElementById('opt-badge');
  const optDim = document.getElementById('opt-dim');
  const optNext = document.getElementById('opt-next');
  const optContinue = document.getElementById('opt-continue');
  const optStart = document.getElementById('opt-start');
  const optToolbar = document.getElementById('opt-toolbar');
  const selectMode = document.getElementById('select-reorder-mode');
  const customColorInput = document.getElementById('custom-color-input');
  const customColorHex = document.getElementById('custom-color-hex');
  const colorBtns = document.querySelectorAll('.color-btn');

  const statPriority = document.getElementById('stat-priority');
  const statCompleted = document.getElementById('stat-completed');
  const statTotal = document.getElementById('stat-total');

  const btnReorderNow = document.getElementById('btn-reorder-now');
  const btnReset = document.getElementById('btn-reset');

  let currentSettings = { ...DEFAULT_SETTINGS };

  // Carregar configurações
  function loadSettings() {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.get(DEFAULT_SETTINGS, items => {
        currentSettings = { ...DEFAULT_SETTINGS, ...items };
        updateUI();
        queryStats();
      });
    } else {
      const saved = localStorage.getItem('cr_organizer_settings');
      if (saved) {
        currentSettings = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
      updateUI();
    }
  }

  // Atualizar a interface com as configurações
  function updateUI() {
    toggleEnabled.checked = currentSettings.enabled;
    optPaintOnlyText.checked = currentSettings.paintOnlyText;
    optCardBorder.checked = currentSettings.cardBorder;
    optBadge.checked = currentSettings.showBadge;
    optDim.checked = currentSettings.dimCompleted;
    optNext.checked = currentSettings.includeNext;
    optContinue.checked = currentSettings.includeContinue;
    optStart.checked = currentSettings.includeStart;
    optToolbar.checked = currentSettings.showToolbar;
    selectMode.value = currentSettings.reorderMode || 'slots';

    const color = currentSettings.highlightColor || '#f47521';
    customColorInput.value = color;
    customColorHex.textContent = color.toUpperCase();

    // Atualiza botão de cor ativo
    colorBtns.forEach(btn => {
      if (btn.getAttribute('data-color').toLowerCase() === color.toLowerCase()) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Salvar configurações
  function saveSettings() {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.set(currentSettings, () => {
        notifyContentScript();
      });
    } else {
      localStorage.setItem('cr_organizer_settings', JSON.stringify(currentSettings));
      notifyContentScript();
    }
  }

  // Notificar a aba ativa da Crunchyroll
  function notifyContentScript() {
    if (typeof chrome === 'undefined' || !chrome.tabs) return;

    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (tabs[0] && tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'updateSettings',
          settings: currentSettings
        }, response => {
          if (chrome.runtime.lastError) {
            // Ignora se não for uma página da crunchyroll ou content script ainda não injetado
          } else {
            queryStats();
          }
        });
      }
    });
  }

  // Obter contadores da aba ativa
  function queryStats() {
    if (typeof chrome === 'undefined' || !chrome.tabs) return;

    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (tabs[0] && tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'getStats' }, response => {
          if (response) {
            statPriority.textContent = response.priority || 0;
            statCompleted.textContent = response.completed || 0;
            statTotal.textContent = response.total || 0;
          } else {
            statPriority.textContent = '-';
            statCompleted.textContent = '-';
            statTotal.textContent = '-';
          }
        });
      }
    });
  }

  // Event Listeners dos Controles
  toggleEnabled.addEventListener('change', () => {
    currentSettings.enabled = toggleEnabled.checked;
    saveSettings();
  });

  optPaintOnlyText.addEventListener('change', () => {
    currentSettings.paintOnlyText = optPaintOnlyText.checked;
    saveSettings();
  });

  optCardBorder.addEventListener('change', () => {
    currentSettings.cardBorder = optCardBorder.checked;
    saveSettings();
  });

  optBadge.addEventListener('change', () => {
    currentSettings.showBadge = optBadge.checked;
    saveSettings();
  });

  optDim.addEventListener('change', () => {
    currentSettings.dimCompleted = optDim.checked;
    saveSettings();
  });

  optNext.addEventListener('change', () => {
    currentSettings.includeNext = optNext.checked;
    saveSettings();
  });

  optContinue.addEventListener('change', () => {
    currentSettings.includeContinue = optContinue.checked;
    saveSettings();
  });

  optStart.addEventListener('change', () => {
    currentSettings.includeStart = optStart.checked;
    saveSettings();
  });

  optToolbar.addEventListener('change', () => {
    currentSettings.showToolbar = optToolbar.checked;
    saveSettings();
  });

  selectMode.addEventListener('change', () => {
    currentSettings.reorderMode = selectMode.value;
    saveSettings();
  });

  // Seletor de cores predefinidas
  colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const color = btn.getAttribute('data-color');
      currentSettings.highlightColor = color;
      customColorInput.value = color;
      customColorHex.textContent = color.toUpperCase();

      colorBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      saveSettings();
    });
  });

  // Seletor de cor customizado
  customColorInput.addEventListener('input', () => {
    const color = customColorInput.value;
    customColorHex.textContent = color.toUpperCase();
    currentSettings.highlightColor = color;

    colorBtns.forEach(b => {
      if (b.getAttribute('data-color').toLowerCase() === color.toLowerCase()) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    saveSettings();
  });

  // Botão Reorganizar Agora
  btnReorderNow.addEventListener('click', () => {
    btnReorderNow.textContent = '⏳ Organizando...';
    notifyContentScript();
    setTimeout(() => {
      btnReorderNow.textContent = '⚡ Reorganizar Agora';
      queryStats();
    }, 400);
  });

  // Botão Restaurar Padrões
  btnReset.addEventListener('click', () => {
    currentSettings = { ...DEFAULT_SETTINGS };
    updateUI();
    saveSettings();
  });

  loadSettings();
});
