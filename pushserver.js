let express = require("express");
let bodyParser = require("body-parser");
let cors = require("cors");
let webpush = require("web-push");
let app = express();

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("This is a push notification server use post");
});

// subscribe notification
app.post("/subscribe", (req, res) => {
  let sub = req.body;
  res.set("Content-Type", "application/json");
  webpush.setVapidDetails(
    "mailto:example@yourdomain.org",
    "BOKsuMzDFtbrgbCGx0066ikZhkom9mdXd_6BPipiTbqjqcUUnbzM2v9D1qy5aFYZt-wAcL2scOxXaNbYAwxy5nY",
    "4_nRohQjmN4JCqjxJakSXRhgWBaxQ5G0oVHGyrQJCng"
  );

  let payload = JSON.stringify({
    notification: {
      title: "Allion Technologies",
      body: "Thanks for subscribing to Allion",
      icon:
        "https://yt3.ggpht.com/a-/AAuE7mCxr-4W53FAxBRcKR0iDk_vPCSAmW-QKFGaFA=s88-mo-c-c0xffffffff-rj-k-no",
    },
  });

  Promise.resolve(webpush.sendNotification(sub, payload))
    .then(() =>
      res.status(200).json({
        message: "Notification sent",
      })
    )
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

//post data with notification
app.post("/weather", (req, res) => {
  console.log(req.body);

  res.set("Content-Type", "application/json");

  Promise.resolve()
    .then(() =>
      res.status(200).json({
        message: "Data save successful",
      })
    )
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

app.listen(3000, () => {
  console.log("Listening on port 3000...");
});

//{"publicKey":"BOKsuMzDFtbrgbCGx0066ikZhkom9mdXd_6BPipiTbqjqcUUnbzM2v9D1qy5aFYZt-wAcL2scOxXaNbYAwxy5nY",
//"privateKey":"4_nRohQjmN4JCqjxJakSXRhgWBaxQ5G0oVHGyrQJCng"}
