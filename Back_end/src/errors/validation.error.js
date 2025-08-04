import IncorretRequest from "./incorretRequest.error.js";

class ValidationError extends IncorretRequest {
  constructor(error) {
    const mensagensErro = Object.values(error.errors)
      .map(error => error.message)
      .join('; ');


    super(`Os seguintes erros foram encontrados: ${mensagensErro}`);
  }
}

export default ValidationError;