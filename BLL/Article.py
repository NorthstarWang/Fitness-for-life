from flask import Blueprint, render_template, request
from sqlalchemy import desc

from app import db, current_user
from models import Article, FavouriteArticles

article = Blueprint("article", __name__, url_prefix="/article")


@article.route("/index")
def article_list():
	page = int(request.args.get("page"))
	per_page = int(request.args.get("per_page"))
	category = str(request.args.get("category"))
	article_pagination = Article.query.filter_by(category=category).order_by(desc(Article.id)).paginate(page, per_page=per_page)
	articles = article_pagination.items
	return render_template("Article/articles.html", pagination=article_pagination, articles=articles)


@article.route("/get/<int:article_id>")
def read_article(article_id):
	article_detail = Article.query.filter_by(id=article_id).first()
	return render_template("Article/article.html", article=article_detail)


@article.route("/favourite/add/<int:article_id>", methods=['Get', 'Post'])
def add_favourite_article(article_id):
	favourite = FavouriteArticles.query.filter_by(userId=current_user.id).first()
	status = favourite.add_article(article_id)
	# if add, return "add", if remove from list, return "remove"
	favourite_article = FavouriteArticles.query.filter_by(userId=current_user.id).first()
	favourite_article.articles = status[1].articles
	db.session.commit()
	return "add" if status[0] else "remove"



