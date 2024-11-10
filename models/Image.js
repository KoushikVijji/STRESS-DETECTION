const mongoose = require('mongoose');
const User = require('./User');


const imageSchema = mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }, 
    images: [
        {
          data: Buffer,
          contentType: String,
          filename: String,
          uploadedAt: {
            type: Date,
            default: Date.now
          }
        }
      ]
});

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;