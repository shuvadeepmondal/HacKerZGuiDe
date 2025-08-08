from flask import render_template, Blueprint

index_bp = Blueprint('index', __name__)

@index_bp.route("/")
def index():
    return render_template("index.html")


@index_bp.route("/about")
def about():
    return render_template("about.html")


@index_bp.route("/resources")
def resources():
    return render_template("resources.html")


@index_bp.route("/faq")
def faq():
    return render_template("faq.html")


@index_bp.route("/quiz")
def quiz():
    return render_template("quiz.html")

@index_bp.route("/contact")
def contact():
    return render_template("contact.html")

@index_bp.route("/pp")
def pp():
    return render_template("pp.html")

@index_bp.route("/tc")
def tc():
    return render_template("t&c.html")


@index_bp.route("/web-dev")
def wd():
    return render_template("wd.html")


@index_bp.route("/android-dev")
def ad():
    return render_template("ad.html")


@index_bp.route("/game-dev")
def gd():
    return render_template("gd.html")


@index_bp.route("/cloud-computing")
def cc():
    return render_template("cc.html")


@index_bp.route("/cyber-security")
def cs():
    return render_template("cs.html")

@index_bp.route("/ai")
def ai():
    return render_template("ai.html")

