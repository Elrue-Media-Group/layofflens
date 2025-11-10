// Root entry point for Azure Functions v4
// This file ensures the main entry point (dist/functions.js) is loaded
// Azure Functions v4 will load this file, which then loads our functions
console.log('🔴 index.js is being loaded...');
try {
  console.log('🔴 About to require dist/functions.js...');
  require('./dist/functions.js');
  console.log('🔴 Successfully required dist/functions.js');
} catch (error) {
  console.error('🔴 ERROR loading dist/functions.js:', error);
  throw error;
}

