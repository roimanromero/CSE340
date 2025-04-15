const jwt = require("jsonwebtoken")
require("dotenv").config()

const invModel = require("../models/inventory-model")

async function getNav() {
  try {
    const data = await invModel.getClassifications()
    let navList = `<ul>`
    navList += `<li><a href="/" title="Home page">Home</a></li>`
    data.forEach(({ classification_id, classification_name }) => {
      navList += `
        <li>
          <a href="/inv/type/${classification_id}" 
             title="See our inventory of ${classification_name} vehicles">
            ${classification_name}
          </a>
        </li>`
    })
    navList += `</ul>`
    return navList
  } catch (error) {
    console.error('❌ Error loading nav:', error)
    return '<nav><ul><li>Error loading nav</li></ul></nav>'
  }
}

function buildVehicleDetailHtml(vehicle) {
  const priceFormatted = Number(vehicle.inv_price).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  })

  const milesFormatted = Number(vehicle.inv_miles).toLocaleString("en-US")

  return `
    <div class="vehicle-detail-container">
      <img src="${vehicle.inv_image}" 
           alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}" 
           class="vehicle-detail-img">
      
      <div class="vehicle-info">
        <h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>
        <p><strong>Price:</strong> ${priceFormatted}</p>
        <p><strong>Description:</strong> ${vehicle.inv_description}</p>
        <p><strong>Color:</strong> ${vehicle.inv_color}</p>
        <p><strong>Miles:</strong> ${milesFormatted} miles</p>
      </div>
    </div>
  `
}

function buildClassificationGrid(data) {
  if (!data?.length) {
    return `<p class="notice">Sorry, no vehicles matched your search.</p>`
  }

  let grid = '<section class="vehicle-grid">'
  data.forEach(vehicle => {
    const formattedPrice = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(vehicle.inv_price)

    grid += `
      <div class="vehicle-card">
        <a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
          <img src="${vehicle.inv_thumbnail}" 
               alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}" 
               loading="lazy">
        </a>
        <div class="vehicle-card-content">
          <h2>
            <a href="/inv/detail/${vehicle.inv_id}">
              ${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}
            </a>
          </h2>
          <span>${formattedPrice}</span>
        </div>
      </div>
    `
  })
  grid += '</section>'
  return grid
}

// ✅ FIX: Add this missing utility function
async function buildClassificationList(classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.forEach((row) => {
    classificationList += `<option value="${row.classification_id}"`
    if (classification_id != null && row.classification_id == classification_id) {
      classificationList += " selected"
    }
    classificationList += `>${row.classification_name}</option>`
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

module.exports = {
  getNav,
  buildVehicleDetailHtml,
  buildClassificationGrid,
  buildClassificationList // ✅ export it!
}
