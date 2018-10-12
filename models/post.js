const mongoose = require('mongoose');
const unique = require('mongoose-unique-validator');
const validate = require('mongoose-validator');

const textValidator = [
  validate({
    validator: 'isLength',
    arguments: [0, 140],
    message: 'Name must not exceed {ARGS[1]} characters.'
  })
];


// Define the database model
const PostSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Text is required.'],
    validate: textValidator
  }
});

// Use the unique validator plugin
PostSchema.plugin(unique, { message: 'That {PATH} is already taken.' });

const Post = module.exports = mongoose.model('post', PostSchema);
