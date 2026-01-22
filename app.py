from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/enroll", methods=["GET", "POST"])
def enroll():
    errors = []

    if request.method == "POST":
        child_name = request.form.get("child_name", "").strip()
        dob = request.form.get("dob", "")
        gender = request.form.get("gender", "")
        program = request.form.get("program", "")
        parent_name = request.form.get("parent_name", "").strip()
        phone = request.form.get("phone", "").strip()
        agreement = request.form.get("agreement")

        if not child_name:
            errors.append("Child name is required.")
        if not dob:
            errors.append("Date of birth is required.")
        if not gender:
            errors.append("Please select a gender.")
        if not program:
            errors.append("Please select a program.")
        if not parent_name:
            errors.append("Parent/Guardian name is required.")
        if not phone or len(phone) < 10:
            errors.append("Valid phone number is required.")
        if not agreement:
            errors.append("You must accept the declaration.")

        if not errors:
            # Future: save to DB / send email
            return redirect(url_for("confirmation"))

    return render_template("enroll.html", errors=errors)


@app.route("/confirmation")
def confirmation():
    return render_template("confirmation.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3000, debug=True)
