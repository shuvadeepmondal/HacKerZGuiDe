from flask import Flask

def create_app():
    app = Flask(__name__)
   
   
    # Blueprint imports
    from .routes.index_routes import index_bp


    # Register blueprints
    app.register_blueprint(index_bp)


    return app
