from flask import request, jsonify, url_for, flash, redirect, Blueprint
from flask_login import login_user, logout_user, login_required, current_user
from itsdangerous import URLSafeTimedSerializer, SignatureExpired
from flask_mail import Mail, Message
from app import db, render_template, app
from models import User, FavouriteArticles

urlSerializer = URLSafeTimedSerializer('Thisisasecret!')
app.config.from_pyfile('BLL/config.cfg')
mailer = Mail(app)

account = Blueprint("account", __name__, url_prefix="/account")


@account.route('/signup', methods=['Get', 'Post'])
def sign_up():
    # Check whether user is logged in with an account
    # if they already log in, they cannot enter the login page
    if current_user.is_authenticated:
        flash(u"You have already logged in!", "warning")
        return redirect(url_for('index'))
    else:
        return render_template('login.html')


@account.route('/sign_up', methods=['GET', 'POST'])
def login_insertion():
    # sign up a new account
    username = str(request.form['username'])
    email = str(request.form['email'])
    age = int(request.form['age'])
    weight = float(request.form['weight'])
    height = float(request.form['height'])
    password = str(request.form['password'])
    user = User(username=username, email=email, password=password, age=age, height=height, weight=weight)
    # insert new data into database
    db.session.add(user)
    db.session.commit()
    return 'You have successfully created the account. A confirmation mail will be sent to your registration email. ' \
           'Please verify within 24 hours '


@account.route('/sign_in', methods=['POST', 'GET'])
def login_validation():
    username = str(request.form['username'])
    password = str(request.form['password'])
    user = User.query.filter_by(username=username, password=password).first()
    if user:
        login_user(user)
        return '0'
    else:
        return '1'


@account.route('/check_username_availability', methods=['POST', 'GET'])
def check():
    username = str(request.form['username'])
    user = User.query.filter_by(username=username).first()
    if user:
        return jsonify(valid=False, message='This username already exist, please try other username.')
    else:
        return jsonify(valid=True)


@account.route('/mail_verification', methods=['POST', 'GET'])
def mail():
    email = str(request.form['email'])
    username = str(request.form['username'])
    user = User.query.filter_by(email=email, username=username).first()
    PK = user.id
    token = urlSerializer.dumps(PK, salt='email-confirm')
    msg = Message('Confirmation Mail', sender='Juncus@qq.com', recipients=[email])
    link = request.host_url + url_for('account.confirm_mail', token=token, external=True)
    msg.body = 'Click this link to confirm your email:{}'.format(link)
    mailer.connect()
    mailer.send(msg)
    return '0'


@account.route('/confirm_mail/<token>')
def confirm_mail(token):
    try:
        array = urlSerializer.loads(token, salt='email-confirm', max_age=86400)
        user = User.query.filter_by(id=array).first()
        user.confirm = True
        # as id is auto generated, the id get after generation, all other database should be generated after email confirmed
        favourite_article = FavouriteArticles(userId=user.id)
        db.session.add(favourite_article)
        db.session.commit()
        flash(u"You have successfully confirmed your email address!", "success")
    except SignatureExpired:
        flash(u"The link is expired!", "warning")
    except Exception:
        flash(u"Invalid token!", "error")
    return render_template('login.html')


@account.route('/logout', methods=['POST', 'GET'])
@login_required
def logout():
    logout_user()
    return render_template('Index.html', notify="You have logged out.", type="danger")
