# JQ Stock Backend
  API Develop using Node.js for a JQ Stock project ERP system management stock, POS System for JQ Shop.

## Table of Contents

- [Installation](#run-locally)
- [Configuration](#config)
- [MVC Structure](#mvc-structure)
- [.ENV](#.env)
- [Endpoints](#endpoints)

## Run locally

To run this project, follow the instructions

1. Clone the repository
```
git clone https://github.com/JQ-Shop/jqstock-backend.git
cd jqstock-backend
```

2. Install all depedencies and start the application
OBS.: note we use Node version > v.20.0.0, to see your node version use the command
```
node -v
```
then
```
npm install
npm start
```

## MVC structure 

The api use components structure to organize the folders
MVC | Model View Controller

- Models
  - stock.schema.js
- View
  - stock.route.js
- Controllers
  - stock.controller.js

## Config

Folder to all configurations, the project use mongodb as databaase NoSQL

- config
  - db
    - mongodb.js

    ```
    import mongoose from 'mongoose';

    //LOCAL
    mongoose.connect('mongodb://localhost:27017/JQStock-dev');

    const db = mongoose.connection;

    export default db;
    ```

    String connection is default mongodb://localhost:27017
    after '/' the database`s name JQStock-dev

## .env

SECRET KEYS settings must be saved, if you wish you can enter BASE_URL and PORT according to your preferences.

```
JWT_SECRET=
JWT_EXPIRES_IN=
```

## Endpoints

The API exposes the following *endpoints* from the *BASE_URL*:*PORT* `http://localhost:8080`
BASE_URL and PORT could be used by .env

Public routes
  * `GET /api-docs - swagger` 
  * `POST /login - login`

`/users`
  * `GET /users/all - getAll`
  * `GET /users/photo/:id - findPhotoById`
  * `GET /users - getAllActives`
  * `GET /users/:id - getById`
  * `POST /users - create`
  * `PUT /users/:id - updateUser`
  * `PUT /users/password/:id - updatePassword`
  * `PUT /users/photo/:id - savePhoto`
  * `PUT /users/reative/:id - reativeUser`
  * `DELETE /users/:id - inativeUser`

