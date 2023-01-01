# Before you start

This application is developed and optimized for node v16.17.0. Please run `nvm use` before you start. If nvm is not installed, please install it first.

This application is using `typescript` for type checking and linting.

This application is using `postgresql` as database.

This application is using `jest` for testing.


This application is using `docker` for containerization. You can use docker-compose to start the database container with `docker-compose up -d db` (env file is included in the repo).

In development mode, this application is listening on port `3000`, while in production mode, it is listening on port `80`.

Use `yarn prod` to build the app and run in production mode.

Use `yarn dev` to run the app in development mode.

Use `yarn test` to run test.

Use `yarn lint` to check the code quality.

Use `yarn test:cov` to check the test coverage.

# Installtion

```sh
$ nvm use # use node version v16.17.0
$ yarn # install dependencies
$ docker-compose up -d db # start postgresql container
$ yarn prisma:migrate # create database and seed
```

# Running the app 
```
$ yarn dev // in development mode
$ yarn prod // build the app and run in production mode
```
# Running the app in docker
```
$ docker-compose up -d  --build # start the app and postgresql 
container
yarn prisma:migrate # create database and seed
yarn seed
```

# Test
```
$ yarn test
```

## Prisma init
```
$ npx prisma init --datasource-provider postgresql
$ npx prisma migrate dev --name init
$ npx prisma db pull
$ npx prisma generate

```

# API Endpoints
Créer le compte d’un autre dresseur : POST /auth/register X

Modifier un compte (dont les droits) : PUT /trainers/:id X
Modifier son propre compte : PUT /trainers/me V
Supprimer un compte : DELETE /trainers/:id X
Supprimer son propre compte : DELETE /trainers/me V
Récupérer les informations d’un compte : GET /trainers/:id V

Modifier ses pokémons : PUT /pokemons/:id/me V
Modifier les pokémons d’un autre dresseur : PUT /pokemons/:id X
Récupérer les informations des pokémons : GET /pokemons V

Créer un trade : POST /trades V
Accepter un trade : PUT /trades/:id V
Refuser un trade : PUT /trades/:id V
Récupérer les informations d’un trade : GET /trades/:id V
Récupérer les logs : GET /logs X


# TODO

- [ ] Add @throws
- [ ] Add @private
- [ ] Add @public
- [ ] Add @roles
- [ ] Add logger

    

# Projet PC Pokémon 

## Contexte 

Ce projet a pour objectif de permettre à différents dresseurs d’enregistrer des informations sur leur Pokémon, de pouvoir les consulter et de pouvoir les échanger. 

La partie front-end et la partie Cloud seront gérés par d’autres équipes. Vous avez la charge du développement back-end de cette application. 

Il est attendu que celui-ci réponde aux demandes exprimées tout au long de ce document, qu’il soit testé unitairement, que de la documentation sous la forme d’un Swagger soit livré, et que le code soit clair et maintenable. 

## Prérequis 

Vous devez créer une API REST, avec Node version 16 et Express. Vous avez le choix de développer en Javascript ou en Typescript. 

Le choix de la base de données est le votre aussi, cependant ce doit être une base de données relationnelle, que l’on manipule via du SQL 

Vous avez le choix du framework de test utilisé. 

Le back-end ainsi que la base de données doivent être conteneurisé via un docker-compose, afin d’être lancé depuis n’importe quel poste. 

Votre back-end doit être accessible depuis le port HTTP standard. Il doit y avoir à minima :  

- Un script pour démarrer l’application, 
- Un pour lancer les tests, 
- Un pour vérifier la qualité du code. 

Un README est attendu, qui donne les clés à une personne pour s’onboarder sur le projet. La spécification de l’API via Swagger doit être disponible sur la route */api-docs*. 

## Dresseurs 

Les dresseurs doivent pouvoir se connecter de manière sécurisée à votre back-end via le protocole OAuth2 et suivant l’Authorization Code Flow. 

N’oubliez pas de sécuriser vos routes par les rôles d’un utilisateur. Ceux-ci seront décrit dans la dernière partie du document. 

Les dresseurs ont : 

- Un nom, 
- Un prénom, 
- Un login, 
- Un mot de passe, 
- Un âge, 
- Des rôles, 
- Des pokémons. 

Un dresseur doit pouvoir créer son compte sur une route */register*. 



|![](Aspose.Words.28e1003b-929a-4814-aa24-eee64ed33dce.001.png)|**Dresseur standard**|
| - | - |
|Créer le compte d’un autre dresseur|**X**|
|Modifier un compte (dont les droits)|**X**|
|Modifier son compte|**V**|
|Supprimer un compte|**X** |
|Supprimer son compte|**V** |
|Récupérer les informations d’un compte|**V**|

## Pokémons 

Chaque Pokémon dans la base de données est lié à un dresseur. Un Pokémon a : 

- Une espèce, 
- Un nom (facultatif), 
- Un niveau, 
- Un genre (mâle, femelle ou non-défini), 
- Une taille, 
- Un poids, 
- Il peut être chromatique ou non. 



|**Dresseur standard**||
| - | - |
|Manipuler ses Pokémons|**V**|
|Manipuler les Pokémons d’un autre dresseur|**X**|
|Récupérer les informations des Pokémons|**V**|
La récupération des informations de tous les Pokémons d’un dresseur doit être paginé. 

## Echanges 

Les dresseurs peuvent procéder à des échanges de Pokémons entre eux. Un échange à 3 états : 

- La proposition d’échange de la part d’un des dresseurs à un autre, qui comprend notamment le ou les Pokémon à échanger ; 
- L’acceptation de l’échange par l’autre dresseur, auquel cas les Pokémons sont échangés ; 
- Le refus de l’échange. 

Implémentez des routes permettant ce système d’échanges. 

## Log 

Gardez une trace des différentes actions sur votre back-end. Ces données doivent cependant être anonymisées, conformément à la RGPD. 

Les logs peuvent être extraits par un utilisateur ayant le droit nécessaire dans un fichier CSV. Attention à avoir des Logs pertinents ! 

Autres 

N’oubliez pas d’avoir une route par défaut ! 

La base de données doit avoir un dresseur par défaut nommé Léo Pokemaniac, né le 8 octobre 1999, dont le login est leopkmn et le mot de passe est cynthia. Cet utilisateur aura l’intégralité des droits. 


## ER Diagram
https://prisma-erd.simonknott.de/
