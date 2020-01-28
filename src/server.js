import express from "express";
import fs from "fs";
import { parseString } from "xml2js";

const app = express();

app.use((req, res, next) => {
  fs.readFile(__dirname + "/../data.xml", (error, data) => {
    if (error) {
      console.error(error);
    } else {
      parseString(data, function(error, result) {
        let areas = [];
        let locationForecastPeriods = {};
        result.product.forecast[0].area.map(item => {
          areas.push(item);
        });
        areas.forEach(area => {
          if (area["forecast-period"]) {
            locationForecastPeriods[area["$"].description] =
              area["forecast-period"][3]["text"][0]["_"];
          }
        });
        res.json(locationForecastPeriods);
        console.log("Done");
      });
    }
  });
  next();
});

app.get("/", () => {});

const port = 8080;
app.listen(port, () => {
  console.log(`node app is running on ${port}`);
});
