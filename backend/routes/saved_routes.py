from flask import Blueprint
from ..extensions import db
from ..models.CheapestRoute import Route
from ..helpers.return_saved import format_return

saved_routes = Blueprint('saved_routes', __name__)

@saved_routes.route('/', methods=['GET'])
def index():
    return format_return()

@saved_routes.route('/toggle_favorite/<id>', methods=['POST'])
def toggle_favorite(id):
    route = Route.query.filter_by(id=id).first()

    if route.favorited:
        route.favorited = False
    else:
        route.favorited = True

    db.session.commit()
    return format_return()