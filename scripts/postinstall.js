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

    // Add this section to update the submodule to the latest commit
    console.log('🔄 Updating databaseMusiconn to latest version...');
    const modulePath = join(rootDir, 'src', 'components', 'databaseMusiconn');
    if (existsSync(join(modulePath, '.git'))) {
      execSync('git fetch', { stdio: 'inherit', cwd: modulePath });
      execSync('git checkout main', { stdio: 'inherit', cwd: modulePath });
      execSync('git pull origin main', { stdio: 'inherit', cwd: modulePath });
    }

    console.log('✅ Git submodules successfully initialized and updated.');
  }

  // Handle the databaseMusiconn submodule configuration files
  const modulePath = join(rootDir, 'src', 'components', 'databaseMusiconn');

  // install the submodule dependencies
  const submodulePackageJson = join(modulePath, 'package.json');
  if (existsSync(submodulePackageJson)) {
    console.log(`📦 Installing dependencies for submodule at ${modulePath}`);
    execSync('npm install --omit=dev', { stdio: 'inherit', cwd: modulePath });
  }

  //  npm run build
  const buildCommand = 'npm run build';
  console.log(`🚀 Running build command: ${buildCommand}`)
  execSync(buildCommand, { stdio: 'inherit', cwd: modulePath })

  // copy in the module path the .env file from the root directory
  const envFilePath = join(rootDir, '.env');
  const destEnvFilePath = join(modulePath, '.env');
  if (existsSync(envFilePath)) {
    console.log(`📄 Copying .env file from ${envFilePath} to ${destEnvFilePath}`);
    execSync(`cp ${envFilePath} ${destEnvFilePath}`, { stdio: 'inherit' });
    console.log('✅ .env file copied successfully.');
  } else {
    console.warn('⚠️ .env file not found in the root directory. Skipping copy.');
  }

  // copy the src/api/map folder to the local src/api folder
  const srcApiMapPath = join(modulePath, 'src', 'routes', 'api', 'map');
  const destApiMapPath = join(rootDir, 'src', 'routes', 'api', 'map');
  // Check if the destination directory exists, ad assure a clean copy
  if (existsSync(destApiMapPath)) {
    console.log(`🗂️ Copying ${srcApiMapPath} to ${destApiMapPath}`);
    execSync(`rm -rf ${destApiMapPath}`, { stdio: 'inherit' });
  }
  execSync(`cp -r ${srcApiMapPath} ${destApiMapPath}`, { stdio: 'inherit' });
  console.log(`✅ Successfully copied ${srcApiMapPath} to ${destApiMapPath}`);

  // remove the env file from the module path
  const moduleEnvFilePath = join(modulePath, '.env');
  if (existsSync(moduleEnvFilePath)) {
    console.log(`🗑️ Removing .env file from ${moduleEnvFilePath}`);
    execSync(`rm ${moduleEnvFilePath}`, { stdio: 'inherit' });
    console.log('✅ .env file removed successfully.');
  } else {
    console.warn('⚠️ .env file not found in the module path. Skipping removal.');
  }

  // Log success message
  console.log('✅ Postinstall script completed successfully.');
} catch (error) {
  console.error('❌ Error during postinstall script:', error.message);
  // Not exiting with error code to avoid failing the install process
}
