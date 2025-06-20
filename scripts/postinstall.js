import { existsSync, writeFileSync } from 'fs';
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
  
  // Handle tsconfig.json - replace it with a simple one instead of just removing
  const tsconfigPath = path.join(databaseMusiconnPath, 'tsconfig.json');
  if (existsSync(tsconfigPath)) {
    console.log('Replacing tsconfig.json with a compatible version...');
    const simpleConfig = {
      "compilerOptions": {
        "target": "ES2020",
        "useDefineForClassFields": true,
        "module": "ESNext",
        "lib": ["ES2020", "DOM", "DOM.Iterable"],
        "skipLibCheck": true,
        "moduleResolution": "bundler",
        "allowImportingTsExtensions": true,
        "resolveJsonModule": true,
        "isolatedModules": true,
        "noEmit": true,
        "strict": true,
        "noUnusedLocals": false,
        "noUnusedParameters": false,
        "noFallthroughCasesInSwitch": true
      },
      "include": ["src/**/*.ts", "src/**/*.js", "src/**/*.svelte"]
    };
    writeFileSync(tsconfigPath, JSON.stringify(simpleConfig, null, 2));
  }
  
  // Remove .git directory to avoid Docker build conflicts
  const gitDirPath = path.join(databaseMusiconnPath, '.git');
  if (existsSync(gitDirPath)) {
    console.log('Removing .git directory to prevent Docker build issues...');
    execSync(`rm -rf ${gitDirPath}`, { stdio: 'inherit' });
  }
  
  // Install dependencies and build
  execSync(`cd ${databaseMusiconnPath} && yarn install`, { stdio: 'inherit' });
  
  console.log('DatabaseMusiconn setup completed successfully');
} catch (error) {
  console.error('Error during postinstall:', error.message);
  process.exit(1);
}