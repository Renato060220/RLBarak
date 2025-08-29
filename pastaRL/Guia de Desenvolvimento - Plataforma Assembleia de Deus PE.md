# Guia de Desenvolvimento - Plataforma Assembleia de Deus PE

## Estrutura do Projeto

```
assembleia-pe-platform/
├── frontend/                 # React App
│   ├── public/
│   ├── src/
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── pages/          # Páginas principais
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # APIs e serviços
│   │   ├── styles/         # CSS e temas
│   │   └── utils/          # Utilitários
│   └── package.json
├── backend/                 # Flask API
│   ├── app/
│   │   ├── models/         # Modelos de dados
│   │   ├── routes/         # Rotas da API
│   │   ├── services/       # Lógica de negócio
│   │   └── utils/          # Utilitários
│   ├── migrations/         # Migrações do banco
│   └── requirements.txt
└── docs/                   # Documentação
```

## Fase 1: Configuração Inicial

### 1.1 Setup do Frontend (React)
```bash
# Criar aplicação React
npx create-react-app frontend
cd frontend

# Instalar dependências essenciais
npm install react-router-dom axios styled-components
npm install @mui/material @emotion/react @emotion/styled
npm install react-icons react-toastify
npm install framer-motion # Para animações
```

### 1.2 Setup do Backend (Flask)
```bash
# Criar ambiente virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# Instalar Flask e dependências
pip install flask flask-sqlalchemy flask-cors
pip install flask-migrate python-dotenv
pip install pillow requests  # Para upload de imagens
```

## Fase 2: Desenvolvimento do Backend

### 2.1 Estrutura da API Flask
```python
# app/__init__.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///assembleia.db'
    
    db.init_app(app)
    CORS(app)
    
    # Registrar blueprints
    from app.routes import products, orders, feedback
    app.register_blueprint(products.bp)
    app.register_blueprint(orders.bp)
    app.register_blueprint(feedback.bp)
    
    return app
```

### 2.2 Modelos de Dados
```python
# app/models/product.py
class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(200))
    category = db.Column(db.String(50))
    available = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# app/models/order.py
class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_name = db.Column(db.String(100), nullable=False)
    customer_phone = db.Column(db.String(20), nullable=False)
    customer_address = db.Column(db.Text)
    items = db.Column(db.JSON)  # Lista de produtos
    total = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
```

### 2.3 Rotas da API
```python
# app/routes/products.py
@bp.route('/api/products', methods=['GET'])
def get_products():
    products = Product.query.filter_by(available=True).all()
    return jsonify([{
        'id': p.id,
        'name': p.name,
        'description': p.description,
        'price': p.price,
        'image_url': p.image_url,
        'category': p.category
    } for p in products])

# app/routes/orders.py
@bp.route('/api/orders', methods=['POST'])
def create_order():
    data = request.json
    order = Order(
        customer_name=data['customer_name'],
        customer_phone=data['customer_phone'],
        customer_address=data.get('customer_address'),
        items=data['items'],
        total=data['total']
    )
    db.session.add(order)
    db.session.commit()
    
    # Enviar notificação WhatsApp
    send_whatsapp_notification(order)
    
    return jsonify({'id': order.id, 'status': 'created'})
```

## Fase 3: Desenvolvimento do Frontend

### 3.1 Componentes Principais
```jsx
// src/components/ProductCard.jsx
import React from 'react';
import { motion } from 'framer-motion';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <motion.div 
      className="product-card"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <img src={product.image_url} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <div className="price">R$ {product.price.toFixed(2)}</div>
      <button onClick={() => onAddToCart(product)}>
        Adicionar ao Carrinho
      </button>
    </motion.div>
  );
};
```

### 3.2 Timer de Promoções
```jsx
// src/components/PromotionTimer.jsx
import React, { useState, useEffect } from 'react';

const PromotionTimer = ({ endDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +new Date(endDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
        horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutos: Math.floor((difference / 1000 / 60) % 60),
        segundos: Math.floor((difference / 1000) % 60)
      };
    }
    return timeLeft;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  return (
    <div className="promotion-timer">
      <h3>Oferta por tempo limitado!</h3>
      <div className="timer-display">
        <span>{timeLeft.dias || 0}d</span>
        <span>{timeLeft.horas || 0}h</span>
        <span>{timeLeft.minutos || 0}m</span>
        <span>{timeLeft.segundos || 0}s</span>
      </div>
    </div>
  );
};
```

### 3.3 Integração WhatsApp
```jsx
// src/utils/whatsapp.js
export const sendWhatsAppMessage = (phone, message) => {
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/55${phone}?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank');
};

export const formatOrderMessage = (order) => {
  let message = `🛒 *Novo Pedido - Assembleia de Deus PE*\n\n`;
  message += `👤 *Cliente:* ${order.customer_name}\n`;
  message += `📱 *Telefone:* ${order.customer_phone}\n`;
  message += `📍 *Endereço:* ${order.customer_address}\n\n`;
  message += `🍰 *Itens do Pedido:*\n`;
  
  order.items.forEach(item => {
    message += `• ${item.name} (${item.quantity}x) - R$ ${item.price}\n`;
  });
  
  message += `\n💰 *Total:* R$ ${order.total.toFixed(2)}`;
  return message;
};
```

## Fase 4: Funcionalidades Avançadas

### 4.1 Sistema de Avaliações
```jsx
// src/components/RatingSystem.jsx
import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

const RatingSystem = ({ productId, onSubmitRating }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    onSubmitRating({
      productId,
      rating,
      comment,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="rating-system">
      <div className="stars">
        {[...Array(5)].map((star, index) => {
          const ratingValue = index + 1;
          return (
            <FaStar
              key={index}
              className={ratingValue <= rating ? 'star active' : 'star'}
              onClick={() => setRating(ratingValue)}
            />
          );
        })}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Deixe seu comentário..."
      />
      <button onClick={handleSubmit}>Enviar Avaliação</button>
    </div>
  );
};
```

### 4.2 Carrinho de Compras
```jsx
// src/hooks/useCart.js
import { useState, useContext, createContext } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const addItem = (product) => {
    setItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeItem = (productId) => {
    setItems(prev => prev.filter(item => item.id !== productId));
  };

  const getTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, getTotal }}>
      {children}
    </CartContext.Provider>
  );
};
```

## Fase 5: Estilização e Responsividade

### 5.1 CSS Moderno com Grid e Flexbox
```css
/* src/styles/global.css */
:root {
  --primary-color: #1e40af;
  --secondary-color: #f59e0b;
  --accent-color: #10b981;
  --text-color: #374151;
  --bg-color: #f3f4f6;
  --border-radius: 8px;
  --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
}

.product-card {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  overflow: hidden;
  transition: transform 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
}

/* Responsividade */
@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
  
  .header {
    flex-direction: column;
    text-align: center;
  }
}
```

### 5.2 Animações com Framer Motion
```jsx
// src/components/AnimatedPage.jsx
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5
};

const AnimatedPage = ({ children }) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
};
```

## Fase 6: Deploy e Produção

### 6.1 Preparação para Deploy
```bash
# Build do frontend
cd frontend
npm run build

# Configurar Flask para produção
export FLASK_ENV=production
export DATABASE_URL=sqlite:///prod.db
```

### 6.2 Estrutura Final
```
assembleia-pe-platform/
├── static/              # Build do React
├── app.py              # Flask app principal
├── requirements.txt    # Dependências Python
└── Procfile           # Para deploy (Heroku/Railway)
```

## Sugestões de Melhorias

### 1. **PWA (Progressive Web App)**
- Adicionar service worker para cache offline
- Manifest.json para instalação no celular
- Push notifications para promoções

### 2. **Analytics e Métricas**
- Google Analytics para acompanhar visitantes
- Heatmaps para entender comportamento do usuário
- Métricas de conversão de vendas

### 3. **SEO Avançado**
- Meta tags dinâmicas por produto
- Schema markup para rich snippets
- Sitemap XML automático

### 4. **Funcionalidades Futuras**
- Sistema de cupons de desconto
- Programa de fidelidade
- Chat bot integrado
- Múltiplos métodos de pagamento
- Sistema de delivery com rastreamento

### 5. **Otimizações de Performance**
- Lazy loading de imagens
- Code splitting no React
- CDN para assets estáticos
- Compressão de imagens automática

## Cronograma Sugerido

**Semana 1-2**: Setup e backend básico
**Semana 3-4**: Frontend e componentes principais  
**Semana 5**: Integrações e funcionalidades avançadas
**Semana 6**: Testes, ajustes e deploy

## Recursos Necessários

- **Domínio**: assembleiadeuspe.com.br (sugestão)
- **Hospedagem**: Vercel/Netlify (frontend) + Railway/Heroku (backend)
- **Banco de dados**: PostgreSQL (produção)
- **CDN**: Cloudinary para imagens
- **Monitoramento**: Sentry para erros

Esta plataforma será uma solução completa e profissional para divulgar e vender os produtos da igreja, com foco na experiência do usuário e facilidade de uso tanto para clientes quanto para os empreendedores.

