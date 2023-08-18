from flask import Flask
from flask_cors import CORS


from .extensions import db
from .routes.simple_search import simple_search
from .routes.cheapest_route import cheapest_route

def create_app():
    #Instantiate and configure app
    app = Flask(__name__)
    CORS(app)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///../backend/databases/simpleSearch.sqlite3'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SQLALCHEMY_BINDS'] = {'cheapest_route' : 'sqlite:///../backend/databases/cheapestRoute.sqlite3'}
    app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True
    #print(os.environ['DEBUG'])

    app.app_context().push()

    #create database
    db.init_app(app)
    db.create_all()

    
    app.register_blueprint(simple_search, url_prefix='/simple_search')
    app.register_blueprint(cheapest_route, url_prefix='/cheapest_route')
    return app