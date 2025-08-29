from flask import Blueprint, request, jsonify
from src.models.product import db, Product, Order, Review, Promotion
from datetime import datetime

products_bp = Blueprint('products', __name__)

@products_bp.route('/products', methods=['GET'])
def get_products():
    """Retorna todos os produtos disponíveis"""
    try:
        category = request.args.get('category')
        
        query = Product.query.filter_by(available=True)
        if category and category != 'todos':
            query = query.filter_by(category=category)
            
        products = query.all()
        return jsonify([product.to_dict() for product in products])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@products_bp.route('/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """Retorna um produto específico"""
    try:
        product = Product.query.get_or_404(product_id)
        return jsonify(product.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@products_bp.route('/products', methods=['POST'])
def create_product():
    """Cria um novo produto (admin)"""
    try:
        data = request.json
        
        product = Product(
            name=data['name'],
            description=data.get('description', ''),
            price=data['price'],
            category=data['category'],
            image_url=data.get('image_url', ''),
            available=data.get('available', True),
            rating=data.get('rating', 0.0)
        )
        
        db.session.add(product)
        db.session.commit()
        
        return jsonify(product.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@products_bp.route('/orders', methods=['POST'])
def create_order():
    """Cria um novo pedido"""
    try:
        data = request.json
        
        # Validar dados obrigatórios
        required_fields = ['customer_name', 'customer_phone', 'items', 'total']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Campo {field} é obrigatório'}), 400
        
        order = Order(
            customer_name=data['customer_name'],
            customer_phone=data['customer_phone'],
            customer_address=data.get('customer_address', ''),
            items=data['items'],
            total=data['total']
        )
        
        db.session.add(order)
        db.session.commit()
        
        return jsonify({
            'id': order.id,
            'status': 'created',
            'message': 'Pedido criado com sucesso!'
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@products_bp.route('/orders', methods=['GET'])
def get_orders():
    """Retorna todos os pedidos (admin)"""
    try:
        orders = Order.query.order_by(Order.created_at.desc()).all()
        return jsonify([order.to_dict() for order in orders])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@products_bp.route('/orders/<int:order_id>', methods=['PUT'])
def update_order_status(order_id):
    """Atualiza status do pedido (admin)"""
    try:
        order = Order.query.get_or_404(order_id)
        data = request.json
        
        if 'status' in data:
            order.status = data['status']
            db.session.commit()
            
        return jsonify(order.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@products_bp.route('/reviews', methods=['POST'])
def create_review():
    """Cria uma nova avaliação"""
    try:
        data = request.json
        
        # Validar dados obrigatórios
        required_fields = ['customer_name', 'rating']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Campo {field} é obrigatório'}), 400
        
        # Validar rating
        if not (1 <= data['rating'] <= 5):
            return jsonify({'error': 'Rating deve ser entre 1 e 5'}), 400
        
        review = Review(
            product_id=data.get('product_id'),
            customer_name=data['customer_name'],
            rating=data['rating'],
            comment=data.get('comment', '')
        )
        
        db.session.add(review)
        db.session.commit()
        
        return jsonify(review.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@products_bp.route('/reviews', methods=['GET'])
def get_reviews():
    """Retorna todas as avaliações"""
    try:
        product_id = request.args.get('product_id')
        
        query = Review.query
        if product_id:
            query = query.filter_by(product_id=product_id)
            
        reviews = query.order_by(Review.created_at.desc()).all()
        return jsonify([review.to_dict() for review in reviews])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@products_bp.route('/promotions', methods=['GET'])
def get_promotions():
    """Retorna promoções ativas"""
    try:
        now = datetime.utcnow()
        promotions = Promotion.query.filter(
            Promotion.active == True,
            Promotion.start_date <= now,
            Promotion.end_date >= now
        ).all()
        
        return jsonify([promotion.to_dict() for promotion in promotions])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@products_bp.route('/promotions', methods=['POST'])
def create_promotion():
    """Cria uma nova promoção (admin)"""
    try:
        data = request.json
        
        promotion = Promotion(
            title=data['title'],
            description=data.get('description', ''),
            discount_percentage=data['discount_percentage'],
            category=data.get('category'),
            start_date=datetime.fromisoformat(data['start_date']),
            end_date=datetime.fromisoformat(data['end_date']),
            active=data.get('active', True)
        )
        
        db.session.add(promotion)
        db.session.commit()
        
        return jsonify(promotion.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@products_bp.route('/categories', methods=['GET'])
def get_categories():
    """Retorna todas as categorias de produtos"""
    try:
        categories = db.session.query(Product.category).distinct().all()
        category_list = [cat[0] for cat in categories if cat[0]]
        
        return jsonify({
            'categories': category_list,
            'count': len(category_list)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@products_bp.route('/stats', methods=['GET'])
def get_stats():
    """Retorna estatísticas gerais (admin)"""
    try:
        total_products = Product.query.count()
        total_orders = Order.query.count()
        total_reviews = Review.query.count()
        pending_orders = Order.query.filter_by(status='pending').count()
        
        return jsonify({
            'total_products': total_products,
            'total_orders': total_orders,
            'total_reviews': total_reviews,
            'pending_orders': pending_orders
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

