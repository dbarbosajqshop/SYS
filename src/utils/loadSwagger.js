import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function loadSwagger() {
  const swaggerPath = join(__dirname, '../../swagger.json');
  const data = await readFile(swaggerPath, 'utf8');
  return JSON.parse(data);
}