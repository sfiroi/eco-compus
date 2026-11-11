#include "gestion.h"

/* =========================================================
   api.c  -  command-line bridge between Flask and gestion.c

   Flask (app.py) starts this program like:
     api.exe  measures_in.csv  data.json  <command>  [arguments...]

   Every command prints ONE JSON document on stdout.
   Exit code 0 = success, 1 = the command failed, 2 = bad usage.
   The helpers below only print JSON. The real work is in gestion.c.
   ========================================================= */

#define MAX_MESURES 1000   /* maximum number of measures kept in memory */

/* Prints a C string as a JSON string, escaping " and \. */
static void js(const char *s) {
    putchar('"');
    for (const char *p = s; *p; p++) {
        if (*p == '"' || *p == '\\') putchar('\\');
        putchar(*p);
    }
    putchar('"');
}

/* Prints one Mesure as a JSON object: id, building, resource, value, threshold, date, alert. */
static void jm(Mesure m) {
    printf("{\"id\":%d,\"batiment\":", m.id);
    js(m.batiment);
    printf(",\"ressource\":");
    js(m.ressource);
    printf(",\"valeur\":%.2f,\"seuil\":%.2f,\"date\":", m.valeur, m.seuil);
    js(m.date);
    printf(",\"alerte\":%s}", m.alerte ? "true" : "false");
}

/* Prints a JSON array of n measures. */
static void jms(Mesure *t, int n) {
    putchar('[');
    for (int i = 0; i < n; i++) {
        if (i) putchar(',');
        jm(t[i]);
    }
    putchar(']');
}

/* Reads the CSV into t. *n becomes the number of rows. Returns 0 if the file cannot be opened. */
static int load(Mesure *t, int *n, const char *csv) {
    *n = conv((char *)csv, t, MAX_MESURES);
    return *n >= 0;
}

/* Writes the same measures to both the CSV and the JSON file. Both must succeed. */
static int saveall(Mesure *t, int n, const char *csv, const char *json) {
    return sauvegarderCSV(csv, t, n) && sauvegarderJSON(json, t, n);
}

int main(int ac, char **av) {
    /* Need at least: program, csv path, json path, command name. */
    if (ac < 4) return 2;

    const char *csv = av[1], *json = av[2], *cmd = av[3];
    Mesure t[MAX_MESURES];
    int n = 0;

    if (!load(t, &n, csv)) {
        printf("{\"ok\":false,\"error\":\"CSV\"}");
        return 1;
    }

    /* sync: rebuild data.json from the CSV (or the other way, Flask decides which file is newer). */
    if (!strcmp(cmd, "sync")) {
        if (!saveall(t, n, csv, json)) return 1;
        printf("{\"ok\":true}");
        return 0;
    }

    /* list: every measure, as a JSON array. */
    if (!strcmp(cmd, "list")) {
        jms(t, n);
        return 0;
    }

    /* evaluation: star rating (1-5) for one building + resource + year. Args: building, resource, year. */
    if (!strcmp(cmd, "evaluation") && ac >= 7) {
        int s = evaluationAnnee(t, n, av[4], av[5], av[6]);
        printf("{\"stars\":%d}", s);
        return 0;
    }

    /* anomalies: measures whose value is above the threshold. */
    if (!strcmp(cmd, "anomalies")) {
        int k = 0;
        for (int i = 0; i < n; i++)
            if (t[i].valeur > t[i].seuil) k++;
        printf("{\"count\":%d,\"data\":[", k);
        int f = 1;
        for (int i = 0; i < n; i++) {
            if (t[i].valeur > t[i].seuil) {
                if (!f) putchar(',');
                jm(t[i]);
                f = 0;
            }
        }
        printf("]}");
        return 0;
    }
    /* sort_val: sort by value (ascending) and save CSV + JSON. */
if (!strcmp(cmd, "sort_val")) {
    trieMesures(t, n);

    if (!saveall(t, n, csv, json)) {
        printf("{\"ok\":false,\"error\":\"Erreur sauvegarde\"}");
        return 1;
    }

    printf("{\"ok\":true,\"data\":");
    jms(t, n);
    printf("}");
    return 0;
}

/* sort_id_desc: bubble sort by id, largest id first, then save. */
if (!strcmp(cmd, "sort_id_desc")) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (t[j].id < t[j + 1].id) {
                Mesure temp = t[j];
                t[j] = t[j + 1];
                t[j + 1] = temp;
            }
        }
    }

    if (!saveall(t, n, csv, json)) {
        printf("{\"ok\":false,\"error\":\"Erreur sauvegarde\"}");
        return 1;
    }

    printf("{\"ok\":true,\"data\":");
    jms(t, n);
    printf("}");
    return 0;
}

    /* sort_id: bubble sort by id, smallest id first, then save. */
    if (!strcmp(cmd, "sort_id")) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (t[j].id > t[j + 1].id) {
                Mesure temp = t[j];
                t[j] = t[j + 1];
                t[j + 1] = temp;
            }
        }
    }

    if (!saveall(t, n, csv, json)) {
        printf("{\"ok\":false,\"error\":\"Erreur sauvegarde\"}");
        return 1;
    }

    printf("{\"ok\":true,\"data\":");
    jms(t, n);
    printf("}");

    return 0;
}
    

    /* search: measures whose building or resource contains the word in av[4]. */
    if (!strcmp(cmd, "search") && ac >= 5) {
        putchar('[');
        int f = 1;
        for (int i = 0; i < n; i++) {
            if (contient(t[i].batiment, av[4]) || contient(t[i].ressource, av[4])) {
                if (!f) putchar(',');
                jm(t[i]);
                f = 0;
            }
        }
        putchar(']');
        return 0;
    }

    /* max / min: extreme measure for one building (av[4]) and one resource (av[5]). */
    if ((!strcmp(cmd, "max") || !strcmp(cmd, "min")) && ac >= 6) {
        Mesure m = !strcmp(cmd, "max")
            ? max(t, n, av[4], av[5])
            : min(t, n, av[4], av[5]);
        printf("{\"found\":%s,\"measure\":", m.id ? "true" : "false");
        jm(m);
        putchar('}');
        return 0;
    }

    /* compare: sum of one resource in building A (av[4]) vs building B (av[5]). Resource is av[6]. */
    if (!strcmp(cmd, "compare") && ac >= 7) {
        float a = 0, b = 0;
        int fa = 0, fb = 0;
        for (int i = 0; i < n; i++) {
            if (!strcmp(t[i].ressource, av[6])) {
                if (!strcmp(t[i].batiment, av[4])) a += t[i].valeur, fa = 1;
                if (!strcmp(t[i].batiment, av[5])) b += t[i].valeur, fb = 1;
            }
        }
        printf(
            "{\"found1\":%s,\"found2\":%s,\"consommation1\":%.2f,\"consommation2\":%.2f,\"winner\":",
            fa ? "true" : "false", fb ? "true" : "false", a, b
        );
        if (!fa || !fb) js("");
        else if (a > b) js(av[4]);
        else if (b > a) js(av[5]);
        else js("egalite");
        printf("}");
        return 0;
    }

    /* total: campus-wide sum. av[4] is electricite, eau, or anything else (treated as chauffage). */
    if (!strcmp(cmd, "total") && ac >= 5) {
        float v = 0;
        if (!strcmp(av[4], "electricite")) v = calculerTotalEnergie(t, n);
        else if (!strcmp(av[4], "eau")) v = calculerTotalEau(t, n);
        else v = calculerTotalChauffage(t, n);
        printf("{\"total\":%.2f}", v);
        return 0;
    }

    
/* average: mean value for one building, one resource and one year (date format MM/DD/YYYY). */
if (!strcmp(cmd, "average") && ac >= 7) {
    const char *batiment = av[4];
    const char *ressource = av[5];
    int annee_cible = atoi(av[6]);

    float somme_valeurs = 0.0f;
    float somme_seuils = 0.0f;
    int nombre = 0;

    for (int i = 0; i < n; i++) {
        int mois, jour, annee;

        if (strcmp(t[i].batiment, batiment) != 0)
            continue;

        if (strcmp(t[i].ressource, ressource) != 0)
            continue;

        if (sscanf(t[i].date, "%d/%d/%d",
                   &mois, &jour, &annee) != 3)
            continue;

        if (annee != annee_cible)
            continue;

        somme_valeurs += t[i].valeur;
        somme_seuils += t[i].seuil;
        nombre++;
    }

    if (nombre == 0) {
        printf("{\"found\":false}");
        return 0;
    }

    float moyenne = somme_valeurs / nombre;
    float pourcentage = somme_seuils > 0
        ? (somme_valeurs / somme_seuils) * 100.0f
        : 0.0f;

    printf(
        "{\"found\":true,\"moyenne\":%.2f,"
        "\"pourcentage\":%.2f,\"nombre\":%d}",
        moyenne, pourcentage, nombre
    );

    return 0;
}


    /* add: append a measure. Args: building, resource, value, threshold, date. Alert is set if value > threshold. */
    if (!strcmp(cmd, "add") && ac >= 9) {
        Mesure m = {0};
        strncpy(m.batiment, av[4], 49);
        strncpy(m.ressource, av[5], 49);
        m.valeur = atof(av[6]);
        m.seuil = atof(av[7]);
        strncpy(m.date, av[8], 19);
        m.alerte = m.valeur > m.seuil;
        if (!verifierMesure(m)) {
            printf("{\"ok\":false,\"error\":\"Mesure invalide\"}");
            return 1;
        }
        insererMesure(t, &n, m, csv, json);
        printf("{\"ok\":true,\"id\":%d}", t[n - 1].id);
        return 0;
    }

    /* delete: remove the measure whose id is av[4], then save. */
    if (!strcmp(cmd, "delete") && ac >= 5) {
        int id = atoi(av[4]), found = 0;
        for (int i = 0; i < n; i++)
            if (t[i].id == id) { found = 1; break; }
        if (!found) {
            printf("{\"ok\":false,\"error\":\"Mesure introuvable\"}");
            return 1;
        }
        supprimerMesure(t, &n, id, csv, json);
        printf("{\"ok\":true,\"deleted\":%d}", id);
        return 0;
    }

    /* verify: check a measure without saving it. Same arguments as add. */
    if (!strcmp(cmd, "verify") && ac >= 9) {
        Mesure m = {0};
        strncpy(m.batiment, av[4], 49);
        strncpy(m.ressource, av[5], 49);
        m.valeur = atof(av[6]);
        m.seuil = atof(av[7]);
        strncpy(m.date, av[8], 19);
        m.alerte = m.valeur > m.seuil;
        printf(
            "{\"valid\":%s,\"alerte\":%s}",
            verifierMesure(m) ? "true" : "false",
            m.alerte ? "true" : "false"
        );
        return 0;
    }
    

    /* Unknown command name. */
    return 2;
}