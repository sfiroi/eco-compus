# 🌱 EcoCampus — Plateforme de suivi énergétique

EcoCampus est une application web destinée au suivi de la consommation des ressources d'un campus. Elle permet de consulter les mesures des bâtiments, repérer les dépassements de seuils, analyser les consommations et obtenir des conseils pour réduire le gaspillage.

Les ressources actuellement gérées sont :

- Électricité (`electricite`)
- Eau (`eau`)
- Chauffage (`chauffage`)

## Fonctionnalités

### Tableau de bord et mesures
- Consultation des mesures enregistrées.
- Affichage des indicateurs et des tendances de consommation.
- Visualisation graphique des données.
- Recherche et tri des mesures.
- Identification des mesures qui dépassent leur seuil.

### Analyses
- Évaluation annuelle de la consommation d'un bâtiment et d'une ressource.
- Comparaison de deux bâtiments.
- Recherche des valeurs minimale et maximale.
- Calcul des totaux et des moyennes annuelles.
- Consultation des anomalies de consommation.

### Gestion
- Ajout d'une mesure.
- Suppression d'une mesure.
- Vérification de la validité d'une mesure avant son enregistrement.

### Notifications et assistant IA
- Centre de notifications pour attirer l'attention sur les alertes.
- Assistant conversationnel spécialisé dans la consommation énergétique.
- Conseils générés à partir des mesures réelles du projet.
- Prise en charge du français et de l'arabe tunisien par l'assistant.
- Interface multilingue et fonction de lecture vocale du texte dans l'interface.

### Connexion
- Page de connexion avec CAPTCHA.
- Vérification des identifiants à l'aide de PHP et MySQL.

## Technologies utilisées

| Partie | Technologies |
|---|---|
| Interface | HTML5, CSS3, JavaScript, Bootstrap 5.3 |
| API web | Python, Flask |
| Traitement des mesures | C |
| Connexion et authentification | PHP |
| Base de données des utilisateurs | MySQL / MariaDB |
| Assistant IA | Groq API (`openai/gpt-oss-20b`) |
| Données de consommation | CSV et JSON |

## Structure du projet

```text
eco-compus/
├── ai/
│   └── conseil.py                 # Intégration de l'assistant IA via Groq
├── backend/
│   ├── app.py                     # Serveur Flask et routes API
│   ├── api.c                      # Programme C appelé par Flask
│   ├── db.php                     # Connexion PHP à MySQL
│   ├── login.php                  # Traitement du formulaire de connexion
│   ├── measures_in.csv            # Données de consommation au format CSV
│   └── data.json                  # Données exportées au format JSON
├── database/
│   └── ecocampus_db.sql           # Structure et données initiales de la base
├── frontend/
│   ├── login.html                 # Page de connexion
│   ├── dashboard.html             # Tableau de bord
│   ├── mesures.html               # Liste des mesures
│   ├── analyses.html              # Analyses et statistiques
│   ├── gestion.html               # Ajout, suppression et vérification
│   ├── notifications.html         # Centre de notifications
│   ├── chat.html                  # Assistant IA
│   └── assets/
│       ├── css/                   # Feuilles de style
│       └── js/                    # Scripts JavaScript
└── README.md
```

## Prérequis

Installer les outils suivants avant de lancer le projet :

- Python 3.10 ou version ultérieure.
- GCC (ou un compilateur C compatible).
- PHP 8 et Apache.
- MySQL ou MariaDB (XAMPP peut fournir Apache, PHP et MariaDB).
- Une clé API Groq pour utiliser l'assistant IA.
- Un navigateur web récent.

## Installation et configuration

### 1. Récupérer le projet

```bash
git clone <URL_DU_DEPOT>
cd eco-compus
```

### 2. Préparer la base de données

1. Démarrer Apache et MySQL depuis XAMPP.
2. Ouvrir phpMyAdmin à l'adresse `http://localhost/phpmyadmin`.
3. Importer le fichier `database/ecocampus_db.sql`.
4. Vérifier que la base `ecocampus_db` et la table `users` ont bien été créées.

La connexion MySQL utilisée dans `backend/db.php` est actuellement configurée pour un serveur local avec :

- Hôte : `localhost`
- Utilisateur : `root`
- Mot de passe : vide
- Base : `ecocampus_db`

Adapter `backend/db.php` si la configuration locale est différente.

### 3. Installer les dépendances Python

Depuis la racine du projet :

```bash
python -m venv .venv
```

Activer l'environnement virtuel :

**Windows (PowerShell)**

```powershell
.venv\Scripts\Activate.ps1
```

**Linux / macOS**

```bash
source .venv/bin/activate
```

Installer les bibliothèques :

```bash
pip install Flask groq python-dotenv
```

### 4. Configurer la clé API de l'assistant IA

Créer un fichier nommé `.env` dans le dossier `ai/` :

```text
GROQ_API_KEY=votre_cle_api_groq
```

Le fichier `.env` est ignoré par Git : ne jamais publier sa clé API ni la placer directement dans le code source.

Sans cette clé, l'importation du module IA peut empêcher le démarrage du serveur Flask. Pour utiliser uniquement les autres fonctionnalités, il faudra rendre le chargement du module IA facultatif dans `backend/app.py` et `ai/conseil.py`.

### 5. Compiler le programme C

Le serveur Flask appelle un exécutable C nommé `api.exe` sous Windows ou `api` sous Linux/macOS. Il lui transmet les chemins des fichiers CSV et JSON ainsi que l'opération à effectuer.

**Attention :** dans la copie du dépôt fournie avec ce README, `backend/api.c` est présent, mais les fichiers d'implémentation et d'en-tête contenant les fonctions de gestion (`gestion.c` et `gestion.h`) ne sont pas présents. La compilation ne pourra donc pas aboutir tant que ces fichiers ne seront pas ajoutés au dossier `backend/`.

Lorsque `gestion.c` et `gestion.h` sont disponibles, compiler depuis la racine du projet :

**Windows (MinGW/GCC)**

```bash
gcc -Wall -Wextra -o backend/api.exe backend/api.c backend/gestion.c
```

**Linux / macOS**

```bash
gcc -Wall -Wextra -o backend/api backend/api.c backend/gestion.c
```

Vérifier que le compilateur est accessible depuis le terminal avec `gcc --version`.

### 6. Lancer le serveur Flask

Depuis la racine du projet, avec l'environnement virtuel activé :

```bash
python backend/app.py
```

Le serveur démarre sur :

```text
http://127.0.0.1:5000
```

Ouvrir ensuite `http://127.0.0.1:5000/` pour accéder à la page de connexion ou `http://127.0.0.1:5000/dashboard` pour le tableau de bord.

### 7. Configurer l'accès PHP

La page `frontend/login.html` envoie le formulaire à :

```text
http://localhost/EcoCampus/backend/login.php
```

Pour que cette partie fonctionne avec XAMPP, placer le projet dans le répertoire web Apache (généralement `C:\xampp\htdocs\EcoCampus`) ou modifier l'attribut `action` du formulaire pour correspondre au chemin réel.

Le traitement PHP utilise la base `ecocampus_db`. Après une connexion réussie, il redirige l'utilisateur vers le serveur Flask à `http://127.0.0.1:5000/dashboard`.

> Le serveur Flask et Apache doivent donc être démarrés pour utiliser le parcours de connexion actuel.

## API HTTP

L'API Flask est définie dans `backend/app.py`. Les principales routes sont :

| Méthode | Route | Rôle |
|---|---|---|
| `GET` | `/api/data` | Récupérer toutes les mesures |
| `GET` | `/api/anomalies` | Récupérer les mesures en dépassement de seuil |
| `GET` | `/api/search?q=...` | Rechercher une mesure |
| `GET` | `/api/evaluation?batiment=...&ressource=...&annee=...` | Évaluation annuelle |
| `GET` | `/api/max?...` | Valeur maximale |
| `GET` | `/api/min?...` | Valeur minimale |
| `GET` | `/api/compare?batiment1=...&batiment2=...&ressource=...` | Comparer deux bâtiments |
| `GET` | `/api/average?batiment=...&ressource=...&annee=...` | Moyenne annuelle |
| `GET` | `/api/total/<ressource>` | Total d'une ressource |
| `POST` | `/api/sort` | Trier par valeur |
| `POST` | `/api/sort-id` | Trier par identifiant croissant |
| `POST` | `/api/sort-id-desc` | Trier par identifiant décroissant |
| `POST` | `/api/measure` | Ajouter une mesure |
| `DELETE` | `/api/measure/<id>` | Supprimer une mesure |
| `POST` | `/api/verify` | Vérifier une mesure |
| `POST` | `/api/conseil` | Envoyer une question à l'assistant IA |

Les routes de l'API renvoient des réponses JSON. Pour les paramètres détaillés et les formats des corps JSON, consulter les fonctions correspondantes dans `backend/app.py` et les appels `fetch()` dans `frontend/assets/js/`.

## Gestion des données

Les mesures sont conservées dans deux fichiers :

- `backend/measures_in.csv` : fichier CSV utilisé comme source d'entrée.
- `backend/data.json` : représentation JSON utilisée notamment par l'interface et l'assistant IA.

Avant certaines opérations, Flask compare les dates de modification des deux fichiers et synchronise le fichier le plus récemment modifié. Les opérations de lecture et de modification sont déléguées au programme C.

La structure d'une mesure est la suivante :

| Champ | Description |
|---|---|
| `id` | Identifiant de la mesure |
| `batiment` | Nom du bâtiment |
| `ressource` | `electricite`, `eau` ou `chauffage` |
| `valeur` | Valeur mesurée |
| `seuil` | Seuil de référence |
| `date` | Date de la mesure |
| `alerte` | `true` si la valeur dépasse le seuil |

Exemple CSV :

```csv
id,batiment,ressource,valeur,seuil,date,alerte
1,Biblio,electricite,15.0,200.0,03/28/2026,false
2,Resto,eau,360.0,500.0,06/16/2026,false
```

## Organisation Git

Le dépôt fourni contient les branches `main`, `backend` et `frontend`.

Workflow recommandé :

1. Mettre à jour sa branche à partir de `main`.
2. Développer et tester les modifications sur la branche concernée.
3. Enregistrer les changements avec un commit.
4. Envoyer la branche sur le dépôt distant.
5. Créer une pull request vers `main`.
6. Après la fusion, synchroniser les autres branches avec `main`.

Exemples :

```bash
git switch backend
git pull
git add .
git commit -m "Description des modifications"
git push
```

## Sécurité — points à améliorer

Ce dépôt est un projet de développement/démonstration. Avant toute mise en production :

- Remplacer les mots de passe de démonstration et ne jamais conserver de mots de passe en clair ; utiliser `password_hash()` et `password_verify()` en PHP.
- Utiliser des requêtes SQL préparées pour éviter les injections SQL dans `backend/login.php`.
- Ajouter une protection CSRF et renforcer la gestion des sessions.
- Ne pas activer le mode debug de Flask en production.
- Protéger la clé Groq dans un fichier `.env` non versionné ou dans les variables d'environnement du serveur.
- Vérifier et valider toutes les données reçues par l'API.
- Configurer HTTPS et des identifiants MySQL dédiés avec des droits limités.

## Dépannage

- **`api.exe` ou `api` introuvable** : compiler le programme C et vérifier que l'exécutable se trouve dans `backend/`.
- **Erreur de compilation `gestion.h` / `gestion.c` introuvable** : ces fichiers ne sont pas inclus dans l'archive fournie ; les récupérer ou les ajouter avant de compiler.
- **Erreur `GROQ_API_KEY introuvable`** : vérifier la présence de `ai/.env` et le nom de la variable.
- **Erreur de connexion MySQL** : vérifier que MySQL est démarré, que `ecocampus_db` existe et que les paramètres de `backend/db.php` sont corrects.
- **La connexion ne redirige pas** : vérifier que le projet est accessible par Apache au chemin configuré dans le formulaire et que Flask écoute sur le port `5000`.
- **Erreur lors d'un appel API** : vérifier que Flask est lancé et que l'exécutable C peut être exécuté depuis `backend/`.

## Licence

Aucune licence n'est spécifiée pour le moment.
<<<<<<< HEAD

=======
>>>>>>> frontend
