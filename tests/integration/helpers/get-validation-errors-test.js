
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import EmberObject from '@ember/object';
import { A } from '@ember/array';

moduleForComponent('get-validation-errors', 'helper:get-validation-errors', {
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
    {{#each (get-validation-errors object) as |validationErrors|}}
      <span>{{validationErrors.error}}</span>
    {{/each}}
  `);

  assert.equal(this.$('span:eq(0)').text().trim(), 'Some error message');
  assert.equal(this.$('span:eq(1)').text().trim(), 'Some other error message');
});

test('it gets multiple objects with errors', function(assert) {
  this.set('object', EmberObject.create({
    validationErrors: A([{
      validation: 'test',
      error: 'Some error message'
    }, {
      validation: 'otherTest',
      error: 'Some other error message'
    }])
  }));
  this.set('object2', EmberObject.create({
    validationErrors: A([{
      validation: 'test',
      error: 'Some message'
    }, {
      validation: 'otherTest',
      error: 'Some other message'
    }])
  }));

  this.render(hbs`
    {{#each (get-validation-errors object object2) as |validationErrors|}}
      <span>{{validationErrors.error}}</span>
    {{/each}}
  `);

  assert.equal(this.$('span:eq(0)').text().trim(), 'Some error message');
  assert.equal(this.$('span:eq(1)').text().trim(), 'Some other error message');
  assert.equal(this.$('span:eq(2)').text().trim(), 'Some message');
  assert.equal(this.$('span:eq(3)').text().trim(), 'Some other message');
});
