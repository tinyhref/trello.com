// eslint-disable-next-line no-restricted-imports -- legacy stack
import Bluebird from 'bluebird';
import _ from 'underscore';

export default {
  // Backbone 1.0.0 adds this method, but we aren't running Backbone 1.0.0, so
  // here's a shim for you.
  //
  // Actually, this behaves slightly different from Backbone's implementation.
  // Backbone's implementation will bind *each* event in events (assuming it's
  // a space-separated list) once -- so the callback can be invoked once for
  // each of them. This is stupid, so we don't do that. Hopefully it won't
  // matter. Please don't rely on that.
  listenToOnce(model, events, callback) {
    let removeFn = null;
    const actualCallback = function () {
      callback.apply(this, arguments);
      return removeFn();
    };
    removeFn = (function (_this) {
      return function () {
        return _this.stopListening(model, events, actualCallback);
      };
    })(this);
    return this.listenTo(model, events, actualCallback);
  },
  waitForId(model, next) {
    return this.waitForAttr(model, 'id', next);
  },
  waitForAttr(model, attr, next) {
    if (arguments.length !== 3) {
      throw new Error('Wrong number of arguments to waitForAttr');
    }
    const val = model.get(attr);
    if (val !== null && val !== undefined) {
      next(val);
    } else {
      this.listenToOnce(
        model,
        'change:' + attr,
        (function (_this) {
          return function () {
            return _this.waitForAttr(model, attr, next);
          };
        })(this),
      );
    }
  },
  waitForAttrs(model, attrs, next) {
    if (arguments.length !== 3) {
      throw new Error('Wrong number of arguments to waitForAttrs');
    }
    const attrValues = attrs.map(
      (function (_this) {
        return function (attr) {
          return new Bluebird(function (resolve) {
            return _this.waitForAttr(model, attr, resolve);
          });
        };
      })(this),
    );
    Bluebird.all(attrValues)
      .then(function (values) {
        return _.object(_.zip(attrs, values));
      })
      .then((attrValueMap) => {
        // The value returned by next doesn't mean anything here
        // (e.g. if it happened to return something that looked like
        // a thennable, we don't need to do anything with it)
        next(attrValueMap);
      })
      .done();
  },
};
