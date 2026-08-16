import { app, connectMongoInBackground } from "./backend/src/server.js";

const port = process.env.PORT || 3000;

app.listen(port, "0.0.0.0", () => {
  console.log(`[API] listening on http://0.0.0.0:${port}`);
});

connectMongoInBackground();
