# FinancePulse — Application de Gestion de Finances Personnelles

FinancePulse est une application web moderne, réactive et élégante conçue pour suivre vos transactions (revenus et dépenses), surveiller l'évolution de votre solde au fil du temps et gérer vos budgets mensuels avec des alertes visuelles en cas de dépassement.

---

## 🌟 Fonctionnalités Principales

- 💳 **Suivi des Transactions** : Enregistrement, modification et suppression des revenus et dépenses par catégorie.
- 🔍 **Filtres et Recherche Instantanée** : Filtrage combiné par type (Revenu/Dépense), catégorie et recherche par mot-clé.
- 📈 **Courbe d'Évolution du Solde** : Graphique temporel interactif du solde disponible cumulé (Chart.js).
- 🎯 **Budgets Mensuels & Alertes par Catégorie** :
  - Barres de progression visuelles avec code couleur (Vert / Orange / Rouge).
  - Bandeau d'alerte global et badges clignotants en cas de dépassement de budget (≥ 100%).
- 📊 **Répartition des Dépenses** : Graphique Donut de la répartition des dépenses du mois par catégorie.
- 💾 **Persistance Locale & Mode Démo** : Sauvegarde dans `localStorage` du navigateur avec option de réinitialisation des données de démonstration.

---

## 🚀 Démarrage Rapide

### Prérequis
- **Node.js** (version 18 ou supérieure)
- **npm**

### Installation & Lancement

```bash
# 1. Cloner le dépôt (si non présent localement)
git clone git@github.com:Jhun-code/personal_finance_vibecode.git
cd personal_finance_vibecode

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:5173/`.

### Build de Production

```bash
npm run build
```

---

## 🛠 Stack Technique

- **Framework** : React 19, TypeScript, Vite
- **Design System** : Vanilla CSS (Dark Mode & Glassmorphism, variables HSL, responsive)
- **Visualisation de Données** : Chart.js, `react-chartjs-2`
- **Icônes** : `lucide-react`
