from flask import Flask, request, jsonify, render_template, flash
from io import BytesIO
import requests
import time
import logging
import base64
from flask import Flask, render_template, request, redirect, url_for
import os

from cryptography.fernet import Fernet
from datetime import datetime, timedelta
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, UserMixin, login_user, current_user, logout_user, login_required
from forms import RegistrationForm, LoginForm, ChangePasswordForm
from models import User, URL, db, bcrypt
from urllib.parse import urlparse

app = Flask(__name__)

API_KEY = '35ff4fd90a69e29c7a77d726681f10e1d802d3f3bfb609cf1b263dc4590b8723'
UPLOAD_FILE = 'https://www.virustotal.com/api/v3/files'
ANALYSIS_FILE = 'https://www.virustotal.com/api/v3/analyses/'

app.config['SECRET_KEY'] = "b'k\xec\t\x024\xff\x15\x993\x02\xf9\\\xca\x08\xcaKs\x8b\xcb\xd2bs\xaeF'"
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_BINDS'] = {
    'secondary': 'sqlite:///secondary.db'
}

db.init_app(app)
bcrypt.init_app(app)
login_manager = LoginManager()
login_manager.init_app(app)

key = Fernet.generate_key()
cipher_suite = Fernet(key)


# Configure logging
logging.basicConfig(level=logging.DEBUG)

@app.route('/')
def index():
    app.logger.debug('Serving index.html')
    return render_template('index.html')

@app.route('/index')
def to_index():
    app.logger.debug('Serving index.html')
    return render_template('index.html')

@app.route('/accueil')
def accueil():
    app.logger.debug('Serving accueil.html')
    return render_template('accueil.html')

@app.route('/entreprise')
def entreprise():
    app.logger.debug('Serving entreprise.html')
    return render_template('entreprise.html')

@app.route('/contact')
def contact():
    app.logger.debug('Serving contact.html')
    return render_template('contact.html')

@app.route('/apropos')
def apropos():
    app.logger.debug('Serving apropos.html')
    return render_template('apropos.html')

@app.route('/question')
def question():
    app.logger.debug('Serving question.html')
    return render_template('question.html')

@app.route('/email')
def email():
    app.logger.debug('Serving email.html')
    return render_template('email.html')

@app.route('/usb')
def usb():
    app.logger.debug('Serving usb.html')
    return render_template('usb.html')

@app.route('/filedl')
def filedl():
    app.logger.debug('Serving filedl.html')
    return render_template('filedl.html')

@app.route('/inco')
def inco():
    app.logger.debug('Serving inco.html')
    return render_template('inco.html')

@app.route('/cookies')
def cookies():
    app.logger.debug('Serving cookies.html')
    return render_template('cookies.html')

@app.route('/avis')
def avis():
    app.logger.debug('Serving avis.html')
    return render_template('avis.html')

@app.route('/account')
@login_required
def account():
    app.logger.debug('Serving apropos.html')
    
    form = ChangePasswordForm()
    return render_template('account.html',form=form) 

@app.route('/change_password', methods=['GET', 'POST'])
@login_required
def change_password():
    form = ChangePasswordForm()
    if form.validate_on_submit():
        if bcrypt.check_password_hash(current_user.password, form.old_password.data):
            hashed_password = bcrypt.generate_password_hash(form.new_password.data).decode('utf-8')
            current_user.password = hashed_password
            db.session.commit()
            flash('Your password has been updated!', 'success')
            return redirect(url_for('index'))
        else:
            flash('Incorrect old password. Please try again.', 'danger')
            return render_template('account.html', form=form)


@app.route('/connexion', methods=['GET', 'POST'])
def connexion():
    form = LoginForm()
    if form.validate_on_submit():

        user = User.query.filter_by(username=form.username.data).first()

        if user:

            if user.is_locked():
                flash('Votre compte est verrouillé. Veuillez réessayer plus tard.', 'danger')
                return render_template('connexion.html', form=form)

            if bcrypt.check_password_hash(user.password, form.password.data):
                user.reset_failed_attempts()
                login_user(user, remember=form.remember.data)
                return redirect(url_for('index'))
            else:
                user.failed_attempts = user.failed_attempts + 1
                if user.failed_attempts >= 5:
                    user.lock_until = datetime.utcnow() + timedelta(seconds=30)
                    flash('Votre compte a été verrouillé pour 30 secondes en raison de trop nombreuses tentatives échouées.', 'danger')
                else:
                    flash('Identifiant ou mot de passe incorrect. Veuillez réessayer.', 'danger')
                db.session.commit()
        else:
            flash('Identifiant ou mot de passe incorrect. Veuillez réessayer.', 'danger')
    return render_template('connexion.html', form=form)

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('connexion'))  

@app.route('/inscription', methods=['GET', 'POST'])
def inscription():
    form = RegistrationForm()
    if form.validate_on_submit():
        # Chiffrer le mail
        encrypted_email =form.email.data
        hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        enterprise = form.entreprise.data

        # Créer un nouvel utilisateur avec le mail chiffré et les hachages
        user = User(username=form.username.data, email=encrypted_email, password=hashed_password, entreprise=enterprise, failed_attempts=0)
        db.session.add(user)
        db.session.commit()

        flash('Votre compte a été créé avec succès !', 'success')
        return redirect(url_for('connexion'))
    return render_template('inscription.html', title='Register', form=form)

@login_manager.user_loader
def load_user(user_id):
    # Chargez et retournez l'utilisateur à partir de la base de données en utilisant l'ID fourni
    return User.query.get(int(user_id))  # Assurez-vous d'avoir défini la classe User et sa structure

@app.route('/uploadfile', methods=['POST'])
def upload_file():
    app.logger.debug('Upload endpoint hit')
    
    if 'file' not in request.files:
        app.logger.error('No file part')
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        app.logger.error('No selected file')
        return jsonify({'error': 'No selected file'}), 400
    
    if file:
        app.logger.info(f'Uploading file: {file.filename}')
        files = {'file': (file.filename, file.read())}
        headers = {'x-apikey': API_KEY}
        response = requests.post(UPLOAD_FILE, files=files, headers=headers)
        
        if response.status_code == 200:
            analysis_id = response.json()['data']['id']
            app.logger.info(f'File uploaded successfully. Analysis ID: {analysis_id}')
            
            max_attempts = 30
            attempts = 0
            while attempts < max_attempts:
                result_response = requests.get(f'{ANALYSIS_FILE}{analysis_id}', headers=headers)
                if result_response.status_code == 200:
                    result_json = result_response.json()
                    status = result_json['data']['attributes']['status']
                    app.logger.debug(f'Analysis status: {status}')
                    if status == 'completed':
                        app.logger.info('Analysis completed')
                        return jsonify(result_json)
                    elif status == 'queued':
                        app.logger.info('Analysis queued')
                
                attempts += 1
                time.sleep(15)
            
            app.logger.error('Analysis timed out')
            return jsonify({'error': 'Analysis timed out'}), 408
        else:
            app.logger.error(f'Failed to upload file to VirusTotal. Status code: {response.status_code}, Response: {response.text}')
            return jsonify({'error': f'Failed to upload file to VirusTotal. Status code: {response.status_code}, Response: {response.text}'}), response.status_code
    
    app.logger.error('Unknown error')
    return jsonify({'error': 'Unknown error'}), 400

@app.route('/check_url_bdd', methods=['POST'])
def check_url_bdd():
    url = request.form.get('url')
    if not url:
        return jsonify({'error': 'No URL provided'}), 400
    parsed_url = urlparse(url)
    parts = parsed_url.hostname.split('.')
    
        # Check if there is an extension to remove
    if len(parts) > 2:
        # Remove the last part (extension)
        parsed_url = parsed_url._replace(netloc='.'.join(parts[:-1]))
    print(parsed_url)
    # Vérifiez si l'URL est déjà présente dans la base de données secondaire avec une comparaison stricte
    url_record = URL.query.filter_by(url=url).first()
    if url_record:
        return jsonify({'exists': True, 'message': 'URL already present in the database'})

    # Si l'URL n'est pas présente, retournez une réponse indiquant qu'elle n'existe pas
    return jsonify({'exists': False, 'message': 'URL not found in the database'})

@app.route('/add_blacklist_url', methods=['POST'])
def add_blacklist_url():
    url = request.form.get('url')
    if not url:
        return jsonify({'error': 'No URL provided'}), 400

    # Vérifiez si l'URL est déjà dans la base de données
    url_record = URL.query.filter_by(url=url).first()
    if url_record:
        return jsonify({'message': 'URL already in the blacklist'}), 200

    # Ajouter l'URL à la base de données
    new_url = URL(url=url)
    db.session.add(new_url)
    db.session.commit()
    return jsonify({'message': 'URL added to blacklist'}), 201


# Route pour soumettre l'URL pour analyse
@app.route('/uploadurl', methods=['POST'])
def upload_url():
    url = request.form.get('url')
    if not url:
        return jsonify({'error': 'No URL provided'}), 400

    # Encode l'URL en base64
    url_bytes = url.encode('utf-8')
    base64_url = base64.urlsafe_b64encode(url_bytes).decode('utf-8').strip("=")

    headers = {
        'x-apikey': API_KEY,
    }
    
    # Step 1: Submit URL for scanning
    response = requests.post(f'https://www.virustotal.com/api/v3/urls', headers=headers, data={'url': url})
    if response.status_code != 200:
        return jsonify({'error': 'Error submitting URL for analysis'}), response.status_code
    
    response_json = response.json()
    analysis_id = response_json['data']['id']

    # Step 2: Retrieve the analysis results
    max_attempts = 30
    attempts = 0
    while attempts < max_attempts:
        result_response = requests.get(f'https://www.virustotal.com/api/v3/analyses/{analysis_id}', headers=headers)
        if result_response.status_code == 200:
            result_json = result_response.json()
            status = result_json['data']['attributes']['status']
            if status == 'completed':
                return jsonify(result_json)
            elif status == 'queued':
                time.sleep(10)
        attempts += 1

    return jsonify({'error': 'Analysis timed out'}), 408
    
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)

  