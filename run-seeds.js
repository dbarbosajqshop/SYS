import { globby } from 'globby';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const runSeeds = async () => {
  try {
    const seedFiles = await globby(['src/components/**/seeds/*.seed.js']);
    
    for (const file of seedFiles) {
      const absolutePath = path.join(__dirname, file);
      const fileUrl = pathToFileURL(absolutePath).href;
      const module = await import(fileUrl);
      if (typeof module.default === 'function') {
        await module.default();
      }
    }
    
    console.log('All seeds completed successfully!');
  } catch (error) {
    console.error('Error running seeds:', error);
    process.exit(1);
  }
};

runSeeds();