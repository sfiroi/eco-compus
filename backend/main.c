#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char batiment[50];
    char ressource[50];
    float valeur;
    float seuil;
    char date[20];
    int alerte;
} Mesure;

/* Conversion CSV -> tableau */
int conv(char nomFichier[], Mesure tableau[], int max) {
    FILE *f;
    char ligne[200];
    int n = 0;

    f = fopen(nomFichier, "r");
    if (f == NULL) {
        printf("Erreur : impossible d'ouvrir le fichier.\n");
        return -1;
    }

    fgets(ligne, sizeof(ligne), f);

    while (fgets(ligne, sizeof(ligne), f) != NULL && n < max) {
        char *token;

        token = strtok(ligne, ",");
        if (token == NULL) continue;
        strcpy(tableau[n].batiment, token);

        token = strtok(NULL, ",");
        if (token == NULL) continue;
        strcpy(tableau[n].ressource, token);

        token = strtok(NULL, ",");
        if (token == NULL) continue;
        tableau[n].valeur = atof(token);

        token = strtok(NULL, ",");
        if (token == NULL) continue;
        tableau[n].seuil = atof(token);

        token = strtok(NULL, ",");
        if (token == NULL) continue;
        strcpy(tableau[n].date, token);

        token = strtok(NULL, ",\r\n");
        if (token == NULL) continue;

        if (strcmp(token, "true") == 0)
            tableau[n].alerte = 1;
        else
            tableau[n].alerte = 0;

        n++;
    }

    fclose(f);
    return n;
}

/* Evaluation d'une mesure */
int evaluation(float consommation, float seuil) {
    float pourcentage;

    if (seuil <= 0)
        return 0;

    pourcentage = (consommation / seuil) * 100;

    if (pourcentage <= 40)
        return 5;
    else if (pourcentage <= 60)
        return 4;
    else if (pourcentage <= 80)
        return 3;
    else if (pourcentage <= 100)
        return 2;
    else
        return 1;
}

/* Extraction de l'année */
void extraireAnnee(char date[], char annee[]) {
    int longueur = strlen(date);

    if (longueur < 4) {
        annee[0] = '\0';
        return;
    }

    strncpy(annee, date + longueur - 4, 4);
    annee[4] = '\0';
}

/* Evaluation annuelle par bâtiment et ressource */
int evaluationAnnee(Mesure tableau[], int n, char batiment[],
                    char ressource[], char annee[]) {
    float totalConsommation = 0;
    float totalSeuil = 0;
    int trouve = 0;
    int i;

    for (i = 0; i < n; i++) {
        char anneeMesure[5];

        extraireAnnee(tableau[i].date, anneeMesure);

        if (strcmp(tableau[i].batiment, batiment) == 0 &&
            strcmp(tableau[i].ressource, ressource) == 0 &&
            strcmp(anneeMesure, annee) == 0) {
            totalConsommation += tableau[i].valeur;
            totalSeuil += tableau[i].seuil;
            trouve = 1;
        }
    }

    if (trouve == 0)
        return 0;

    return evaluation(totalConsommation, totalSeuil);
}

/* Affichage du tableau */
void afficher(Mesure tableau[], int n) {
    int i;

    for (i = 0; i < n; i++) {
        printf("\nMesure %d\n", i + 1);
        printf("Batiment  : %s\n", tableau[i].batiment);
        printf("Ressource : %s\n", tableau[i].ressource);
        printf("Valeur    : %.2f\n", tableau[i].valeur);
        printf("Seuil     : %.2f\n", tableau[i].seuil);
        printf("Date      : %s\n", tableau[i].date);
        printf("Alerte    : %d\n", tableau[i].alerte);
        printf("----------------------\n");
    }
}

/* Affichage des étoiles */
void afficherEtoiles(int nombre) {
    int i;

    if (nombre == 0) {
        printf("Aucune mesure trouvee.");
        return;
    }

    for (i = 0; i < nombre; i++)
        printf("*");
}

int main() {
    Mesure tableau[100];
    int n, etoiles;

    n = conv("measures_in.csv", tableau, 100);

    if (n == -1)
        return 1;

    afficher(tableau, n);

    printf("\n===== EVALUATION ANNUELLE =====\n");

    etoiles = evaluationAnnee(tableau, n, "Biblio",
                              "électricité", "2026");

    printf("Biblio - electricite - 2026 : ");
    afficherEtoiles(etoiles);
    printf("\n");

    return 0;
}