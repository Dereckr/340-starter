const pool = require("../database/");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClasifficationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      JOIN public.classification AS c
      ON i.classification_id = c.classification_id
      WHERE i.classification_id = $1`,
      [classification_id]
    );

    return data.rows;
  } catch (error) {
    console.error("getclassificationsbyid error " + error);
  }
}

async function getCarById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      JOIN public.classification AS c
      ON i.classification_id = c.classification_id
      WHERE i.inv_id = $1`,
      [inv_id]
    );
    let newData = data.rows[0];
    return newData;
  } catch (error) {
    console.error("getcarbyid error " + error);
  }
}

/* ***************************
 *  Register new account
 * ************************** */
async function addClassification(classification_name) {
  try {
    const sql =
      "INSERT INTO classification ( classification_name) VALUES ($1) RETURNING *";
    return await pool.query(sql, [classification_name]);
  } catch (error) {
    return error.message;
  }
}

/* ***************************
 *  Register new Car
 * ************************** */
async function addInventory(
  classification_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color
) {
  try {
    const sql =
      "INSERT INTO inventory ( classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *";
    return await pool.query(sql, [
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    ]);
  } catch (error) {
    return error.message;
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *";
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id,
    ]);
    return data.rows[0];
  } catch (error) {
    console.error("model error: " + error);
  }
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
async function deleteInventory(inv_id) {
  try {
    const sql = "DELETE FROM inventory WHERE inv_id = $1";
    const data = await pool.query(sql, [inv_id]);
    return data;
  } catch (error) {
    console.error("Delete Inventory Error ");
  }
}

/* ***************************
 *  Add review
 * ************************** */
async function addReview(review_text, inv_id, account_id) {
  console.log(review_text);
  console.log(inv_id);
  console.log(account_id);
  try {
    const sql =
      "INSERT INTO review ( review_text, inv_id, account_id) VALUES ($1, $2, $3) RETURNING *";
    let value = await pool.query(sql, [review_text, inv_id, account_id]);
    console.log(value);
    return value;
  } catch (error) {
    return error.message;
  }
}

async function getReviewById(review_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      JOIN public.review AS r
      ON i.inv_id = r.inv_id
      WHERE r.review_id = $1`,
      [review_id]
    );
    let newData = data.rows[0];
    return newData;
  } catch (error) {
    console.error("getreviewbyid error " + error);
  }
}

async function getReviewByInvId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      JOIN public.review AS r
      ON i.inv_id = r.inv_id
      WHERE r.inv_id = $1`,
      [inv_id]
    );
    let newData = data.rows;
    return newData;
  } catch (error) {
    console.error("getreviewbyid error " + error);
  }
}

/* ***************************
 *  Update Review Data
 * ************************** */
async function updateReview(review_id, review_text, inv_id, account_id) {
  try {
    const sql =
      "UPDATE public.review SET review_text = $1, inv_id = $2, account_id = $3 WHERE review_id = $4 RETURNING *";
    const data = await pool.query(sql, [
      review_text,
      inv_id,
      account_id,
      review_id,
    ]);
    return data.rows[0];
  } catch (error) {
    console.error("model error: " + error);
  }
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
async function deleteReview(review_id) {
  try {
    const sql = "DELETE FROM review WHERE review_id = $1";
    const data = await pool.query(sql, [review_id]);
    return data;
  } catch (error) {
    console.error("Delete Review Error ");
  }
}

module.exports = {
  getClassifications,
  getInventoryByClasifficationId,
  getCarById,
  addClassification,
  addInventory,
  updateInventory,
  deleteInventory,
  addReview,
  getReviewById,
  updateReview,
  deleteReview,
  getReviewByInvId,
};
