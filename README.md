# User Management System

## Overview

Le système de gestion des utilisateurs permet d’administrer les utilisateurs avec différents rôles, gérer leur authentification et autorisation, ainsi que de fournir des fonctionnalités avancées telles que l'authentification à deux facteurs (2FA), la gestion des profils, et des liens sociaux. Ce projet utilise **SpringBoot** pour la gestion du backend, avec un focus particulier sur la sécurité, l'authentification sécurisée, et la gestion des rôles.

Les utilisateurs peuvent être des **etudiants**, des **RH** ou des **projects managers**, et chaque rôle a des privilèges différents. 

## Features

- **Gestion des utilisateurs** : Inscription, authentification sécurisée, et gestion des rôles (etudiants, RH, projects managers).
- **2FA (Authentification à deux facteurs)** : Utilisation de Google Authenticator pour sécuriser les comptes utilisateurs.
- **Gestion des profils utilisateurs** : Mise à jour des informations personnelles (nom, email, photo de profil, etc.)
- **Tableau de bord administrateur** : Accès complet pour gérer, valider et approuver les utilisateurs et leurs documents.
- **API d'authentification** : API sécurisée pour gérer les sessions d'utilisateur et l'authentification JWT.
- **Interface utilisateur moderne** : Interface web construite avec **Angular** pour gérer les profils utilisateurs et les paramètres.

## Tech Stack

### Frontend
- **Angular 9** : Framework pour construire l'interface utilisateur moderne.
- **Bootstrap** : Pour le design réactif et moderne.

### Backend
- **SpringBoot** : Framework  utilisé pour construire le backend.
- **MySQL** : Base de données relationnelle pour stocker les informations des utilisateurs.
- **JWT (JSON Web Token)** : Utilisé pour sécuriser l'authentification et les sessions des utilisateurs.

### Autres outils
- **Google Authenticator** : Utilisé pour l'authentification à deux facteurs (2FA).
- **Cloudinary** : Utilisé pour le stockage des images de profil.

## Directory Structure


## Getting Started

### Prérequis

1. **PHP 8.1+**
2. **Composer** pour la gestion des dépendances.
3. **Node.js** et **npm** pour les dépendances frontend (si vous utilisez Angular).
4. **MySQL** ou une autre base de données relationnelle.
5. **Google Authenticator** (pour l'authentification à deux facteurs).

### Installation

1. Clonez le repository :
    ```bash
    git clone https://github.com/username/user-management-system.git
    cd user-management-system
    ```

2. Installez les dépendances PHP :
    ```bash
    composer install
    ```

3. Installez les dépendances frontend (Angular) :
    ```bash
    npm install
    ```

4. Configurez la base de données dans le fichier `.env` :
    ```
    DATABASE_URL="mysql://root:root@127.0.0.1:3306/user_management"
    ```

5. Créez la base de données :
    ```bash
    php bin/console doctrine:database:create
    php bin/console doctrine:migrations:migrate
    ```

6. Lancez l'application Symfony :
    ```bash
    symfony serve
    ```

7. Si vous avez un frontend Angular, démarrez-le :
    ```bash
    ng serve
    ```

### Utilisation

#### Authentification

- **Inscription** : L'utilisateur peut s'inscrire avec un email, un mot de passe et une confirmation par email.
- **Authentification** : L'utilisateur peut se connecter avec son email et mot de passe. L'authentification utilise **JWT** pour sécuriser les sessions.
- **2FA** : Après la connexion, l'utilisateur est invité à entrer un code généré par **Google Authenticator** pour valider sa session.

#### Tableau de bord Admin

L'administrateur peut :
- Visualiser tous les utilisateurs inscrits.
- Approuver ou refuser les demandes d'inscription des médecins après avoir validé les documents téléchargés.
- Gérer les rôles des utilisateurs.

#### API

1. **POST /api/users/register** : Inscription d'un utilisateur.
2. **POST /api/users/login** : Authentification d'un utilisateur.
3. **GET /api/users/{id}** : Obtenir les informations d'un utilisateur spécifique.
4. **PUT /api/users/{id}/update** : Mise à jour des informations de l'utilisateur.
5. **POST /api/users/2fa** : Activation de l'authentification à deux facteurs.

## Acknowledgments

- **Symfony** pour la gestion du backend et des API.
- **Angular** pour la création de l'interface utilisateur moderne et réactive.
- **JWT** pour sécuriser les sessions et l'authentification.
- **Google Authenticator** pour ajouter une couche supplémentaire de sécurité avec l'authentification à deux facteurs.

## Contributing

Si vous souhaitez contribuer à ce projet, veuillez soumettre une **pull request** avec les changements souhaités. Assurez-vous de respecter les bonnes pratiques de codage et de tester vos modifications.

---

Ce modèle de fichier `README.md` vous permettra de bien décrire votre projet de gestion des utilisateurs tout en mettant en avant les technologies utilisées et les fonctionnalités offertes.
