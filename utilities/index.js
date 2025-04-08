const invModel = require("../models/inventory-model");

async function getNav() {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
}

function buildVehicleDetailHtml(vehicle) {
  const priceFormatted = Number(vehicle.inv_price).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
  const milesFormatted = Number(vehicle.inv_miles).toLocaleString("en-US");

  return `
    <div class="vehicle-detail-container">
      <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
      <div class="vehicle-info">
        <h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>
        <p><strong>Price:</strong> ${priceFormatted}</p>
        <p><strong>Description:</strong> ${vehicle.inv_description}</p>
        <p><strong>Color:</strong> ${vehicle.inv_color}</p>
        <p><strong>Miles:</strong> ${milesFormatted} miles</p>
      </div>
    </div>
  `;
}

// ✅ Single export object with both functions
module.exports = {
  getNav,
  buildVehicleDetailHtml,
};
