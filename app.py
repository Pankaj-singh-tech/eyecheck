from flask import Flask
from controller import bp as controller_bp
from api import api_bp

app = Flask(__name__)
# Register Blueprints
app.register_blueprint(controller_bp)
app.register_blueprint(api_bp)

if __name__ == "__main__":
    with app.app_context():
        app.run(host='192.168.0.87', debug=True, use_reloader=True)
