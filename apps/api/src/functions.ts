// Main entry point - imports all functions so they register at startup
// Guard to ensure this only runs once even if loaded multiple times
// Updated: 2025-11-10 - trigger Functions deployment
if (!(global as any).__layofflens_functions_loaded) {
  (global as any).__layofflens_functions_loaded = true;
  
  try {
    // Load .env file first
    require("./load-env");
    
    // Import all function handlers - this registers them with the app
    // These must be synchronous requires to register at startup
    console.log("Loading TestHttp...");
    require("./TestHttp/index");
    console.log("TestHttp loaded successfully");
    
    console.log("Loading ListItemsHttp...");
    require("./ListItemsHttp/index");
    console.log("ListItemsHttp loaded successfully");
    
    require("./FetchNowHttp/index");
    require("./FetchDailyTimer/index");
  } catch (initError: any) {
    console.error("Failed to initialize functions:", initError?.message || String(initError));
    console.error("Stack:", initError?.stack || "");
    throw initError; // Re-throw to prevent silent failures
  }
}
