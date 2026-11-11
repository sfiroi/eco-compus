from pathlib import Path
import sys

# The project root contains the folder ai/ (the AI advice module)
ROOT = Path(__file__).resolve().parent.parent

if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from ai.conseil import generer_conseil

# Flask = the small web server that sends the pages and answers the /api/... requests of the website.
from flask import Flask, jsonify, request, send_from_directory

import subprocess, json, os

ROOT = Path(__file__).resolve().parent.parent
# Important paths: backend/ and frontend/ folders, the CSV and JSON data files and the C program (api.exe).
B = ROOT / 'backend'
F = ROOT / 'frontend'
CSV = B / 'measures_in.csv'
JSON = B / 'data.json'
EXE = B / ('api.exe' if os.name == 'nt' else 'api')

# Creates the server. static_folder = the frontend folder, so Flask also serves the CSS / JS / HTML files.
app = Flask(__name__, static_folder=str(F), static_url_path='')


# Rewrites measures_in.csv from data.json (keeps the two data files identical).
def write_json_to_csv():
    with open(JSON, encoding='utf-8') as f:
        data = json.load(f)
    with open(CSV, 'w', encoding='utf-8') as f:
        f.write('id,batiment,ressource,valeur,seuil,date,alerte\n')
        for m in data:
            f.write(
                f"{m['id']},{m['batiment']},{m['ressource']},"
                f"{m['valeur']},{m['seuil']},{m['date']},"
                f"{str(m['alerte']).lower()}\n"
            )


# Keeps data.json and measures_in.csv in sync: the most recently modified file wins.
def sync_files():
    if not JSON.exists() or not CSV.exists():
        return

    # The newest of CSV/JSON is considered the user's latest manual edit.
    if JSON.stat().st_mtime_ns > CSV.stat().st_mtime_ns:
        write_json_to_csv()
    elif CSV.stat().st_mtime_ns > JSON.stat().st_mtime_ns:
        p = subprocess.run(
            [str(EXE), str(CSV), str(JSON), 'sync'],
            capture_output=True, text=True, timeout=10
        )
        if p.returncode:
            raise RuntimeError(p.stdout or p.stderr or 'Erreur sync')


# Runs the C program (api.exe) with a command (total, max, compare, add...) and returns its JSON answer.
# All the calculations of the project are done by the C code; Flask only forwards the request.
def c(cmd, *args):
    sync_files()

    p = subprocess.run(
        [str(EXE), str(CSV), str(JSON), cmd, *map(str, args)],
        capture_output=True,
        text=True,
        timeout=10
    )

    if p.returncode != 0:
        raise RuntimeError(
            p.stderr.strip() or
            p.stdout.strip() or
            "Erreur C"
        )

    output = p.stdout.strip()

    # api.c peut afficher des printf avant le JSON.
    # On récupère uniquement la partie JSON.
    pos_objet = output.find("{")
    pos_tableau = output.find("[")

    positions = [p for p in (pos_objet, pos_tableau) if p != -1]

    if not positions:
        raise RuntimeError(
            "api.exe n'a pas retourné de JSON : " + output
        )

    debut = min(positions)
    json_output = output[debut:]

    try:
        return json.loads(json_output)
    except json.JSONDecodeError:
        raise RuntimeError(
            "Réponse invalide de api.exe : " + output
        )


# Tells the browser never to keep old answers in cache, so the data on screen is always fresh.
@app.after_request
def nc(r):
    r.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    return r


# Page de connexion
# Page routes: "/" opens the login page, "/dashboard" opens the dashboard.
@app.get('/')
@app.get('/login')
@app.get('/login.html')
def login():
    return send_from_directory(F, 'login.html')


# Dashboard
@app.get('/dashboard')
@app.get('/dashboard.html')
def home():
    return send_from_directory(F, 'dashboard.html')


# Sends ALL the measures as JSON (used by the dashboard, Mesures and Analyses).
@app.get('/api/data')
def data():
    sync_files()
    with open(JSON, encoding='utf-8') as f:
        return jsonify(json.load(f))


# One route for several read-only commands: anomalies, search, evaluation, max, min, compare, average.
@app.get('/api/<cmd>')
def getcmd(cmd):
    if cmd == 'anomalies':
        return jsonify(c('anomalies'))
    if cmd == 'search':
        return jsonify(c('search', request.args.get('q', '')))
    if cmd == 'evaluation':
        return jsonify(c(
            'evaluation',
            request.args['batiment'],
            request.args['ressource'],
            request.args['annee']
        ))
    if cmd in ('max', 'min'):
        return jsonify(c(
            cmd,
            request.args['batiment'],
            request.args['ressource']
        ))
    if cmd == 'compare':
        return jsonify(c(
            'compare',
            request.args['batiment1'],
            request.args['batiment2'],
            request.args['ressource']
        ))
    
    if cmd == 'average':
        return jsonify(c(
            'average',
            request.args['batiment'],
            request.args['ressource'],
            request.args['annee']
        ))

    return jsonify({'error': 'unknown'}), 404


# Total consumption of one resource (electricite, eau or chauffage).
@app.get('/api/total/<r>')
def total(r):
    return jsonify(c('total', r))


# Sorting routes: the C program sorts the measures by value, by id, or by id descending.
@app.post('/api/sort')
def sort():
    return jsonify(c('sort_val'))


@app.post('/api/sort-id')
def sort_id():
    return jsonify(c('sort_id'))


@app.post('/api/sort-id-desc')
def sort_id_desc():
    return jsonify(c('sort_id_desc'))

# Add a new measure (sent as JSON by the Gestion page).
@app.post('/api/measure')
def add():
    d = request.get_json()
    return jsonify(c(
        'add',
        d['batiment'],
        d['ressource'],
        d['valeur'],
        d['seuil'],
        d['date']
    ))


# Delete the measure that has this id.
@app.delete('/api/measure/<int:i>')
def delete(i):
    return jsonify(c('delete', i))


# Checks if a measure is valid and if it is above its threshold, without saving it.
@app.post('/api/verify')
def verify():
    d = request.get_json()
    return jsonify(c(
        'verify',
        d['batiment'],
        d['ressource'],
        d['valeur'],
        d['seuil'],
        d['date']
    ))


# =========================
# AI Conseil consommation
# =========================
@app.route("/chat")
@app.route("/chat.html")
def chat():
    return send_from_directory(F, "chat.html")


# The AI assistant: sends the question + the real measures to the AI (Groq) and returns its advice.
@app.post("/api/conseil")
def api_conseil():
    data = request.get_json(silent=True) or {}

    question = data.get("message", "").strip()
    historique = data.get("historique", [])

    if not question:
        return jsonify({
            "reply": "Veuillez écrire votre question."
        }), 400

    # Charger les mesures réelles du projet
    try:
        sync_files()

        with open(JSON, encoding="utf-8") as f:
            mesures = json.load(f)

    except (OSError, json.JSONDecodeError, RuntimeError):
        return jsonify({
            "reply": "Impossible de lire les mesures de consommation."
        }), 500

    # Vérifier les mesures et préparer le contexte AI
    try:
        reply = generer_conseil(
            question=question,
            mesures=mesures,
            historique=historique
        )

        return jsonify({"reply": reply})

    except Exception:
        app.logger.exception("Erreur pendant l'appel AI")

        return jsonify({
            "reply": (
                "Le service AI est momentanément indisponible. "
                "Vérifiez la clé API, la connexion et le modèle Groq."
            )
        }), 502

# Starts the server on port 5000 when you run: python backend\app.py
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)