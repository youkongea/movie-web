/**
 * Created by unsad on 2017/2/21.
 */
const mongoose = require('mongoose');
const CategorySchema = require('../schemas/Category');
const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;
