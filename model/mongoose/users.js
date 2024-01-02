import mongoose from 'mongoose';
import userSchema from '../schemas/users.js';
import defaultMongoose from '../defaultMongoose.js';

let Model = mongoose.model('User', userSchema);

let mongooseFunctions = defaultMongoose(Model);
// overide default methods here
mongooseFunctions.find = async function find(selector) {
  return Model.find(selector).lean();
};
export default mongooseFunctions;
