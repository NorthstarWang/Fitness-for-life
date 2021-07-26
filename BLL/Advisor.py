import datetime

from flask import Blueprint, render_template, request, jsonify
from flask_login import login_required, current_user
from sqlalchemy import and_

from app import db
from models import *

advisor = Blueprint("advisor", __name__, url_prefix="/advisor")


def format_axis_data(data):
	axis_data = []
	for i in data:
		temp_date = i.updateDay
		temp_point = {"x": temp_date, "y": i.weight}
		axis_data.append(temp_point)
	return jsonify(axis_data)


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


@advisor.route("/<string:monitor>", methods=['Get', 'Post'])
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


@advisor.route("/chart/week/get", methods=['Get', 'Post'])
@login_required
def get_week_chart():
	current = date.today()
	data = BodyProfile.query.filter(and_(BodyProfile.updateDay > current - datetime.timedelta(weeks=1), (BodyProfile.userId == current_user.id))).all()
	return format_axis_data(data)


@advisor.route("/chart/month/get", methods=['Get', 'Post'])
@login_required
def get_month_chart():
	month = str(request.form["month"])
	# reformat the month from string back to date time
	date_month = datetime.datetime.strptime(month, "%b %Y")
	date_next_month = datetime.datetime(month=date_month.month+1, year=date_month.year, day=1)
	data = BodyProfile.query.filter(and_(BodyProfile.updateDay >= date_month), (BodyProfile.updateDay < date_next_month), (BodyProfile.userId == current_user.id)).all()
	return format_axis_data(data)


@advisor.route("/record/month/get", methods=['Get', 'Post'])
@login_required
def get_month_record():
	current = date.today()
	data = BodyProfile.query.filter_by(userId=current_user.id).order_by(BodyProfile.updateDay).all()
	month = []
	curr_month = None
	for i in data:
		# sort month
		if curr_month is None or (curr_month.month != i.updateDay.month or curr_month.year != i.updateDay.year):
			# short format of month
			temp_format = i.updateDay.strftime("%b %Y")
			curr_month = i.updateDay
			month.append(str(temp_format))
		else:
			continue
	return jsonify(month)
