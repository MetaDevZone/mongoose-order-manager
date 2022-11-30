# Order Manager Package for Your Mongodb Documents

## Description

This package is a simple order manager for your mongodb documents. You can use this package for your projects.
to get maximun order number for your documents. Update order of a specific document with respect to other documents for higher order number or lower order number.
You can also change order of other documents if a document is deleted.

## Installation

### Install via running the following command from you terminal

npm install mongoose-order-manager --save

## Usage

### Import the package into your project

```javascript
const {
  MAX_DOCUMENT_ORDER,
  UPDATE_DOCUMENT_ORDER,
  CHANGE_DOCUMENT_ORDER_EXCEPT_DELETED,
  REORDER_ALL_DOCUMENTS,
} = require("mongoose-order-manager");

var { error, error_message, max_order } = await MAX_DOCUMENT_ORDER(
  modelName,
  quer_obj,
  order_field
);

// modelName : Name of the model
// quer_obj : Query object to find the documents you can pass empty object

// Query Obj Example if you want to order your documents according to theor categirues you can pass the following query object

let query_obj = {
  category_id: req.body.category_id, // category_id is the field name of your category
};

// order_field : Name of the field which is used to store the order of the documents

// error : true if error occured
// error_message : Error message
// max_order : Maximum order of the documents

if (error) {
  // Handle error
  console.log(error_message);
} else {
  // Use max_order
  console.log(max_order);
}

// \_id : \_id of the document
// current_order : Current order of the document which you want to update
// past_order : Past order of the document
// modelName : Name of the model
// quer_obj : Query object to find the documents you can pass empty object
// order_field : Name of the field which is used to store the order of the documents

// error : true if error occured
// error_message : Error message
// updated_document : Updated document

var { error, error_message, updated_document } = await UPDATE_DOCUMENT_ORDER(
  _id,
  current_order,
  past_order,
  modelName,
  query_obj,
  order_field
);

if (error) {
  // Handle error
  console.log(error_message);
} else {
  // Use updated_document
  // it will update the order of the document
}

var { error, error_message, updated_document } =
  await CHANGE_DOCUMENT_ORDER_EXCEPT_DELETED(
    _id,
    current_order,
    past_order,
    modelName,
    query_obj,
    order_field
  );

if (error) {
  // Handle error
  console.log(error_message);
}

var { error, error_message, updated_document } = REORDER_ALL_DOCUMENTS(
  modelName,
  query_obj,
  order_field
);

if (error) {
  // Handle error
  console.log(error_message);
}
```

## License

ISC

## Link to the package

[link](https://www.npmjs.com/package/mongoose-order-manager)

## Author

Meta Dev Zone – [@meta-dev-zone](https://www.npmjs.com/meta-dev-zone)

## devDependencies

| Package                              | Version | Dev |
| ------------------------------------ | ------- | --- |
| [joi](https://npmjs.com/package/joi) | ^7.32.0 | ✖   |

## Dependencies

| Package                                        | Version | Dev |
| ---------------------------------------------- | ------- | --- |
| [mongoose](https://npmjs.com/package/mongoose) | ^5.12.3 | ✖   |

## Version History

| Version | Date       | Change          |
| ------- | ---------- | --------------- |
| 1.0.0   | 2022-30-11 | Initial release |
