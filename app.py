import os
from base64 import b64encode

from flask import Flask, render_template, Blueprint
from flask_login import LoginManager, current_user
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# SQLAlchemy create database in data.db using according to models.py
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///' + os.path.join(app.root_path, 'data.db'))
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# login manager monitor the user state
login_manager = LoginManager()
login_manager.login_view = 'sign_up'
login_manager.login_message_category = "warning"
login_manager.init_app(app)
app.secret_key = 'Wang Yang'

main = Blueprint("main", __name__)

from models import User, seeder_user
from BLL.Account import account
from BLL.User import profile


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


@main.route('/')
def index():
    if current_user.is_authenticated:
        user = User.query.filter_by(id=current_user.id).first()
        if user.icon_exist():
            icon = b64encode(user.icon).decode("utf-8")
            return render_template('Index.html', icon=icon)
        return render_template('Index.html')
    return render_template('Index.html')


@main.errorhandler(Exception)
def error(e):
    return render_template('error.html', e=e)


app.register_blueprint(main)
app.register_blueprint(profile)
app.register_blueprint(account)

db.drop_all()
db.create_all()
# prepopulate data for development usage(seeding)
# generate 5 user data
seeder_user(5)

if __name__ == '__main__':
    app.run()
