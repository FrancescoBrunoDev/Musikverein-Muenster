import { existsSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { mkdirSync } from 'fs';

const databaseMusiconnPath = path.join(process.cwd(), 'src/components/databaseMusiconn');
const repoUrl = 'https://github.com/FrancescoBrunoDev/DatabaseMusiconn.git';

try {
  // Check if directory exists
  if (!existsSync(databaseMusiconnPath)) {
    console.log('DatabaseMusiconn directory does not exist. Creating directory...');
    mkdirSync(databaseMusiconnPath, { recursive: true });
    
    console.log('Cloning DatabaseMusiconn repository...');
    execSync(`git clone ${repoUrl} ${databaseMusiconnPath}`, { stdio: 'inherit' });
  } else if (!existsSync(path.join(databaseMusiconnPath, 'package.json'))) {
    console.log('DatabaseMusiconn directory exists but is empty. Cloning repository...');
    // Remove directory and clone again
    execSync(`rm -rf ${databaseMusiconnPath}`, { stdio: 'inherit' });
    mkdirSync(databaseMusiconnPath, { recursive: true });
    execSync(`git clone ${repoUrl} ${databaseMusiconnPath}`, { stdio: 'inherit' });
  } else {
    console.log('DatabaseMusiconn already exists, updating...');
    execSync(`cd ${databaseMusiconnPath} && git pull origin main`, { stdio: 'inherit' });
  }
  
  console.log('Setting up DatabaseMusiconn...');
  // Remove tsconfig.json if it exists to avoid conflicts
  if (existsSync(path.join(databaseMusiconnPath, 'tsconfig.json'))) {
    execSync(`rm ${path.join(databaseMusiconnPath, 'tsconfig.json')}`, { stdio: 'inherit' });
  }
  
  // Install dependencies and build
  execSync(`cd ${databaseMusiconnPath} && yarn install && yarn build`, { stdio: 'inherit' });
  
  console.log('DatabaseMusiconn setup completed successfully');
} catch (error) {
  console.error('Error during postinstall:', error.message);
  process.exit(1);
}