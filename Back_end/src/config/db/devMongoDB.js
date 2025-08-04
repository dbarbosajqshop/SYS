import mongoose from 'mongoose';
import dotenv from 'dotenv';

const loadEnv = () => {
  if (process.env.NODE_ENV === 'localhost') {
    dotenv.config({ path: '.env.local' });
  } else if (process.env.NODE_ENV === 'development') {
    dotenv.config({ path: '.env.development' });
  }
};

const connectDB = async () => {
  loadEnv();
  
  try {
    const dbUri = process.env.MONGODB_URI;
    
    if (!dbUri) {
      throw new Error('MONGODB_URI não definida!');
    }

    // Conexão simplificada (sem opções obsoletas)
    await mongoose.connect(dbUri);

    const db = mongoose.connection;
    
    db.on('error', (error) => {
      console.error('Erro de conexão com MongoDB:', error);
    });

    db.once('open', () => {
      console.log(`Conectado ao MongoDB (${process.env.NODE_ENV || 'production'})`);
    });

    return db;
  } catch (error) {
    console.error('Erro na conexão com MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;