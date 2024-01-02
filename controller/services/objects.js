const getDateFromDays = days => {
  let lastMsgDate = new Date();
  lastMsgDate.setTime(lastMsgDate.getTime() - days * 24 * 60 * 60 * 1000);
  return lastMsgDate;
};
const getDateFromDaysSpecificTime = days => {
  let lastMsgDate = new Date(new Date().setHours(15, 0, 0, 0));
  lastMsgDate.setTime(lastMsgDate - days * 24 * 60 * 60 * 1000);
  return lastMsgDate;
};
const getDateFromYears = years => {
  let date = new Date();
  let diff = date.getFullYear() - years;
  date.setFullYear(diff);
  date.setHours(0, 0, 0, 0);
  return date;
};

const isEmpty = obj => {
  for (let prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false;
    }
  }
  return true;
};

const replaceLineBreaksHtml = html => {
  let new_html = html
    .replace(/\r\n|\n\r/g, '\n')
    .replace(/\n\n/g, '\n')
    .replace(/\n/g, '<br />');
  new_html = new_html.replace(/<(?!br\s*\/?)[^>]+>/g, '');

  return new_html;
};

const removeDuplicates = (originalArray, prop) => {
  var newArray = [];
  var lookupObject = {};

  for (var i in originalArray) {
    lookupObject[originalArray[i][prop]] = originalArray[i];
  }
  for (i in lookupObject) {
    newArray.push(lookupObject[i]);
  }
  return newArray;
};

const copyObject = obj => {
  return JSON.parse(JSON.stringify(obj));
};

const recursivelyFlattenArrays = obj => {
  if (obj instanceof Array) {
    return JSON.stringify(obj);
  } else if (obj instanceof Object) {
    for (let key in obj) {
      obj[key] = recursivelyFlattenArrays(obj[key]);
    }
    return obj;
  } else {
    return obj;
  }
};

const copyAndFlattenArrays = obj => {
  let newObj = this.copyObject(obj);

  recursivelyFlattenArrays(newObj);
  return newObj;
};

const compareObjects = (obj1, obj2) => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};

export {
  getDateFromDays,
  getDateFromDaysSpecificTime,
  getDateFromYears,
  isEmpty,
  replaceLineBreaksHtml,
  removeDuplicates,
  copyObject,
  copyAndFlattenArrays,
  compareObjects,
};
