from flask import Flask, request, jsonify, render_template
import requests
import time
import logging

app = Flask(__name__)

API_KEY = '35ff4fd90a69e29c7a77d726681f10e1d802d3f3bfb609cf1b263dc4590b8723'
UPLOAD_URL = 'https://www.virustotal.com/api/v3/files'
ANALYSIS_URL = 'https://www.virustotal.com/api/v3/analyses/'

# Configure logging
logging.basicConfig(level=logging.DEBUG)

@app.route('/')
def index():
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

@app.route('/upload', methods=['POST'])
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
        response = requests.post(UPLOAD_URL, files=files, headers=headers)
        
        if response.status_code == 200:
            analysis_id = response.json()['data']['id']
            app.logger.info(f'File uploaded successfully. Analysis ID: {analysis_id}')
            
            max_attempts = 30
            attempts = 0
            while attempts < max_attempts:
                result_response = requests.get(f'{ANALYSIS_URL}{analysis_id}', headers=headers)
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
                time.sleep(20)
            
            app.logger.error('Analysis timed out')
            return jsonify({'error': 'Analysis timed out'}), 408
        else:
            app.logger.error(f'Failed to upload file to VirusTotal. Status code: {response.status_code}, Response: {response.text}')
            return jsonify({'error': f'Failed to upload file to VirusTotal. Status code: {response.status_code}, Response: {response.text}'}), response.status_code
    
    app.logger.error('Unknown error')
    return jsonify({'error': 'Unknown error'}), 400

if __name__ == '__main__':
    app.run(debug=True)