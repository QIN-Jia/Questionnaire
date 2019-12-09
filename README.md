# Survey App

C'est une application de questionnaire qui est réalisée par JavaScript. Cela permet de générer les questionnaires et les questions de chaque questionnaire.



## Installation

#### Dépendances

​	• Node.js

​	• MongoDB

​	• React

#### Commandes d'installation

```
git clone https://github.com/QIN-Jia/Questionnaire.git
cd Questionnaire-master
```

##### 	Côte Serveur

```
cd server
npm install
npm install body-parser cors express
npm install mongodb --save
npm install supertest --save-dev
yarn add bcryptjs jsonwebtoken mocha superagent superagent validator xss
```

###### 	Lancement la base de donnée "MongoDB"

```
service mongodb start
```

###### 	Initialization Serveur

```
node init.js
```

###### 	Lancement Serveur

```
node app.js	
```

##### 	

##### 	Côte Client

```
cd ..
npm i -g create-react-app web
cd web
npm i -g bulma
npm i --save react-router-dom
npm i -g node-sass
yarn add --dev @fortawesome/fontawesome-free
```

###### 	Lancement UI

```
yarn start
```

​	• http://localhost:3000

​	• Compte Admin 

​			ID : qj@qq.com

​			Password : 1111111  