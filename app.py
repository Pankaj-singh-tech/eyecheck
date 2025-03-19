from flask import Flask
from controller import bp as controller_bp
from api import api_bp

app = Flask(__name__)

app.register_blueprint(controller_bp)
app.register_blueprint(api_bp)

# if __name__ == "__main__":
#     with app.app_context():
#         app.run(debug=False,host='0.0.0.0')
