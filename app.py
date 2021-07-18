import json
import os
from base64 import b64encode

from flask import Flask, render_template, Blueprint, request
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

from models import User
from models import seeder_user, seeder_article
from BLL.Account import account
from BLL.User import profile
from BLL.Article import article


@login_manager.user_loader
def load_user(user_id):
	return User.query.get(int(user_id))


@main.route('/')
def index():
	notify = request.args.get('notify')
	state_type = "success" if request.args.get('type') is None else request.args.get('type')
	if current_user.is_authenticated:
		user = User.query.filter_by(id=current_user.id).first()
		if user.icon_exist():
			icon = b64encode(user.icon).decode("utf-8")
			return render_template('Index.html', icon=icon, notify=notify, type=state_type)
		return render_template('Index.html', notify=notify, type=state_type)
	return render_template('Index.html', notify=notify, type=state_type)


@main.errorhandler(Exception)
def error(e):
	return render_template('error.html', e=e)


app.register_blueprint(main)
app.register_blueprint(profile)
app.register_blueprint(account)
app.register_blueprint(article)

# db.drop_all()
# db.create_all()
# prepopulate data for development usage(seeding)
# generate 5 user data
# seeder_user(5)
# generate 11 articles according to seeds/article.json
# with open('seeds/article.json', encoding='utf-8') as article_json:
# 	article_data = article_json.read()
# articles = json.loads(article_data)
# for n in list(articles["article"]):
# 	seeder_article(str(n["title"]), str(n["content"]), str(n["tag"]), str(n["category"]), int(n["img"]))

if __name__ == '__main__':
	app.run()
