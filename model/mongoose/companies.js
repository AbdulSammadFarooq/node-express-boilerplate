import mongoose from 'mongoose';
import companySchema from '../schemas/companies.js';
import defaultMongoose from '../defaultMongoose.js';

let Model = mongoose.model('Company', companySchema);

let mongooseFunctions = defaultMongoose(Model);
// overide default methods here
mongooseFunctions.find = async function find(selector) {
  return Model.find(selector).lean();
};
export default mongooseFunctions;
