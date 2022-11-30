# Order Manager Package for Your Mongodb Documents

## Description

This package is a simple order manager for your mongodb documents. You can use this package for your projects.
to get maximun order number for your documents. Update order of a specific document with respect to other documents for higher order number or lower order number.
You can also change order of other documents if a document is deleted.

## Installation

### Install via running the following command from you terminal

```bash

npm install mongoose-order-manager --save

```

## Support

- [Stack Overflow](https://stackoverflowteams.com/c/meta-dev-zone)
- [Bug Reports](https://github.com/MetaDevZone/mongoose-order-manager/issues)

## Usage

```javascript

// build your schema using mongoose make sure you have installed mongoose in your project before using this package
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const BlogSchema = new Schema({
  title:{
    type:String,
  }
  description:{
    type:String,
  },
  category_id:{
    type:Schema.Types.ObjectId,
    ref:"ref_to_your_category_model"
  },
  order:{
    type:Number,
    default:1
  }
});
//make model with your schema
const Blog = mongoose.model("Blog", BlogSchema);

```

### Import the package

```javascript
//. for Maximun Order Number of your documents
const { MAX_DOCUMENT_ORDER } = require("mongoose-order-manager");

/*
@param model_name : your model name
@param query: query for your documents you can pass empty object if you want to get maximun order number for all documents
@ order_field: order field name e.g order
*/

// error : true if there is an error
// error_message : error message
// max_order : maximun order number

const { error, error_message, max_order } = await MAX_DOCUMENT_ORDER(
  Blog, //model name
  {}, // query object empty if you want to get maximun order number for all documents
  "order"
);

// if you want to get maximun order number for documents with specific specific query you can pass query object as second parameter

let query_obj = {
  category_id: req.body.category_id, // category_id is the field name of your category
};

const { error, error_message, max_order } = await MAX_DOCUMENT_ORDER(
  Blog, //model name
  query_obj, // query object
  "order" // order field name
);

if (error) {
  // handle error
  // if you are using express you can send error message as response
  return res.status(500).json({
    error: true,
    message: error_message,
  });
}

// if there is no error you can get maximun order number
let new_blog = new Blog({
  title: req.body.title,
  description: req.body.description,
  order: max_order + 1, // you can set order of new document as maximun order number + 1
});

await new_blog.save();

// Every time you create a new document you can set order of new document as maximun order number + 1
```

### Update Order of a specific document with respect to other documents for higher order number or lower order number

```javascript
const { UPDATE_DOCUMENT_ORDER } = require("mongoose-order-manager");

let _id = document._id; // _id of document you want to update order
let current_order = Number(req.body.current_order); // current order of the document
let past_order = Number(document.order); // past order of the document

var { error, error_message } = await UPDATE_DOCUMENT_ORDER(
  _id, // id of the document you want to update
  current_order, // current order of the document
  past_order, // past order of the document
  Blog, // model name
  {}, // query object empty if you want to update order of all documents not according to specific query
  order_field // order field name
);

// if you want to update order of documents with specific query you can pass query object as fourth parameter

let query_obj = {
  category_id: document.category_id, // category_id is the field name of your category
};

var { error, error_message } = await UPDATE_DOCUMENT_ORDER(
  _id, // id of the document you want to update
  current_order, // current order of the document
  past_order, // past order of the document
  modelName, // model name
  query_obj, // query object (optional)
  order_field // order field name
);

if (error) {
  // handle error
  // if you are using express you can send error message as response
  return res.status(500).json({
    error: true,
    message: error_message,
  });
}

// if there is no error your document order is updated
```

### Change order of other documents if a document is deleted

```javascript
const {
  CHANGE_DOCUMENT_ORDER_EXCEPT_DELETED,
} = require("mongoose-order-manager");

var { error, error_message } = await CHANGE_DOCUMENT_ORDER_EXCEPT_DELETED(
  _id, // id of the document you want to delete
  order, // order of the document you want to delete
  modelName, // model name
  {}, // query object empty if you want to change order of all documents not according to specific query
  order_field // order field name
);

// if you want to change order of documents with specific query you can pass query object

let query_obj = {
  category_id: document.category_id, // category_id is the field name of your category
};

var { error, error_message } = await CHANGE_DOCUMENT_ORDER_EXCEPT_DELETED(
  _id, // id of the document you want to delete
  order, // order of the document you want to delete
  modelName, // model name
  query_obj, // query object
  order_field // order field name
);

if (error) {
  // handle error
  // if you are using express you can send error message as response
  return res.status(500).json({
    error: true,
    message: error_message,
  });
}

// if there is no error your document order is changed for other documents with respect to deleted document
```

## Reorder Documents

```javascript
const { REORDER_ALL_DOCUMENTS } = require("mongoose-order-manager");

var { error, error_message } = await REORDER_ALL_DOCUMENTS(
  modelName, // model name
  {}, // query object empty if you want to change order of all documents not according to specific query
  order_field // order field name
);

// if you want to change order of documents with specific query you can pass query object

let query_obj = {
  category_id: req.body.category_id, // category_id is the field name of your category
};

var { error, error_message } = await REORDER_ALL_DOCUMENTS(
  modelName, // model name
  query_obj, // query object
  order_field // order field name
);

if (error) {
  // handle error
  // if you are using express you can send error message as response
  return res.status(500).json({
    error: true,
    message: error_message,
  });
}

// if there is no error your documents order is changed
```

## Link to the package

[link](https://www.npmjs.com/package/mongoose-order-manager)

## Author

Meta Dev Zone – [@meta-dev-zone](https://www.npmjs.com/~meta-dev-zone)

## Dependencies

| Package                              | Version | Dev |
| ------------------------------------ | ------- | --- |
| [joi](https://npmjs.com/package/joi) | ^7.32.0 | ✖   |

| Package                                        | Version | Dev |
| ---------------------------------------------- | ------- | --- |
| [mongoose](https://npmjs.com/package/mongoose) | ^5.12.3 | ✖   |

## Version History

| Version | Date       | Change          |
| ------- | ---------- | --------------- |
| 1.0.0   | 2022-30-11 | Initial release |

## License

Copyright (c) 2022, Meta Dev Zone

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
