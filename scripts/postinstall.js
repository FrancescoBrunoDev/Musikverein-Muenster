import { existsSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const databaseMusiconnPath = path.join(process.cwd(), 'src/components/databaseMusiconn');
const repoUrl = 'https://github.com/FrancescoBrunoDev/DatabaseMusiconn.git';

try {
  console.log('Setting up DatabaseMusiconn as a Git submodule...');
  
  // Check if this is a CI/production environment where submodules are already handled
  if (process.env.CI || process.env.NODE_ENV === 'production') {
    console.log('CI/Production environment detected, skipping submodule setup');
    process.exit(0);
  }

  // Check if the path exists in the Git index (has been added as submodule before)
  let pathInIndex = false;
  try {
    const gitLsOutput = execSync('git ls-files --stage src/components/databaseMusiconn', { 
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    pathInIndex = gitLsOutput.trim().length > 0;
  } catch (e) {
    // If command fails, assume path is not in index
    pathInIndex = false;
  }

  // If path exists in index but directory doesn't exist or is not a Git repo,
  // we need to deinit the submodule and remove it from the index
  if (pathInIndex && (!existsSync(databaseMusiconnPath) || !existsSync(path.join(databaseMusiconnPath, '.git')))) {
    console.log('Cleaning up incomplete submodule registration...');
    try {
      // Deinitialize the submodule if it exists
      execSync('git submodule deinit -f src/components/databaseMusiconn', {
        stdio: ['pipe', 'pipe', 'pipe']
      });
    } catch (e) {
      // Ignore errors if the submodule isn't initialized
    }
    
    // Remove from the index and working tree
    execSync('git rm -f src/components/databaseMusiconn', {
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    // Remove any remaining directories
    execSync('rm -rf src/components/databaseMusiconn .git/modules/src/components/databaseMusiconn', {
      stdio: 'inherit'
    });
    
    // Reset pathInIndex flag
    pathInIndex = false;
  }

  // Initialize submodule if needed
  if (!pathInIndex) {
    console.log('Adding DatabaseMusiconn as a Git submodule...');
    execSync(`git submodule add --force ${repoUrl} ${databaseMusiconnPath}`, { stdio: 'inherit' });
  } else {
    // Check if URL exists in .gitmodules before updating
    try {
      const gitmodulesExists = existsSync('.gitmodules');
      let hasSubmoduleUrl = false;
      
      if (gitmodulesExists) {
        const gitModulesContent = execSync('git config -f .gitmodules --get submodule.src/components/databaseMusiconn.url', {
          stdio: ['pipe', 'pipe', 'pipe'],
          encoding: 'utf8'
        }).trim();
        hasSubmoduleUrl = gitModulesContent.length > 0;
      }
      
      if (!hasSubmoduleUrl) {
        // No URL in .gitmodules, re-add the submodule
        console.log('No URL found in .gitmodules, re-adding submodule...');
        execSync(`git submodule add --force ${repoUrl} ${databaseMusiconnPath}`, { stdio: 'inherit' });
      } else {
        console.log('Updating existing DatabaseMusiconn submodule...');
        execSync(`git submodule update --init --recursive ${databaseMusiconnPath}`, { stdio: 'inherit' });
      }
    } catch (e) {
      // If anything fails, default to adding the submodule
      console.log('Error checking .gitmodules, re-adding submodule...');
      execSync(`git submodule add --force ${repoUrl} ${databaseMusiconnPath}`, { stdio: 'inherit' });
    }
  }
  
  // Create a minimal tsconfig.json to avoid build errors
  const tsconfigPath = path.join(databaseMusiconnPath, 'tsconfig.json');
  console.log('Creating minimal tsconfig.json to avoid build errors...');
  writeFileSync(tsconfigPath, JSON.stringify({
    "compilerOptions": {
      "skipLibCheck": true,
      "target": "ES2020",
      "moduleResolution": "bundler"
    }
  }, null, 2));
  
  // Install dependencies
  console.log('Installing DatabaseMusiconn dependencies...');
  execSync(`cd ${databaseMusiconnPath} && yarn install`, { stdio: 'inherit' });
  
  console.log('DatabaseMusiconn submodule setup completed successfully');
} catch (error) {
  console.error('Error during DatabaseMusiconn setup:', error.message);
  process.exit(1);
}