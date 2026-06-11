import { Component, ReactElement } from "react";
import { LoadingPanel, Panel, Table } from "blaise-design-system-react-components";
import { ErrorLogScope, GcpErrorLog, getErrorLogs } from "../api/errorLogs";

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
    timeZone: "UTC"
});

type ErrorLogsTableState = {
    loading: boolean;
    logs: GcpErrorLog[];
    errored: boolean;
    errorMessage: string;
    currentPage: number;
    rowsPerPage: number;
};

export default class ErrorLogsTable extends Component<ErrorLogsTableProps, ErrorLogsTableState> {
    constructor(props: ErrorLogsTableProps) {
        super(props);
        this.state = {
            loading: true,
            logs: [],
            errored: false,
            errorMessage: "",
            currentPage: 1,
            rowsPerPage: DEFAULT_LOG_ROWS_PER_PAGE
        };

        this.firstPage = this.firstPage.bind(this);
        this.lastPage = this.lastPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.setRowsPerPage = this.setRowsPerPage.bind(this);
        this.previousPage = this.previousPage.bind(this);
        this.loadLogs = this.loadLogs.bind(this);
    }

    componentDidMount(): void {
        void this.loadLogs();
    }

    async loadLogs(): Promise<void> {
        try {
            const logs = await getErrorLogs(this.props.scope);
            this.setState({ loading: false, logs, errored: false, errorMessage: "", currentPage: 1 });
        } catch (reason: unknown) {
            let errorMessage = `Unable to get ${this.props.scope} GCP error logs.`;

            if (typeof reason === "object" && reason !== null && "response" in reason) {
                const response = (reason as { response?: { data?: unknown } }).response;
                if (typeof response?.data === "string" && response.data.trim().length > 0) {
                    errorMessage = response.data;
                }
            }

            this.setState({ loading: false, logs: [], errored: true, errorMessage, currentPage: 1 });
        }
    }

    getTotalPages(): number {
        return Math.max(1, Math.ceil(this.state.logs.length / this.state.rowsPerPage));
    }

    firstPage(): void {
        this.setState({ currentPage: 1 });
    }

    lastPage(): void {
        this.setState({ currentPage: this.getTotalPages() });
    }

    nextPage(): void {
        this.setState((previousState) => ({
            currentPage: Math.min(previousState.currentPage + 1, this.getTotalPages())
        }));
    }

    previousPage(): void {
        this.setState((previousState) => ({
            currentPage: Math.max(previousState.currentPage - 1, 1)
        }));
    }

    setRowsPerPage(rowsPerPage: number): void {
        this.setState({ currentPage: 1, rowsPerPage });
    }

    getVisibleLogs(): GcpErrorLog[] {
        const startIndex = (this.state.currentPage - 1) * this.state.rowsPerPage;
        const endIndex = startIndex + this.state.rowsPerPage;
        return this.state.logs.slice(startIndex, endIndex);
    }

    formatTimestamp(timestamp: string): string {
        const parsed = new Date(timestamp);
        if (Number.isNaN(parsed.getTime())) {
            return timestamp;
        }

        return TIMESTAMP_FORMATTER.format(parsed).replace(",", "");
    }

    renderRows(): ReactElement[] {
        return this.getVisibleLogs().map((entry, index) => (
            <tr className="ons-table__row" data-testid="error-log-row" key={`${entry.timestamp}-${index}`}>
                <td className="ons-table__cell">{this.formatTimestamp(entry.timestamp)}</td>
                <td className="ons-table__cell">{entry.log}</td>
            </tr>
        ));
    }

    renderPagination(): ReactElement | undefined {
        const totalPages = this.getTotalPages();

        return (
            <div className="ons-u-mt-s" data-testid="error-logs-pagination">
                <span className="ons-u-mr-s">Rows:</span>
                {LOG_ROWS_PER_PAGE_OPTIONS.map((option, index) => (
                    <span className="ons-u-mr-s" key={option}>
                        <button
                            className="ons-u-fs-s"
                            data-testid={`error-logs-rows-per-page-option-${option}`}
                            disabled={this.state.rowsPerPage === option}
                            onClick={() => this.setRowsPerPage(option)}
                            style={{
                                background: "none",
                                border: "none",
                                color: "#005ea5",
                                cursor: this.state.rowsPerPage === option ? "default" : "pointer",
                                padding: 0,
                                textDecoration: this.state.rowsPerPage === option ? "none" : "underline"
                            }}
                            type="button"
                        >
                            {option}
                        </button>
                        {index < LOG_ROWS_PER_PAGE_OPTIONS.length - 1 ? <span className="ons-u-ml-xs">|</span> : undefined}
                    </span>
                ))}
                <button
                    className="ons-btn ons-btn--secondary"
                    data-testid="error-logs-first"
                    disabled={this.state.currentPage === 1}
                    onClick={this.firstPage}
                    type="button"
                >
                    First
                </button>
                <button
                    className="ons-btn ons-btn--secondary"
                    data-testid="error-logs-prev"
                    disabled={this.state.currentPage === 1}
                    onClick={this.previousPage}
                    type="button"
                >
                    Previous
                </button>
                <span className="ons-u-ml-s ons-u-mr-s" data-testid="error-logs-page-indicator">
                    Page {this.state.currentPage} of {totalPages}
                </span>
                <button
                    className="ons-btn ons-btn--secondary"
                    data-testid="error-logs-next"
                    disabled={this.state.currentPage === totalPages}
                    onClick={this.nextPage}
                    type="button"
                >
                    Next
                </button>
                <button
                    className="ons-btn ons-btn--secondary"
                    data-testid="error-logs-last"
                    disabled={this.state.currentPage === totalPages}
                    onClick={this.lastPage}
                    type="button"
                >
                    Last
                </button>
            </div>
        );
    }

    render(): ReactElement {
        const scopeLabel = this.props.scope === "blaise"
            ? "Blaise"
            : this.props.scope === "bts"
                ? "BTS"
            : this.props.scope === "restapi"
                ? "REST API"
            : this.props.scope === "nisra"
                ? "NISRA"
                : "non-Blaise";

        if (this.state.loading) {
            return <LoadingPanel message={`Getting last 24 hours of ${scopeLabel} GCP error logs.`} />;
        }

        if (this.state.errored) {
            return <Panel status="error">{this.state.errorMessage}</Panel>;
        }

        if (this.state.logs.length === 0) {
            return <Panel>No {scopeLabel} error logs found in the last 24 hours.</Panel>;
        }

        return (
            <>
                <Table columns={["Timestamp", "Log"]} id={`${this.props.scope}-gcp-error-logs-table`}>
                    <>{this.renderRows()}</>
                </Table>
                {this.renderPagination()}
            </>
        );
    }
}