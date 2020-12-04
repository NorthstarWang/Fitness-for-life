from flask_wtf.file import FileRequired, FileAllowed
from wtforms import FileField, Form, SubmitField, StringField, HiddenField
from wtforms.validators import DataRequired

from app import *
from models import User
from flask import request, redirect, url_for


class AvatarForm(Form):
    avatar = FileField('profile_avatar', validators=[FileRequired(), FileAllowed(['png', 'jpg', 'jpeg'])])
    id = HiddenField('id')
    submit = SubmitField('Confirm')


@app.route('/profile')
def profile():
    user_id = request.args.get('id')
    user = User.query.filter_by(id=user_id).first()
    form = AvatarForm()
    return render_template('profile.html', user=user, form=form)


@app.route('/api/profile/edit/description', methods=['POST', 'GET'])
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


@app.route('/api/profile/edit/avatar', methods=['POST', 'GET'])
def edit_avatar():
    form = AvatarForm()
    avatar = request.files.get('avatar')
    avatar.save(os.path.join(app.root_path, 'static/user/icon/' + avatar.filename))
    user_id = str(request.form['id'])
    user = User.query.filter_by(id=user_id).first()
    user.icon = avatar.filename
    db.session.commit()
    return redirect(url_for('profile', id=user_id))
