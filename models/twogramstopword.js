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
const TwogramstopwordSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Text is required.'],
    validate: textValidator,
    index: true
  }
});
TwogramstopwordSchema.index({text: 'text'});
// Use the unique validator plugin
TwogramstopwordSchema.plugin(unique, { message: 'That {PATH} is already taken.' });

const Post = module.exports = mongoose.model('twogramstopword', TwogramstopwordSchema);
