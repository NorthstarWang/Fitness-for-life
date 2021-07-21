from flask import Blueprint, render_template, request
from flask_login import login_required, current_user

from app import db
from models import *

advisor = Blueprint("advisor", __name__, url_prefix="/advisor")


def calorie_intake_calculation():
	if current_user.age <= 30:
		if current_user.gender == 0:
			return (63 * current_user.weight + 2896) // 4.18
		else:
			return (62 * current_user.weight + 2036) // 4.18
	else:
		if current_user.gender == 0:
			return (48 * current_user.weight + 3653) // 4.18
		else:
			return (34 * current_user.weight + 3538) // 4.18


@advisor.route("/<string:monitor>")
@login_required
def health_advisor_index(monitor, notify=None):
	health_profile = HealthProfile.query.filter_by(userId=current_user.id).first()
	if monitor == "diet":
		return render_template("Advisor/advisorDiet.html", health_profile=health_profile, notify=notify)
	else:
		return render_template("Advisor/advisorWeight.html", health_profile=health_profile, notify=notify)


@advisor.route("/target/set", methods=['Get', 'Post'])
@login_required
def set_target():
	target = str(request.form['target'])
	health_profile = HealthProfile.query.filter_by(userId=current_user.id).first()
	if target == "weight_loss":
		target_weight = float(request.form['weight'])
		health_profile.target = 1
		health_profile.targetValue = target_weight
	else:
		health_profile.target = 2
		health_profile.targetValue = calorie_intake_calculation()
	# calorie is different for individual thus calculate base on age, weight, gender
	db.session.commit()
	return "success"
