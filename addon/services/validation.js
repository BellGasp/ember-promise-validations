import Service from '@ember/service';
import { get, set } from '@ember/object';
import { A } from '@ember/array';
import { getOwner } from '@ember/application';
import { assert } from '@ember/debug';
import ObjectProxy from '@ember/object/proxy';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
import { resolve, all } from 'rsvp';

export default Service.extend({
  _getValidator(validatorName) {
    let app = getOwner(this);
    return app.lookup(`validator:${validatorName}`);
  },
  _setErrors(object, errors, validations) {
    let validationErrors = get(object, 'validationErrors');
    if (!validationErrors) {
      validationErrors = A();
    }
    validations.forEach(validationName => {
      let error = validationErrors.findBy('validation', validationName)
      if (error) {
        validationErrors.removeObject(error);
      }
    });
    validationErrors.addObjects(errors);
    set(object, 'validationErrors', validationErrors);
  },
  getErrors(object, validatorName, validationsToRun) {
    if (!object) {
      assert('An object to validate must be passed.');
    }
    if (!validatorName) {
      assert('A validator name must be passed.');
    }

    let validator = this._getValidator(validatorName);

    if (!validator || !validator.validations) {
      assert('A valid validator containing a validations object must be passed.');
    }
    let possibleValidations = Object.entries(validator.validations);

    let validations = validationsToRun
      ? possibleValidations.filter(([validationName]) => validationsToRun.includes(validationName))
      : possibleValidations;

    let promises = validations.map(([validationName, validationFn]) => {
      if (typeof validationFn === 'function') {
        let value = get(object, validationName);

        let promiseAwareObject = ObjectProxy.extend(PromiseProxyMixin);

        let error = resolve(validationFn.call(validator, value, object));

        return resolve({
          validation: validationName,
          error: promiseAwareObject.create({
            promise: error
          })
        });
      }
    });

    return all(promises).then(validations => {
      let validationErrors = validations.mapBy('error');
      return all(validationErrors).then(() => {
        let errors = validations.filter(validation => validation.error.content && true);

        this._setErrors(object, errors, validations);
        return errors;
      });
    });
  }
});
