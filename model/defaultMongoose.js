let defaultFunctions = model => {
  const findWithCursor = async selector => {
    return await model.find(selector).cursor();
  };
  return {
    insert: async data => {
      let newDoc = new model(data);

      await newDoc.save();

      return newDoc._doc;
    },
    find: async selector => {
      return await model.find(selector).lean();
    },
    findOne: async selector => {
      return await model.findOne(selector).lean();
    },
    findOneById: async id => {
      return await model.findById(id).lean();
    },
    findSortLimitSkip: async (selector, sorter, limit, skip) => {
      skip = parseInt(skip);
      return await model.find(selector).sort(sorter).limit(limit).skip(skip).lean();
    },
    findWithCursor: findWithCursor,
    findAndIterate: async (selector, fn) => {
      let cursor = await findWithCursor(selector);
      let doc = await cursor.next();

      for (null; doc !== null; doc = await cursor.next()) {
        await fn(doc);
      }
    },
    updateOne: async (selector, updateObj) => {
      return await model.findOneAndUpdate(selector, updateObj, {
        runValidators: true,
        // useFindAndModify: false,
        // returnOriginal: false,
        // new: true,
        // returnNewDocument: true
      });
    },
    deleteOne: async selector => {
      return await model.findOne(selector).remove();
    },
    count: async selector => {
      return new Promise((resolve, reject) => {
        try {
          model.countDocuments(selector, (err1, result) => {
            if (err1) reject(err1);
            resolve(result);
          });
        } catch (err2) {
          reject(err2);
        }
      });
    },
  };
};

export default defaultFunctions;
