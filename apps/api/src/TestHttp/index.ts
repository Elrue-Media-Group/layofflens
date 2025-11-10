import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

// Ultra-minimal test function - just returns success
async function TestHttp(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log("TestHttp handler called - this proves the handler works!");
  return {
    status: 200,
    jsonBody: { 
      message: "Test function works!",
      timestamp: new Date().toISOString()
    },
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };
}

app.http("TestHttp", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "TestHttp",
  handler: TestHttp,
});

