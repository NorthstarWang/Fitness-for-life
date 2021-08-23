from flask import Blueprint, render_template, request, jsonify
from flask_login import login_required, current_user
from sqlalchemy import and_, func, desc

from app import db
from models import *

advisor = Blueprint("advisor", __name__, url_prefix="/advisor")


def get_today_consumption():
	todayProfileId = DietProfile.query.filter(and_(DietProfile.userId == current_user.id), (DietProfile.consumeDay == date.today())).first().id
	todayFoods = DietKanban.query.filter_by(referenceId=todayProfileId).all()
	calorie = 0
	for food in todayFoods:
		calorie += food.caloriePerHundreds * food.weight / 100
	return calorie


def get_today_nutrition():
	todayProfileId = DietProfile.query.filter(and_(DietProfile.userId == current_user.id), (DietProfile.consumeDay == date.today())).first().id
	todayFoods = DietKanban.query.filter_by(referenceId=todayProfileId).all()
	sumFat = 0
	sumCarb = 0
	sumProtein = 0
	for food in todayFoods:
		sumFat += food.fatPerHundreds * food.weight / 100
		sumCarb += food.carbPerHundreds * food.weight / 100
		sumProtein += food.proteinPerHundreds * food.weight / 100
	return [round(sumFat, 1), round(sumCarb, 1), round(sumProtein, 1)]


def get_recent_meal_calorie():
	records = DietProfile.query.filter_by(userId=current_user.id).order_by(desc(DietProfile.consumeDay)).limit(5).all()
	if len(records) == 0:
		return None
	else:
		percentage = []
		for record in records:
			calorie = 0
			# load all food on that record day, sum up the calorie
			foods = DietKanban.query.filter_by(referenceId=record.id).all()
			for food in foods:
				calorie += food.weight * food.caloriePerHundreds / 100
			# return percentage sum calrie/ limit max calorie
			percentage.append(calorie / record.calorie)
		return percentage


def create_diet_profile(today, user):
	# check whether there is already a kanban and profile for diet today
	dietProfileExist = DietProfile.query.filter(and_(DietProfile.consumeDay == today), (DietProfile.userId == user)).all()
	# if no profile yet, create one
	if len(dietProfileExist) == 0:
		dietProfile = DietProfile(userId=user, consumeDay=today, calorie=calorie_intake_calculation()[0] + calorie_intake_calculation()[1])
		db.session.add(dietProfile)
		db.session.commit()


def clear_today_meal(dietProfileId):
	# if there is any food in current day list, clear it all
	food = DietKanban.query.filter_by(referenceId=dietProfileId).all()
	for i in food:
		db.session.delete(i)
	db.session.commit()


def calculate_calorie_consumption(weight, base_calorie, rate):
	weight_difference = weight - 57
	return round(weight_difference / 13.5 * rate + base_calorie)


def format_axis_data(data):
	axis_data = []
	for i in data:
		temp_date = i.updateDay
		temp_point = {"x": temp_date, "y": i.weight}
		axis_data.append(temp_point)
	return jsonify(axis_data)


def format_axis_data_BMI(data):
	axis_data = []
	for i in data:
		temp_date = i.updateDay
		temp_point = {"x": temp_date, "y": round(i.weight / ((current_user.height / 100) * (current_user.height / 100)), 2)}
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
		return render_template("Advisor/advisorDiet.html", health_profile=health_profile, notify=notify, calorie_limit=calorie_intake_calculation(), recent_meal=get_recent_meal_calorie(), nutrition=get_today_nutrition(),
		                       today_consumption=get_today_consumption())
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
		health_profile.targetValue = calorie_intake_calculation()[0]
	# calorie is different for individual thus calculate base on age, weight, gender
	db.session.commit()
	return "success"


@advisor.route("/chart/week/get", methods=['Get', 'Post'])
@login_required
def get_week_chart():
	current = date.today()
	data = BodyProfile.query.filter(and_(BodyProfile.updateDay > current - datetime.timedelta(weeks=1), (BodyProfile.userId == current_user.id))).all()
	return format_axis_data(data)


@advisor.route("/chart/week/get/BMI", methods=['Get', 'Post'])
@login_required
def get_week_chart_BMI():
	current = date.today()
	data = BodyProfile.query.filter(and_(BodyProfile.updateDay > current - datetime.timedelta(weeks=1), (BodyProfile.userId == current_user.id))).all()
	return format_axis_data_BMI(data)


@advisor.route("/chart/month/get", methods=['Get', 'Post'])
@login_required
def get_month_chart():
	month = str(request.form["month"])
	# reformat the month from string back to date time
	date_month = datetime.datetime.strptime(month, "%b %Y")
	date_next_month = datetime.datetime(month=date_month.month + 1, year=date_month.year, day=1)
	data = BodyProfile.query.filter(and_(BodyProfile.updateDay >= date_month), (BodyProfile.updateDay < date_next_month), (BodyProfile.userId == current_user.id)).all()
	return format_axis_data(data)


@advisor.route("/sport/trend/get", methods=['Get', 'Post'])
def get_trending_sports():
	sports = Sport.query.order_by(func.random()).limit(7).all()
	ret_array = []
	for i in sports:
		ret_array.append({"difficulty": i.difficulty, "name": i.name})
	return jsonify(ret_array)


@advisor.route("/chart/month/get/BMI", methods=['Get', 'Post'])
@login_required
def get_BMI_month_chart():
	month = str(request.form["month"])
	# reformat the month from string back to date time
	date_month = datetime.datetime.strptime(month, "%b %Y")
	date_next_month = datetime.datetime(month=date_month.month + 1, year=date_month.year, day=1)
	data = BodyProfile.query.filter(and_(BodyProfile.updateDay >= date_month), (BodyProfile.updateDay < date_next_month), (BodyProfile.userId == current_user.id)).all()
	return format_axis_data_BMI(data)


@advisor.route("/record/month/get", methods=['Get', 'Post'])
@login_required
def get_month_record():
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


@advisor.route("/sport/get/<int:number>", methods=['Get', 'Post'])
@login_required
def get_sport(number):
	# calculate sport energy consumption based on user weight
	# get numbers of random row
	easy_sport = Sport.query.filter_by(difficulty=0).order_by(func.random()).limit(number)
	intermediate_sport = Sport.query.filter_by(difficulty=1).order_by(func.random()).limit(number)
	advance_sport = Sport.query.filter_by(difficulty=2).order_by(func.random()).limit(number)
	# create a return dictionary that key is the difficulty level
	ret_dict = {0: [], 1: [], 2: []}
	for i in range(number):
		ret_dict[0].append({"name": easy_sport[i].name, "calorie": calculate_calorie_consumption(current_user.weight, easy_sport[i].calorie, easy_sport[i].rate), "category": easy_sport[i].category.split(",")})
		ret_dict[1].append({"name": intermediate_sport[i].name, "calorie": calculate_calorie_consumption(current_user.weight, intermediate_sport[i].calorie, intermediate_sport[i].rate), "category": intermediate_sport[i].category.split(",")})
		ret_dict[2].append({"name": advance_sport[i].name, "calorie": calculate_calorie_consumption(current_user.weight, advance_sport[i].calorie, advance_sport[i].rate), "category": advance_sport[i].category.split(",")})
	return jsonify(ret_dict)


@advisor.route("/diet/set", methods=['Get', 'Post'])
@login_required
def set_today_diet():
	# get food info
	foods = request.get_json()
	user = current_user.id
	today = date.today()
	dietProfileId = DietProfile.query.filter(and_(DietProfile.consumeDay == today), (DietProfile.userId == user)).first().id
	create_diet_profile(today, user)
	# if there is any food in current day list, clear it all
	clear_today_meal(dietProfileId)
	for food in foods:
		dietKanban = DietKanban(name=str(food["name"]), fatPerHundreds=float(food["fatPerHundreds"]), carbPerHundreds=float(food["carbPerHundreds"]), proteinPerHundreds=float(food["proteinPerHundreds"]), image=str(food["image"]),
		                        carb=float(food["carb"]), protein=float(food["protein"]), fat=float(food["fat"]), weight=int(food["weight"]), mealType=int(food["mealType"]),
		                        caloriePerHundreds=float(food["caloriePerHundreds"]), referenceId=int(dietProfileId))
		db.session.add(dietKanban)
		db.session.commit()
	return "success"


@advisor.route("/diet/get", methods=['Get', 'Post'])
@login_required
def get_today_diet():
	user = current_user.id
	today = date.today()
	dietProfile = DietProfile.query.filter(and_(DietProfile.consumeDay == today), (DietProfile.userId == user)).first()
	if dietProfile is not None:
		food_list = DietKanban.query.filter_by(referenceId=dietProfile.id).all()
		foods = []
		for food in food_list:
			temp = {
				"name": food.name,
				"fatPerHundreds": food.fatPerHundreds,
				"carbPerHundreds": food.carbPerHundreds,
				"proteinPerHundreds": food.proteinPerHundreds,
				"image": food.image,
				"carb": food.carb,
				"protein": food.protein,
				"fat": food.fat,
				"weight": food.weight,
				"mealType": food.mealType,
				"caloriePerHundreds": food.caloriePerHundreds
			}
			foods.append(temp)
		return jsonify(foods)
	else:
		return "Empty"
