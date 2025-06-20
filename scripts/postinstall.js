import { existsSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const databaseMusiconnPath = path.join(process.cwd(), 'src/components/databaseMusiconn');

try {
  // Check if submodule content exists
  if (!existsSync(path.join(databaseMusiconnPath, 'package.json'))) {
    console.log('Initializing DatabaseMusiconn submodule...');
    execSync('git submodule update --init --recursive', { stdio: 'inherit' });
  }
  
  console.log('Setting up DatabaseMusiconn...');
  // Remove tsconfig.json if it exists to avoid conflicts
  if (existsSync(path.join(databaseMusiconnPath, 'tsconfig.json'))) {
    execSync(`rm ${path.join(databaseMusiconnPath, 'tsconfig.json')}`, { stdio: 'inherit' });
  }
  
  // Install dependencies and build
  execSync('cd src/components/databaseMusiconn && yarn install && yarn build', 
    { stdio: 'inherit' });
  
  console.log('DatabaseMusiconn setup completed successfully');
} catch (error) {
  console.error('Error during postinstall:', error.message);
  process.exit(1);
}