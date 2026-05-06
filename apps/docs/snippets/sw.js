self.addEventListener("install", (event) => {
  console.debug(`⚡️ ${event?.type}`);
});

self.addEventListener("fetch", (event) => {
  console.debug(`⚡️ ${event?.type}`);
});
