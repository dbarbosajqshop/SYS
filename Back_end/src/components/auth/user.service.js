import User from "./schema/user.schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import sharp from "sharp";
import NotFound from "../../errors/notFound.error.js";

export default class UserService {
  static async validUserExisted(id) {
    const isValidUser = await User.findById(id);

    if (!isValidUser) throw new Error(`Usuário não encontrado.`);

    return isValidUser;
  }

  static async encryptPassword(password) {
    const saltRounds = 14;
    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return hashedPassword;
    } catch (err) {
      throw new Error("Erro ao criptografar a senha.");
    }
  }

  static async validEmailAndPassword(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Email não encontrado.");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (isValidPassword) {
      const token = this.signToken(user);
      return { token, userId: user._id, email: user.email };
    }
    return false;
  }

  static signToken(user) {
    try {
      const JWT_SECRET = "process.env.JWT_SECRET";
      const JWT_EXPIRES_IN = "48h";

      const token = jwt.sign(
        { userId: user._id, email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      return token;
    } catch (err) {
      throw new Error("Token não foi assinado.");
    }
  }

  static async validImageFormat(type) {
    const allowedFormats = ["image/heic", "image/png", "image/jpeg"];

    if (!allowedFormats.includes(type)) {
      throw new Error("Formato de imagem inválido. Use .heic, .png ou .jpeg.");
    }

    return;
  }

  static async resizedImage(buffer) {
    try {
      const resize = await sharp(buffer).resize(1080, 1080).toBuffer();

      return resize;
    } catch (err) {
      throw new Error(err);
    }
  }

  static async generateSupervisorPassword(userInputPassword) {
    const lastInitialCode = await this.getNextSpPassword();
    return `${lastInitialCode}${userInputPassword}`;
  }

  static async updateSupervisorPassword(userId, userInputPassword) {
    const supervisorPassword = await this.generateSupervisorPassword(userInputPassword);
    
    const encryptedPassword = await this.encryptPassword(supervisorPassword.slice(4));
    
    const finalPassword = supervisorPassword.slice(0, 4) + encryptedPassword;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { supervisorPassword: finalPassword },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      throw new Error("Usuário não encontrado.");
    }

    return updatedUser;
  }

  static async validateSupervisorPassword(supervisorPassword) {
    if (supervisorPassword.length < 4) {
      throw new Error('A senha fornecida é inválida.');
    }

    const prefix = supervisorPassword.slice(0, 4);
    const passwordToCheck = supervisorPassword.slice(4); 
    const users = await User.find({ supervisorPassword: { $exists: true, $ne: null } });

    for (const user of users) {
      if (user.supervisorPassword.startsWith(prefix)) {
        const hashPassword = user.supervisorPassword.slice(4); 
        
        const isMatch = await bcrypt.compare(passwordToCheck, hashPassword);
        if (isMatch) {
          return {
            message: 'Senha de supervisor válida.',
            userId: user._id, 
          };
        }
      }
    }

    throw new Error('Senha de supervisor inválida.');
  }

  static async getNextSpPassword() {
    const lastUserWithPassword = await User.findOne(
      { supervisorPassword: { $ne: null } },
      { supervisorPassword: 1 }
    ).sort({ supervisorPassword: -1 });

    let nextInitialCode = 1381;

    if (lastUserWithPassword) {
      const lastPassword = lastUserWithPassword.supervisorPassword;
      
      const lastInitialCode = lastPassword.slice(0, 4);
      
      if (lastInitialCode) {
        nextInitialCode = parseInt(lastInitialCode, 10) + 1;
      }
    }

    return nextInitialCode;
  }
}
