
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "gestion.h"

int main()
{
    Mesure tableau[100];
    int n;
    int choix;

    char fichierCSV[] = "measures_in.csv";
    char fichierJSON[] = "data.json";

    /* Chargement du fichier CSV */
    n = conv(fichierCSV, tableau, 100);

    if (n == -1)
    {
        printf("Erreur lors du chargement du fichier CSV.\n");
        return 1;
    }

    printf("====================================\n");
    printf("       PROJET ECO CAMPUS\n");
    printf("====================================\n");

    printf("%d mesures chargees.\n", n);

    do
    {
        printf("\n");
        printf("========== MENU PRINCIPAL ==========\n");
        printf("1  - Afficher toutes les mesures\n");
        printf("2  - Evaluation annuelle\n");
        printf("3  - Afficher les anomalies\n");
        printf("4  - Trier les mesures\n");
        printf("5  - Rechercher une mesure\n");
        printf("6  - Afficher la mesure maximale\n");
        printf("7  - Afficher la mesure minimale\n");
        printf("8  - Comparer deux batiments\n");
        printf("9  - Calculer total electricite\n");
        printf("10 - Calculer total chauffage\n");
        printf("11 - Calculer total eau\n");
        printf("12 - Afficher moyennes annuelles\n");
        printf("13 - Ajouter une mesure\n");
        printf("14 - Supprimer une mesure\n");
        printf("15 - Verifier une mesure\n");
        printf("0  - Quitter\n");
        printf("====================================\n");

        printf("Votre choix : ");
        scanf("%d", &choix);

        switch (choix)
        {
            case 1:
                printf("\n===== TOUTES LES MESURES =====\n");
                afficher(tableau, n);
                break;


            case 2:
            {
                char batiment[50];
                char ressource[50];
                char annee[10];
                int etoiles;

                printf("\nNom du batiment : ");
                scanf("%49s", batiment);

                printf("Nom de la ressource : ");
                scanf("%49s", ressource);

                printf("Annee : ");
                scanf("%9s", annee);

                etoiles = evaluationAnnee(
                    tableau,
                    n,
                    batiment,
                    ressource,
                    annee
                );

                printf("\nEvaluation : ");
                afficherEtoiles(etoiles);
                printf("\n");

                break;
            }


            case 3:
                printf("\n===== DETECTION DES ANOMALIES =====\n");
                detecterAnomalies(tableau, n);
                break;


            case 4:
                printf("\n===== TRI DES MESURES =====\n");

                trieMesures(tableau, n);

                printf("Mesures triees par valeur croissante.\n");

                afficherMesures(tableau, n);

                break;


            case 5:
            {
                char mot[50];
                int resultat;

                printf("\nMot a rechercher : ");
                scanf("%49s", mot);

                resultat = rechercher(tableau, n, mot);

                if (resultat == 0)
                {
                    printf("Aucune mesure trouvee.\n");
                }
                else
                {
                    printf("%d mesure(s) trouvee(s).\n", resultat);
                }

                break;
            }


            case 6:
            {
                char batiment[50];
                char ressource[50];
                Mesure resultat;

                printf("\nBatiment : ");
                scanf("%49s", batiment);

                printf("Ressource : ");
                scanf("%49s", ressource);

                resultat = max(
                    tableau,
                    n,
                    batiment,
                    ressource
                );

                printf("\n===== MAXIMUM =====\n");
                afficherMesure(resultat);

                break;
            }


            case 7:
            {
                char batiment[50];
                char ressource[50];
                Mesure resultat;

                printf("\nBatiment : ");
                scanf("%49s", batiment);

                printf("Ressource : ");
                scanf("%49s", ressource);

                resultat = min(
                    tableau,
                    n,
                    batiment,
                    ressource
                );

                printf("\n===== MINIMUM =====\n");
                afficherMesure(resultat);

                break;
            }


            case 8:
            {
                char bat1[50];
                char bat2[50];
                char ressource[50];

                printf("\nPremier batiment : ");
                scanf("%49s", bat1);

                printf("Deuxieme batiment : ");
                scanf("%49s", bat2);

                printf("Ressource : ");
                scanf("%49s", ressource);

                comparerDeuxBatiments(
                    tableau,
                    n,
                    bat1,
                    bat2,
                    ressource
                );

                break;
            }


            case 9:
            {
                float total;

                total = calculerTotalEnergie(
                    tableau,
                    n
                );

                printf("\nTotal electricite : %.2f\n", total);

                break;
            }


            case 10:
            {
                float total;

                total = calculerTotalChauffage(
                    tableau,
                    n
                );

                printf("\nTotal chauffage : %.2f\n", total);

                break;
            }


            case 11:
            {
                float total;

                total = calculerTotalEau(
                    tableau,
                    n
                );

                printf("\nTotal eau : %.2f\n", total);

                break;
            }


            case 12:
            {
                int annee;

                printf("\nAnnee : ");
                scanf("%d", &annee);

                moyenne(
                    tableau,
                    n,
                    annee
                );

                break;
            }


            case 13:
            {
                Mesure nouvelle;

                nouvelle.id = n + 1;

                printf("\n===== AJOUT D'UNE MESURE =====\n");

                printf("Batiment : ");
                scanf("%49s", nouvelle.batiment);

                printf("Ressource : ");
                scanf("%49s", nouvelle.ressource);

                printf("Valeur : ");
                scanf("%f", &nouvelle.valeur);

                printf("Seuil : ");
                scanf("%f", &nouvelle.seuil);

                printf("Date (MM/JJ/AAAA) : ");
                scanf("%19s", nouvelle.date);

                nouvelle.alerte =
                    nouvelle.valeur > nouvelle.seuil;

                if (verifierMesure(nouvelle))
                {
                    insererMesure(
                        tableau,
                        &n,
                        nouvelle,
                        fichierCSV,
                        fichierJSON
                    );
                }
                else
                {
                    printf("Mesure invalide.\n");
                }

                break;
            }


            case 14:
            {
                int id;

                printf("\nID de la mesure a supprimer : ");
                scanf("%d", &id);

                supprimerMesure(
                    tableau,
                    &n,
                    id,
                    fichierCSV,
                    fichierJSON
                );

                break;
            }


            case 15:
            {
                int indice;
                Mesure m;

                printf("\nNumero de la mesure a verifier : ");
                scanf("%d", &indice);

                if (indice >= 0 && indice < n)
                {
                    m = tableau[indice];

                    if (verifierMesure(m))
                        printf("La mesure est valide.\n");
                    else
                        printf("La mesure est invalide.\n");
                }
                else
                {
                    printf("Indice invalide.\n");
                }

                break;
            }


            case 0:
                printf("\nFin du programme.\n");
                break;


            default:
                printf("\nChoix invalide.\n");
        }

    } while (choix != 0);


    return 0;
}
