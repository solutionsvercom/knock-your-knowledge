const port = process.env.PORT || 3000;

import("./backend/src/server.js").then(({ app, connectMongoInBackground }) => {
  app.listen(port, "0.0.0.0", () => {
    console.log(`[API] listening on http://0.0.0.0:${port}`);
  });
  connectMongoInBackground();
}).catch((err) => {
  console.error("[API] failed to start:", err);
  process.exit(1);
});
