# 🌱 Eco Campus – Gestion des consommations

Application console en **C** pour suivre, analyser et évaluer la consommation de ressources (**électricité, eau, chauffage**) des bâtiments d'un campus.

Les mesures sont chargées depuis un fichier CSV, manipulées en mémoire, puis sauvegardées automatiquement en **CSV** et en **JSON** à chaque ajout ou suppression.

## Fonctionnalités

- Chargement des mesures depuis `measures_in.csv`
- Affichage de toutes les mesures
- **Évaluation annuelle** d'un bâtiment pour une ressource (note de 1 à 5 étoiles)
- **Détection des anomalies** (valeur supérieure au seuil)
- Tri des mesures par valeur croissante
- Recherche par mot-clé (bâtiment ou ressource, insensible à la casse)
- Mesure **maximale** / **minimale** pour un bâtiment et une ressource
- Comparaison de la consommation de deux bâtiments
- Totaux par ressource (électricité, chauffage, eau)
- Moyennes annuelles par ressource
- Ajout et suppression de mesures avec synchronisation CSV + JSON
- Vérification de la validité d'une mesure (ressource, valeurs, date)

## Organisation du dépôt

Le dépôt est organisé en trois branches :

| Branche    | Rôle                                                                 | État                          |
|------------|----------------------------------------------------------------------|-------------------------------|
| `main`     | Branche par défaut, version stable du projet                         | Mise à jour la semaine dernière |
| `backend`  | Développement de la logique métier en C (gestion des mesures, CSV/JSON) | 10 commits d'avance sur `main` |
| `frontend` | Développement de l'interface                                         | À jour avec `main`, pas encore de commits propres |

### Contenu de la branche `backend`

```
.
├── main.c            # Programme principal : menu interactif
├── gestion.c         # Implémentation des fonctions de gestion
├── gestion.h         # Structure Mesure et prototypes
├── measures_in.csv   # Données d'entrée (chargées au démarrage)
├── data.json         # Export JSON des mesures (régénéré à chaque modification)
└── README.md
```

### Workflow conseillé

1. Créer ou mettre à jour sa branche à partir de `main` (`git checkout backend` ou `git checkout frontend`).
2. Commiter les changements sur la branche concernée, puis `git push`.
3. Ouvrir une **pull request** vers `main` une fois la fonctionnalité terminée.
4. Après fusion, resynchroniser les autres branches : `git merge main`.

```bash
git clone <url-du-depot>
cd <nom-du-depot>
git checkout backend      # pour compiler et tester le code C
```

## Compilation et exécution

Prérequis : un compilateur C (GCC, Clang…) et la branche `backend` récupérée (`git checkout backend`).

```bash
gcc -Wall -o eco_campus main.c gestion.c
./eco_campus
```

> Lancez le programme depuis le dossier contenant `measures_in.csv` : le fichier est ouvert avec un chemin relatif.

## Format des données

### Structure `Mesure`

| Champ        | Type         | Description                                   |
|--------------|--------------|-----------------------------------------------|
| `id`         | `int`        | Identifiant de la mesure                      |
| `batiment`   | `char[50]`   | Nom du bâtiment                               |
| `ressource`  | `char[50]`   | `electricite`, `eau` ou `chauffage`           |
| `valeur`     | `float`      | Consommation mesurée                          |
| `seuil`      | `float`      | Seuil d'alerte                                |
| `date`       | `char[20]`   | Date au format **MM/JJ/AAAA**                 |
| `alerte`     | `bool`       | `true` si la valeur dépasse le seuil          |

### Exemple CSV

```csv
id,batiment,ressource,valeur,seuil,date,alerte
1,Biblio,electricite,15.0,200.0,03/28/2026,false
2,Resto,eau,360.0,500.0,06/16/2026,false
```

### Exemple JSON

```json
{
  "id": 6,
  "batiment": "Amphi A",
  "ressource": "electricite",
  "valeur": 285.0,
  "seuil": 250.0,
  "date": "10/27/2026",
  "alerte": true
}
```

## Menu principal

| N° | Action                          |
|----|---------------------------------|
| 1  | Afficher toutes les mesures     |
| 2  | Évaluation annuelle             |
| 3  | Afficher les anomalies          |
| 4  | Trier les mesures               |
| 5  | Rechercher une mesure           |
| 6  | Afficher la mesure maximale     |
| 7  | Afficher la mesure minimale     |
| 8  | Comparer deux bâtiments         |
| 9  | Total électricité               |
| 10 | Total chauffage                 |
| 11 | Total eau                       |
| 12 | Moyennes annuelles              |
| 13 | Ajouter une mesure              |
| 14 | Supprimer une mesure            |
| 15 | Vérifier une mesure             |
| 0  | Quitter                         |

## Barème d'évaluation

L'évaluation annuelle compare la somme des consommations au cumul des seuils de l'année :

| Consommation / seuil | Note    |
|----------------------|---------|
| ≤ 40 %               | ⭐⭐⭐⭐⭐ |
| ≤ 60 %               | ⭐⭐⭐⭐   |
| ≤ 80 %               | ⭐⭐⭐     |
| ≤ 100 %              | ⭐⭐       |
| > 100 %              | ⭐         |

## Règles de validation d'une mesure

Une mesure est valide si :

- la ressource est `electricite`, `eau` ou `chauffage` ;
- la valeur et le seuil sont strictement positifs ;
- la date respecte le format `MM/JJ/AAAA` et existe réellement (années bissextiles prises en compte).

## Exemple d'utilisation

```
Votre choix : 2

Nom du batiment : Amphi
Nom de la ressource : electricite
Annee : 2026
```

Le programme affiche alors la note sous forme d'étoiles.

## Limites connues

- Capacité maximale de **100 mesures** en mémoire.
- Les noms de bâtiments sont saisis avec `scanf("%s")` : les espaces ne sont pas acceptés (ex. saisir `Biblio`, pas `Salle info 1`).
- L'évaluation annuelle et les recherches max/min comparent les noms de façon sensible à la casse.
- Le menu 12 (moyennes) cherche la ressource `électricité` (avec accents) alors que les données utilisent `electricite` : l'électricité apparaît donc « aucune donnée ».
- Le tri (menu 4) modifie l'ordre du tableau en mémoire.

## Pistes d'amélioration

- Lecture des noms avec espaces (`fgets`) et normalisation de la casse
- Allocation dynamique du tableau
- Correction de l'orthographe de la ressource dans `moyenne()`
- Tests unitaires et `Makefile`

## Licence

À définir (par exemple MIT).