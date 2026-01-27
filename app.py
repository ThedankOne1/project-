from flask import Flask, render_template, request, redirect, session, url_for, abort
from functools import wraps
from datetime import datetime

from models import db, BlogPost, User


# =========================
# APP SETUP
# =========================
app = Flask(__name__)

app.secret_key = "replace-this-with-env-secret"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///galaxykids.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)


# =========================
# AUTH DECORATOR
# =========================
def login_required(role=None):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            user = session.get("user")

            if not user:
                return redirect(url_for("login"))

            if role and user.get("role") != role:
                abort(403)

            return fn(*args, **kwargs)
        return wrapper
    return decorator


# =========================
# ROUTES
# =========================
@app.route("/")
def home():
    return render_template("index.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email", "").strip()
        password = request.form.get("password", "")
        role = request.form.get("role", "")

        if not email or not password or not role:
            return render_template("login.html", error="All fields are required")

        user = User.query.filter_by(email=email, role=role).first()

        if not user or not user.check_password(password):
            return render_template("login.html", error="Invalid credentials")

        session["user"] = {
            "email": user.email,
            "role": user.role
        }

        return redirect(url_for("home"))

    return render_template("login.html")


@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("home"))


@app.route("/blog")
def blog():
    posts = BlogPost.query.order_by(BlogPost.created_at.desc()).all()
    return render_template("blog.html", posts=posts)


@app.route("/blog/new", methods=["GET", "POST"])
@login_required(role="teacher")
def new_blog():
    if request.method == "POST":
        title = request.form.get("title", "").strip()
        content = request.form.get("content", "").strip()

        if not title or not content:
            return render_template("new_blog.html", error="All fields required")

        post = BlogPost(
            title=title,
            content=content,
            author_email=session["user"]["email"],
            created_at=datetime.utcnow()
        )

        db.session.add(post)
        db.session.commit()

        return redirect(url_for("blog"))

    return render_template("new_blog.html")


@app.route("/enroll", methods=["GET", "POST"])
def enroll():
    if request.method == "POST":
        required_fields = [
            "child_name",
            "dob",
            "gender",
            "program",
            "parent_name",
            "phone",
            "address"
        ]

        errors = [
            f"{field.replace('_', ' ').title()} is required"
            for field in required_fields
            if not request.form.get(field)
        ]

        if errors:
            return render_template("enroll.html", errors=errors)

        # Enrollment saving logic can be added here later

        return redirect(url_for("confirmation"))

    return render_template("enroll.html")


@app.route("/confirmation")
def confirmation():
    return render_template("confirmation.html")


# =========================
# APP ENTRY POINT
# =========================
if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(
        host="0.0.0.0",
        port=3000,
        debug=True
    )
