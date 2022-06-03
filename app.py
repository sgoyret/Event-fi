from flask import Flask, render_template
from flask_cors import CORS

app = Flask(__name__)

@app.route('/', strict_slashes=False)
def index():
    return render_template('index.html')

@app.route('/sign-in', strict_slashes=False)
def login():
    return render_template('signin.html')

if __name__ == '__main__':
    app.run(port=5001, debug=True)