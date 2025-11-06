import _ from 'underscore';

import { ajax } from '@trello/ajax';
import { getMemberId } from '@trello/authentication';
import { dismissFlag, showFlag } from '@trello/nachos/experimental-flags';
import { getCsrfRequestPayload } from '@trello/session-cookie/csrf';

import { l } from 'app/scripts/lib/localize';
import { Alerts } from 'app/scripts/views/lib/Alerts';
import { UploadAttachmentContent } from 'app/src/components/UploadAttachmentContent';
import {
  setUploadsFlagState,
  UploadAttachmentState,
} from 'app/src/components/UploadAttachmentState';
import { methodOf } from './methodOf';
import { randomNumber } from './randomNumber';

/* eslint-disable eqeqeq */
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
let AjaxQueue: any;

export const ajaxQueue = (AjaxQueue = new (class {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _maxLength: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _msBackoff: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _msBackoffMin: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _nTriesLeft: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _nTriesMax: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _queue: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _queueIdSeq: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _retrying: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _stopped: any;
  constructor() {
    this._msBackoff = 100;
    this._msBackoffMin = 100;
    this._nTriesLeft = 12;
    this._nTriesMax = 12;
    this._retrying = false;
    this._stopped = false;
    this._maxLength = 10;

    this._queue = [];
    this._queueIdSeq = 0;
  }

  uniqueReqId() {
    return `${getMemberId()}-${randomNumber()}`;
  }

  hasQueue() {
    return this._queue.length > 0;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inQueue(req: any) {
    return _.find(this._queue, (r) => r.queueId === req.queueId);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  removeFromQueue(req: any) {
    return (this._queue = _.filter(
      this._queue,
      (r) => r.queueId !== req.queueId,
    ));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addToQueue(req: any) {
    if (this._queue.length + 1 > this._maxLength) {
      return;
    }
    this._queue.push(req);
    return this.showRetrying();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  success(req: any) {
    if (this.inQueue(req)) {
      this.removeFromQueue(req);
      this._retrying = false;
      this._msBackoff = this._msBackoffMin;
      this._nTriesLeft = this._nTriesMax;
      return this.retryNext();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  retryableError(reqIn: any) {
    const req = _.clone(reqIn);
    if (AjaxQueue.inQueue(req)) {
      this._retrying = false;
    } else {
      AjaxQueue.addToQueue(req);
    }
    return this.retryNext();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  serverAlreadySaw(req: any) {
    if (this.inQueue(req)) {
      this.removeFromQueue(req);
      return this.retryNext();
    }
  }

  retryNext() {
    if (this._stopped) {
      return true;
    }
    if (!this.hasQueue()) {
      this.hideRetrying();
      return true;
    }
    this.showRetrying();
    if (this._retrying) {
      return true;
    }
    this._retrying = true;
    const req = this._queue[0];
    if (this._nTriesLeft > 0) {
      req.headers = {
        ...req.headers,
        'X-Trello-ReqId': this.uniqueReqId(),
      };
      if (methodOf(req) !== 'GET' && !!req.data?.dsc) {
        const csrfPayload = getCsrfRequestPayload();
        req.data.dsc = csrfPayload.dsc;
      }
      setTimeout(() => ajax(req), this._msBackoff);
      this._msBackoff *= 2;
      --this._nTriesLeft;
      return true;
    } else {
      this._stopped = true;
      this.showOutOfRetries();

      // We're out of retries. Return false here so the original error callback gets invoked
      return false;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  showError(msg: any) {
    showFlag({
      id: 'AjaxQueueFail',
      title: msg,
      appearance: 'error',
      actions: [
        {
          content: l('alerts.reload page'),
          onClick: () => window.location.reload(),
          type: 'button',
        },
      ],
      isUndismissable: true,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  showRealError(xhr: any, textStatus: any, err: any) {
    this.hideRetrying();
    this.showError(l('alerts.changes not saved'));
  }

  showOutOfRetries() {
    this.hideRetrying();
    this.showError(l('alerts.timed out'));
  }

  showRetrying() {
    return Alerts.show('retrying', 'error', 'AjaxQueueRetry');
  }

  hideRetrying() {
    return Alerts.hide('AjaxQueueRetry');
  }

  showSending() {
    return Alerts.show('sending', 'warning', 'AjaxQueueSending');
  }

  hideSending() {
    return Alerts.hide('AjaxQueueSending');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  showUploading(numOfFiles: any, fileIdx: any, percent: any) {
    const moreThanOneFile = numOfFiles > 1;
    showFlag({
      id: 'AjaxQueueUpload',
      title: l(
        moreThanOneFile
          ? 'alerts.uploading files number of file numbers'
          : 'alerts.uploading files',
        {
          fileIdx,
          numOfFiles,
          percent,
        },
      ),
      appearance: 'info',
      isAutoDismiss: false,
      description: moreThanOneFile ? null : <UploadAttachmentContent />,
    });
  }

  hideUploading() {
    return dismissFlag({ id: 'AjaxQueueUpload' });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ajax(reqIn: any) {
    const req = _.clone(reqIn);
    if (this._stopped) {
      return;
    }

    if (/^put$/i.test(req.type)) {
      // TRELP-2192: match server timeout for large put requests
      if (req.timeout == null) {
        req.timeout = 120000;
      }
    } else {
      if (req.timeout == null) {
        req.timeout = 32000;
      }
    }

    if (req.showSendingAfter == null) {
      req.showSendingAfter = 3000;
    }
    req.queueId = this._queueIdSeq++;
    if (req.headers == null) {
      req.headers = {};
    }
    req.headers['X-Trello-ReqId'] = this.uniqueReqId();

    req.oldSuccess = req.success;
    req.oldError = req.error;
    req.ourComplete = req.complete;
    delete req.complete;

    const { modelCache } = req;
    delete req.modelCache;

    const retry = req.retry != null ? req.retry : true;
    delete req.retry;

    let completed = false;
    let isUpload = false;

    const lockIndex =
      modelCache != null ? modelCache.lock('AjaxQueue.ajax') : undefined;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req.success = function (...args: any[]) {
      AjaxQueue.hideSending();
      AjaxQueue.hideUploading();
      completed = true;
      AjaxQueue.success(this);
      if (typeof this.oldSuccess === 'function') {
        this.oldSuccess(...Array.from(args || []));
      }
      if (typeof this.ourComplete === 'function') {
        this.ourComplete();
      }
      return modelCache != null ? modelCache.unlock(lockIndex) : undefined;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req.error = function (...args: any[]) {
      AjaxQueue.hideSending();
      AjaxQueue.hideUploading();
      completed = true;
      const [xhr] = Array.from(args);
      if (retry && [0, 408, 500].includes(xhr.status)) {
        // For the moment, treat 412 just the same as other errors
        //else if xhr.status in [412]
        //  # We already sent this reqId, response must have been lost or server crashed
        //  AjaxQueue.serverAlreadySaw(@)
        //  @oldError?(args...)

        // Don't invoke the original error callback until we're all out of retries
        const hasRetriesRemaining = AjaxQueue.retryableError(this);
        if (hasRetriesRemaining) {
          return;
        }
      }

      const defaultErrorHandler = function () {
        AjaxQueue._stopped = true;
        return AjaxQueue.showRealError(...Array.from(args || []));
      };

      if (_.isFunction(this.oldError)) {
        this.oldError(...Array.from(args), defaultErrorHandler);
      } else {
        defaultErrorHandler();
      }

      if (typeof this.ourComplete === 'function') {
        this.ourComplete();
      }
      return modelCache != null ? modelCache.unlock(lockIndex) : undefined;
    };

    if (/^post$/i.test(req.type)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const isLongUpload = (evt: any) =>
        evt.lengthComputable && evt.total > 64 * 1024;

      req.xhr = () => {
        const xhr = new XMLHttpRequest();
        const { upload } = xhr;
        if (upload != null) {
          const id = `AjaxQueueProcess-${req.headers['X-Trello-ReqId']}`;
          // Periodically delivered to indicate the amount of progress made so far
          upload.addEventListener('progress', (evt) => {
            if (!isLongUpload(evt)) {
              return;
            }
            isUpload = true;
            const attachmentName = req.data.get('file')?.name;
            const numOfFiles = req.data.get('numOfFiles');
            const fileIdx = req.data.get('fileIdx');

            const percentString =
              Math.round((100 * evt.loaded) / evt.total).toString() + '%';

            setUploadsFlagState({
              label: l('alerts.uploading', {
                percentString,
                attachmentName,
              }),
              id,
              uploadComplete: false,
            });

            this.showUploading(numOfFiles, fileIdx, percentString);
          });

          // The upload completed successfully
          upload.addEventListener('load', (evt) => {
            if (!isUpload) {
              return;
            }
            const attachmentName = req.data.get('file')?.name;

            setUploadsFlagState({
              label: l('alerts.filename finished uploading', {
                attachmentName,
              }),
              id,
              uploadComplete: true,
            });
          });
          if (UploadAttachmentState.value.allUploadsComplete) {
            dismissFlag({ id: 'AjaxQueueUpload' });
          }
        }

        return xhr;
      };
    }

    if (this.hasQueue()) {
      // We currently have a request in retry, so add this to the queue
      AjaxQueue.addToQueue(req);
    } else {
      // Nothing in the queue, so allow the parallel request
      if (req.showSendingAfter >= 0) {
        setTimeout(() => {
          if (!completed && !isUpload) {
            return AjaxQueue.showSending();
          }
        }, req.showSendingAfter);
      }
      this.send(req);
    }
  }

  send(req: object) {
    return ajax(req);
  }
})());
