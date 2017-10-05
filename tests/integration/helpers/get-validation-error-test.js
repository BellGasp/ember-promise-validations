
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import EmberObject from '@ember/object';
import { A } from '@ember/array';

moduleForComponent('get-validation-error', 'helper:get-validation-error', {
  integration: true
});

test('it gets an object with errors', function(assert) {
  this.set('object', EmberObject.create({
    validationErrors: A([{
      validation: 'test',
      error: 'Some error message'
    }, {
      validation: 'otherTest',
      error: 'Some other error message'
    }])
  }));

  this.render(hbs`
    {{#each (get-validation-error object) as |validationErrors|}}
      <span>{{validationErrors.error}}</span>
    {{/each}}
  `);

  assert.equal(this.$('span:eq(0)').text().trim(), 'Some error message');
  assert.equal(this.$('span:eq(1)').text().trim(), 'Some other error message');
});

test('it gets an object without errors', function(assert) {
  this.set('object', EmberObject.create({
    validationErrors: A([])
  }));

  this.render(hbs`{{get-validation-error object}}`);

  assert.equal(this.$().text().trim(), '');
});

test('it gets a specified validation in an object with an error', function(assert) {
  this.set('object', EmberObject.create({
    validationErrors: A([{
      validation: 'test',
      error: 'Some error message'
    }, {
      validation: 'otherTest',
      error: 'Some other error message'
    }])
  }));

  this.render(hbs`{{get (get-validation-error object 'test') 'error'}}`);

  assert.equal(this.$().text().trim(), 'Some error message');
});


test('it gets a specified validation in an object without an error', function(assert) {
  this.set('object', EmberObject.create({
    validationErrors: A([{
      validation: 'test',
      error: 'Some error message'
    }, {
      validation: 'otherTest',
      error: 'Some other error message'
    }])
  }));

  this.render(hbs`{{get-validation-error object 'yetAnotherTest'}}`);

  assert.equal(this.$().text().trim(), '');
});
