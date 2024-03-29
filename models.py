import datetime
import json
from datetime import date
import math
import random
import string

from app import db
from flask_login import UserMixin


def random_string_generator(str_size, allowed_chars=string.ascii_letters):
	return ''.join(random.choice(allowed_chars) for _ in range(str_size))


def seeder_user_specific():
	user = User(username="TestAccount",
	            email=random_string_generator(10) + "@gmail.com",
	            password="12345678",
	            age=20,
	            gender=1,
	            height=170.0,
	            weight=75.0,
	            confirm=True,
	            createDate=date.today())
	db.session.add(user)
	db.session.commit()
	newUserid = 1
	favourite_article = FavouriteArticles(userId=newUserid)
	body_profile = BodyProfile(updateDay=date.today(), weight=75.0, userId=newUserid)
	past_bprofile = BodyProfile(updateDay=date.today() - datetime.timedelta(days=6), weight=75.0, userId=newUserid)
	past_bprofile_1 = BodyProfile(updateDay=date.today() - datetime.timedelta(days=3), weight=75.0, userId=newUserid)
	health_profile = HealthProfile(userId=newUserid)
	db.session.add(past_bprofile)
	db.session.add(past_bprofile_1)
	db.session.add(favourite_article)
	db.session.add(body_profile)
	db.session.add(health_profile)
	db.session.commit()


def seeder_user(number):
	# generate seed user data for development use
	for i in range(number):
		user = User(username=random_string_generator(10),
		            email=random_string_generator(10) + "@gmail.com",
		            password=random_string_generator(12),
		            age=random.randint(18, 60),
		            gender=random.randint(0, 1),
		            height=round(random.uniform(100.0, 200.0), 1),
		            weight=round(random.uniform(35.0, 100.0), 1),
		            confirm=True,
		            createDate=date.today())
		db.session.add(user)
	db.session.commit()
	# other database can only be add afterward as the user id is auto generated
	users = User.query.all()
	for i in users:
		favourite_article = FavouriteArticles(userId=i.id)
		body_profile = BodyProfile(updateDay=date.today(), weight=i.weight, userId=i.id)
		past_bprofile = BodyProfile(updateDay=date.today() - datetime.timedelta(days=6), weight=i.weight, userId=i.id)
		past_bprofile_1 = BodyProfile(updateDay=date.today() - datetime.timedelta(days=3), weight=i.weight, userId=i.id)
		health_profile = HealthProfile(userId=i.id)
		db.session.add(past_bprofile)
		db.session.add(past_bprofile_1)
		db.session.add(favourite_article)
		db.session.add(body_profile)
		db.session.add(health_profile)
		db.session.commit()


def seeder_sport(name, calorie, rate, difficulty, category):
	sport = Sport(name=name, calorie=calorie, rate=rate, category=category, difficulty=difficulty)
	sport.create_sport()


def seeder_article(title, content, tag, category, img):
	article = Article(title=title, content=content, tag=tag, category=category, img=img)
	article.create_article()


def check_today_weight_exist(userId, new_weight):
	# only one update on weight each day, if anymore update posted on the same date, weight data overwrite
	today = date.today()
	last_day_update = BodyProfile.query.filter_by(userId=userId).order_by(BodyProfile.id.desc()).first()
	user = User.query.filter_by(id=userId).first()
	if last_day_update.updateDay == today:
		# rewrite initiate as it already exist and change user weight
		user.weight = new_weight
		last_day_update.weight = new_weight
		db.session.commit()
		# return false as no new data row has been created, instead a modification
		return False
	else:
		# else create a new row for today's new weight
		user.weight = new_weight
		new_body_profile = BodyProfile(updateDay=today, weight=new_weight, userId=userId)
		db.session.add(new_body_profile)
		db.session.commit()
		return True


class User(UserMixin, db.Model):
	__tablename__ = "user"
	id = db.Column(db.Integer, primary_key=True)
	username = db.Column(db.String(40), unique=True, nullable=False)
	email = db.Column(db.String(100))
	password = db.Column(db.String(30), nullable=False)
	age = db.Column(db.Integer)
	# 0 for male, 1 for female
	gender = db.Column(db.Integer, nullable=False)
	height = db.Column(db.Float, nullable=True)
	weight = db.Column(db.Float, nullable=True)
	icon = db.Column(db.BLOB, nullable=True, default=None)
	description = db.Column(db.String(200), nullable=True, default="")
	confirm = db.Column(db.Boolean, default=False)
	# indicate the user's fitness behaviour, 0 is sedentary, 1 is lightly, 2 is Moderate, 3 is Very active, 4 is Extreme
	exerciseFrequency = db.Column(db.Integer, nullable=True)
	createDate = db.Column(db.Date, nullable=False, default=datetime.date.today())
	body_profile = db.relationship("BodyProfile", backref='user')
	favourite_article = db.relationship("FavouriteArticles", backref='user')
	health_profile = db.relationship("HealthProfile", backref='user')
	diet_profile = db.relationship("DietProfile", backref='user')

	def icon_exist(self):
		if self.icon is None:
			return False
		else:
			return True

	def remove_icon(self):
		self.icon = None


class BodyProfile(db.Model):
	__tablename__ = "body_profile"
	id = db.Column(db.Integer, primary_key=True)
	updateDay = db.Column(db.Date, nullable=False)
	weight = db.Column(db.Float, nullable=False)
	userId = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

	def get_bmi(self):
		return self.weight / math.pow(self.height / 100, 2)


class Article(db.Model):
	__tablename__ = "article"
	id = db.Column(db.Integer, primary_key=True)
	title = db.Column(db.String, nullable=False)
	content = db.Column(db.String, nullable=False)
	tag = db.Column(db.String, nullable=False)
	category = db.Column(db.String, nullable=False)
	img = db.Column(db.Integer, nullable=False)

	def create_article(self):
		db.session.add(self)
		db.session.commit()

	def is_favourite(self, userId):
		# check whether the article is in favourite article lsit
		fav_list = FavouriteArticles.query.filter_by(userId=userId).first().articles.split(",")
		if str(self.id) in fav_list:
			return True
		else:
			return False


class FavouriteArticles(db.Model):
	__tablename__ = "favourite_article"
	userId = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True, nullable=False)
	articles = db.Column(db.String, nullable=False, default="")

	def add_article(self, new_article: int):
		# if article already in the list, remove the article from list
		if self.check_article_exist(new_article):
			temp = self.articles.split(",")
			temp.remove(str(new_article))
			self.articles = ",".join(temp) if temp is not None else ""
			return [False, self]
		# else the article added to the list
		elif self.articles == "":
			self.articles = str(new_article)
		else:
			self.articles += "," + str(new_article)
		return [True, self]

	def check_article_exist(self, article):
		if self.articles != "" and str(article) in self.articles.split(","):
			return True
		return False


class HealthProfile(db.Model):
	__tablename__ = "health_profile"
	userId = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True, nullable=False)
	# 0 means no current target, 1 means weight loss, 2 means stay fit
	target = db.Column(db.Integer, nullable=False, default=0)
	# when target is weight loss, value means target weight, when target is stay fit, value is calories intake per day, else 0
	targetValue = db.Column(db.Float, nullable=False, default=0)


class DietProfile(db.Model):
	__tablename__ = "diet_profile"
	id = db.Column(db.Integer, primary_key=True)
	userId = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
	consumeDay = db.Column(db.Date, nullable=False)
	# calorie limit on that date
	calorie = db.Column(db.Float, nullable=False)
	diet_kanban = db.relationship("DietKanban", backref='diet_profile')


class DietKanban(db.Model):
	__tablename__ = "diet_kanban"
	id = db.Column(db.Integer, primary_key=True)
	# food name
	name = db.Column(db.String, nullable=False)
	# image src link
	image = db.Column(db.String)
	# nutrition in kcal
	carb = db.Column(db.Float)
	protein = db.Column(db.Float)
	fat = db.Column(db.Float)
	fatPerHundreds = db.Column(db.Float)
	carbPerHundreds = db.Column(db.Float)
	proteinPerHundreds = db.Column(db.Float)
	# weight consumed in grams
	weight = db.Column(db.Integer, nullable=False)
	# 1 - Breakfast, 2 - Lunch, 3 - Dinner
	mealType = db.Column(db.Integer, nullable=False)
	caloriePerHundreds = db.Column(db.Float, nullable=False)
	referenceId = db.Column(db.Integer, db.ForeignKey('diet_profile.id'))


class Sport(db.Model):
	__tablename__ = "sport"
	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String, nullable=False)
	# calorie consumption are for average 57KG(125 pounds) person trained for 30 mins
	calorie = db.Column(db.Integer, nullable=False)
	# rate is the increment of calorie lost, for every 13.5kg(30 pounds) increase, the constant rate increase
	rate = db.Column(db.Integer, nullable=False)
	# 0 is beginner, 1 is intermediate, 2 is advance
	difficulty = db.Column(db.Integer, nullable=False)
	# 1 for cardio, 2 for body shape(flexibility), 3 for muscular strength, 4 for stamina, the string store the interger split by colon
	category = db.Column(db.String, nullable=False)

	def create_sport(self):
		db.session.add(self)
		db.session.commit()
