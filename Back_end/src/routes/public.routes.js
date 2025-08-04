import express from 'express'
import UserController from '../components/auth/user.controller.js';

const publicRoute = (app) => {
  app.use(
    express.json(),
    express.Router().post('/login', UserController.login),
  )
}

export default publicRoute;