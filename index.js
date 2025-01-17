const {
  max_order_validator,
  change_order_validator,
  change_delete_order_validator,
  reoder_validator,
} = require("./validation");
// MAX_DOCUMENT_ORDER

/**
 *
 * @param {*} modelName - Model Name
 * @param {*} query_obj - Query Object
 * @param {*} order_field - Order Field Name like order, sequence etc
 * @returns {Object} resp - {error: false, error_message: "", max_order: 0}
 * @description - This function will return the maximum order of the document
 */
const MAX_DOCUMENT_ORDER = async (modelName, query_obj = {}, order_field) => {
  let resp = {
    error: false,
    error_message: "",
    max_order: 0,
  };
  try {
    let { error } = await max_order_validator(
      modelName,
      query_obj,
      order_field
    );
    if (error) {
      throw new Error(error.details[0].message.replace(/"/g, ""));
    }
    let max_order = 0;
    let x;

    x = await modelName
      .findOne(query_obj)
      .sort({ [order_field]: -1 })
      .limit(1);

    if (x) {
      max_order = x[order_field];
    }
    resp.max_order = max_order;
    return resp;
  } catch (error) {
    resp.error = true;
    resp.error_message = error.message;
    return resp;
  }
};
//UPDATE_DOCUMENT_ORDER

/**
 * @param {*} _id - Document ID
 * @param {*} current_order - Current Order of the document
 * @param {*} past_order - Past Order of the document
 * @param {*} modelName - Model Name
 * @param {*} query_obj - Query Object
 * @param {*} order_field - Order Field Name like order, sequence etc
 * @returns {Object} resp - {error: false, error_message: ""}
 * @returns {String} resp - "Order Changed Successfully"
 * @returns {String} resp - "Order is same as before"
 * @description - This function will update the order of the document
 */

const UPDATE_DOCUMENT_ORDER = async (
  _id,
  current_order,
  past_order,
  modelName,
  query_obj = {},
  order_field
) => {
  let resp = {
    error: false,
    error_message: "",
  };
  try {
    let { error } = change_order_validator(
      _id,
      current_order,
      past_order,
      modelName,
      query_obj,
      order_field
    );
    if (error) {
      throw new Error(error.details[0].message.replace(/"/g, ""));
    }
    let { max_order } = await MAX_DOCUMENT_ORDER(
      modelName,
      query_obj,
      order_field
    );
    if (current_order > max_order) {
      throw new Error("Order can not be greater than max order :" + max_order);
    }

    if (current_order == past_order) {
      return " Order is same as before ";
    } else if (past_order > current_order) {
      query_obj._id = { $ne: _id };
      query_obj[order_field] = { $gte: current_order, $lte: past_order };
      let x = await modelName.find(query_obj).sort({ [order_field]: 1 });
      const promise = x.map(async (Obj) => {
        Obj[order_field] = Obj[order_field] + 1;
        await Obj.save();
      });
      await Promise.all(promise);
    } else if (past_order < current_order) {
      query_obj._id = { $ne: _id };
      query_obj.order = { $gte: past_order, $lte: current_order };
      let x = await modelName.find(query_obj).sort({ [order_field]: 1 });

      const promise = x.map(async (Obj) => {
        Obj[order_field] = Obj[order_field] - 1;
        await Obj.save();
      });
      await Promise.all(promise);
    }

    return "Order Changed Successfully";
  } catch (error) {
    resp.error = true;
    resp.error_message = error.message;
    return resp;
  }
};
//CHANGE_DOCUMENT_ORDER_EXCEPT_DELETED

/**
 *
 * @param {*} _id - Document ID
 * @param {*} order - Order of the document
 * @param {*} modelName - Model Name
 * @param {*} query_obj - Query Object
 * @param {*} order_field - Order Field Name like order, sequence etc
 * @returns 
 * @description - This function will change the order of the document except the deleted document
 */

const CHANGE_DOCUMENT_ORDER_EXCEPT_DELETED = async (
  _id,
  order,
  modelName,
  query_obj = {},
  order_field
) => {
  let resp = {
    error: false,
    error_message: "",
  };
  try {
    let { error } = change_delete_order_validator(
      _id,
      order,
      modelName,
      query_obj,
      order_field
    );

    if (error) {
      throw new Error(error.details[0].message.replace(/"/g, ""));
    }

    query_obj._id = { $ne: _id };
    query_obj[order_field] = { $gte: order };
    let x = await modelName.find(query_obj).sort({ [order_field]: 1 });

    const promise = x.map(async (Obj) => {
      Obj[order_field] = Obj[order_field] - 1;

      await Obj.save();
    });
    await Promise.all(promise);
    return " Order Changed Successfully. Except the deleted document";
  } catch (error) {
    resp.error = true;
    resp.error_message = error.message;
    return resp;
  }
};
//REORDER_ALL_DOCUMENTS

/**
 *
 * @param {*} modelName - Model Name
 * @param {*} query_obj - Query Object
 * @param {*} order_field - Order Field Name like order, sequence etc
 * @returns
 * @description - This function will reorder all the documents
 */

const REORDER_ALL_DOCUMENTS = async (
  modelName,
  query_obj = {},
  order_field
) => {
  let resp = {
    error: false,
    error_message: "",
  };

  try {
    let { error } = reoder_validator(modelName, query_obj, order_field);
    if (error) {
      throw new Error(error.details[0].message.replace(/"/g, ""));
    }
    let x = await modelName.find(query_obj).sort({ [order_field]: 1 });
    let order = 1;
    const promise = x.map(async (Obj) => {
      Obj[order_field] = order;
      order++;
      await Obj.save();
    });

    await Promise.all(promise);

    return "All documents are reordered";
  } catch (error) {
    resp.error = true;
    resp.error_message = error.message;
    return resp;
  }
};

module.exports = {
  MAX_DOCUMENT_ORDER,
  UPDATE_DOCUMENT_ORDER,
  CHANGE_DOCUMENT_ORDER_EXCEPT_DELETED,
  REORDER_ALL_DOCUMENTS,
};
