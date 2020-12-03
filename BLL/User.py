from app import *
from models import User
from flask import request


@app.route('/profile')
def profile():
    user_id = request.args.get('id')
    user = User.query.filter_by(id=user_id).first()
    return render_template('profile.html', user=user)


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
