# 📺 Crunchyroll Watchlist Organizer

Extensão de navegador (Manifest V3) e Userscript para a [Watchlist da Crunchyroll](https://www.crunchyroll.com/pt-br/watchlist).

Organiza sua lista de animes de forma inteligente: **destaca visualmente ("pinta")** e **move para o topo** tudo o que você está assistindo ativamente ou precisa começar, separando-os de dezenas de animes já concluídos ("Assistir de Novo") que a Crunchyroll empurra para cima.

---

## 🚀 Funcionalidades

- 🎯 **Separação Inteligente**:
  - **Prioritários (Move para o topo e destaca)**:
    - `Começar a Assistir` (Animes que você ainda não começou)
    - `Continuar` (Episódios pausados ou em andamento)
    - `A Seguir` (Novos episódios recém-lançados aguardando você assistir)
    - `Assistir` (Episódios prontos)
  - **Ignorados / Esmaecidos**:
    - `Assistir de Novo` (Animes que você já terminou/está em dia)
- 🎨 **Pintura e Destaque Visual**:
  - Borda estilizada com brilho suave (*glow*).
  - Badge no card indicando o status (`▶ CONTINUAR`, `▶ COMEÇAR`, `▶ A SEGUIR`).
  - Efeito suave ao passar o mouse (*hover zoom*).
  - Opção para esmaecer (*dim*) com leve transparência os cards já concluídos.
- ⚡ **Reordenação Segura (100% compatível com React)**:
  - Utiliza CSS Grid `order` para mover os cards para o topo sem quebrar a árvore virtual do React e sem causar travamentos durante o **scroll infinito**.
  - Opção no menu para ordenação direta no DOM se preferir.
- 🎛️ **Popup de Configurações**:
  - Ligue ou desligue a extensão com 1 clique.
  - Paleta de cores para trocar a "pintura" (Laranja Crunchyroll, Ciano Neon, Roxo, Verde, ou cor customizada).
  - Estatísticas ao vivo: mostra quantos animes prioritários foram encontrados na tela.
  - Botão "Reorganizar Agora" para reprocessar imediatamente.
- 📊 **Barra de Resumo Integrada**:
  - Exibe uma barra sutil no topo da watchlist com a contagem de animes prontos para assistir.

---

## 📦 Como Instalar no Navegador (Chrome, Edge, Brave, Opera)

1. Abra seu navegador e acesse a página de extensões:
   - **Chrome / Brave**: `chrome://extensions`
   - **Microsoft Edge**: `edge://extensions`
   - **Opera**: `opera://extensions`
2. Ative o interruptor **"Modo do desenvolvedor"** (normalmente no canto superior direito).
3. Clique no botão **"Carregar sem compactação"** (ou *"Load unpacked"*).
4. Selecione a pasta deste projeto:
   ```
   e:\z-dev\node\www\crunchyroll_rainbow
   ```
5. Pronto! A extensão está instalada.
6. Acesse sua Watchlist na Crunchyroll: [https://www.crunchyroll.com/pt-br/watchlist](https://www.crunchyroll.com/pt-br/watchlist).

---

## 🐒 Alternativa: Instalação via Tampermonkey / Violentmonkey

Se você já utiliza extensões de userscripts como **Tampermonkey** ou **Violentmonkey**:
1. Abra o arquivo `userscript/crunchyroll-organizer.user.js`.
2. Copie o conteúdo e cole no seu gerenciador como um novo script.
3. Salve e recarregue a página da Watchlist!

---

## 🛠️ Estrutura dos Arquivos

```
crunchyroll_rainbow/
├── manifest.json                  # Manifesto da extensão (V3)
├── content.js                     # Script principal com observador do DOM e reordenação
├── content.css                    # Estilos visuais, glow, badges e animações
├── popup/
│   ├── popup.html                 # Interface do popup de opções
│   ├── popup.css                  # Tema dark mode Crunchyroll
│   └── popup.js                   # Lógica de controle e persistência
├── icons/
│   ├── icon16.png                 # Ícone 16x16
│   ├── icon48.png                 # Ícone 48x48
│   └── icon128.png                # Ícone 128x128
├── userscript/
│   └── crunchyroll-organizer.user.js # Versão independente em arquivo único
└── README.md
```

