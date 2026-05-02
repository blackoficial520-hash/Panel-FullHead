# FULLHEAD - Panel Mobile

## Estado Atual (30/04/2026) - REBRAND v2 NAVY DEEP

App PWA com nova identidade visual aplicada em todo o app: navy profundo + dourado fosco + dragon logo.

### Design Visual - FullHead Navy Deep

#### Paleta de Cores
- **Black**: `#07080C` (fundo principal)
- **Surface**: `#0C0E18` / Surface2 `#0D1018` / Surface3 `#12151E`
- **Borda**: `#16192A` / Soft `#1C2030` / `rgba(212,170,0,0.30)` (dourado)
- **Ouro**: `#D4AA00` / Light `#E8C040` / Dim `#8A6E00`
- **Texto**: `#E8DDB0` / Strong `#C8D4F0` / Muted `#4A5578` / Faint `#2A3050`
- **Acentos por módulo**: Blue `#3B82F6`, Orange `#F97316`, Cyan `#06B6D4`, Green `#10B981`, Violet `#7C3AED`, Red `#E55353`

#### Tipografia
- **Barlow Condensed** — títulos, logo, hero, valores numéricos, botões CTA
- **Inter** — corpo, inputs, labels, descrições

(Aliases legados `.font-bebas`, `.font-rajdhani`, `.font-exo` preservados em CSS para compatibilidade)

#### Logo
- `src/assets/fullhead-logo.webp` (importado nos componentes)
- `public/logo-fullhead.webp` (fallback)
- Dragon dourado em círculo escuro com borda sutil

### Páginas

1. **Login.jsx** — Card central com cantos dourados decorativos, logo no círculo, FULLHEAD em Barlow Condensed, botão dourado "› INGRESAR"
2. **Register.jsx** — Mesmo padrão do login com "CREAR CUENTA"
3. **ForgotPassword.jsx** — Mesmo padrão minimalista
4. **Dashboard.jsx** — Hero com art decorativa nos cantos + grid 2/3 colunas de mod-cards (barra de acento no topo + ícone colorido + título Barlow + botão "ACCEDER ›") + card Premium violeta + tip bar
5. **AppLayout.jsx** — Sidebar 240px (desktop) + topbar mobile, logo do dragão, nav items com indicador dourado lateral no ativo, footer com user chip + logout

### Módulos (páginas internas)

Header sticky com `module-header` (cor `#09090F`, gradiente dourado na borda inferior), botão voltar arredondado, título Barlow Condensed:
- **Sensi.jsx** — Card refeito: nome em Barlow + DPI block dourado destacado + 6 stat-bars coloridas (gold/red/blue/yellow/cyan/green) + nota expansível + botão dourado "COPIAR SENSI"
- **Hud.jsx**, **Configs.jsx**, **Treinos.jsx**, **Instalacion.jsx**, **PainelExterno.jsx** — Usam classes `.data-card`, `.btn-copy`, `.fh-input`, `.stat-box`. Auto-rebrand ao atualizar o `index.css`

### Sistema de Classes CSS (index.css)

Classes reutilizáveis (mantém os mesmos nomes da v1, restyled):
- `.module-page`, `.module-header`, `.module-back-btn`, `.module-title`, `.module-subtitle`
- `.data-card` (border-radius 13px, hover gold)
- `.fh-select`, `.fh-input` (radius 8px, min-height 44px)
- `.btn-copy` (gold tinted background sem gradiente)
- `.stat-box`, `.stat-label`, `.stat-value`
- `.code-block`
- `.badge-premium`, `.badge-free`
- `.animate-float-up`, `.animate-slide-in`, `.card-enter`
- Helpers: `.font-barlow`, `.font-inter`, `.text-gold`, etc.

### Tech Stack
- React 19 + Vite 7 + Firebase 12
- Tailwind CSS 4 (base reset)
- React Router v7
- CSS custom properties (variáveis `--gold`, `--black`, `--surface`, etc.)
- Google Fonts: Barlow Condensed, Inter
- PWA: Service Worker (cache `panel-fullhead-v5`) + manifest (`theme_color: #07080C`)

### Módulos do Dashboard
- **01 Instalación** — Gold `#D4AA00`
- **Sensibilidad** — Blue `#3B82F6` (badge NUEVO verde)
- **HUD Pro** — Orange `#F97316` (badge PRO dourado)
- **Configuraciones Pro** — Cyan `#06B6D4` (badge PRO dourado)
- **Entrenamientos** — Green `#10B981`
- **Panel Externo** — Gold `#D4AA00`
- **Área Premium** — Violet `#7C3AED` (card full-width, bloqueado)

### Arquivos PWA
- `public/manifest.json` (theme color #07080C)
- `public/service-worker.js` (cache v5 — bumped a partir do v4)
- `public/favicon.png`
- `public/logo-fullhead.webp`

### iOS PWA
- Status bar: `black-translucent`
- Padding-top do `body` removido — cada header (`module-header`, `mobile-header`) aplica `env(safe-area-inset-top)` localmente pra evitar bug do recorte do topo no standalone
- Service Worker cache bumpado a cada update visual (atualmente v5)

### Preferências do Usuário
- Design navy profundo + dourado fosco
- Fontes Barlow Condensed + Inter
- Sem emojis em código (SVG inline)
- UI em espanhol, comunicação em português brasileiro
- Mantém sidebar com texto (não vertical de ícones)
- Responsivo mobile-first, touch targets mínimos 44px
