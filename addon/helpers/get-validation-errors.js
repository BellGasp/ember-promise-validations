import Helper from '@ember/component/helper';
import { A } from '@ember/array';
import { isArray } from '@ember/array';

export default Helper.extend({
  observers: A(),
  isObserverSet(model) {
    return this.get('observers').includes(model);
  },
  addObserver(model) {
    if (!this.isObserverSet(model)) {
      model.addObserver('validationErrors.[]', this, this.observeErrors);
      this.get('observers').addObject(model);
    }
  },
  removeObserver(model) {
    if (this.isObserverSet(model)) {
      model.removeObserver('validationErrors.[]', this, this.observeErrors);
      this.get('observers').removeObject(model);
    }
  },
  flattenArray(array) {
    let newArray = A();
    array.forEach(p => {
      if (isArray(p)) {
        newArray = newArray.concat(...this.flattenArray(p));
      } else {
        newArray = newArray.concat(p);
      }
    });
    return newArray;
  },
  observeErrors() {
    this.recompute();
  },
  willDestroy(){
    this._super(...arguments);
    let models = this.get('models');
    models.forEach(model => {
      this.removeObserver(model);
    })
  },
  compute(params) {
    let validationErrors = [];

    let models = this.flattenArray(params);

    this.set('models', models);
    models.forEach(model => {
      this.addObserver(model);
      let errors = model.get('validationErrors');

      if (errors && errors.length)
      {
        validationErrors = validationErrors.concat(...errors);
      }
    });

    return validationErrors;
  }
});
