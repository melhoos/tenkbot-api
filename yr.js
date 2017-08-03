const fetch = require('node-fetch');
const xml2json = require('xml2json');

const osloYrURL = 'http://www.yr.no/sted/Norge/Oslo/Oslo/Oslo/varsel.xml';

module.exports = res => {
  fetch(osloYrURL)
  .then(response => response.text())
  .then(response => JSON.parse(xml2json.toJson(response)))
  .then(data => data.weatherdata.forecast.tabular.time.slice(0,2))
  .then(perioder =>
    perioder.reduce((sum, periode) => sum + Number(periode.precipitation.value), 0)
  )
  .then(precipitation => {
    if (precipitation < 1) {
      res.json({
        messages: [
          {text: "Ser ut til å bli fint vær!"}
        ]
      });
    } else if (precipitation >=1 && precipitation < 3) {
      res.json({
        messages: [
          {text: "Kan være greit å ha med paraply i dag, det ser ut til at det skal regne litt! ☔"}
        ]
      });
    } else if (precipitation > 3) {
      res.json({
        messages: [
          {text: "Ta frem allværsjakken og paraplyen, i dag blir det regnvær! ☔"}
        ]
      });
    }
  });
}