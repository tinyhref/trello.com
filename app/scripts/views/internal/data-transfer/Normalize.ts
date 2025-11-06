// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
/*
Drag and Drop is still a mess; here we attempt to provide a consistent way to
get the types of items that are being dragged and the types and content of
items that are dropped

State of Drag and Drop for supported browsers:

Chrome

- Things you can drag: Files, Urls, Text
- How you get the types of things being dragged: e.dataTransfer.item[].type
- How you get the content that was dropped: e.dataTransfer.item.getAsString or
  e.dataTransfer.getData()

Firefox

- Things you can drag: Files, Urls, Text
- How you get the types of things being dragged: e.dataTransfer.types
- How you get the content that was dropped: e.dataTransfer.getData()

Internet Explorer / Edge

- Things you can drag: Files, Urls, Text
  (Text may not work in some cases unless you've enabled "Allow dragging of
  content between domains into separate windows")
- How you get the types of things being dragged: e.dataTransfer.types
- How you get the content that was dropped: e.dataTransfer.getData()

Safari

- Things you can drag: Files, Urls
- How you get the types of things being dragged: e.dataTransfer.types, although
  there isn't a good way to detect this
- How you get the content that was dropped: e.dataTransfer.getData()
*/

// eslint-disable-next-line no-restricted-imports
import Bluebird from 'bluebird';
import _ from 'underscore';

import { isUrl } from '@trello/urls';

type DataTransferItem = {
  kind: string;
  type: string;
  getAsString: (callback: (data: File) => void) => void;
  getAsFile: () => File | null;
};

// Chrome has dataTransfer.items; you can figure out the type by looking at
// the item.kind and item.type
const getTypeFromItem = function (
  item: DataTransferItem,
): 'files' | 'text' | 'unknown' | 'url' {
  const knownType = (() => {
    switch (item.kind) {
      case 'file':
        return 'files';
      case 'string':
        switch (item.type) {
          case 'text/uri-list':
            return 'url';
          case 'text/plain':
            return 'text';
          default:
        }
        break;
      default:
    }
  })();

  return knownType || 'unknown';
};

// Chrome has dataTransfer.items
const getTypesUsingItems = (dataTransfer: { items: DataTransferItem[] }) =>
  _.chain(dataTransfer?.items).map(getTypeFromItem).compact().uniq().value();

// IE uses types like Files/Url/Text
// Firefox uses things that look like mime types, and also the IE ones
// Safari includes text/uri-list for links
const getTypeFromType = function (
  type: string,
): 'files' | 'text' | 'unknown' | 'url' {
  switch (type) {
    case 'Files':
    case 'application/x-moz-file':
      return 'files';
    case 'Url':
    case 'text/x-moz-url':
    case 'text/uri-list':
      return 'url';
    case 'Text':
    case 'text/plain':
      return 'text';
    default:
      return 'unknown';
  }
};

// Map the browser types to our simple types (files, url, text)\
const getTypesUsingTypes = (dataTransfer: { types: string[] }) =>
  _.chain(dataTransfer.types).map(getTypeFromType).compact().uniq().value();

// If dataTransfer.files isn't empty, we're dragging files
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTypesUsingFiles = function (dataTransfer: { files: any[] }): string[] {
  if (dataTransfer.files.length > 0) {
    return ['files'];
  } else {
    return [];
  }
};

// Chrome has dataTransfer.items
const getDroppedUsingItems = (
  dataTransfer: { items: DataTransferItem[] }, // [MAPPING]
) =>
  Bluebird.all(
    _.toArray(dataTransfer?.items).map(function (item) {
      const type = getTypeFromItem(item);

      if (['text', 'url'].includes(type)) {
        return new Bluebird(function (resolve) {
          return item.getAsString((content: File) =>
            resolve({ type, content }),
          );
        });
      } else if (type === 'files') {
        // getAsFile can actually take a while if the file is large (e.g. 20mb),
        // but we can't give any sort of message while we're thinking about it
        // because there can't be any async steps in the path between the "paste"
        // event and the getAsFile (I'm guessing it's a security precaution)
        const content = item.getAsFile();
        // It's possible the content will be null, e.g. for images copied and
        // pasted out of Outlook https://stackoverflow.com/q/59758501
        if (content) {
          return { type, content };
        } else {
          return null;
        }
      } else {
        return null;
      }
    }),
  );

// All the browsers seem to have dataTransfer.files
const getDroppedUsingFiles = (dataTransfer: { files: File[] }) =>
  _.map(dataTransfer.files, (content) => ({ type: 'files', content }));

// Firefox, Safari and IE support getData
const getDroppedUsingGetData = function (dataTransfer: {
  getData: (type: string) => string[];
  types?: string[];
}) {
  // Get the list of actual types, since that's what getData will expect
  let { types } = dataTransfer;
  // Unfortunately IE doesn't appear to set the types on clipboardData when
  // pasting text (types is just null)
  if (!types) {
    types = dataTransfer.getData('Text') ? ['Text'] : [];
  }

  return _.map(types, function (type) {
    let content;
    const simpleType = getTypeFromType(type);
    if (
      ['text', 'url'].includes(simpleType) &&
      (content = dataTransfer.getData(type))
    ) {
      return {
        type: simpleType,
        content,
      };
    } else {
      return null;
    }
  });
};

const isMacSafari = () =>
  /mac/i.test(navigator.platform) && /safari/i.test(navigator.userAgent);

// Attempt to do some basic feature detection by looking at what's defined on
// the DataTransfer prototype
const hasSupport = function (propertyName: string): boolean {
  // Older versions of safari (pre 7.1) used the Clipboard type for drag events
  // eslint-disable-next-line @trello/enforce-variable-case
  const DataTransferType = window.DataTransfer || window.Clipboard;
  // We don't know what type is used for drag/drop events, so we can't do
  // feature detection
  if (!DataTransferType) {
    return false;
  }

  return (
    Object.prototype.hasOwnProperty.call(
      DataTransferType.prototype,
      propertyName,
    ) ||
    // There doesn't seem to be a way to see that Safari includes types on their
    // event.dataTransfer
    (propertyName === 'types' && isMacSafari()) ||
    // ... (and pre 7.1 safari doesn't indicate that Clipboard has files)
    (!window.DataTransfer && propertyName === 'files' && isMacSafari())
  );
};

export const getTypes = hasSupport('items')
  ? getTypesUsingItems
  : hasSupport('types')
    ? getTypesUsingTypes
    : hasSupport('files')
      ? getTypesUsingFiles
      : () => [];

const droppedGetters = hasSupport('items')
  ? [getDroppedUsingItems]
  : _.compact([
      hasSupport('files') ? getDroppedUsingFiles : undefined,

      hasSupport('getData') && hasSupport('types')
        ? getDroppedUsingGetData
        : undefined,
    ]);

// Given a DataTransfer (from a drop event or a paste event) return a normalized
// map of files/text/url
const contentFromDataTransfer = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataTransfer: any, // [MAPPING]
) =>
  Bluebird.all(droppedGetters.map((getter) => getter(dataTransfer))).then(
    (dropped) =>
      _.chain(dropped)
        .flatten()
        .compact()
        // @ts-expect-error Type 'unknown' is not assignable to type '{ type: string; content: string; }'.ts(2345)
        .each((entry: { type: string; content: string }) => {
          if (entry.type === 'text' && isUrl(entry.content)) {
            entry.type = 'url';
          }
        })
        .reject(
          (entry) =>
            // e.g. file:// is considered a URL but we can't do anything with those
            // @ts-expect-error 'entry' is of type 'unknown'.ts(18046)
            entry.type === 'url' && !isUrl(entry.content),
        )
        .groupBy('type')
        .mapObject(function (values, key) {
          // For files we give an array of the File objects, for everything else
          // (text and urls) we assume there's only one thing
          if (key === 'files') {
            return _.pluck(values, 'content');
          } else {
            // @ts-expect-error Object is of type 'unknown'.ts(2571)
            return values[0].content;
          }
        })
        .value(),
  );

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getDropped = (event: any) =>
  contentFromDataTransfer(event.dataTransfer);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getPasted = function (event: any) {
  if (event.clipboardData) {
    return contentFromDataTransfer(event.clipboardData);
    // @ts-expect-error TS(2339): Property 'clipboardData' does not exist on type 'W... Remove this comment to see the full error message
  } else if (window.clipboardData) {
    // Internet Explorer
    // @ts-expect-error TS(2339): Property 'clipboardData' does not exist on type 'W... Remove this comment to see the full error message
    return contentFromDataTransfer(window.clipboardData);
  } else {
    return Bluebird.resolve({});
  }
};

// [MAPPING]
//
// We can't use Promise.map here, as it will resolve the body on the next tick.
// This is bad, because on the next tick the next tick the relevant properties
// of each item will be cleared out -- item.type, for example, will just give
// you the empty string.
