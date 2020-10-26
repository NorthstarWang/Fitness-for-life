import os
from flask import Flask, render_template
from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, IntegerField, SubmitField

app = Flask(__name__)

db = SQLAlchemy(app)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///' + os.path.join(app.root_path, 'data.db'))
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = 'Wang Yang'
import BLL


class User_Detail(db.Model):
    def __init__(self):
        pass

    # user id
    id = db.Column(db.Integer, primary_key=True)
    # user weight
    weight = db.Column(db.Float, nullable=False)
    # user height
    height = db.Column(db.Float, nullable=False)
    # user bmi
    bmi = db.Column(db.Float, nullable=False)
    # date
    date = db.Column(db.Date, nullable=False)
    # sleeping hour
    sleep = db.Column(db.Integer, nullable=False)


class SignUpForm(FlaskForm):
    username = StringField('username')
    email = StringField('email')
    password = PasswordField('password')
    age = IntegerField('age')
    height = IntegerField('height')
    weight = IntegerField('weight')
    submit = SubmitField('Sign Up')


@app.route('/')
def index():
    return render_template('Index.html')


@app.route('/signup',methods=['Get', 'Post'])
def sign_up():
    sign_up_form = SignUpForm()
    return render_template('login.html', sign_up_form=sign_up_form)


if __name__ == '__main__':
    app.run()
