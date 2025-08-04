import User from '../components/auth/schema/user.schema.js';

/**
 * Middleware para validar se o usuário tem a permissão necessária.
 * @param {String} requiredPermission - Nome da permissão necessária.
 */
export const authorize = (requiredPermission) => async (req, res, next) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).populate({
      path: 'Roles',
      populate: {
        path: 'permissions'
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const hasPermission = user.Roles.some(role =>
      role.permissions.some(permission => permission.name === requiredPermission)
    );

    if (!hasPermission) {
      return res.status(403).json({ message: 'Acesso negado: Permissão insuficiente.' });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};
