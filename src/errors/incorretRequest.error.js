import ErrorBase from "./base.error.js";

class IncorretRequest extends ErrorBase {
  constructor(message = 'Um ou mais dados fonecidos estão incorretos') {
    super(message, 400);
  }
}

export default IncorretRequest;