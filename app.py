import os
from flask import Flask, render_template, Blueprint
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)

db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.login_view = 'sign_up'
login_manager.login_message_category = "warning"
login_manager.init_app(app)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///' + os.path.join(app.root_path, 'data.db'))
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = 'Wang Yang'


from models import User
import BLL.Login
import BLL.User


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


@app.route('/')
def index():
    return render_template('Index.html')


@app.errorhandler(Exception)
def error(e):
    return render_template('error.html', e=e)


db.create_all()

if __name__ == '__main__':
    app.run()
