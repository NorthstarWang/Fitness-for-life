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
        db.session.add(user)
    db.session.commit()


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
    health_profile = db.relationship("HealthProfile", backref='user')

    def icon_exist(self):
        if self.icon is None:
            return False
        else:
            return True

    def remove_icon(self):
        self.icon = None


class HealthProfile(db.Model):
    __tablename__ = "health_profile"
    id = db.Column(db.Integer, primary_key=True)
    latest = db.Column(db.Boolean, nullable=False, default=True)
    postTime = db.Column(db.DateTime, nullable=False)
    weight = db.Column(db.Float, nullable=False)
    height = db.Column(db.Float, nullable=False)
    BMI = db.Column(db.Float, nullable=False)
    userId = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def get_bmi(self):
        return self.weight / math.pow(self.height / 100, 2)
