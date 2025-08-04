import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const client = new SecretManagerServiceClient();

export async function getConfig(prefix = 'JQ_') {
  if (process.env.NODE_ENV === 'production') {
    const projectId = process.env.GCP_PROJECT_ID;
    const secretName = `${prefix.toLowerCase().replace('_', '-')}config`;
    
    try {
      const [version] = await client.accessSecretVersion({
        name: `projects/${projectId}/secrets/${secretName}/versions/latest`,
      });
      return JSON.parse(version.payload.data.toString('utf8'));
    } catch (error) {
      console.error('Erro ao buscar segredo:', error);
      throw error;
    }
  } else {
    return {
      MONGODB_URI: process.env[`${prefix}MONGODB_URI`],
      JWT_SECRET: process.env[`${prefix}JWT_SECRET`],
      JWT_EXPIRES_IN: process.env[`${prefix}JWT_EXPIRES_IN`],
      USER_ADMIN_DB: process.env[`${prefix}USER_ADMIN_DB`],
      PASSWORD_ADMIN_DB: process.env[`${prefix}PASSWORD_ADMIN_DB`]
    };
  }
}