console.log("⏳ Wachten op GitHub sync (10 seconden)...");

setTimeout(() => {
  console.log("⏱️ Klaar. Begin met build.");
  process.exit(0);
}, 10000);
