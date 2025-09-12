<div align="center">

# Frontend Angular

_Application frontend Angular (v20) utilisant PrimeNG, ApexCharts et PrimeFlex._

</div>

## 🚀 Objectif
Ce dépôt contient l'interface utilisateur Angular. Il inclut une authentification (guard + interceptor), un tableau de bord avec graphiques (ApexCharts) et une structure modulaire prête pour évoluer.

---

## 📦 Prérequis
| Outil | Version conseillée | Vérification |
|-------|--------------------|--------------|
| Node.js | 20.x LTS (≥ 18.19 supporté) | `node -v` |
| npm | fourni avec Node | `npm -v` |
| Angular CLI | 20.3.0 | `npx ng version` |
| Navigateur moderne | Dernière version | - |

Sous Windows PowerShell, si Angular CLI n'est pas installé globalement :
```powershell
npm install -g @angular/cli@20.3.0
```
> L'installation globale est optionnelle : toutes les commandes peuvent être lancées avec `npx ng ...`.

---

## 🗂 Structure (extrait)
```
src/
	app/
		auth/               # Services & garde d'authentification
			login/             # Composant de connexion
		dashboard/           # Tableau de bord (charts, widgets)
	environments/
		env.ts               # Configuration d'environnement (dev)
```

---

## ⚙️ Installation locale
Cloner puis installer les dépendances :
```powershell
git clone <URL_DU_REPO> frontend
cd frontend
npm install
```

Si vous utilisez un registre privé/proxy :
```powershell
npm config set registry https://registry.npmjs.org/
```

---

## ▶️ Démarrage en développement
Serveur de dev avec rechargement à chaud :
```powershell
npm start
# ou
npx ng serve
```
Ouvrir le navigateur : http://localhost:4200/

Options utiles :
```powershell
npx ng serve --open          # ouvre automatiquement le navigateur
npx ng serve --port 4300     # autre port
npx ng serve --hmr           # (expérimental) Hot Module Replacement
```

---

## 🧪 Tests unitaires
Lancement (Karma + Jasmine) :
```powershell
npm test
```
Mode watch continu :
```powershell
npm test -- --watch
```
Rapport de couverture (généralement dans `coverage/`) :
```powershell
npx ng test --code-coverage
```

> Pas de tests e2e configurés par défaut. Ajouter Playwright ou Cypress si nécessaire.

---

## 🏗️ Build
Compilation production optimisée :
```powershell
npm run build -- --configuration production
# équivalent :
npx ng build --configuration production
```
Sortie : `dist/frontend/` (par défaut). Pour prévisualiser :
```powershell
npx http-server dist/frontend -p 5000
```
(Installer `http-server` si besoin : `npm i -D http-server`)

Build de développement (rapide) :
```powershell
npx ng build --configuration development --watch
```

---

## 🛡 Authentification
- `auth.guard.ts` protège les routes.
- `auth.interceptor.ts` injecte le token dans les requêtes HTTP.
- `token-storage.service.ts` gère la persistance (ex: `localStorage`).

Pour intégrer un backend :
1. Adapter l'URL de base dans un service dédié (ex: `AuthService`).
2. Mettre les secrets côté serveur (jamais dans le frontend).
3. Gérer l'expiration du token (refresh ou redirection login).

---

## 🌐 Configuration d'environnement
Le fichier `src/environments/env.ts` centralise les constantes (ex: API base URL). Pour gérer plusieurs environnements :
1. Créer `env.prod.ts` / `env.staging.ts`.
2. Ajouter les remplacements dans `angular.json` (`fileReplacements`).
3. Construire avec : `npx ng build --configuration production`.

Exemple minimal :
```ts
export const environment = {
	production: false,
	apiBaseUrl: 'http://localhost:8080/api'
};
```

---

## 📜 Scripts npm disponibles
| Script | Commande | Description |
|--------|----------|-------------|
| start  | ng serve | Démarre le serveur de dev |
| build  | ng build | Build standard (dev) |
| watch  | ng build --watch --configuration development | Build incrémental continu |
| test   | ng test  | Tests unitaires |

Autres (via CLI) : `npx ng generate component <nom>`, `npx ng lint` (si config lint ajoutée), etc.

---

## 🧱 Génération de code (scaffolding)
```powershell
npx ng generate component shared/button
npx ng generate service core/api
npx ng generate guard auth/auth
```
Liste complète :
```powershell
npx ng generate --help
```

---

## 🎨 UI & Bibliothèques
- PrimeNG + PrimeFlex : composants & utilitaires CSS.
- ApexCharts : graphiques interactifs (`ng-apexcharts`).
Pensez à importer les modules PrimeNG nécessaires dans vos modules / `standalone components`.

---

## 🔍 Qualité & Formatting
Prettier configuré (HTML parser Angular). Pour formater :
```powershell
npx prettier . --write
```
Lint (si configuration ajoutée, par exemple via `ng add @angular-eslint/schematics`) :
```powershell
npx ng lint
```

---

## 🛠 Dépannage (FAQ)
| Problème | Cause probable | Solution |
|----------|----------------|----------|
| `ERR_MODULE_NOT_FOUND` | Node trop ancien | Mettre à jour Node ≥ 18.19 (idéal 20 LTS) |
| CSS PrimeNG manquante | Imports oubliés | Vérifier `styles.scss` et thèmes PrimeNG |
| CORS API | Backend sans en-têtes | Activer CORS côté serveur / proxy Angular |
| Tests figés | ChromeHeadless absent | Installer Chrome / utiliser `--browsers Chrome` |

Proxy local (si API backend sur autre port) : créer `proxy.conf.json` :
```json
{
	"/api": { "target": "http://localhost:8080", "secure": false, "changeOrigin": true }
}
```
Puis :
```powershell
npx ng serve --proxy-config proxy.conf.json
```

---

## ✅ Checklist avant commit
- [ ] Build de prod passe (`ng build --configuration production`)
- [ ] Tests OK (`npm test`)
- [ ] Formatage (`prettier`) appliqué
- [ ] Pas d'informations sensibles dans les sources

---

## 📚 Ressources
- Docs Angular : https://angular.dev
- Angular CLI : https://angular.dev/tools/cli
- PrimeNG : https://primeng.org
- ApexCharts : https://apexcharts.com

---

## 📄 Licence
Projet interne / propriétaire (adapter si nécessaire).

---

## 🤝 Contributions
1. Créer une branche (`feat/xxx` ou `fix/xxx`)
2. Commits descriptifs (convention : `feat:`, `fix:`, `chore:`, `test:` ...)
3. PR + revue.

Bon développement !
