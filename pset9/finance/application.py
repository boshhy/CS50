import os

from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request, session
from flask_session import Session
from tempfile import mkdtemp
from werkzeug.exceptions import default_exceptions, HTTPException, InternalServerError
from werkzeug.security import check_password_hash, generate_password_hash

from helpers import apology, login_required, lookup, usd

# Configure application
app = Flask(__name__)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True


# Ensure responses aren't cached
@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


# Custom filter
app.jinja_env.filters["usd"] = usd

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_FILE_DIR"] = mkdtemp()
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///finance.db")

# Make sure API key is set
if not os.environ.get("API_KEY"):
    raise RuntimeError("API_KEY not set")


@app.route("/")
@login_required
def index():
    """Show portfolio of stocks"""
    current_user = db.execute("SELECT * FROM users WHERE id = ?", session["user_id"])
    current_stocks = db.execute(
        "SELECT symbol, sum(amount) as amount, price FROM stocks WHERE id = ? GROUP BY symbol", session["user_id"])
    cash_total = 0
    for stock in current_stocks:
        quote = lookup(stock["symbol"])
        stock["price"] = quote["price"]
        stock["name"] = quote["name"]
        cash_total = cash_total + (stock["amount"] * stock["price"])

    cash_total = cash_total + current_user[0]["cash"]
    return render_template("index.html", user=current_user, stocks=current_stocks, total=cash_total)


@app.route("/buy", methods=["GET", "POST"])
@login_required
def buy():
    """Buy shares of stock"""
    if request.method == "POST":
        symbol = request.form.get("symbol")
        shares = request.form.get("shares")
        quote = lookup(symbol)

        try:
            shares = int(shares)
            if shares < 1:
                return apology("Enter a positive integer")
        except ValueError:
            return apology("Enter a positive integer")

        if not shares:
            return apology("Enter number of shares")
        elif int(shares) < 1:
            return apology("Enter a positive number")
        elif not quote:
            return apology("Invalid symbol")
        else:
            # buy the symbol
            current_user = db.execute("SELECT * FROM users WHERE id = ?", session["user_id"])
            cost = float(shares) * float(quote["price"])
            if cost <= current_user[0]["cash"]:
                db.execute(
                    "INSERT INTO history (id, symbol, deal, amount, price) VALUES(?, ?, ?, ?, ?)",
                    session["user_id"], symbol, "buy", int(shares), float(quote["price"]))
                db.execute("UPDATE users SET cash = cash - ? WHERE id = ?", cost, session["user_id"])
                num = int(shares)
                while num > 0:
                    db.execute("INSERT INTO stocks (id, symbol, amount, price) VALUES(?, ?, ?, ?)",
                               session["user_id"], symbol, 1, float(quote["price"]))
                    num = num - 1

                flash("Bought!")
                return redirect("/")
            else:
                return apology("Not enough money")
    else:
        return render_template("buy.html")


@app.route("/history")
@login_required
def history():
    """Show history of transactions"""
    history = db.execute("SELECT * FROM history WHERE id = ?", session["user_id"])
    return render_template("/history.html", history=history)


@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""

    # Forget any user_id
    session.clear()

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":

        # Ensure username was submitted
        if not request.form.get("username"):
            return apology("must provide username", 403)

        # Ensure password was submitted
        elif not request.form.get("password"):
            return apology("must provide password", 403)

        # Query database for username
        rows = db.execute("SELECT * FROM users WHERE username = ?", request.form.get("username"))

        # Ensure username exists and password is correct
        if len(rows) != 1 or not check_password_hash(rows[0]["hash"], request.form.get("password")):
            return apology("invalid username and/or password", 403)

        # Remember which user has logged in
        session["user_id"] = rows[0]["id"]

        # Redirect user to home page
        return redirect("/")

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("login.html")


@app.route("/logout")
def logout():
    """Log user out"""

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/")


@app.route("/quote", methods=["GET", "POST"])
@login_required
def quote():
    """Get stock quote."""
    if request.method == "POST":
        symbol = request.form.get("symbol")
        quote = lookup(symbol)
        if not quote:
            return apology("Invalid symbol")
        else:
            return render_template("quoted.html", quote=quote)
    return render_template("quote.html")


@app.route("/register", methods=["GET", "POST"])
def register():
    """Register user"""
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        confirmation = request.form.get("confirmation")

        db_row = db.execute("SELECT * FROM users WHERE username = ?", username)

        if not username:
            return apology("No username")
        elif len(db_row) >= 1:
            return apology("Username already taken")
        elif not password or not confirmation:
            return apology("Password field left blank")
        elif password != confirmation:
            return apology("Passwords did not match")
        else:
            userhash = generate_password_hash(password)
            db.execute("INSERT INTO users (username, hash) VALUES(?, ?)", username, userhash)

            session.clear()
            user = db.execute("SELECT id FROM users WHERE username = ?", username)
            session["user_id"] = user[0]["id"]
            return redirect("/")
    else:
        return render_template("/register.html")


@app.route("/sell", methods=["GET", "POST"])
@login_required
def sell():
    """Sell shares of stock"""
    if request.method == "POST":
        symbol = request.form.get("symbol")
        shares = request.form.get("shares")
        quote = lookup(symbol)
        try:
            shares = int(shares)
            if shares < 1:
                return apology("Enter a positive integer")
        except ValueError:
            return apology("Enter a positive integer")

        if not quote:
            return apology("Invalid symbol")
        elif not shares:
            return apology("Please enter amount of shares to sell")
        elif int(shares) < 1:
            return apology("Enter a positive integer")
        else:
            stocks = db.execute("SELECT sum(amount) as amount FROM stocks WHERE id = ? AND symbol = ?", session["user_id"], symbol)
            if stocks[0]["amount"] == None:
                return apology("You don't own that stock")
            if stocks[0]["amount"] < int(shares):
                return apology("You don't own that much stocks")
            if int(stocks[0]["amount"]) == int(shares):
                db.execute("DELETE FROM stocks WHERE id = ? AND symbol = ?", session["user_id"], symbol)
                db.execute("INSERT INTO history (id, symbol, deal, amount, price) VALUES(?, ?, ?, ?,?)",
                           session["user_id"], symbol, "sold", int(shares), float(quote["price"]))
            else:
                db.execute("DELETE FROM stocks WHERE id = ? AND symbol = ? ORDER BY time LIMIT ?",
                           session["user_id"], symbol, int(shares))
                db.execute("INSERT INTO history (id, symbol, deal, amount, price) VALUES(?, ?, ?, ?, ?)",
                           session["user_id"], symbol, "sold", int(shares), float(quote["price"]))
            cost = int(shares) * quote["price"]
            db.execute("UPDATE users SET cash = cash + ? WHERE id = ?", cost, session["user_id"])

            flash("Sold!")
            return redirect("/")
    else:
        stocks_owned = db.execute("SELECT symbol FROM stocks WHERE id = ? GROUP BY symbol", session["user_id"])
        return render_template("/sell.html", stocks=stocks_owned)


@app.route("/change", methods=["GET", "POST"])
@login_required
def change():
    """Let user change password"""
    if request.method == "POST":
        oldpassword = request.form.get("oldpassword")
        newpassword = request.form.get("newpassword")
        confirmation = request.form.get("repeatpassword")

        if not oldpassword or not newpassword or not confirmation:
            return apology("One of more password fields left blank")
        if newpassword != confirmation:
            return apology("Passwords did not match")
        originalpassword = db.execute("SELECT hash FROM users WHERE id = ?", session["user_id"])

        if not check_password_hash(originalpassword[0]["hash"], oldpassword):
            return apology("Did not match current Password")

        if check_password_hash(originalpassword[0]["hash"], confirmation):
            return apology("New password must be different then previous password")

       #db.execute("UPDATE users SET cash = cash - ? WHERE id = ?", cost, session["user_id"])
        db.execute("UPDATE users SET hash = ? WHERE id = ?", generate_password_hash(confirmation), session["user_id"])
        flash("Password Changed")
        return redirect("/")

    else:
        return render_template("/change.html")


def errorhandler(e):
    """Handle error"""
    if not isinstance(e, HTTPException):
        e = InternalServerError()
    return apology(e.name, e.code)


# Listen for errors
for code in default_exceptions:
    app.errorhandler(code)(errorhandler)
