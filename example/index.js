/*
In this example file, we will use the mongoose-order-manager package to manage the order of documents in a collection.
We will see how to manage a simple order in a collection and handle complex ordering that will be managed according to another collection document.
*/

/*
How to install mongoose-order-manager package.
Run command on terminal.
npm install mongoose-order-manager --save
*/

/*******************{Schemas}********************/
/*
Create two schemas for this example: one for Season and another for Crop.
First of all, require the mongoose package.
*/

const mongoose = require("mongoose");

//season schema
const seasonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  order: {
    type: Number,
    default: 1,
  },
});

const Season = mongoose.model("Season", seasonSchema);

//crop schema
const cropSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  season: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Season",
  },
  order: {
    type: Number, //add order field in the schema to manage the order of documents in the collection.
    default: 1,
  },
});
const Crop = mongoose.model("Crop", cropSchema);

/**********************{Add Simple Order}************************/
/*
Now, we will see how to manage the order of documents in the Season collection.
its simple order management in the collection.
1) Require the mongoose-order-manager package.
2) Use the MAX_DOCUMENT_ORDER constant to get the maximum order value in the collection.
*/

const { MAX_DOCUMENT_ORDER } = require("mongoose-order-manager");

try {
  const { error, error_message, max_order } = await MAX_DOCUMENT_ORDER(
    Season, //model name
    {}, // query object empty if you want to get maximum order number for all documents
    "order" // field name
  );

  //if error occurs then return error message

  if (error) {
    return res.status(400).json({ error: error_message });
  }

  //if no error then use the max_order variable to get the maximum order value and then use max_order + 1 to set the order of the new document.

  let season_data = {
    name: "Summer",
    description: "Summer season",
    order: max_order + 1,
  };

  const season = new Season(season_data);
  await season.save();

  return res.status(200).json({ message: "Season added successfully" });
} catch (err) {
  return res.status(500).json({ error: err.message });
}

//like above you can manage the order of documents in the Your collection.

/**********************{Add Complex Order}************************/

/*
Now, we will see how to manage the order of documents in the Crop collection.
its complex order management in the collection.
1) Require the mongoose-order-manager package.
2) Use the MAX_DOCUMENT_ORDER constant to get the maximum order value in the collection.

In this example, we will manage the order of documents in the Crop collection according to the Season collection.
*/

const { MAX_DOCUMENT_ORDER } = require("mongoose-order-manager");

try {
  const { error, error_message, max_order } = await MAX_DOCUMENT_ORDER(
    Crop, //model name
    { season: "season_id" }, // query object with season id
    "order" // field name
  );

  //if error occurs then return error message

  if (error) {
    return res.status(400).json({ error: error_message });
  }

  //if no error then use the max_order variable to get the maximum order value and then use max_order + 1 to set the order of the new document.

  let crop_data = {
    name: "Mango",
    description: "Mango",
    season: "season_id",
    order: max_order + 1,
  };

  const crop = new Crop(crop_data);
  await crop.save();

  return res.status(200).json({ message: "Crop added successfully" });
} catch (err) {
  return res.status(500).json({ error: err.message });
}

//like above you can manage the order of documents in the Your collection.

/**********************{Update Simple Order}************************/

/*
Now, we will see how to manage the order of documents in the Season collection when updating a document.
*/

const { UPDATE_DOCUMENT_ORDER } = require("mongoose-order-manager");
try {
  //get the document by id that you want to update the order

  const find_season = await Season.findOneById({ _id: "season_id" });
  const past_order = find_season.order;
  const current_order = req.body.order;

  var { error, error_message } = await UPDATE_DOCUMENT_ORDER(
    _id, // id of the document you want to update
    current_order, // current order of the document
    past_order, // past order of the document
    Season, // model name
    {}, // query object empty if you want to update order of all documents not according to specific query
    "order" // order field name
  );
  //if error occurs then return error message
  if (error) {
    return res.status(400).json({ error: error_message });
  }

  //update the order of the document

  find_season.order = current_order;
  await find_season.save();

  return res.status(200).json({ message: "Order updated successfully" });
} catch (err) {
  return res.status(500).json({ error: err.message });
}

//like above you can manage the order of documents in the Your collection.

/**********************{Update Complex Order}************************/

const { UPDATE_DOCUMENT_ORDER } = require("mongoose-order-manager");
try {
  //get the document by id that you want to update the order

  const find_crop = await Crop.findOneById({ _id: "crop_id" });
  const past_order = find_crop.order;
  const current_order = req.body.order;

  var { error, error_message } = await UPDATE_DOCUMENT_ORDER(
    _id, // id of the document you want to update
    current_order, // current order of the document
    past_order, // past order of the document
    Crop, // model name
    { season: "season_id" }, // query object with season id
    "order" // order field name
  );
  //if error occurs then return error message
  if (error) {
    return res.status(400).json({ error: error_message });
  }

  //update the order of the document

  find_crop.order = current_order;
  await find_crop.save();

  return res.status(200).json({ message: "Order updated successfully" });
} catch (err) {
  return res.status(500).json({ error: err.message });
}

//like above you can manage the order of documents in the Your collection.

/**********************{Delete Simple Order}************************/
/*
Now, we will see how to manage the order of documents in the Season collection when deleting a document.
*/

const {
  CHANGE_DOCUMENT_ORDER_EXCEPT_DELETED,
} = require("mongoose-order-manager");

try {
  //get the document by id that you want to delete

  const find_season = await Season.findOneById({ _id: "season_id" });
  const order = find_season.order;

  var { error, error_message } = await CHANGE_DOCUMENT_ORDER_EXCEPT_DELETED(
    _id, // id of the document you want to delete
    order, // order of the document you want to delete
    Season, // model name
    {}, // query object empty if you want to change order of all documents not according to specific query
    "order" // order field name
  );
  //if error occurs then return error message
  if (error) {
    return res.status(400).json({ error: error_message });
  }

  //delete the document
  await Season.deleteOne({ _id: "season_id" });

  return res.status(200).json({ message: "Season deleted successfully" });
} catch (err) {
  return res.status(500).json({ error: err.message });
}

//like above you can manage the order of documents in the Your collection.

/**********************{Delete Complex Order}************************/

const {
  CHANGE_DOCUMENT_ORDER_EXCEPT_DELETED,
} = require("mongoose-order-manager");

try {
  //get the document by id that you want to delete

  const find_crop = await Crop.findOneById({ _id: "crop_id" });
  const order = find_crop.order;

  var { error, error_message } = await CHANGE_DOCUMENT_ORDER_EXCEPT_DELETED(
    _id, // id of the document you want to delete
    order, // order of the document you want to delete
    Crop, // model name
    { season: "season_id" }, // query object with season id
    "order" // order field name
  );
  //if error occurs then return error message
  if (error) {
    return res.status(400).json({ error: error_message });
  }

  //delete the document
  await Crop.deleteOne({ _id: "crop_id" });

  return res.status(200).json({ message: "Crop deleted successfully" });
} catch (err) {
  return res.status(500).json({ error: err.message });
}
//like above you can manage the order of documents in the Your collection.

/**********************{Manage Order When Delete Many Records}************************/
/*
Now, we will see how to manage the order of documents in the Season collection when deleting multiple documents
*/

const { REORDER_ALL_DOCUMENTS } = require("mongoose-order-manager");

try {
  //delete the document
  await Season.deleteMany({ _id: { $in: ["season_id1", "season_id2"] } });

  //reorder all documents in the collection
  var { error, error_message } = await REORDER_ALL_DOCUMENTS(
    Season, // model name
    {}, // query object empty if you want to reorder all documents
    "order" // order field name
  );
  //if error occurs then return error message
  if (error) {
    return res.status(400).json({ error: error_message });
  }

  return res.status(200).json({ message: "Seasons deleted successfully" });
} catch (err) {
  return res.status(500).json({ error: err.message });
}

//like above you can manage the order of documents in the Your collection.

/**********************{Manage Order When Delete Many Records}************************/

const { REORDER_ALL_DOCUMENTS } = require("mongoose-order-manager");

try {
  //delete the document
  await Crop.deleteMany({ _id: { $in: ["crop_id1", "crop_id2"] } });

  let query_object = { season: "season_id" };

  //reorder all documents in the collection
  var { error, error_message } = await REORDER_ALL_DOCUMENTS(
    Crop, // model name
    query_object, // query object with season id
    "order" // order field name
  );
  //if error occurs then return error message
  if (error) {
    return res.status(400).json({ error: error_message });
  }

  return res.status(200).json({ message: "Crops deleted successfully" });
} catch (err) {
  return res.status(500).json({ error: err.message });
}

//like above you can manage the order of documents in the Your collection.
