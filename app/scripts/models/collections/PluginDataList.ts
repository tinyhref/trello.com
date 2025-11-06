import _ from 'underscore';

import { PluginData } from 'app/scripts/models/PluginData';
import { CollectionWithHelpers } from './internal/CollectionWithHelpers';

interface PluginDataList {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scopeModel: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signalCache: any;
}

class PluginDataList extends CollectionWithHelpers<PluginData> {
  static initClass() {
    this.prototype.model = PluginData;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialize(models: any, options: any) {
    return (this.scopeModel = options.scopeModel);
  }

  scope() {
    return this.scopeModel.typeName.toLowerCase();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for(idPlugin: any, visibility: any) {
    return _.find(this.models, (model) => {
      return (
        model.get('idPlugin') === idPlugin &&
        // @ts-expect-error
        model.get('access') === visibility &&
        model.get('scope') === this.scope() &&
        model.get('idModel') === this.scopeModel.id
      );
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create(attributes: any, options?: any) {
    attributes = {
      ...attributes,
      scope: this.scope(),
      idModel: this.scopeModel.id,
      access: attributes.visibility,
    };

    return super.create(attributes, options);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataForPlugin(idPlugin: any) {
    return _.chain(this.models)
      .filter((entry) => entry.get('idPlugin') === idPlugin)
      .groupBy((entry) => entry.get('scope'))
      .mapObject((val) =>
        _.chain(val)
          // @ts-expect-error
          .groupBy((entry) => entry.get('access'))
          // @ts-expect-error
          // eslint-disable-next-line @typescript-eslint/no-shadow
          .mapObject((val) => val[0].get('value'))
          .value(),
      )
      .value();
  }

  getPluginDataByKey(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    idPlugin: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    visibility: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    key: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultVal: any,
  ) {
    const data = this.dataForPlugin(idPlugin);
    const scope = this.scope();
    const unparsed = data?.[scope]?.[visibility];

    if (typeof unparsed === 'string') {
      try {
        const parsed = JSON.parse(unparsed);

        if (
          _.isObject(parsed) &&
          !_.isArray(parsed) &&
          parsed[key] !== undefined
        ) {
          return parsed[key];
        }
      } catch {
        return defaultVal;
      }
    }

    return defaultVal;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  snoopDataForPlugin(idPlugin: any) {
    if (!this.signalCache) {
      this.signalCache = {};
    }
    if (!this.signalCache[idPlugin]) {
      // @ts-expect-error
      this.signalCache[idPlugin] = this.snoop('value').map(() =>
        this.dataForPlugin(idPlugin),
      );
      // Temporary solution to avoid error caused from issue with guest members
      // Will address more long-term fix moving forward with DACI: https://tinyurl.com/4bpbvvjb
      this.signalCache[idPlugin].addDisposer(() => {
        if (this.signalCache) {
          delete this.signalCache[idPlugin];
        }
      });
    }
    return this.signalCache[idPlugin];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  upsert(idPlugin: any, visibility: any, data: any) {
    const pluginData = this.for(idPlugin, visibility);
    if (pluginData) {
      // @ts-expect-error
      pluginData.update('value', data);
    } else {
      this.create({
        idPlugin,
        visibility,
        value: data,
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setPluginDataByKey(idPlugin: any, visibility: any, key: any, val: any) {
    const data = this.dataForPlugin(idPlugin);
    const scope = this.scope();
    const unparsed = data?.[scope]?.[visibility];

    let updatedData = {};
    // @ts-expect-error
    updatedData[key] = val;
    if (typeof unparsed === 'string') {
      try {
        const parsed = JSON.parse(unparsed);
        if (_.isObject(parsed) && !_.isArray(parsed)) {
          parsed[key] = val;
          updatedData = parsed;
        }
      } catch {
        // No need to handle the exception here since we're overriding bad
        // values anyway
      }
    }
    return this.upsert(idPlugin, visibility, JSON.stringify(updatedData));
  }
}
PluginDataList.initClass();

export { PluginDataList };
