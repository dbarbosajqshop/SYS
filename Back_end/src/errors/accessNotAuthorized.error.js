import ErrorBase from "./base.error.js";

class AccessNotAuthorized extends ErrorBase{
  constructor(message = 'You have not permissions access') {
    super(message, 401);
  }
}

export default AccessNotAuthorized;