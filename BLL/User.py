from flask import request, redirect, url_for, Blueprint
from flask_wtf.file import FileRequired, FileAllowed
from wtforms import FileField, Form, SubmitField, HiddenField
from base64 import b64encode

from app import db, render_template
from models import User


class AvatarForm(Form):
    avatar = FileField('profile_avatar', validators=[FileRequired(), FileAllowed(['png', 'jpg', 'jpeg'])])
    id = HiddenField('id')
    submit = SubmitField('Confirm')


profile = Blueprint("profile", __name__, url_prefix="/profile")


@profile.route('/info/<int:user_id>')
def _profile(user_id):
    user = User.query.filter_by(id=user_id).first()
    form = AvatarForm()
    if user.icon_exist():
        icon = b64encode(user.icon).decode("utf-8")
        return render_template('profile.html', user=user, form=form, icon=icon)
    return render_template('profile.html', user=user, form=form, icon=None)


@profile.route('/edit/description', methods=['POST', 'GET'])
def edit_description():
    description = str(request.form['description'])
    user_id = int(request.form['id'])
    user = User.query.filter_by(id=user_id).first()
    user.description = description
    try:
        db.session.commit()
        return 'success'
    except Exception:
        return 'failure'


@profile.route('/edit/avatar', methods=['POST', 'GET'])
def edit_avatar():
    avatar = request.files.get('avatar')
    user_id = str(request.form['id'])
    user = User.query.filter_by(id=user_id).first()
    user.icon = avatar.read()
    db.session.commit()
    return redirect(url_for('profile._profile', user_id=user_id))


@profile.route('/delete/avatar/<int:user_id>', methods=['POST', 'GET'])
def delete_avatar(user_id):
    user = User.query.filter_by(id=user_id).first()
    try:
        user.remove_icon()
        db.session.commit()
        return 'success'
    except Exception:
        return 'failure'
