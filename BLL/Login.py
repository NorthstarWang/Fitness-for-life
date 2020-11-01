from datetime import time

from flask import request, json, jsonify, url_for
from itsdangerous import URLSafeTimedSerializer, SignatureExpired
from flask_mail import Mail, Message
from app import *

urlSerializer = URLSafeTimedSerializer('Thisisasecret!')
app.config.from_pyfile('BLL/config.cfg')
mailer = Mail(app)


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), unique=True, index=True, nullable=False)
    email = db.Column(db.String(100))
    password = db.Column(db.String(30), nullable=False)
    age = db.Column(db.Integer)
    height = db.Column(db.Integer)
    weight = db.Column(db.Integer)
    confirm = db.Column(db.Boolean, default=False)


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
    return 'You have successfully created the account. A confirmation mail will be sent to your registration email. ' \
           'Please verify within 24 hours '


@app.route('/api/login/sign_in', methods=['POST', 'GET'])
def login_validation():
    username = str(request.form['username'])
    password = str(request.form['password'])
    user = User.query.filter_by(username=username, password=password).first()
    if user:
        login_user(user)
        return '0'
    else:
        return '1'


@app.route('/api/login/check_username_availability', methods=['POST', 'GET'])
def check():
    username = str(request.form['username'])
    user = User.query.filter_by(username=username).first()
    if user:
        return jsonify(valid=False, message='This username already exist, please try other username.')
    else:
        return jsonify(valid=True)


@app.route('/api/login/mail_verification', methods=['POST', 'GET'])
def mail():
        email = str(request.form['email'])
        token = urlSerializer.dumps(email, salt='email-confirm')
        msg = Message('Confirmation Mail', sender='Juncus@qq.com', recipients=[email])
        link = url_for('confirm_mail', token=token, external=True)
        msg.body = 'Click this link to confirm your email:{}'.format(link)
        mailer.connect()
        mailer.send(msg)
        return '0'


@app.route('/api/login/confirm_mail/<token>')
def confirm_mail(token):
    try:
        email = urlSerializer.loads(token, salt='email-confirm', max_age=20)
        return 'Success'
    except SignatureExpired:
        return 'Failure, expired'


@app.route('/api/logout', methods=['POST', 'GET'])
@login_required
def logout():
    logout_user()
    return 'You are now logged out!'


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))
