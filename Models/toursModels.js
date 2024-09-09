const mongoose = require('mongoose');
// const User = require('./userModel');
// const validator = require('validator');

// const slug = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A Tour must have a  name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour must have less or equal to 40 characters'],
      minlength: [10, 'A tour must have more or equal to 10 characters'],
      // validate: [validator.isAlpha,'Tour name must be characters.']
    },
    slugify: String,
    duration: {
      type: Number,
      required: [true, 'A Tour must have a duration'],
    },
    maxGroupSize: {
      type: String,
      required: [true, 'A Tour must have group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A Tour must have difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A Tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to current Doc on New Doc creation.
          return val < this.price;
        },
        message: 'Discount must be lessthan the regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A Tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A Tour must have a Cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    screatTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// virtual middleware will add the field to the Data and show the added fields but those fields are not acutally added to the Database.

tourSchema.virtual('durationweeks').get(function () {
  return this.duration / 7;
});

//Document middleware run before .save() and .create()
tourSchema.pre('save', function (next) {
  // this.slugify = slug(this.name,{lower:true})
  this.slugify = this.name;
  next();
});

//  it is used for embedding the guides detail in tours
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// tourSchema.pre('save',function(next){
//   console.log('will save doc.....');
//   next();
// })

// tourSchema.post('save',function(doc,next){
//   console.log(doc);
//   next();
// })

//QUERY middleware it can filter the data before or after the Data projected.
tourSchema.pre(/^find/, function (next) {
  this.find({ screatTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});

tourSchema.post(/^find/, function (doc, next) {
  console.log(`Query took ${this.start} millisecond`);
  // console.log(doc);
  next();
});

// Aggregate middleware
tourSchema.pre('Aggregate', function (next) {
  console.log9(this.pipline());
  this.pipline().unshift({ $match: { screatTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);
/* 
General methode to creat a collection

const newTour = new Tour({
  name:'the mountain hike',
  price:500,
  rating:4.9
})

newTour
  .save()
  .then(data => {
    console.log(data)
  })
  .catch(err=>{
    console.log(err)
  })


*/
module.exports = Tour;
