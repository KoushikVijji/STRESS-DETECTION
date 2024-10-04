const mongoose = require('mongoose');


const imageSchema = mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }, 
    images: [
        {
          url: String,
          filename: String,
          uploadedAt: {
            type: Date,
            default: Date.now
          }
        }
      ]
});

const Image = mongoose.model("image", imageSchema);

module.exports = Image;