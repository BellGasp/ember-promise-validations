import { moduleFor, test } from 'ember-qunit';
import EmberObject from '@ember/object';
import { A } from '@ember/array';
import ObjectProxy from '@ember/object/proxy';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';

moduleFor('service:validation', 'Unit | Service | validation');

test('It can get validators', function(assert) {
  let object = EmberObject.extend({
    testProperty: 'test'
  });

  this.registry.register('validator:test', object);

  let service = this.subject();
  let testObject = service._getValidator('test');
  assert.equal(testObject.get('testProperty'), 'test');
});

test('It can set specified errors', function(assert) {
  let promiseAwareObject = ObjectProxy.extend(PromiseProxyMixin);

  let object = EmberObject.create({
    validationErrors: A([{
      validation: 'test',
      error: promiseAwareObject.create({
        content: 'Some error message'
      })
    }, {
      validation: 'otherTest',
      error: promiseAwareObject.create({
        content: 'Some other error message'
      })
    }])
  });

  let errors = A([{
    validation: 'test',
    error: promiseAwareObject.create({
      content: 'Some second error message'
    })
  }]);

  let service = this.subject();

  service._setErrors(object, errors, [['test']]);
  assert.equal(object.get('validationErrors').findBy('validation', 'otherTest').error.content,
    'Some other error message');

  assert.equal(object.get('validationErrors').findBy('validation', 'test').error.content,
    'Some second error message');
});

test('It can get errors', async function(assert) {
  let validator = EmberObject.extend({
    validations: {
      testProperty(value) {
        return value;
      },
      testFn() {
        return 'testFnError';
      },
      testFn2() {
        return false;
      }
    }
  });

  this.registry.register('validator:test', validator);

  let object = EmberObject.create({
    testProperty: 'some-value'
  });

  let service = this.subject();

  let errors = await service.getErrors(object, 'test');
  
  assert.equal(errors.length, 2);
  assert.equal(object.get('validationErrors').findBy('validation', 'testProperty').error.content,
    'some-value');
  assert.equal(object.get('validationErrors').findBy('validation', 'testFn').error.content,
    'testFnError');
  assert.equal(object.get('validationErrors').findBy('validation', 'testFn2'),
    undefined);
});
