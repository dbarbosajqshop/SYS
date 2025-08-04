import jwt from 'jsonwebtoken';
import AccessNotAuthorized from '../../errors/accessNotAuthorized.error.js';
import 'dotenv/config'

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if(!token) {
    return res.status(401).send({ message: 'Token não presente.'});
  }

  jwt.verify(token, 'process.env.JWT_SECRET', (err, decoded) => {
    if(err) {
      next(new AccessNotAuthorized('Token inválido.'));
    }

    req.userId = decoded.userId;
    next();
  });
};

export default verifyToken;