from app import *
from models import User
from flask import request
from flask_login import login_required


@app.route('/profile')
def profile():
    user_id = request.args.get('id')
    user = User.query.filter_by(id=user_id).first()
    return render_template('profile.html', user=user)

