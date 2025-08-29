import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from flask_cors import CORS
from src.models.user import db
from src.models.product import Product, Order, Review, Promotion
from src.routes.user import user_bp
from src.routes.products import products_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT'

# Habilitar CORS para todas as rotas
CORS(app)

app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(products_bp, url_prefix='/api')

# uncomment if you need to use database
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
with app.app_context():
    db.create_all()
    
    # Inserir dados iniciais se não existirem
    if Product.query.count() == 0:
        produtos_iniciais = [
            Product(
                name='Sopas Gourmet',
                description='Sopas artesanais preparadas com ingredientes frescos e selecionados',
                price=15.00,
                category='sopas',
                image_url='/static/images/sopa-gourmet.jpg',
                rating=4.8
            ),
            Product(
                name='Doces Finos',
                description='Doces artesanais para festas e ocasiões especiais',
                price=3.50,
                category='doces',
                image_url='/static/images/doces-finos.jpg',
                rating=4.9
            ),
            Product(
                name='Biscoitos Amanteigados',
                description='Biscoitos caseiros com sabor tradicional e textura perfeita',
                price=12.00,
                category='biscoitos',
                image_url='/static/images/biscoitos-amanteigados.jpg',
                rating=4.7
            ),
            Product(
                name='Palha Italiana',
                description='Doce tradicional com chocolate e biscoito, irresistível',
                price=8.00,
                category='doces',
                image_url='/static/images/palha-italiana.jpg',
                rating=4.6
            ),
            Product(
                name='Suspiros Coloridos',
                description='Suspiros delicados em diversas cores e sabores',
                price=10.00,
                category='doces',
                image_url='/static/images/suspiros.jpg',
                rating=4.8
            ),
            Product(
                name='Brownies Premium',
                description='Brownies de chocolate com textura úmida e sabor intenso',
                price=6.00,
                category='doces',
                image_url='/static/images/brownies.jpg',
                rating=4.9
            ),
            Product(
                name='Cookies Caseiros',
                description='Cookies com gotas de chocolate, crocantes por fora e macios por dentro',
                price=4.00,
                category='cookies',
                image_url='/static/images/cookies.jpg',
                rating=4.7
            )
        ]
        
        for produto in produtos_iniciais:
            db.session.add(produto)
        
        # Adicionar algumas avaliações iniciais
        avaliacoes_iniciais = [
            Review(
                customer_name='Maria Silva',
                rating=5,
                comment='Produtos maravilhosos! Os doces são deliciosos e o atendimento é excelente.'
            ),
            Review(
                customer_name='João Santos',
                rating=4,
                comment='Muito bom! As sopas são saborosas e bem temperadas.'
            )
        ]
        
        for avaliacao in avaliacoes_iniciais:
            db.session.add(avaliacao)
        
        db.session.commit()

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
            return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
