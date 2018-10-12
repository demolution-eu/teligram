const express = require('express');
const router = express.Router();
const RateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const stringCapitalizeName = require('string-capitalize-name');

const Twogramstopword = require('../models/twogramstopword');

// Attempt to limit spam twogramstopword requests for inserting data
const minutes = 5;
const twogramstopwordLimiter = new RateLimit({
  windowMs: minutes * 60 * 1000, // milliseconds
  max: 100, // Limit each IP to 100 requests per windowMs
  delayMs: 0, // Disable delaying - full speed until the max limit is reached
  handler: (req, res) => {
    res.status(429).json({ success: false, msg: `You made too many requests. Please try again after ${minutes} minutes.` });
  }
});

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

// READ (ALL)
router.get('/:input', (req, res) => {
  console.log(req.params);
  // Twogramstopword.remove({}, function() {
  //   console.log('all removed');
  // });
  const regex = new RegExp(escapeRegex(req.params.input), 'gi');

  Twogramstopword.find(
    {"word": regex},
    ['word','n'],
    {
      sort: {
        'n':-1
      }
    }
  ).limit(250)
    .then((result) => {
      console.log(result);
      res.json(result);
    })
    .catch((err) => {
      res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
    });
});

// CREATE
router.post('/', twogramstopwordLimiter, (req, res) => {

  let newTwogramstopword = new Twogramstopword({
    text: sanitizeText(req.body.text)
  });

  newTwogramstopword.save()
    .then((result) => {
      res.json({
        success: true,
        msg: `Successfully added!`,
        result: {
          _id: result._id,
          text: result.text
        }
      });
    })
    .catch((err) => {
      if (err.errors) {
        if (err.errors.text) {
          res.status(400).json({ success: false, msg: err.errors.text.message });
          return;
        }
        // Show failed if all else fails for some reasons
        res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
      }
    });
});

// UPDATE
router.put('/:id', (req, res) => {

  let updatedTwogramstopword = {
    text: sanitizeText(req.body.text)
  };

  Twogramstopword.findOneAndUpdate({ _id: req.params.id }, updatedTwogramstopword, { runValidators: true, context: 'query' })
    .then((oldResult) => {
      Twogramstopword.findOne({ _id: req.params.id })
        .then((newResult) => {
          res.json({
            success: true,
            msg: `Successfully updated!`,
            result: {
              _id: newResult._id,
              text: newResult.text
            }
          });
        })
        .catch((err) => {
          res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
          return;
        });
    })
    .catch((err) => {
      if (err.errors) {
        if (err.errors.text) {
          res.status(400).json({ success: false, msg: err.errors.text.message });
          return;
        }
        // Show failed if all else fails for some reasons
        res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
      }
    });
});

// DELETE
router.delete('/:id', (req, res) => {

  Twogramstopword.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.json({
        success: true,
        msg: `It has been deleted.`,
        result: {
          _id: result._id,
          text: result.text
        }
      });
    })
    .catch((err) => {
      res.status(404).json({ success: false, msg: 'Nothing to delete.' });
    });
});

module.exports = router;

// Minor sanitizing to be invoked before reaching the database
sanitizeText = (text) => {
  return (text);
}
