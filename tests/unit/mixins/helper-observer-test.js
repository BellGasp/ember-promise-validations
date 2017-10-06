import Ember from 'ember';
import HelperObserverMixin from 'ember-promise-validations/mixins/helper-observer';
import { module, test } from 'qunit';

module('Unit | Mixin | helper observer');

// Replace this with your real tests.
test('it works', function(assert) {
  let HelperObserverObject = Ember.Object.extend(HelperObserverMixin);
  let subject = HelperObserverObject.create();
  assert.ok(subject);
});

test('can add an observer', function(assert) {
  let HelperObserverObject = Ember.Object.extend(HelperObserverMixin);
  let subject = HelperObserverObject.create();
  let object = {
    property: 'test'
  };
  subject.addObserver(object, 'property');

  assert.equal(subject.observers.get('length'), 1);
  assert.equal(subject.observers.get('firstObject').property, 'property');
  assert.equal(subject.observers.get('firstObject').model, object);
});

test('can remove an observer', function(assert) {
  let HelperObserverObject = Ember.Object.extend(HelperObserverMixin);
  let subject = HelperObserverObject.create();
  let object = {
    property: 'test'
  };
  subject.addObserver(object, 'property');

  assert.equal(subject.observers.get('length'), 1);
  assert.equal(subject.observers.get('firstObject').property, 'property');
  assert.equal(subject.observers.get('firstObject').model, object);

  subject.removeObserver(object, 'property');
  assert.equal(subject.observers.get('length'), 0);
});
