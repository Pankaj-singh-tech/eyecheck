from flask import Blueprint
from .endpoints import *

api_bp = Blueprint("api", __name__, url_prefix="/api")

api_bp.add_url_rule("/analyse/img", view_func=analyseImg, methods=["POST"])