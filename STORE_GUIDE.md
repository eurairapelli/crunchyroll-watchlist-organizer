# 🚀 Guia de Publicação na Chrome Web Store

Este guia contém **exatamente** o que você precisa preencher e enviar no [Painel de Desenvolvedores da Chrome Web Store](https://chrome.google.com/webstore/devconsole) para sua extensão ser **aprovada rapidamente e sem rejeições de direitos autorais/políticas**.

---

## 📦 1. Arquivo do Pacote (.ZIP)

O pacote limpo e compilado é gerado na pasta:
```
e:\z-dev\node\www\crunchyroll_rainbow\dist\watchlist-organizer-crunchyroll-v1.1.0.zip
```
*(Se você alterar qualquer código no futuro, basta executar o script `.\build-zip.ps1` no PowerShell para gerar um novo ZIP atualizado).*

---

## 🔄 2. Como Funciona Quando Tiver uma Nova Versão?

Quando você fizer melhorias ou correções no código e quiser lançar uma versão atualizada:

1. **Atualize o número da versão**:
   - No arquivo `manifest.json`: altere `"version": "1.2.0"` (exemplo).
   - No arquivo `popup/popup.html`: altere a tag `<div class="version">v1.2.0</div>`.
   - No arquivo `userscript/crunchyroll-organizer.user.js`: altere `// @version 1.2.0`.
2. **Gere o novo arquivo ZIP**:
   - Abra o terminal e execute:
     ```powershell
     .\build-zip.ps1
     ```
   - O script lerá automaticamente o `manifest.json` e gerará o ZIP correspondente na pasta `dist/` (ex: `watchlist-organizer-crunchyroll-v1.2.0.zip`).
3. **No Navegador em Modo Desenvolvedor (Local)**:
   - Abra `chrome://extensions` (ou `edge://extensions`) e clique no botão de **Recarregar (🔄)** no card da extensão.
4. **Na Loja (Chrome Web Store / Edge Add-ons)**:
   - Acesse o [Chrome Developer Dashboard](https://chrome.google.com/webstore/devconsole).
   - Clique na sua extensão já cadastrada.
   - No menu lateral, acerte a aba **Pacote (Package)** e clique em **Enviar novo pacote (Upload new package)**.
   - Envie o novo arquivo `.zip` da pasta `dist/`.
   - No campo de notas da versão, resuma as novidades (ex: "Melhorias de destaque e correções visuais").
   - Clique em **Enviar para análise (Submit for review)**. A atualização será aprovada e distribuída automaticamente aos usuários em algumas horas.
5. **No Git**:
   - Salve a versão com tag:
     ```powershell
     git add .
     git commit -m "feat: versão 1.2.0"
     git tag -a "v1.2.0" -m "Versão 1.2.0"
     ```

---

## 📝 3. Informações da Ficha da Loja

### Nome do Item (Title)
> `Watchlist Organizer para Crunchyroll™`  
*(Em inglês: `Watchlist Organizer for Crunchyroll™`)*

> [!IMPORTANT]
> **Atenção às regras de marcas da Google**: Nunca inicie o título com "Crunchyroll Watchlist...". O Google exige a estrutura `[Seu Nome] para [Marca Comercial]™` para não caracterizar personificação da empresa dona da marca.

---

### Resumo Curto (Short Description - máx. 132 caracteres)
```
Organiza sua Watchlist na Crunchyroll™ destacando animes em andamento e movendo episódios prioritários para o topo.
```

---

### Descrição Detalhada (Detailed Description)
*(Copie e cole este texto na descrição completa da loja)*:

```markdown
Cansado de ver sua Watchlist na Crunchyroll bagunçada com animes que você já terminou subindo para o topo só porque saiu uma dublagem em outro idioma?

O Watchlist Organizer para Crunchyroll™ resolve esse problema organizando sua lista de forma inteligente e automática!

✨ PRINCIPAIS RECURSOS:
🎯 Separação Inteligente: Move para o topo da grade todos os animes que você realmente precisa assistir:
  - "Começar a Assistir" (Animes que você ainda não começou)
  - "Continuar" (Episódios pausados ou em andamento)
  - "A Seguir" (Novos episódios recém-lançados)
🎨 Pintura & Destaque Elegante:
  - Pinta o texto do título e subtítulo de status na cor vibrante da Crunchyroll (sem bordas pesadas ou poluição visual).
  - Mantém 100% da nitidez e visibilidade dos demais animes (sem escurecer ou prejudicar a navegação).
  - Opções avançadas no menu para ativar bordas ou badges se desejar.
⚡ Super Leve e Fluido:
  - Totalmente compatível com o React e com o scroll infinito da Crunchyroll (sem travamentos ou recarregamentos forçados).
🎛️ Personalização Total:
  - Escolha sua cor favorita para o destaque (Laranja Crunchyroll, Ciano Neon, Roxo, Verde ou cor customizada).
  - Ative ou desative filtros individuais através do menu da extensão.

🔒 100% SEGURO & PRIVADO:
- Não coleta dados pessoais.
- Não acessa senhas ou dados da sua conta.
- Todas as suas opções de cores e preferências ficam salvas apenas no seu próprio navegador.

----------------------------------------------------------------
ISENÇÃO DE RESPONSABILIDADE / DISCLAIMER:
Esta extensão é um projeto independente de código aberto desenvolvido para melhorar a experiência do usuário e NÃO possui vínculo, filiação, parceria, autorização ou endosso da Crunchyroll, LLC ou de suas subsidiárias. Crunchyroll™ e seus logotipos são marcas comerciais registradas de Crunchyroll, LLC.
----------------------------------------------------------------
```

---

## 🛡️ 4. Práticas de Privacidade (Privacy Practices)

A Google exige o preenchimento desta seção para publicar:

### Finalidade Única (Single Purpose Description)
```
Organizar e destacar visualmente os animes em andamento na Watchlist da Crunchyroll para facilitar a localização de episódios pendentes.
```

### Justificativa de Permissão (Permission Justification)
- **`storage`**:
  ```
  Utilizada unicamente para salvar as preferências visuais de cores, badges e filtros escolhidas pelo usuário no dispositivo local.
  ```

### Declaração de Coleta de Dados (Data Collection Disclosure)
- Responda **"NÃO"** para todas as opções de coleta de dados (esta extensão não coleta nomes, e-mails, histórico, localização, autenticação ou dados financeiros).
- Marque as caixas de conformidade confirmando que você não vende dados e segue a Política de Dados do Usuário.

### URL da Política de Privacidade (Privacy Policy URL)
- Você pode hospedar o arquivo [`PRIVACY_POLICY.html`](file:///e:/z-dev/node/www/crunchyroll_rainbow/PRIVACY_POLICY.html) no GitHub Pages, como um Gist público no GitHub, ou em qualquer servidor web gratuito.

---

## 🎨 5. Recursos Gráficos Necessários

1. **Ícone da Loja**:
   - O ícone `icons/icon128.png` (128x128 px) já está incluído no pacote.
2. **Captura de Tela (Screenshot - Obrigatório pelo menos 1)**:
   - Dimensão exigida pela Google: **1280x800 px** ou **640x400 px** (PNG ou JPEG).
   - Tire um print da sua watchlist na Crunchyroll com a extensão ativada destacando os animes em 1280x800 e envie nesta seção.

---

## 🏁 6. Passo a Passo do Envio Inicial

1. Acesse o [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole).
2. Se for sua primeira vez publicando, o Google cobra uma taxa única de registro de desenvolvedor de **$5 USD**.
3. Clique em **"Novo item"** (*"New Item"*).
4. Arraste e solte o arquivo `dist/watchlist-organizer-crunchyroll-v1.1.0.zip`.
5. Preencha as seções com os textos deste guia.
6. Clique em **"Enviar para análise"** (*"Submit for review"*).
7. O tempo médio de aprovação varia entre **24 a 48 horas**!
