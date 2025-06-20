import { existsSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const databaseMusiconnPath = path.join(process.cwd(), 'src/components/databaseMusiconn');

try {
  // Check if directory already exists
  if (!existsSync(databaseMusiconnPath)) {
    console.log('Cloning DatabaseMusiconn repository...');
    execSync('git clone https://github.com/FrancescoBrunoDev/DatabaseMusiconn.git src/components/databaseMusiconn', 
      { stdio: 'inherit' });
    
    console.log('Setting up DatabaseMusiconn...');
    execSync('cd src/components/databaseMusiconn && rm tsconfig.json && yarn install && yarn build', 
      { stdio: 'inherit' });
    
    console.log('DatabaseMusiconn setup completed successfully');
  } else {
    console.log('DatabaseMusiconn already exists, skipping setup');
  }
} catch (error) {
  console.error('Error during postinstall:', error.message);
  process.exit(1);
}