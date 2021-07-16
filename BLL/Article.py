from flask import Blueprint, render_template

article = Blueprint("article", __name__, url_prefix="/article")


@article.route("/index")
def article_list():
	return render_template("Article/articles.html")
