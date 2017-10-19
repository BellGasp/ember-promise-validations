import Ember from 'ember';
import layout from '../templates/components/validation-summary';
import { isEmpty } from '@ember/utils';
import { computed } from '@ember/object';

export default Ember.Component.extend({
  layout,
  tagName: 'ul',
  classNameBindings: ['isHidden:hidden'],

  validations: null,

  isHidden: computed('validations.[]', function() {
    let validations = this.get('validations');
    return isEmpty(validations);
  })
});
