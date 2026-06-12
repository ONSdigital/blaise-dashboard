import { ReactElement, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  LoadingPanel,
  Panel,
  Table,
} from "blaise-design-system-react-components";
import { ErrorLogScope, GcpErrorLog, getErrorLogs } from "../api/errorLogs";
import { extractResponseErrorMessage } from "../api/errorMessage";

type ErrorLogsTableProps = {
  scope: ErrorLogScope;
};

const DEFAULT_LOG_ROWS_PER_PAGE = 20;
const LOG_ROWS_PER_PAGE_OPTIONS = [20, 50, 100];
const TIMESTAMP_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
  timeZone: "UTC",
});

function formatTimestamp(timestamp: string): string {
  const parsed = new Date(timestamp);
  if (Number.isNaN(parsed.getTime())) {
    return timestamp;
  }

  return TIMESTAMP_FORMATTER.format(parsed).replace(",", "");
}

function getScopeLabel(scope: ErrorLogScope): string {
  if (scope === "blaise") {
    return "Blaise";
  }
  if (scope === "bts") {
    return "BTS";
  }
  if (scope === "restapi") {
    return "REST API";
  }
  if (scope === "nisra") {
    return "NISRA";
  }
  return "non-Blaise";
}

export default function ErrorLogsTable({
  scope,
}: ErrorLogsTableProps): ReactElement {
  const [paginationState, setPaginationState] = useState({
    currentPage: 1,
    rowsPerPage: DEFAULT_LOG_ROWS_PER_PAGE,
    scope,
  });

  const logsQuery = useQuery<GcpErrorLog[]>({
    queryKey: ["error-logs", scope],
    queryFn: () => getErrorLogs(scope),
    staleTime: 30 * 1000,
  });

  const logs = useMemo(() => logsQuery.data ?? [], [logsQuery.data]);
  const rowsPerPage = paginationState.rowsPerPage;
  const totalPages = Math.max(1, Math.ceil(logs.length / rowsPerPage));
  const rawCurrentPage =
    paginationState.scope === scope ? paginationState.currentPage : 1;
  const currentPage = Math.min(rawCurrentPage, totalPages);

  const visibleLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return logs.slice(startIndex, endIndex);
  }, [currentPage, logs, rowsPerPage]);

  function firstPage(): void {
    setPaginationState((previousState) => ({
      ...previousState,
      scope,
      currentPage: 1,
    }));
  }

  function lastPage(): void {
    setPaginationState((previousState) => ({
      ...previousState,
      scope,
      currentPage: totalPages,
    }));
  }

  function nextPage(): void {
    setPaginationState((previousState) => ({
      ...previousState,
      scope,
      currentPage: Math.min(currentPage + 1, totalPages),
    }));
  }

  function previousPage(): void {
    setPaginationState((previousState) => ({
      ...previousState,
      scope,
      currentPage: Math.max(currentPage - 1, 1),
    }));
  }

  function updateRowsPerPage(nextRowsPerPage: number): void {
    setPaginationState((previousState) => ({
      ...previousState,
      scope,
      rowsPerPage: nextRowsPerPage,
      currentPage: 1,
    }));
  }

  function renderRows(): ReactElement[] {
    return visibleLogs.map((entry, index) => (
      <tr
        className="ons-table__row"
        data-testid="error-log-row"
        key={`${entry.timestamp}-${index}`}
      >
        <td className="ons-table__cell">{formatTimestamp(entry.timestamp)}</td>
        <td className="ons-table__cell">{entry.log}</td>
      </tr>
    ));
  }

  function renderPagination(): ReactElement {
    return (
      <div className="ons-u-mt-s" data-testid="error-logs-pagination">
        <span className="ons-u-mr-s">Rows:</span>
        {LOG_ROWS_PER_PAGE_OPTIONS.map((option, index) => (
          <span className="ons-u-mr-s" key={option}>
            <button
              className="ons-u-fs-s"
              data-testid={`error-logs-rows-per-page-option-${option}`}
              disabled={rowsPerPage === option}
              onClick={() => updateRowsPerPage(option)}
              style={{
                background: "none",
                border: "none",
                color: "#005ea5",
                cursor: rowsPerPage === option ? "default" : "pointer",
                padding: 0,
                textDecoration: rowsPerPage === option ? "none" : "underline",
              }}
              type="button"
            >
              {option}
            </button>
            {index < LOG_ROWS_PER_PAGE_OPTIONS.length - 1 ? (
              <span className="ons-u-ml-xs">|</span>
            ) : undefined}
          </span>
        ))}
        <button
          className="ons-btn ons-btn--secondary"
          data-testid="error-logs-first"
          disabled={currentPage === 1}
          onClick={firstPage}
          type="button"
        >
          First
        </button>
        <button
          className="ons-btn ons-btn--secondary"
          data-testid="error-logs-prev"
          disabled={currentPage === 1}
          onClick={previousPage}
          type="button"
        >
          Previous
        </button>
        <span
          className="ons-u-ml-s ons-u-mr-s"
          data-testid="error-logs-page-indicator"
        >
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="ons-btn ons-btn--secondary"
          data-testid="error-logs-next"
          disabled={currentPage === totalPages}
          onClick={nextPage}
          type="button"
        >
          Next
        </button>
        <button
          className="ons-btn ons-btn--secondary"
          data-testid="error-logs-last"
          disabled={currentPage === totalPages}
          onClick={lastPage}
          type="button"
        >
          Last
        </button>
      </div>
    );
  }

  const scopeLabel = getScopeLabel(scope);

  if (logsQuery.isLoading) {
    return (
      <LoadingPanel
        message={`Getting last 24 hours of ${scopeLabel} GCP error logs.`}
      />
    );
  }

  if (logsQuery.isError) {
    const errorMessage = extractResponseErrorMessage(
      logsQuery.error,
      `Unable to get ${scope} GCP error logs.`,
    );
    return <Panel status="error">{errorMessage}</Panel>;
  }

  if (logs.length === 0) {
    return (
      <Panel>No {scopeLabel} error logs found in the last 24 hours.</Panel>
    );
  }

  return (
    <>
      <Table
        columns={["Timestamp", "Log"]}
        id={`${scope}-gcp-error-logs-table`}
      >
        <>{renderRows()}</>
      </Table>
      {renderPagination()}
    </>
  );
}
