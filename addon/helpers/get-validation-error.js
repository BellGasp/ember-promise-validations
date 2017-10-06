import Helper from '@ember/component/helper';
import HelperObserver from '../mixins/helper-observer';

export default Helper.extend(HelperObserver, {
  compute([model, validation]) {
    this.set('model', model);
    this.addObserver(model, 'validationErrors.[]');

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
