from flask import Blueprint, render_template, request
from sqlalchemy import desc

from app import db
from models import Article

article = Blueprint("article", __name__, url_prefix="/article")


@article.route("/index")
def article_list():
	page = int(request.args.get("page"))
	per_page = int(request.args.get("per_page"))
	category = str(request.args.get("category"))
	article_pagination = Article.query.filter_by(category=category).order_by(desc(Article.id)).paginate(page, per_page=per_page)
	articles = article_pagination.items
	return render_template("Article/articles.html", pagination=article_pagination, articles=articles)
