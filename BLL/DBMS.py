from flask import request
from app import *


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(15), unique=True, index=True, nullable=False)
    email = db.Column(db.String(100)
                      )
    password = db.Column(db.String(30), nullable=False)
    age = db.Column(db.Integer)
    height = db.Column(db.Integer)
    weight = db.Column(db.Integer)


@app.route('/api/login/sign_up', methods=['POST'])
def login_insertion():
    username = str(request.form['username'])
    email = str(request.form['email'])
    password = str(request.form['password'])
    age = int(request.form['age'])
    weight = int(request.form['weight'])
    height = int(request.form['height'])
    user = User(username=username, email=email, password=password, age=age, height=height, weight=weight)
    db.session.add(user)
    db.session.commit()
    return 'You have successfully created the account.'
