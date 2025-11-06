// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
class SubviewRemover {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scheduled: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  viewsToBeRemoved: any;
  constructor() {
    this.viewsToBeRemoved = [];
    this.scheduled = null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  enqueue(subviews: any) {
    for (const view of Array.from(subviews)) {
      // @ts-expect-error TS(2571): Object is of type 'unknown'.
      view.$el.detach();
      this.viewsToBeRemoved.push(view);
    }
    if (this.scheduled === null) {
      return (this.scheduled = setInterval(this.processQueue.bind(this), 10));
    }
  }

  processQueue() {
    const startTime = Date.now();
    while (Date.now() - startTime < 10 && this.viewsToBeRemoved.length > 0) {
      const view = this.viewsToBeRemoved.shift();
      view.remove();
    }
    if (this.viewsToBeRemoved.length === 0) {
      clearInterval(this.scheduled);
      return (this.scheduled = null);
    }
  }
}

const subviewRemover = new SubviewRemover();
export { subviewRemover as SubviewRemover };
