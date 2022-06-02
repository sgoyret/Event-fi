from pickle import TRUE
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/', strict_slashes=False)
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(port=5001, debug=True)