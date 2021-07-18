import math
import random
import string

from app import db
from flask_login import UserMixin


def random_string_generator(str_size, allowed_chars=string.ascii_letters):
	return ''.join(random.choice(allowed_chars) for _ in range(str_size))


def seeder_user(number):
	# generate seed user data for development use
	for i in range(number):
		user = User(username=random_string_generator(10),
		            email=random_string_generator(10) + "@gmail.com",
		            password=random_string_generator(12),
		            age=random.randint(18, 60),
		            height=round(random.uniform(100.0, 200.0), 1),
		            weight=round(random.uniform(35.0, 100.0), 1),
		            confirm=True)
		favourite_article = FavouriteArticles(userId=i+1)
		db.session.add(user)
		db.session.add(favourite_article)
	db.session.commit()


def seeder_article(title, content, tag, category, img):
	article = Article(title=title, content=content, tag=tag, category=category, img=img)
	article.create_article()


class User(UserMixin, db.Model):
	__tablename__ = "user"
	id = db.Column(db.Integer, primary_key=True)
	username = db.Column(db.String(40), unique=True, index=True, nullable=False)
	email = db.Column(db.String(100))
	password = db.Column(db.String(30), nullable=False)
	age = db.Column(db.Integer)
	height = db.Column(db.Float, nullable=True)
	weight = db.Column(db.Float, nullable=True)
	icon = db.Column(db.BLOB, nullable=True, default=None)
	description = db.Column(db.String(200), nullable=True, default="")
	confirm = db.Column(db.Boolean, default=False)
	health_profile = db.relationship("BodyProfile", backref='user')
	favourite_article = db.relationship("FavouriteArticles", backref='user')

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
	latest = db.Column(db.Boolean, nullable=False, default=True)
	postTime = db.Column(db.DateTime, nullable=False)
	weight = db.Column(db.Float, nullable=False)
	height = db.Column(db.Float, nullable=False)
	BMI = db.Column(db.Float, nullable=False)
	userId = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

	def get_bmi(self):
		return self.weight / math.pow(self.height / 100, 2)

	def copy_previous_height(self):
		old_height = BodyProfile.query.filter_by(userId=self.userId).all()[-1].height
		self.height = old_height


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
