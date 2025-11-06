import * as styles from './RequestAccessBackground.module.less';

// eslint-disable-next-line @trello/assets-alongside-implementation
import backgroundLeftSvg from 'resources/images/request-access/background-left.svg';
// eslint-disable-next-line @trello/assets-alongside-implementation
import backgroundRightSvg from 'resources/images/request-access/background-right.svg';

export const RequestAccessBackground = () => (
  <div className={styles.background}>
    <img alt="" className={styles.left} src={backgroundLeftSvg} />
    <img alt="" className={styles.right} src={backgroundRightSvg} />
  </div>
);
