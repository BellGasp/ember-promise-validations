import Helper from '@ember/component/helper';

export default Helper.extend({
  observerSet: false,
  willDestroy(){
    this._super(...arguments);
    if (this.get('observerSet')) {
      this.get('model').removeObserver('validationErrors', this, this.observeErrors);
      this.set('observerSet', false);
    }
  },
  observeErrors() {
    this.recompute();
  },
  compute([model, validation]) {
    this.set('model', model);
    if (!this.get('observerSet')) {
      model.addObserver('validationErrors', this, this.observeErrors);
      this.set('observerSet', true);
    }

    let errors = model.get('validationErrors');

    if (!errors || !errors.length)
    {
      return null;
    }

    if (!validation) {
      return errors;
    }
    let error = errors.findBy('validation', validation);
    if (error) {
      return error;
    }
    return null;
  }
});
