from flask import Blueprint, render_template, request
from flask_login import login_required, current_user

from app import db
from models import *

advisor = Blueprint("advisor", __name__, url_prefix="/advisor")


def calorie_intake_calculation():
	age = current_user.age
	weight = float(current_user.weight)
	gender = current_user.gender
	if gender == 0:
		# if male
		if age < 3:
			return [round(59.512 * weight - 30.4), 70]
		elif 3 <= age < 10:
			return [round(22.706 * weight + 504.3), 67]
		elif 10 <= age < 18:
			return [round(17.686 * weight + 658.2), 105]
		elif 18 <= age < 30:
			return [round(15.057 * weight + 692.2), 153]
		elif 30 <= age < 60:
			return [round(11.472 * weight + 873.1), 167]
		else:
			return [round(11.711 * weight + 587.7), 164]
	else:
		# if female
		if age < 3:
			return [round(58.317 * weight - 31.1), 59]
		elif 3 <= age < 10:
			return [round(20.315 * weight + 485.9), 70]
		elif 10 <= age < 18:
			return [round(13.384 * weight + 692.6), 111]
		elif 18 <= age < 30:
			return [round(14.818 * weight + 486.6), 119]
		elif 30 <= age < 60:
			return [round(8.126 * weight + 845.6), 111]
		else:
			return [round(9.082 * weight + 658.5), 108]


@advisor.route("/<string:monitor>")
@login_required
def health_advisor_index(monitor, notify=None):
	health_profile = HealthProfile.query.filter_by(userId=current_user.id).first()
	if monitor == "diet":
		return render_template("Advisor/advisorDiet.html", health_profile=health_profile, notify=notify, calorie_limit=calorie_intake_calculation())
	else:
		return render_template("Advisor/advisorWeight.html", health_profile=health_profile, notify=notify, calorie_limit=calorie_intake_calculation())


@advisor.route("/frequency/set", methods=['Get', 'Post'])
@login_required
def set_frequency():
	frequency = int(request.form['frequency'])
	User.query.filter_by(id=current_user.id).first().exerciseFrequency = frequency
	db.session.commit()
	return 'success'


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
