import { A } from '@ember/array';
import Mixin from '@ember/object/mixin';
import { addObserver, removeObserver } from '@ember/object/observers';

export default Mixin.create({
  observers: null,
  init() {
    this._super(...arguments);
    this.set('observers', A());
  },
  getObserver(mod, prop) {
    return this.get('observers').find(({model, property}) => {
      return model === mod && property === prop;
    });
  },
  addObserver(model, property) {
    let observer = this.getObserver(model, property);
    if (!observer) {
      addObserver(model, property, this, this.recomputeHelper);
      this.get('observers').addObject({model, property});
    }
  },
  removeObserver(model, property) {
    let observer = this.getObserver(model, property);
    if (observer) {
      removeObserver(model, property, this, this.recomputeHelper);
      this.get('observers').removeObject(observer);
    }
  },
  recomputeHelper() {
    this.recompute();
  },
  willDestroy(){
    this._super(...arguments);
    let observers = this.get('observers');
    observers.forEach(({model, property}) => {
      this.removeObserver(model, property);
    });
  },
});
