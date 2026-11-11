
import os
from groq import Groq
from dotenv import load_dotenv

# Charger le fichier .env qui se trouve dans le dossier ai/
DOSSIER_AI = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(DOSSIER_AI, ".env"))

api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    raise ValueError(
        "GROQ_API_KEY introuvable dans ai/.env"
    )

client = Groq(api_key=api_key)


SYSTEM_PROMPT = """
Tu es un assistant spécialisé dans la consommation énergétique
des bâtiments.

Tu aides les utilisateurs à :
- Réduire la consommation d'électricité et d'eau.
- Comprendre les dépassements de seuil.
- Identifier les causes possibles d'une consommation élevée.
- Proposer des actions concrètes, simples et économiques.
- Comprendre les mesures de consommation fournies par le système.

Règles :
1. Réponds en français simple, sauf si l'utilisateur parle
   en arabe tunisien : dans ce cas, réponds dans son dialecte.
2. Utilise les données du bâtiment fournies dans le contexte.
3. Si une valeur dépasse son seuil, explique le dépassement
   et propose des actions adaptées.
4. Ne prétends pas connaître la cause exacte sans preuve.
5. N'invente jamais de mesures, de dates ou de seuils.
6. Si les données sont insuffisantes, demande une précision.
7. Donne des conseils sous forme d'étapes pratiques.
8. Tu dois uniquement répondre aux questions liées à la consommation énergétique des bâtiments. Toute question hors sujet (programmation, informatique, sport, actualité, mathématiques, etc.) doit être refusée. Dans ce cas, réponds uniquement : « Désolé, je suis spécialisé dans la consommation énergétique des bâtiments et je ne peux répondre qu’aux questions liées à ce domaine. 
"""


def generer_conseil(question, mesures, historique=None):
    """Ask Groq for energy advice.

    question   = what the user typed in the chat.
    mesures    = the real campus measures (so the model does not invent numbers).
    historique = previous chat messages; only the last 10 are sent.
    Returns the assistant's reply as plain text.
    """
    contexte = (
        "Voici les mesures de consommation disponibles :\n"
        + str(mesures)
    )

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {
            "role": "system",
            "content": contexte
        }
    ]

    # Garder uniquement les derniers messages
    if historique:
        messages.extend(historique[-10:])

    messages.append({
        "role": "user",
        "content": question
    })

    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=messages,
        temperature=0.4,
        max_tokens=3000
    )

    return response.choices[0].message.content
