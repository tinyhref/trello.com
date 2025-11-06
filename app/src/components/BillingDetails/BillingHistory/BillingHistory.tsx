import type {
  FunctionComponent,
  MouseEvent as ReactMouseEvent,
  ReactNode,
} from 'react';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import ChevronLeftIcon from '@atlaskit/icon/core/chevron-left';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import ChevronUpIcon from '@atlaskit/icon/core/chevron-up';
import { numericDateFormatter } from '@trello/dates/i18n';
import { asMoney } from '@trello/legacy-i18n/formatters';
import { Button } from '@trello/nachos/button';
import type { BillingIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { useTeamBillingStatementsQuery } from './TeamBillingStatementsQuery.generated';

import * as styles from './BillingHistory.module.less';

interface PaginatorProps {
  collapsed: boolean;
  handleChangePage: (start: number, end: number) => void;
  start: number;
  end: number;
  normalizedStatements: StatementProps[];
  handleShowAll: (e: ReactMouseEvent<HTMLElement>) => void;
  handleCollapse: (e: ReactMouseEvent<HTMLElement>) => void;
}

const Paginator: FunctionComponent<PaginatorProps> = ({
  collapsed,
  handleChangePage,
  start,
  end,
  normalizedStatements,
  handleShowAll,
  handleCollapse,
}) => {
  if (collapsed) {
    return (
      <div className={styles.pagination}>
        <Button
          onClick={(e: ReactMouseEvent<HTMLElement>) =>
            handleChangePage(start - 10, start)
          }
          isDisabled={start <= 0}
        >
          <ChevronLeftIcon label="Previous" size="small" />
        </Button>
        <p>{Math.ceil(end / 10)}</p>
        <Button
          onClick={(e: ReactMouseEvent<HTMLElement>) =>
            handleChangePage(end, end + 10)
          }
          isDisabled={end >= normalizedStatements.length}
        >
          <ChevronRightIcon label="Next" size="small" />
        </Button>

        <Button onClick={handleShowAll} className={styles.showAll}>
          <FormattedMessage
            id="templates.billing_statement.show-all"
            defaultMessage="Show all"
            description="Show all button"
          />
          <ChevronDownIcon label="" size="small" />
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={handleCollapse} className={styles.showAll}>
      <FormattedMessage
        id="templates.billing_statement.collapse"
        defaultMessage="Collapse"
        description="Collapse button"
      />
      <ChevronUpIcon label="" size="small" />
    </Button>
  );
};

type StatementType = 'bill' | 'credit' | 'payment' | 'refund' | 'unknown';

interface StatementProps {
  date: string;
  timestamp: number;
  token: string;
  type: StatementType;
  isReceipt: boolean;
  secureUrl?: string | null;
  amount: string;
  description: ReactNode;
}

export const Statement: FunctionComponent<StatementProps> = ({
  date,
  type,
  description,
  isReceipt,
  amount,
  secureUrl,
}) => (
  <tr
    data-testid={getTestId<BillingIds>('billing-history-statement')}
    className={styles.statement}
  >
    <td>
      <p>
        <strong>{date}</strong>
      </p>
    </td>
    <td className={styles.description}>
      <p>{description}</p>
    </td>
    <td className={styles.amount}>
      <p>
        {type === 'payment' && (
          <FormattedMessage
            id="templates.billing_statement.paid-credit"
            defaultMessage="Paid: ${credit}"
            description="Paid amount"
            values={{ credit: amount }}
          />
        )}
        {type === 'credit' && (
          <FormattedMessage
            id="templates.billing_statement.credited-return"
            defaultMessage="Credited: ${return}"
            description="Credited amount"
            values={{ return: amount }}
          />
        )}
        {type === 'refund' && (
          <FormattedMessage
            id="templates.billing_statement.refunded-refund"
            defaultMessage="Refunded: ${refund}"
            description="Refunded amount"
            values={{ refund: amount }}
          />
        )}
        {type === 'bill' && (
          <FormattedMessage
            id="templates.billing_statement.billed-debit"
            defaultMessage="Billed: ${debit}"
            description="Billed amount"
            values={{ debit: amount }}
          />
        )}
        {secureUrl && (
          <>
            <br />
            <a href={secureUrl} target="_blank">
              {isReceipt ? (
                <FormattedMessage
                  id="templates.billing_statement.receipt"
                  defaultMessage="Receipt"
                  description="Receipt"
                />
              ) : (
                <FormattedMessage
                  id="templates.billing_statement.invoice"
                  defaultMessage="Invoice"
                  description="Invoice"
                />
              )}
            </a>
          </>
        )}
      </p>
    </td>
  </tr>
);

interface RawStatement {
  date: string;
  amount: number;
  item: string;
  statementToken: string;
  translationKey?: string | null;
}

/**
 * This is a little weird in that we're using translationKeys
 * provided by the API as enums to determine what type of statement
 * we're dealing with. For the most part, we don't care, it's only
 * credits, refunds and free trials that we make special exceptions
 * for as we change the label in the component next to the amount.
 */
const isFreeTrial = (statement: RawStatement): boolean =>
  statement.amount === 0 &&
  statement.translationKey === 'per_user_line_item_free_trial';

export const getStatementType = (statement: RawStatement): StatementType => {
  if (statement.translationKey === 'credit') {
    return 'credit';
  } else if (statement.translationKey === 'settle_refund') {
    return 'refund';
  } else if (statement.amount > 0) {
    return 'payment';
  } else if (statement.amount < 0 || isFreeTrial(statement)) {
    return 'bill';
  }
  return 'unknown';
};

const getSecureStatementUrl = (
  accountId: string,
  type: 'bc' | 'standard',
  statement: RawStatement,
) => {
  if (!statement.statementToken) {
    return null;
  }
  return `/1/organizations/${accountId}/statement/${statement.statementToken}`;
};

/**
 * Takes the raw API response from /statement and converts them into localized
 * props for the Statement component.
 *
 * 1) Map the properties to component props:
 *    - Infer the statement type.
 *    - Localize/format the date and amount
 * 2) Filter out $0 statements, unless they are notices of starting a free trial
 * 3) Sort the statements so they are ordered by date descending
 */
export const normalizeStatements = (
  accountId: string,
  type: 'bc' | 'standard',
  statements: RawStatement[],
): StatementProps[] =>
  statements
    .map((statement: RawStatement) => ({
      token: statement.statementToken,
      timestamp: Date.parse(statement.date),
      date: numericDateFormatter.format(new Date(statement.date)),
      secureUrl: getSecureStatementUrl(accountId, type, statement),
      description: statement.item,
      type: getStatementType(statement),
      amount: asMoney(Math.abs(statement.amount)),
      isReceipt: statement.amount > 0,
    }))
    .filter((statement: StatementProps) => statement.type !== 'unknown')
    .sort((a, b) => b.timestamp - a.timestamp);

interface BillingHistoryProps {
  type: 'bc' | 'standard';
  accountId: string;
}

export const BillingHistory: FunctionComponent<BillingHistoryProps> = ({
  accountId,
  type,
}) => {
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(10);
  const [collapsed, setCollapsed] = useState(true);
  const [shownStatements, setShownStatements] = useState<StatementProps[]>([]);

  const { data: teamData } = useTeamBillingStatementsQuery({
    variables: {
      orgId: accountId,
    },
    waitOn: ['None'],
  });

  const statements = teamData?.organizationStatements ?? [];
  const normalizedStatements = normalizeStatements(accountId, type, statements);

  const handleChangePage = (nextStart: number, nextEnd: number) => {
    const page = normalizedStatements.slice(nextStart, nextEnd);
    setShownStatements(page);
    setStart(nextStart);
    setEnd(nextEnd);
  };

  const handleShowAll = (e: ReactMouseEvent<HTMLElement>) => {
    setShownStatements(normalizedStatements);
    setCollapsed(false);
  };

  const handleCollapse = (e: ReactMouseEvent<HTMLElement>) => {
    handleChangePage(0, 10);
    setCollapsed(true);
  };

  if (normalizedStatements.length > 0 && shownStatements.length === 0) {
    handleChangePage(0, 10);
  }

  return (
    <>
      <table className={styles.billingHistoryTable}>
        <thead>
          <tr>
            <th>
              <FormattedMessage
                id="templates.billing_statement.billing-date"
                defaultMessage="Billing date"
                description="Billing date column header"
              />
            </th>
            <th>
              <FormattedMessage
                id="templates.billing_statement.billing-description"
                defaultMessage="Description"
                description="Description column header"
              />
            </th>
            <th>
              <FormattedMessage
                id="templates.billing_statement.billing-amount"
                defaultMessage="Amount"
                description="Amount column header"
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {shownStatements.map((statement) => (
            <Statement key={statement.token} {...statement} />
          ))}
        </tbody>
      </table>
      {normalizedStatements.length > 10 && (
        <Paginator
          collapsed={collapsed}
          handleChangePage={handleChangePage}
          start={start}
          end={end}
          normalizedStatements={normalizedStatements}
          handleShowAll={handleShowAll}
          handleCollapse={handleCollapse}
        />
      )}
    </>
  );
};
