import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = join(__dirname, '..');

try {
  console.log('📦 Running postinstall script...');
  
  // Check if the .git directory exists (to avoid errors in environments like CI where git might not be available)
  if (existsSync(join(rootDir, '.git'))) {
    console.log('🔄 Initializing git submodules...');
    execSync('git submodule init', { stdio: 'inherit', cwd: rootDir });
    
    console.log('🔄 Updating git submodules...');
    execSync('git submodule update', { stdio: 'inherit', cwd: rootDir });
    
    console.log('✅ Git submodules successfully initialized and updated.');
  } else {
    console.log('ℹ️ Skipping git submodule initialization (not a git repository).');
  }

  // Handle the databaseMusiconn submodule configuration files
  const modulePath = join(rootDir, 'src', 'components', 'databaseMusiconn');
  
  // Remove problematic configuration files (both tsconfig.json and jsconfig.json)
  const tsconfigPath = join(modulePath, 'tsconfig.json');
  if (existsSync(tsconfigPath)) {
    console.log(`🗑️ Removing tsconfig.json from ${modulePath}`);
    execSync(`rm ${tsconfigPath}`, { stdio: 'inherit' });
  }
  
  const jsconfigPath = join(modulePath, 'jsconfig.json');
  if (existsSync(jsconfigPath)) {
    console.log(`🗑️ Removing jsconfig.json from ${modulePath}`);
    execSync(`rm ${jsconfigPath}`, { stdio: 'inherit' });
  }

  // install the submodule dependencies
  const submodulePackageJson = join(modulePath, 'package.json');
  if (existsSync(submodulePackageJson)) {
    console.log(`📦 Installing dependencies for submodule at ${modulePath}`);
    execSync('npm install --omit=dev', { stdio: 'inherit', cwd: modulePath });
  }
} catch (error) {
  console.error('❌ Error during postinstall script:', error.message);
  // Not exiting with error code to avoid failing the install process
}
