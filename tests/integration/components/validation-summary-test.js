import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import EmberObject from '@ember/object';
import { A } from '@ember/array';
import ObjectProxy from '@ember/object/proxy';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
import { resolve } from 'rsvp';

moduleForComponent('validation-summary', 'Integration | Component | validation summary', {
  integration: true
});

test('it renders validation errors', function(assert) {
  let promiseAwareObject = ObjectProxy.extend(PromiseProxyMixin);

  this.set('object', EmberObject.create({
    validationErrors: A([{
      validation: 'test',
      error: promiseAwareObject.create({
        promise: resolve('Some error message')
      })
    }, {
      validation: 'otherTest',
      error: promiseAwareObject.create({
        promise: resolve('Some other error message')
      })
    }])
  }));

  this.render(hbs`{{validation-summary validations=object.validationErrors}}`);

  assert.equal(this.$('li:eq(0)').text().trim(), 'Some error message');
  assert.equal(this.$('li:eq(1)').text().trim(), 'Some other error message');
});
