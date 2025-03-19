from flask import Blueprint
from controller.views import *

bp = Blueprint("blueprint1", __name__, url_prefix="/")

bp.add_url_rule('/', endpoint='home', view_func=home_view)