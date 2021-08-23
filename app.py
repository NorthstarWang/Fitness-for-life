import datetime
import json
import os
from base64 import b64encode
from datetime import date

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

from models import User, seeder_user_specific
from models import seeder_user, seeder_article, seeder_sport, BodyProfile
from BLL.Account import account
from BLL.User import profile
from BLL.Article import article
from BLL.Advisor import advisor


def getJoinDayCount():
	day = (date.today() - current_user.createDate + datetime.timedelta(days=1)).days
	# format this day into string
	if day % 10 == 1:
		return str(day) + "st"
	elif day % 10 == 2:
		return str(day) + "nd"
	elif day % 10 == 3:
		return str(day) + "rd"
	else:
		return str(day) + "th"


def getWeightProgress():
	# return the weight difference of user from the day he/she join healthier, negative means weight loss, else weight gain
	origin = BodyProfile.query.filter_by(userId=current_user.id).first()
	return [round(origin.weight-current_user.weight, 2), (date.today() - origin.updateDay).days]


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
			return render_template('Index.html', icon=icon, notify=notify, type=state_type, dayJoin=getJoinDayCount(), weightProgress=getWeightProgress())
		return render_template('Index.html', notify=notify, type=state_type, dayJoin=getJoinDayCount(), weightProgress=getWeightProgress())
	return render_template('Index.html', notify=notify, type=state_type)


@main.errorhandler(Exception)
def error(e):
	return render_template('error.html', e=e)


app.register_blueprint(main)
app.register_blueprint(profile)
app.register_blueprint(account)
app.register_blueprint(article)
app.register_blueprint(advisor)

db.drop_all()
db.create_all()
# prepopulate data for development usage(seeding)
# generate 5 user data
seeder_user_specific()
# generate 11 articles according to seeds/article.json
with open('seeds/article.json', encoding='utf-8') as article_json:
	article_data = article_json.read()
articles = json.loads(article_data)
for n in list(articles["article"]):
	seeder_article(str(n["title"]), str(n["content"]), str(n["tag"]), str(n["category"]), int(n["img"]))
article_json.close()

# generate 35 sports according to seeds/sport.json
with open('seeds/sport.json', encoding='utf-8') as sport_json:
	sport_data = sport_json.read()
sports = json.loads(sport_data)
for n in list(sports):
	seeder_sport(str(n["name"]), int(n["calorie"]), int(n["rate"]), int(n["difficulty"]), str(n["category"]))
sport_json.close()

if __name__ == '__main__':
	app.run()
