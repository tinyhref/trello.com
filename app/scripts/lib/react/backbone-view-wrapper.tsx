import type { MouseEventHandler, RefObject } from 'react';
import { Component, createRef } from 'react';
import _ from 'underscore';

interface BackboneView {
  render: () => { el: HTMLElement };
}

interface ReactWrapperProps {
  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
  view: BackboneView;
}

export class ReactWrapper extends Component<ReactWrapperProps> {
  nodeRef: RefObject<HTMLDivElement>;
  constructor(props: ReactWrapperProps) {
    super(props);
    this.nodeRef = createRef();
  }

  componentDidMount() {
    const node = this.nodeRef.current;

    const { el } = this.props.view.render();

    node?.append(el);
  }

  render() {
    let passedProps;
    if (this.props.onClick) {
      passedProps = _.assign(_.pick(this.props, ['className']), {
        onClick: this.props.onClick,
      });
    } else {
      passedProps = _.pick(this.props, ['className']);
    }

    return <div ref={this.nodeRef} {...passedProps} />;
  }
}
