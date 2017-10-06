import Helper from '@ember/component/helper';
import { A } from '@ember/array';
import { isArray } from '@ember/array';
import HelperObserver from '../mixins/helper-observer';

export default Helper.extend(HelperObserver, {
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
  compute(params) {
    let validationErrors = [];

    let models = this.flattenArray(params);

    this.set('models', models);
    models.forEach(model => {
      this.addObserver(model, 'validationErrors.[]');
      let errors = model.get('validationErrors');

      if (errors && errors.length)
      {
        validationErrors = validationErrors.concat(...errors);
      }
    });

    return validationErrors;
  }
});
