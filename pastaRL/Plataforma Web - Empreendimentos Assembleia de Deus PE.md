# Plataforma Web - Empreendimentos Assembleia de Deus PE

## Visão Geral
Plataforma web para divulgação e venda de produtos alimentícios dos empreendimentos da Assembleia de Deus em Pernambuco, focada em doces, salgados e produtos artesanais.

## Funcionalidades Principais

### 1. Catálogo de Produtos
- **Produtos**: Sopas, doces, biscoitos amanteigados, palha italiana, suspiro, brownie, cookies
- **Informações por produto**:
  - Nome e descrição
  - Fotos em alta qualidade
  - Preço
  - Ingredientes/informações nutricionais
  - Disponibilidade

### 2. Sistema de Pedidos
- **Carrinho de compras** interativo
- **Formulário de pedido** com:
  - Dados do cliente (nome, telefone, endereço)
  - Método de entrega (retirada/delivery)
  - Observações especiais
- **Confirmação automática** via WhatsApp
- **Notificação** para o empreendedor

### 3. Promoções e Ofertas
- **Banner de promoções** em destaque
- **Timer countdown** para ofertas limitadas
- **Desconto percentual** ou valor fixo
- **Produtos em destaque**

### 4. Integração Social
- **Botões diretos** para WhatsApp e Instagram
- **Link para chat** do WhatsApp com mensagem pré-definida
- **Compartilhamento** de produtos nas redes sociais

### 5. Sistema de Feedback
- **Avaliações** por estrelas (1-5)
- **Comentários** dos clientes
- **Recomendações** de produtos
- **Depoimentos** em destaque

### 6. Área Administrativa (Básica)
- **Gerenciamento de produtos**
- **Visualização de pedidos**
- **Controle de promoções**
- **Moderação de comentários**

## Arquitetura Técnica

### Frontend
- **React.js** com componentes modernos
- **Design responsivo** (mobile-first)
- **CSS moderno** com animações
- **PWA** (Progressive Web App) para melhor experiência mobile

### Backend
- **Flask** (Python) para API REST
- **SQLite** para banco de dados local
- **Sistema de notificações** via WhatsApp API
- **Upload de imagens**

### Integrações
- **WhatsApp Business API** ou link direto
- **Instagram** (links para perfis)
- **Timer JavaScript** para promoções
- **Geolocalização** para delivery

## Design e UX

### Paleta de Cores
- **Primária**: Azul (#1e40af) - confiança e tradição
- **Secundária**: Dourado (#f59e0b) - qualidade e valor
- **Accent**: Verde (#10b981) - frescor e natural
- **Neutros**: Cinza claro (#f3f4f6) e escuro (#374151)

### Tipografia
- **Títulos**: Fonte serifada elegante
- **Corpo**: Sans-serif legível
- **Destaques**: Peso bold para preços e promoções

### Layout
- **Header** com logo e navegação
- **Hero section** com produtos em destaque
- **Grid de produtos** com filtros
- **Footer** com contatos e redes sociais

## Fluxo do Usuário

1. **Entrada**: Usuário acessa o site
2. **Navegação**: Explora produtos e promoções
3. **Seleção**: Adiciona itens ao carrinho
4. **Pedido**: Preenche formulário de pedido
5. **Confirmação**: Recebe confirmação e é direcionado ao WhatsApp
6. **Feedback**: Pode avaliar após a compra

## Recursos Especiais

### Timer de Promoções
- **Countdown visual** em tempo real
- **Atualização automática** dos preços
- **Notificação** quando a promoção expira

### Integração WhatsApp
- **Botão flutuante** sempre visível
- **Mensagem pré-formatada** com detalhes do pedido
- **Link direto** para chat do empreendedor

### Sistema de Avaliações
- **Estrelas visuais** interativas
- **Comentários moderados**
- **Média de avaliações** por produto

## Considerações de Performance
- **Otimização de imagens** (WebP, lazy loading)
- **Cache** de dados estáticos
- **Minificação** de CSS/JS
- **CDN** para assets

## SEO e Marketing
- **Meta tags** otimizadas
- **Schema markup** para produtos
- **Sitemap** XML
- **Google Analytics** integrado

## Segurança
- **Validação** de formulários
- **Sanitização** de inputs
- **HTTPS** obrigatório
- **Rate limiting** para APIs

