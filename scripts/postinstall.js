import { existsSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { mkdirSync } from 'fs';

const databaseMusiconnPath = path.join(process.cwd(), 'src/components/databaseMusiconn');
const repoUrl = 'https://github.com/FrancescoBrunoDev/DatabaseMusiconn.git';

try {
  // Check if directory exists, delete it first if it does
  if (existsSync(databaseMusiconnPath)) {
    console.log('DatabaseMusiconn directory exists. Removing for fresh installation...');
    execSync(`rm -rf ${databaseMusiconnPath}`, { stdio: 'inherit' });
  }
  
  // Create directory and clone repository
  console.log('Creating directory and cloning DatabaseMusiconn repository...');
  mkdirSync(databaseMusiconnPath, { recursive: true });
  execSync(`git clone ${repoUrl} ${databaseMusiconnPath}`, { stdio: 'inherit' });
  
  console.log('Setting up DatabaseMusiconn...');
  // Remove tsconfig.json if it exists to avoid conflicts
  if (existsSync(path.join(databaseMusiconnPath, 'tsconfig.json'))) {
    execSync(`rm ${path.join(databaseMusiconnPath, 'tsconfig.json')}`, { stdio: 'inherit' });
  }
  
  // Install dependencies and build
  execSync(`cd ${databaseMusiconnPath} && yarn install`, { stdio: 'inherit' });
  
  console.log('DatabaseMusiconn setup completed successfully');
} catch (error) {
  console.error('Error during postinstall:', error.message);
  process.exit(1);
}