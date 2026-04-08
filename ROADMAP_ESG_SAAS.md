# 🗺️ Roadmap SaaS ESG — DecarboTech

## État actuel
- Site vitrine (Index.tsx) + page RSE (RSE.tsx)
- Diagnostic ESG 18 questions avec scoring pondéré E/S/G
- Rapport automatique (donuts, radar, barres, recommandations)
- Formulaire de contact + envoi email via Netlify Function / Resend
- Header partagé entre pages
- Stack : React 18 + Vite + TailwindCSS + shadcn/ui + React Router + Recharts
- Hébergement : Netlify

---

## Phase 1 — Fondations SaaS (socle technique)
> **Objectif** : Passer du site vitrine à une app avec auth, BDD et persistance.

### 1.1 Authentification & Multi-tenant
- [ ] Intégrer Supabase (auth + PostgreSQL)
- [ ] Inscription / connexion (email + magic link)
- [ ] Modèle BDD : `organizations`, `users`, `roles`
- [ ] Middleware de protection des routes
- [ ] Page /login, /register, /onboarding

### 1.2 Modèle de données centralisé
- [ ] Table `assessments` (diagnostics ESG sauvegardés)
- [ ] Table `organization_data` (données entreprise : énergie, eau, RH, etc.)
- [ ] Table `scores` (historique des scores E/S/G par période)
- [ ] Table `recommendations` (actions générées)
- [ ] Row Level Security (RLS) multi-tenant

### 1.3 Layout applicatif
- [ ] Sidebar de navigation (Dashboard, Modules E/S/G, Rapports, Paramètres)
- [ ] Layout authentifié vs layout public (site vitrine)
- [ ] Routing : `/app/dashboard`, `/app/environnement`, `/app/social`, `/app/gouvernance`, `/app/rapports`

**Estimation** : ~3-4 sessions de travail

---

## Phase 2 — Dashboard & Historique
> **Objectif** : Tableau de bord central avec KPIs et suivi dans le temps.

### 2.1 Dashboard principal (`/app/dashboard`)
- [ ] Score ESG global (jauge animée)
- [ ] Scores par pilier E / S / G
- [ ] Radar chart comparatif
- [ ] Indicateurs clés (top 5 priorités, progression, benchmark sectoriel)

### 2.2 Historique & évolution
- [ ] Graphique d'évolution des scores dans le temps (Recharts line chart)
- [ ] Comparaison période N vs N-1
- [ ] Objectifs définis par l'utilisateur + progression

### 2.3 Notifications & alertes
- [ ] Alertes sur écarts importants
- [ ] Rappels de mise à jour des données

**Estimation** : ~2-3 sessions

---

## Phase 3 — Modules E / S / G détaillés
> **Objectif** : Collecte de données structurée + scoring par indicateur.

### 3.1 Module Environnement (`/app/environnement`)
- [ ] Formulaire : émissions carbone (Scope 1/2/3), énergie, eau, déchets, biodiversité
- [ ] Indicateurs calculés automatiquement (tCO₂e, kWh/employé, m³/CA, taux valorisation)
- [ ] Score environnemental détaillé
- [ ] Lien vers CarbonScan / HydroScan si disponible

### 3.2 Module Social (`/app/social`)
- [ ] Formulaire : effectifs, turnover, formation, accidents, diversité, satisfaction
- [ ] Indicateurs : taux formation, index égalité, taux AT, eNPS
- [ ] Score social détaillé

### 3.3 Module Gouvernance (`/app/gouvernance`)
- [ ] Formulaire : structure board, éthique, anti-corruption, gestion risques, transparence
- [ ] Indicateurs : % indépendants CA, politique éthique, cartographie risques
- [ ] Score gouvernance détaillé

### 3.4 Recommandations intelligentes (transverse)
- [ ] Moteur de recommandations basé sur les scores par indicateur
- [ ] Classement : impact × facilité × coût
- [ ] Suivi de mise en œuvre (statut : planifié / en cours / fait)

**Estimation** : ~4-5 sessions

---

## Phase 4 — Conformité & Reporting
> **Objectif** : Mapping données → normes + génération de rapports.

### 4.1 Mapping GRI / CSRD / ESRS
- [ ] Table de correspondance indicateurs ↔ standards (GRI 302, 303, 305, 306, 401, 403, 405…)
- [ ] Matrice de double matérialité simplifiée
- [ ] Indicateur de couverture (% des standards couverts)

### 4.2 Génération de rapports
- [ ] Rapport PDF ESG complet (jsPDF ou react-pdf)
- [ ] Rapport GRI simplifié (index GRI + données)
- [ ] Export Excel des données brutes
- [ ] Modèle de rapport personnalisable (logo entreprise, couleurs)

**Estimation** : ~3-4 sessions

---

## Phase 5 — Intégrations & Scale
> **Objectif** : Connecteurs externes, import de données, API.

### 5.1 Import de données
- [ ] Import Excel/CSV (énergie, RH, déchets)
- [ ] Parsing automatique + mapping colonnes
- [ ] Validation des données

### 5.2 API REST
- [ ] Endpoints pour lecture/écriture des données ESG
- [ ] Documentation Swagger/OpenAPI
- [ ] Webhooks pour événements (nouveau score, alerte)

### 5.3 Intégrations externes
- [ ] CarbonScan (bilan carbone automatisé)
- [ ] HydroScan (données eau)
- [ ] DecarboBat (données bâtiment)

**Estimation** : ~3-4 sessions

---

## Résumé des phases

| Phase | Contenu | Prérequis | Estimation |
|-------|---------|-----------|------------|
| **1** | Auth + BDD + Layout app | — | 3-4 sessions |
| **2** | Dashboard + Historique | Phase 1 | 2-3 sessions |
| **3** | Modules E/S/G détaillés | Phase 1 | 4-5 sessions |
| **4** | Reporting GRI/CSRD + PDF | Phase 3 | 3-4 sessions |
| **5** | Import/API/Intégrations | Phase 1 | 3-4 sessions |

> **Total estimé** : 15-20 sessions de développement

---

## Stack technique recommandée

| Couche | Techno |
|--------|--------|
| Frontend | React 18 + Vite + TailwindCSS + shadcn/ui |
| Routing | React Router v6 |
| Charts | Recharts (déjà installé) |
| Auth + BDD | Supabase (PostgreSQL + Auth + RLS) |
| PDF | jsPDF ou @react-pdf/renderer |
| Email | Resend (déjà en place) |
| Hébergement | Netlify (frontend) + Supabase (backend) |
| Tests | Vitest + Playwright (déjà configurés) |
