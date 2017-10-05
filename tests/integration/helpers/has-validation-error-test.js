
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import EmberObject from '@ember/object';
import { A } from '@ember/array';

moduleForComponent('has-validation-error', 'helper:has-validation-error', {
  integration: true
});

test('it test an object with errors', function(assert) {
  this.set('object', EmberObject.create({
    validationErrors: A([{
      validation: 'test',
      error: 'Some error message'
    }, {
      validation: 'otherTest',
      error: 'Some other error message'
    }])
  }));

  this.render(hbs`{{has-validation-error object}}`);

  assert.equal(this.$().text().trim(), 'true');
});

test('it test an object without errors', function(assert) {
  this.set('object', EmberObject.create({
    validationErrors: A([])
  }));

  this.render(hbs`{{has-validation-error object}}`);

  assert.equal(this.$().text().trim(), 'false');
});

test('it test a specified validation in an object with an error', function(assert) {
  this.set('object', EmberObject.create({
    validationErrors: A([{
      validation: 'test',
      error: 'Some error message'
    }, {
      validation: 'otherTest',
      error: 'Some other error message'
    }])
  }));

  this.render(hbs`{{has-validation-error object 'test'}}`);

  assert.equal(this.$().text().trim(), 'true');
});


test('it test a specified validation in an object without an error', function(assert) {
  this.set('object', EmberObject.create({
    validationErrors: A([{
      validation: 'test',
      error: 'Some error message'
    }, {
      validation: 'otherTest',
      error: 'Some other error message'
    }])
  }));

  this.render(hbs`{{has-validation-error object 'yetAnotherTest'}}`);

  assert.equal(this.$().text().trim(), 'false');
});
