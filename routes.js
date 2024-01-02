import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import express from 'express';
const router = express.Router();
import { asyncHandler, thenNext } from './controller/middleware/asyncMiddleware.js';
import sanitizerMiddleware from './controller/middleware/sanitizer.js';
import * as objects from './controller/services/objects.js';
import settings from './settings.js';
import {
  request as userRegistrationRequest,
  inputValidation as userRegistrationInputValidation,
  endpoint as userRegistrationEndpoint,
  auth as userRegistrationAuth,
} from './controller/api/users/post.controller.js';
import {
  request as userLoginRequest,
  inputValidation as userLoginInputValidation,
  endpoint as userLoginEndpoint,
} from './controller/api/users/auth/login/post.controller.js';
import {
  request as companyRegistrationRequest,
  inputValidation as companyRegistrationInputValidation,
  endpoint as companyRegistrationEndpoint,
} from './controller/api/companies/post.controller.js';
import {
  request as userEmailVerifyRequest,
  inputValidation as userEmailVerificationInputValidations,
  endpoint as userEmailVerificationEndpoint,
} from './controller/api/users/auth/verify/post.controller.js';
import {
  request as forgetPasswordRequest,
  inputValidation as forgetPasswordInputValidation,
  endpoint as forgetPasswordEndpoint,
} from './controller/api/users/auth/password/forget/post.contoller.js';
import {
  request as resetPasswordRequest,
  inputValidation as resetPasswordInputValidation,
  endpoint as resetPasswordEndpoint,
} from './controller/api/users/auth/password/resetPassword/patch.controller.js';
// register your routes here
const endpoints = [
  {
    request: userRegistrationRequest,
    inputValidation: userRegistrationInputValidation,
    endpoint: userRegistrationEndpoint,
    auth: userRegistrationAuth,
  },
  {
    request: userLoginRequest,
    inputValidation: userLoginInputValidation,
    endpoint: userLoginEndpoint,
  },
  {
    request: companyRegistrationRequest,
    inputValidation: companyRegistrationInputValidation,
    endpoint: companyRegistrationEndpoint,
  },
  {
    request: userEmailVerifyRequest,
    inputValidation: userEmailVerificationInputValidations,
    endpoint: userEmailVerificationEndpoint,
  },
  {
    request: forgetPasswordRequest,
    inputValidation: forgetPasswordInputValidation,
    endpoint: forgetPasswordEndpoint,
  },
  {
    request: resetPasswordRequest,
    inputValidation: resetPasswordInputValidation,
    endpoint: resetPasswordEndpoint,
  },
];

const validateInputs = function (request, inputSchemas) {
  if (inputSchemas) {
    const validationTypes = ['query', 'params', 'body'];
    const modelName = request.type.toUpperCase() + request.path;
    const models = {
      query: inputSchemas.query ? mongoose.model(modelName + '-query', inputSchemas.query) : null,
      params: inputSchemas.params
        ? mongoose.model(modelName + '-params', inputSchemas.params)
        : null,
      body: inputSchemas.body ? mongoose.model(modelName + '-body', inputSchemas.body) : null,
    };

    const checkForUnwantedProperties = function (obj, schema) {
      let schemaObj;
      if (obj instanceof Array) {
        if (schema.type) schemaObj = schema.type[0];
        else schemaObj = schema[0];
        for (let val of obj) {
          checkForUnwantedProperties(val, schemaObj);
        }
      } else if (obj instanceof Object) {
        if (schema instanceof Schema) {
          schemaObj = schema.obj;

          for (let key in obj) {
            if (key !== '_id' && !schemaObj[key])
              throw new Error('Key ' + key + ' could not be found in schema');
            checkForUnwantedProperties(obj[key], schemaObj[key]);
          }
        } else {
          schemaObj = schema;
          let schemaObject;
          for (let key in obj) {
            if (schemaObj[key] && schemaObj[key].type) schemaObject = schemaObj[key].type;
            else schemaObject = schemaObj[key];
            if (!schemaObj[key]) throw new Error('Key ' + key + ' could not be found in schema');
            checkForUnwantedProperties(obj[key], schemaObject);
          }
        }
      }
    };

    const validateObject = function (input, type) {
      // check object matches schema
      const doc = new models[type](input);
      const error = doc.validateSync();
      if (error) throw new Error(error);

      // check object does not contain any other properties
      checkForUnwantedProperties(input, inputSchemas[type]);
    };

    return function (req) {
      for (const type of validationTypes) {
        const input = req[type];
        if (input && !objects.isEmpty(input)) {
          validateObject(input, type);
        }
      }
    };
  }
};

const register = endpoint => {
  const path = '/' + settings.version + endpoint.request.path;
  router[endpoint.request.type](
    path,
    thenNext(endpoint.files),
    sanitizerMiddleware,
    thenNext(validateInputs(endpoint.request, endpoint.inputValidation)),
    thenNext(endpoint.auth),
    asyncHandler(endpoint.endpoint),
  );
};

const registerEndpoint = () => {
  for (const endpoint of endpoints) {
    register(endpoint);
  }
};

registerEndpoint();
export default router;
