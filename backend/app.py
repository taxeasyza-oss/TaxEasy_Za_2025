from flask import Flask, send_from_directory, make_response
from flask_cors import CORS
import os

app = Flask(__name__, static_folder='../', static_url_path='')
CORS(app)

# ----------  MAIN CALCULATOR PAGE  ----------
@app.route('/')
def index():
    return send_from_directory('../', 'index.html')

# ----------  STATIC HELP PAGES  ----------
@app.route('/faq.html')
def faq():
    return send_from_directory('../', 'faq.html')

@app.route('/efiling-guide.html')
def efiling_guide():
    return send_from_directory('../', 'efiling-guide.html')

# ----------  SERVE OTHER STATIC ASSETS (css, js, translations, etc.)  ----------
@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory('../', filename)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
