const {
  max_order_validator,
  change_order_validator,
  change_delete_order_validator,
  reoder_validator,
} = require("./validation");
// MAX_DOCUMENT_ORDER
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
      .limit(1)
      .select({ [order_field]: 1, _id: 0 });

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
      let x = await modelName
        .find(query_obj)
        .sort({ [order_field]: 1 })
        .select({ [order_field]: 1 });
      const promise = x.map(async (Obj) => {
        Obj[order_field] = Obj[order_field] + 1;
        await Obj.save();
      });
      await Promise.all(promise);
    } else if (past_order < current_order) {
      query_obj._id = { $ne: _id };
      query_obj.order = { $gte: past_order, $lte: current_order };
      let x = await modelName
        .find(query_obj)
        .sort({ [order_field]: 1 })
        .select({ [order_field]: 1 });

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
    query_obj[order_field] = { $gte: order_field };
    let x = await modelName
      .find(query_obj)
      .sort({ [order_field]: 1 })
      .select({ [order_field]: 1 });

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
    let x = await modelName
      .find(query_obj)
      .sort({ [order_field]: 1 })
      .select({ [order_field]: 1 });
    let order = 1;
    const promise = x.map(async (Obj) => {
      Obj[order_field] = order;
      await Obj.save();
      order++;
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
