
#include "gestion.h"


/* =========================================================
   Conversion CSV -> tableau
   ========================================================= */

int conv(char nomFichier[], Mesure tableau[], int max)
{
    FILE *f;
    char ligne[200];
    int n = 0;

    f = fopen(nomFichier, "r");

    if (f == NULL)
    {
        printf("Erreur : impossible d'ouvrir le fichier.\n");
        return -1;
    }

    fgets(ligne, sizeof(ligne), f);
    int i=1;
    while (fgets(ligne, sizeof(ligne), f) != NULL && n < max)
    {
        char *token;
        

        token = strtok(ligne, ",");

        if (token == NULL)
            continue;

        tableau[n].id=atoi(token);
        token = strtok(NULL, ",");

        if (token == NULL)
            continue;

        strcpy(tableau[n].batiment, token);

        token = strtok(NULL, ",");

        if (token == NULL)
            continue;

        strcpy(tableau[n].ressource, token);

        token = strtok(NULL, ",");

        if (token == NULL)
            continue;

        tableau[n].valeur = atof(token);

        token = strtok(NULL, ",");

        if (token == NULL)
            continue;

        tableau[n].seuil = atof(token);

        token = strtok(NULL, ",");

        if (token == NULL)
            continue;

        strcpy(tableau[n].date, token);

        token = strtok(NULL, ",\r\n");

        if (token == NULL)
            continue;

        if (strcmp(token, "true") == 0)
            tableau[n].alerte = 1;
        else
            tableau[n].alerte = 0;

        n++;
        i++;
    }

    fclose(f);

    return n;
}


/* =========================================================
   Evaluation d'une mesure
   ========================================================= */

int evaluation(float consommation, float seuil)
{
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


/* =========================================================
   Extraction de l'année
   ========================================================= */

void extraireAnnee(char date[], char annee[])
{
    int longueur = strlen(date);

    if (longueur < 4)
    {
        annee[0] = '\0';
        return;
    }

    strncpy(annee, date + longueur - 4, 4);

    annee[4] = '\0';
}


/* =========================================================
   Evaluation annuelle par bâtiment et ressource
   ========================================================= */

int evaluationAnnee(Mesure tableau[], int n, char batiment[],
                    char ressource[], char annee[])
{
    float totalConsommation = 0;
    float totalSeuil = 0;
    int trouve = 0;
    int i;

    for (i = 0; i < n; i++)
    {
        char anneeMesure[5];

        extraireAnnee(tableau[i].date, anneeMesure);

        if (strcmp(tableau[i].batiment, batiment) == 0 &&
            strcmp(tableau[i].ressource, ressource) == 0 &&
            strcmp(anneeMesure, annee) == 0)
        {
            totalConsommation += tableau[i].valeur;
            totalSeuil += tableau[i].seuil;

            trouve = 1;
        }
    }

    if (trouve == 0)
        return 0;

    return evaluation(totalConsommation, totalSeuil);
}


/* =========================================================
   Affichage du tableau
   ========================================================= */

void afficher(Mesure tableau[], int n)
{
    int i;

    for (i = 0; i < n; i++)
    {
        printf("\nMesure %d\n", tableau[i].id);

        printf("Batiment  : %s\n", tableau[i].batiment);
        printf("Ressource : %s\n", tableau[i].ressource);
        printf("Valeur    : %.2f\n", tableau[i].valeur);
        printf("Seuil     : %.2f\n", tableau[i].seuil);
        printf("Date      : %s\n", tableau[i].date);
        printf("Alerte    : %d\n", tableau[i].alerte);

        printf("----------------------\n");
    }
}


/* =========================================================
   Affichage des étoiles
   ========================================================= */

void afficherEtoiles(int nombre)
{
    int i;

    if (nombre == 0)
    {
        printf("Aucune mesure trouvee.");
        return;
    }

    for (i = 0; i < nombre; i++)
        printf("*");
}


/* =========================================================
   Année bissextile
   ========================================================= */

static int est_bissextile(int annee)
{
    return (annee % 4 == 0 && annee % 100 != 0)
           || (annee % 400 == 0);
}


/* =========================================================
   Nombre de jours dans le mois
   ========================================================= */

static int jours_dans_mois(int mois, int annee)
{
    static const int jours[] =
    {
        31, 28, 31, 30, 31, 30,
        31, 31, 30, 31, 30, 31
    };

    if (mois == 2 && est_bissextile(annee))
        return 29;

    return jours[mois - 1];
}


/* =========================================================
   Validation date
   ========================================================= */

int date_valide(const char *s)
{
    int jour, mois, annee;

    if (s == NULL || strlen(s) != 10)
        return 0;

    for (int i = 0; i < 10; i++)
    {
        if (i == 2 || i == 5)
        {
            if (s[i] != '/')
                return 0;
        }
        else if (!isdigit((unsigned char)s[i]))
        {
            return 0;
        }
    }

    if (sscanf(s, "%2d/%2d/%4d",
               &mois, &jour, &annee) != 3)
        return 0;

    if (annee < 1 || mois < 1 || mois > 12 || jour < 1)
        return 0;

    return jour <= jours_dans_mois(mois, annee);
}


/* =========================================================
   Afficher mesures
   ========================================================= */

void afficherMesures(const Mesure *tab, int n)
{
    for (int i = 0; i < n; i++)
    {
        printf("%d | %s | %s | %.2f | %.2f | %s | %d\n",
               tab[i].id,
               tab[i].batiment,
               tab[i].ressource,
               tab[i].valeur,
               tab[i].seuil,
               tab[i].date,
               tab[i].alerte);
    }
}


/* =========================================================
   Sauvegarder CSV
   ========================================================= */

int sauvegarderCSV(const char *fichierCSV,
                   Mesure *tab,
                   int n)
{
    FILE *f = fopen(fichierCSV, "w");

    if (!f)
    {
        printf("Erreur : impossible d'ouvrir %s\n", fichierCSV);
        return 0;
    }

    fprintf(f, "id,batiment,ressource,valeur,seuil,date,alerte\n");

    for (int i = 0; i < n; i++)
    {
        fprintf(f, "%d,%s,%s,%.1f,%.1f,%s,%s\n",
                tab[i].id,
                tab[i].batiment,
                tab[i].ressource,
                tab[i].valeur,
                tab[i].seuil,
                tab[i].date,
                tab[i].alerte ? "true" : "false");
    }

    fclose(f);

    return 1;
}


/* =========================================================
   Sauvegarder JSON
   ========================================================= */

int sauvegarderJSON(const char *fichierJSON,
                    Mesure *tab,
                    int n)
{
    FILE *f = fopen(fichierJSON, "w");

    if (!f)
    {
        printf("Erreur : impossible d'ouvrir %s\n", fichierJSON);
        return 0;
    }

    fprintf(f, "[\n");

    for (int i = 0; i < n; i++)
    {
        fprintf(f, "  {\n");

        fprintf(f, "    \"id\": %d,\n", tab[i].id);
        fprintf(f, "    \"batiment\": \"%s\",\n", tab[i].batiment);
        fprintf(f, "    \"ressource\": \"%s\",\n", tab[i].ressource);
        fprintf(f, "    \"valeur\": %.1f,\n", tab[i].valeur);
        fprintf(f, "    \"seuil\": %.1f,\n", tab[i].seuil);
        fprintf(f, "    \"date\": \"%s\",\n", tab[i].date);
        fprintf(f, "    \"alerte\": %s\n",
                tab[i].alerte ? "true" : "false");

        fprintf(f, "  }%s\n",
                (i < n - 1) ? "," : "");
    }

    fprintf(f, "]\n");

    fclose(f);

    return 1;
}

/* =========================================================
   Supprimer une mesure
   ========================================================= */

void supprimerMesure(Mesure *tab,
                     int *n,
                     int id,
                     const char *fichierCSV,
                     const char *fichierJSON)
{
    if (*n == 0)
    {
        printf("Table vide\n");
        return;
    }

    int pos = -1;

    for (int i = 0; i < *n; i++)
    {
        if (tab[i].id == id)
        {
            pos = i;
            break;
        }
    }

    if (pos == -1)
    {
        printf("Mesure %d introuvable\n", id);
        return;
    }

    for (int j = pos; j < *n - 1; j++)
    {
        tab[j] = tab[j + 1];
    }

    (*n)--;

    int okCSV =
        sauvegarderCSV(fichierCSV, tab, *n);

    int okJSON =
        sauvegarderJSON(fichierJSON, tab, *n);

    if (okCSV && okJSON)
    {
        printf("Mesure %d supprimée "
               "(tableau, CSV et JSON)\n", id);
    }
    else
    {
        printf("Mesure %d supprimée du tableau, "
               "mais erreur de mise à jour des fichiers\n",
               id);
    }
}


/* =========================================================
   Insérer une mesure
   ========================================================= */

void insererMesure(Mesure *tab,
                   int *n,
                   Mesure nov,
                   const char *fichierCSV,
                   const char *fichierJSON)
{
     if (*n == 0)
        nov.id = 1;
    else
        nov.id = tab[*n - 1].id + 1;

    
    tab[*n] = nov;
    (*n)++;

    

    int okCSV =
        sauvegarderCSV(fichierCSV, tab, *n);

    int okJSON =
        sauvegarderJSON(fichierJSON, tab, *n);

    if (okCSV && okJSON)
    {
        printf("Mesure %d ajoutée "
               "(tableau, CSV et JSON)\n",
               nov.id);
    }
    else
    {
        printf("Mesure %d ajoutée au tableau, "
               "mais erreur de mise à jour des fichiers\n",
               nov.id);
    }
}


/* =========================================================
   Vérifier une mesure
   ========================================================= */

int verifierMesure(Mesure m)
{
    

    if (strcmp(m.ressource, "electricite") != 0 &&
        strcmp(m.ressource, "eau") != 0 &&
        strcmp(m.ressource, "chauffage"))
    {
        printf("e");
        return 0;
    }

    if (m.valeur <= 0 || m.seuil <= 0)
    {
        printf("ep");
        return 0;
    }

    if (!date_valide(m.date))
    {
        printf("es");
        return 0;
    }

    return 1;
}


/* =========================================================
   Maximum
   ========================================================= */

Mesure max(Mesure t[], int n, char *bat, char *res)
{
    float maxV = t[0].valeur;

    char dt[20] = "";

    bool trv = false;

    Mesure max = {0, "", "", 0, 0, "", false};

    if (strcmp(t[0].batiment, bat) == 0 &&
        strcmp(t[0].ressource, res) == 0)
    {
        trv = true;

        strcpy(dt, t[0].date);

        max = t[0];
    }

    for (int i = 1; i < n; i++)
    {
        if (strcmp(t[i].batiment, bat) == 0 &&
            strcmp(t[i].ressource, res) == 0)
        {
            if (!trv || t[i].valeur > maxV)
            {
                maxV = t[i].valeur;

                strcpy(dt, t[i].date);

                trv = true;

                max = t[i];
            }
        }
    }

    return max;
}


/* =========================================================
   Minimum
   ========================================================= */

Mesure min(Mesure t[], int n, char *bat, char *res)
{
    float minV = t[0].valeur;

    char dt[20] = "";

    bool trv = false;

    Mesure min = {0, "", "", 0, 0, "", false};

    if (strcmp(t[0].batiment, bat) == 0 &&
        strcmp(t[0].ressource, res) == 0)
    {
        trv = true;

        strcpy(dt, t[0].date);

        min = t[0];
    }

    for (int i = 1; i < n; i++)
    {
        if (strcmp(t[i].batiment, bat) == 0 &&
            strcmp(t[i].ressource, res) == 0)
        {
            if (!trv || t[i].valeur < minV)
            {
                minV = t[i].valeur;

                strcpy(dt, t[i].date);

                trv = true;

                min = t[i];
            }
        }
    }

    return min;
}


/* =========================================================
   Détection des anomalies
   ========================================================= */

void detecterAnomalies(Mesure tab[], int n)
{
    int i;

    int nbAnomalies = 0;

    for (i = 0; i < n; i++)
    {
        tab[i].alerte =
            (tab[i].valeur > tab[i].seuil);

        if (tab[i].alerte == 1)
        {
            printf("Anomalie : %s | %s | "
                   "valeur %.2f > seuil %.2f\n",
                   tab[i].batiment,
                   tab[i].ressource,
                   tab[i].valeur,
                   tab[i].seuil);

            nbAnomalies++;
        }
    }

    if (nbAnomalies == 0)
        printf("Aucune anomalie detectee.\n");
}


/* =========================================================
   Tri des mesures
   ========================================================= */

void trieMesures(Mesure tab[], int n)
{
    int i, j;

    Mesure temp;

    for (i = 0; i < n - 1; i++)
    {
        for (j = 0; j < n - i - 1; j++)
        {
            if (tab[j].valeur > tab[j + 1].valeur)
            {
                temp = tab[j];

                tab[j] = tab[j + 1];

                tab[j + 1] = temp;
            }
        }
    }
}


/* =========================================================
   Afficher une mesure
   ========================================================= */

void afficherMesure(Mesure m)
{
    printf("%s | %s | %.2f | %.2f | %s | alerte=%d\n",
           m.batiment,
           m.ressource,
           m.valeur,
           m.seuil,
           m.date,
           m.alerte);
}


/* =========================================================
   Comparer deux bâtiments
   ========================================================= */

void comparerDeuxBatiments(Mesure tab[],
                           int n,
                           char bat1[],
                           char bat2[],
                           char ressource[])
{
    float consommation1 = 0;

    float consommation2 = 0;

    int trouve1 = 0;

    int trouve2 = 0;

    int i;

    for (i = 0; i < n; i++)
    {
        if (strcmp(tab[i].ressource, ressource) == 0)
        {
            if (strcmp(tab[i].batiment, bat1) == 0)
            {
                consommation1 += tab[i].valeur;

                trouve1 = 1;
            }

            if (strcmp(tab[i].batiment, bat2) == 0)
            {
                consommation2 += tab[i].valeur;

                trouve2 = 1;
            }
        }
    }

    if (!trouve1 || !trouve2)
    {
        printf("Erreur : batiment ou ressource introuvable.\n");

        return;
    }

    printf("\n--- Comparaison des deux batiments (%s) ---\n",
           ressource);

    printf("%s : %.2f\n",
           bat1,
           consommation1);

    printf("%s : %.2f\n",
           bat2,
           consommation2);

    if (consommation1 > consommation2)
    {
        printf("%s consomme plus de %s.\n",
               bat1,
               ressource);
    }
    else if (consommation2 > consommation1)
    {
        printf("%s consomme plus de %s.\n",
               bat2,
               ressource);
    }
    else
    {
        printf("Les deux batiments ont "
               "la meme consommation.\n");
    }
}


/* =========================================================
   Total énergie
   ========================================================= */

float calculerTotalEnergie(Mesure tab[], int n)
{
    float total = 0;

    int i;

    for (i = 0; i < n; i++)
    {
        if (strcmp(tab[i].ressource, "electricite") == 0)
            total += tab[i].valeur;
    }

    return total;
}


/* =========================================================
   Total chauffage
   ========================================================= */

float calculerTotalChauffage(Mesure tab[], int n)
{
    float total = 0;

    int i;

    for (i = 0; i < n; i++)
    {
        if (strcmp(tab[i].ressource, "chauffage") == 0)
            total += tab[i].valeur;
    }

    return total;
}


/* =========================================================
   Total eau
   ========================================================= */

float calculerTotalEau(Mesure tab[], int n)
{
    float total = 0;

    int i;

    for (i = 0; i < n; i++)
    {
        if (strcmp(tab[i].ressource, "eau") == 0)
            total += tab[i].valeur;
    }

    return total;
}


/* =========================================================
   Convertir en minuscules
   ========================================================= */

void minus(char *copie, char *txt)
{
    int i;

    for (i = 0; txt[i] != '\0'; i++)
        copie[i] = tolower(txt[i]);

    copie[i] = '\0';
}


/* =========================================================
   Contient
   ========================================================= */

int contient(char *texte, char *mot)
{
    char t[50], m[50];

    minus(t, texte);

    minus(m, mot);

    return strstr(t, m) != NULL;
}


/* =========================================================
   Recherche
   ========================================================= */

int rechercher(Mesure t[], int n, char *mot)
{
    int trv = 0;

    for (int i = 0; i < n; i++)
    {
        if (contient(t[i].batiment, mot) ||
            contient(t[i].ressource, mot))
        {
            float pourcent = 0;

            if (t[i].seuil != 0)
                pourcent =
                    (t[i].valeur / t[i].seuil) * 100;

            printf(
                "Bâtiment: %s | Ressource: %s | "
                "Date: %s | Valeur: %.2f / %.2f "
                "(%.1f%%) | %s\n",
                t[i].batiment,
                t[i].ressource,
                t[i].date,
                t[i].valeur,
                t[i].seuil,
                pourcent,
                t[i].alerte ? "ALERTE" : "ok"
            );

            trv++;
        }
    }

    return trv;
}


/* =========================================================
   Moyenne annuelle
   ========================================================= */

void moyenne(Mesure t[], int n, int annee_cible)
{
    char *ressources[] =
    {
        "eau",
        "électricité",
        "chauffage"
    };

    int nb_ressources =
        sizeof ressources / sizeof ressources[0];

    printf("\n--- Statistiques pour l'année %d ---\n",
           annee_cible);

    for (int r = 0; r < nb_ressources; r++)
    {
        float total_valeur = 0;

        float total_seuil = 0;

        int count = 0;

        for (int i = 0; i < n; i++)
        {
            int mois, jour, annee;

            if (strcmp(t[i].ressource,
                       ressources[r]) == 0 &&
                sscanf(t[i].date,
                       "%d/%d/%d",
                       &mois,
                       &jour,
                       &annee) == 3 &&
                annee == annee_cible)
            {
                total_valeur += t[i].valeur;

                total_seuil += t[i].seuil;

                count++;
            }
        }

        if (count > 0)
        {
            float moyenne =
                total_valeur / count;

            float pourcent =
                (total_seuil != 0)
                ? (total_valeur / total_seuil) * 100
                : 0;

            printf(
                "%s : moyenne = %.2f | "
                "pourcentage = %.1f%%\n",
                ressources[r],
                moyenne,
                pourcent
            );
        }
        else
        {
            printf("%s : aucune donnée\n",
                   ressources[r]);
        }
    }
}
