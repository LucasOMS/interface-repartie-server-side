# Serveur
Pour déployer le serveur, rendez vous dans le dossier server-side.

```cd server-side```

## Dépendances

Afin d'être déployé, le serveur nécessite une version de node installé sur le PC.

Installez les dépendances avec la commande ```npm install```

## Lancer le serveur

Pour démarrer le serveur une fois les dépendances installées, vous pouvez utiliser la commande ```npm start```

_Note : pour lancer le serveur en mode développement (redémarrage du serveur à chaque modification) vous pouvez utiliser la commande ```npm run start:dev```_

Le serveur est accessible à l'adresse `http://localhost:4444`, les sockets peuvent se connecter au serveur à l'adresse `http://localhost:10000` 

## Récupérer l'addresse distante du serveur
Afin d'accéder au serveur à distance (avec le casque, la table ou la tablette) il est nécessaire d'avoir son adresse sur le réseau local. Pour cela, utilisez la commande (bash)

```ifconfig | sed -En 's/127.0.0.1//;s/.*inet (addr:)?(([0-9]*\.){3}[0-9]*).*/\2/p'```

Vous obtenez alors l'adresse locale de chaque carte réseau de votre ordinateur. vous devez utiliser l'adresse de la carte qui vous ocnnecte au réseau _(carte wifi si vous êtes en wifi par exemple)_
