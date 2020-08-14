importScripts("./ngsw-worker.js");

self.addEventListener("sync", (event) => {
  if (event.tag === "post-data") {
    event.waitUntil(getDataAndSend());
  }
});

function addData(weatherObj) {
  fetch("http://localhost:3000/weather", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: weatherObj,
  })
    .then(() => Promise.resolve())
    .catch(() => Promise.reject());
}

function getDataAndSend() {
  let db;
  const request = indexedDB.open("weather-db");
  request.onerror = (event) => {
    console.log("please allow my web app to use indexdb");
  };
  request.onsuccess = (event) => {
    db = event.target.result;
    getData(db);
  };
}

function getData(db) {
  const transaction = db.transaction(["weather-store"]);
  const objectStore = transaction.objectStore("weather-store");
  const request = objectStore.get("weather");

  request.onerror = (event) => {};

  request.onsuccess = (event) => {
    console.log("Test - " + request.result);
    addData(request.result);
  };
}
