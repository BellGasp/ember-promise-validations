import Helper from '@ember/component/helper';
import HelperObserver from '../mixins/helper-observer';

export default Helper.extend(HelperObserver, {
  compute([model, validation]) {
    this.set('model', model);
    this.addObserver(model, 'validationErrors.[]');

    let errors = model.get('validationErrors');

    if (!errors || !errors.length)
    {
      return false;
    }

    if (!validation) {
      return errors.length > 0;
    }

    return errors.mapBy('validation').includes(validation);
  }
});
