const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

module.exports = Util
function buildVehicleDetailHtml(vehicle) {
  let vehicleHtml = `
    <div class="vehicle-detail">
      <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}" />
      <h2>${vehicle.inv_make} ${vehicle.inv_model} Details</h2>
      <ul>
        <li><strong>Price:</strong> $${Number(vehicle.inv_price).toLocaleString()}</li>
        <li><strong>Year:</strong> ${vehicle.inv_year}</li>
        <li><strong>Mileage:</strong> ${Number(vehicle.inv_miles).toLocaleString()} miles</li>
        <li><strong>Color:</strong> ${vehicle.inv_color}</li>
        <li><strong>Description:</strong> ${vehicle.inv_description}</li>
      </ul>
    </div>
  `;
  return vehicleHtml;
}

module.exports = {
  buildVehicleDetailHtml,
  // other exports...
};
