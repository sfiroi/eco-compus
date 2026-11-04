
#ifndef GESTION_H
#define GESTION_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include <ctype.h>

/* Structure Mesure */
typedef struct {
    int id;
    char batiment[50];
    char ressource[50];
    float valeur;
    float seuil;
    char date[20];
    bool alerte;
} Mesure;


/* Conversion CSV -> tableau */
int conv(char nomFichier[], Mesure tableau[], int max);

/* Evaluation */
int evaluation(float consommation, float seuil);

/* Date */
void extraireAnnee(char date[], char annee[]);
int date_valide(const char *s);

/* Evaluation annuelle */
int evaluationAnnee(Mesure tableau[], int n, char batiment[],
                    char ressource[], char annee[]);

/* Affichage */
void afficher(Mesure tableau[], int n);
void afficherEtoiles(int nombre);
void afficherMesures(const Mesure *tab, int n);
void afficherMesure(Mesure m);

/* CSV / JSON */
static int sauvegarderCSV(const char *fichierCSV, Mesure *tab, int n);
static int sauvegarderJSON(const char *fichierJSON, Mesure *tab, int n);

/* Insertion / suppression */
void insererMesure(Mesure *tab, int *n, Mesure nov,
                   const char *fichierCSV, const char *fichierJSON);

void supprimerMesure(Mesure *tab, int *n, int id,
                     const char *fichierCSV, const char *fichierJSON);

/* Verification */
int verifierMesure(Mesure m);

/* Maximum / minimum */
Mesure max(Mesure t[], int n, char *bat, char *res);
Mesure min(Mesure t[], int n, char *bat, char *res);

/* Anomalies */
void detecterAnomalies(Mesure tab[], int n);

/* Tri */
void trieMesures(Mesure tab[], int n);

/* Comparaison */
void comparerDeuxBatiments(Mesure tab[], int n,
                           char bat1[], char bat2[], char ressource[]);

/* Totaux */
float calculerTotalEnergie(Mesure tab[], int n);
float calculerTotalChauffage(Mesure tab[], int n);
float calculerTotalEau(Mesure tab[], int n);

/* Recherche */
void minus(char *copie, char *txt);
int contient(char *texte, char *mot);
int rechercher(Mesure t[], int n, char *mot);

/* Moyenne */
void moyenne(Mesure t[], int n, int annee_cible);

#endif
