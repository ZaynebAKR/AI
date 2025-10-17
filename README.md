Voici une **version reformulée et structurée** de ton texte :

---

## **TODO-List API**

Une API REST légère pour gérer une liste de tâches (TODOs) en mémoire, développée avec **Node.js** et **Express**, et testée avec **Jest** et **Supertest**.

---

### **Fonctionnalités**

* CRUD complet sur les tâches : création, lecture, mise à jour et suppression.
* Validation des titres : non vide et longueur maximale.
* Gestion des doublons de titre (empêche la création de tâches avec le même titre).
* Stockage entièrement en mémoire, sans besoin de base de données.
* Tests unitaires et d’intégration pour garantir la fiabilité du module.

---

### **Endpoints**

| Méthode | Endpoint     | Description                                           |
| ------- | ------------ | ----------------------------------------------------- |
| GET     | `/todos`     | Récupère la liste complète des tâches                 |
| GET     | `/todos/:id` | Récupère une tâche par son ID                         |
| POST    | `/todos`     | Crée une nouvelle tâche                               |
| PUT     | `/todos/:id` | Met à jour une tâche existante                        |
| DELETE  | `/todos/:id` | Supprime une tâche                                    |
| GET     | `/health`    | Vérifie l’état de l’API (retourne `{ status: "ok" }`) |

---

### **Tests**

* Commande pour lancer tous les tests :

```bash
npm test
```

* Utilisation de **Jest** et **Supertest**.
* Couverture complète : création, détection des doublons, mise à jour et suppression des tâches.
* Test de charge : création de 100 tâches et vérification de la cohérence de la liste.

---

Si tu veux, je peux te préparer **une version README.md complète et prête à utiliser** avec cette reformulation et tous les détails de l’API.

Veux‑tu que je fasse ça ?
