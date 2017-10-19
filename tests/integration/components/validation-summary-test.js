import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import EmberObject from '@ember/object';
import { A } from '@ember/array';
import ObjectProxy from '@ember/object/proxy';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
import { resolve } from 'rsvp';
import wait from 'ember-test-helpers/wait';

moduleForComponent('validation-summary', 'Integration | Component | validation summary', {
  integration: true
});

test('it renders validation errors', function(assert) {
  let promiseAwareObject = ObjectProxy.extend(PromiseProxyMixin);

  this.set('object', EmberObject.create({
    validationErrors: A([{
      validation: 'test',
      error: promiseAwareObject.create({
        isFulfilled: true,
        promise: resolve('Some error message'),
        content: 'Some error message'
      })
    }, {
      validation: 'otherTest',
      error: promiseAwareObject.create({
        isFulfilled: true,
        promise: resolve('Some other error message'),
        content: 'Some other error message'
      })
    }])
  }));

  this.render(hbs`{{validation-summary validations=object.validationErrors}}`);
  wait().then(() => {
    assert.equal(this.$('li:eq(0)').text().trim(), 'Some error message');
    assert.equal(this.$('li:eq(1)').text().trim(), 'Some other error message');
  });
});

test('it renders validation errors as block', function(assert) {
  let promiseAwareObject = ObjectProxy.extend(PromiseProxyMixin);

  this.set('object', EmberObject.create({
    validationErrors: A([{
      validation: 'test',
      error: promiseAwareObject.create({
        isFulfilled: true,
        promise: resolve('Some error message'),
        content: 'Some error message'
      })
    }, {
      validation: 'otherTest',
      error: promiseAwareObject.create({
        isFulfilled: true,
        promise: resolve('Some other error message'),
        content: 'Some other error message'
      })
    }])
  }));

  this.render(hbs`
    {{#validation-summary validations=object.validationErrors as |message|}}
      error: {{message}}
    {{/validation-summary}}`);
  wait().then(() => {
    assert.equal(this.$('li:eq(0)').text().trim(), 'error: Some error message');
    assert.equal(this.$('li:eq(1)').text().trim(), 'error: Some other error message');
  });
});

test('it renders hidden when no validations', function(assert) {
  this.set('object', EmberObject.create({
    validationErrors: A([])
  }));

  this.render(hbs`
    {{#validation-summary validations=object.validationErrors class="alert alert-danger" as |message|}}
      error: {{message}}
    {{/validation-summary}}`);
  wait().then(() => {
    assert.equal(this.$('ul').hasClass('hidden'), true);
  });
});
