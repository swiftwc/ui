if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then(() => console.debug("⚡️ registered"))
    .catch(console.error);
}
