import ErrorBase from "./base.error.js";

class NotFound extends ErrorBase {
  constructor(message = 'Página não encontrada') {
    super(message, 404);
  }
}

export default NotFound;