# ember-promise-validations
[![npm version](https://badge.fury.io/js/ember-promise-validations.svg)](https://badge.fury.io/js/ember-promise-validations)
[![Ember Observer Score](https://emberobserver.com/badges/ember-promise-validations.svg)](https://emberobserver.com/addons/ember-promise-validations)
[![Build Status](https://travis-ci.org/BellGasp/ember-promise-validations.svg?branch=master)](https://travis-ci.org/BellGasp/ember-promise-validations)
[![Code Climate](https://codeclimate.com/github/BellGasp/ember-promise-validations/badges/gpa.svg)](https://codeclimate.com/github/BellGasp/ember-promise-validations)


## Description
This ember addon provides means to easily validate ember objects with simple DIY promise aware validators.

This addon is still a work in progress.

## Installation

Like most ember addons, simply run `ember install ember-promise-validations` and you should be all set.

## Docs

### Objects
This addon includes a validation service that's necessary to validate the objects you want to validate. It's important to understand that the service doesn't tell you if the object is valid/invalid, instead it sends you a list containing each validation/error that the validator threw an error message for. Those errors are coming from the validators, and since the validators are promise aware, the error themselves need to be promises. The errors can then be used directly, or used through the helpers/components provided.
```javascript
let errors = validationService.getErrors(object, 'validator');
/*
errors: [
  {
    validation: 'someValidation',
    error: ObjectProxy(PromiseProxyMixin)
  }
]
*/
```

### Validators
A validator is an ember object containing a set of validations that can be executed, returning an error (usually a message) if the validation doesn't pass. A validation can be made using promises if necessary.

This addon exposes a blueprint for validators so you can simply run `ember g validator some-name` to generate the some-name validator.

A validator *_MUST_* have a 'validations' object where all the validations are scoped.

#### Example
```javascript
import { isBlank } from '@ember/utils';
import EmberObject from '@ember/object';
import { inject as service } from '@ember/service';

export default EmberObject.extend({
  i18n: service(),
  ajax: service(),

  validations: {
    street(value) {
      if (isBlank(value)) {
        return this.get('i18n').t('validations.address.street.blank');
      }
      return false;
    },
    uniqueAddress(value, model) {
      let url = 'some-url';
      return this.get('ajax').request(url, {
        method: 'GET',
        data: {
          address: model
        }
      }).then(result => {
        if (!result.success) {
          return this.get('i18n').t('validations.address.uniqueAddress');
        }
        return false;
      });
    }
  }
});
```
### Services
#### Validation
The validation service is used to validate an object against a validator and can be passed an array of validations to execute if not all of them need to be executed.

The only method of the service is the `getErrors(object, validatorName, validations)` method.
This method validates the object against the validator, and executes only the validations passed in the array 'validations'. If the parameter isn't passed, it'll execute every validation of the validator.
This returns a promise, so if it's necessary to wait for the result, for example to know if it's safe to save the model, you need to wait for it.
For Example:
``` javascript
[...]
actions: {
  save(model) {
    this.get('validationService').getErrors(model, 'validator').then(errors => {
      if (errors.length === 0)
      {
        model.save();
      }
    });
  }
}
[...]
```
Here are the parameters that are available.

| Property Key | Type | Description |
|---|:-------------:|:------:|:-------------:|
| object | object | Object to validate (can be a model) |
| validatorName | string | Name of the validator to use |
| validations | string[] | Validations to run (*none* if _empty_ array, *all* if _undefined_/_null_) |
|||||
| returns | promise[] | Returns all the errors obtained as an array of promise aware object (ObjectProxy + PromiseProxyMixin) |

The validation service works by returning all the errors generated by the object, and adding a `validationErrors` property on the object itself, so the errors can be access from `object.validationErrors` and from the array returned by the service.
Each time the service is called, the validations to run on the object are cleared from the existing validation errors before the errors are added, so the errors from previous validations aren't cleared until they are ran.
You can access the validationErrors directly on each objects if necessary, or you can use the helpers provided.

### Components
#### validation-summary
The validation-summary component is simple component used to show a list of errors from a list of promise proxy objects.

##### Example
``` javascript
  this.set('validationErrors', validationService.getErrors(address, 'address', ['street']));
```
```HTMLBars
{{validation-summary validations=validationErrors class="alert alert-danger"}}
```
or
```HTMLBars
{{validation-summary validations=(get-validation-errors address) class="alert alert-danger"}}
```

### Helpers
#### has-validation-error
The has-validation-error helper is used to check if an object has an error for a specified validation. If no validation is specified, it checks if the object has any error.

##### Example
``` javascript
  validationService.getErrors(address, 'address', ['street']);
```
```HTMLBars
<div class="form-group col-6 {{if (has-validation-error address 'street') 'has-danger' ''}}">
    <div class="input-group">
      <span class="input-group-addon col-3">Street</span>
      {{input type="text" class="form-control" value=address.street}}
    </div>
  </div>
```
#### get-validation-error
The get-validation-error helper is used to get an object's error for a specified validation.
##### Example
``` javascript
  validationService.getErrors(address, 'address', ['street']);
```
```HTMLBars
<div class="form-group col-6 {{if (has-validation-error address 'street') 'has-danger' ''}}">
    <div class="input-group">
      <span class="input-group-addon col-3">Street</span>
      {{input type="text" class="form-control" value=address.street}}
      <span class="error">{{get-validation-error address 'street'}}</span>
    </div>
  </div>
```

#### get-validation-errors
The get-validation-errors helper is used to get an object's error for a specified validation. If no validation is specified, it gets all the errors for the object.
##### Example
``` javascript
  validationService.getErrors(address, 'address');
  validationService.getErrors(otherAddress, 'address');
```
```HTMLBars
{{#each (get-validation-errors address otherAddress) as |validationErrors|}}
  <span>{{validationErrors.error}}</span>
{{/each}}
```

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
