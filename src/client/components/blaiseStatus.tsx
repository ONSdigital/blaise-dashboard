import { Component, ReactNode } from "react";
import { LoadingPanel, Panel, Table } from "blaise-design-system-react-components";
import { BlaiseStatus, getBlaiseStatus } from "../api/blaiseStatus";

interface State {
    statusList: BlaiseStatus[];
    loading: boolean;
    listError: string;
}

export default class BlaiseStatusPanel extends Component<Record<string, never>, State> {
    constructor(props: Record<string, never>) {
        super(props);
        this.state = {
            statusList: [],
            loading: true,
            listError: ""
        };

        this.loadStatus = this.loadStatus.bind(this);
    }

    componentDidMount(): void {
        void this.loadStatus();
    }

    async loadStatus(): Promise<void> {
        this.setState({ statusList: [], loading: true, listError: "" });

        try {
            const statusList = await getBlaiseStatus();
            if (!Array.isArray(statusList)) {
                throw new Error("Blaise status response is not a list");
            }

            const validStatusList = statusList.filter((item): item is BlaiseStatus =>
                typeof item === "object" && item !== null
            );

            if (validStatusList.length === 0) {
                this.setState({ statusList: [], loading: false, listError: "No connection details found." });
                return;
            }

            this.setState({ statusList: validStatusList, loading: false, listError: "" });
        } catch {
            this.setState({ statusList: [], loading: false, listError: "Unable to get Blaise status" });
        }
    }

    getHealthCheckType(item: unknown): string {
        if (typeof item !== "object" || item === null) {
            return "Unknown health check";
        }

        const typedItem = item as BlaiseStatus;

        if (typeof typedItem["health check type"] === "string" && typedItem["health check type"].trim().length > 0) {
            return typedItem["health check type"];
        }

        if (typeof typedItem.healthCheckType === "string" && typedItem.healthCheckType.trim().length > 0) {
            return typedItem.healthCheckType;
        }

        return "Unknown health check";
    }

    getStatusValue(item: unknown): string {
        if (typeof item !== "object" || item === null) {
            return "Unknown";
        }

        const typedItem = item as BlaiseStatus;

        if (typeof typedItem.status === "string" && typedItem.status.trim().length > 0) {
            return typedItem.status;
        }

        return "Unknown";
    }

    toStatusTestId(healthCheckType: string, index: number): string {
        const normalized = String(healthCheckType)
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");

        if (normalized.length > 0) {
            return `blaise-status-${normalized}`;
        }

        return `blaise-status-unknown-health-check-${index}`;
    }

    renderStatusRows(): ReactNode[] {
        return this.state.statusList.map((item: BlaiseStatus, index: number) => {
            const healthCheckType = this.getHealthCheckType(item);
            const status = this.getStatusValue(item);

            return (
            <tr className="ons-table__row" key={`${healthCheckType}-${index}`}>
                <td className="ons-table__cell">{healthCheckType}</td>
                <td className="ons-table__cell">
                    <span
                        className={`ons-status ons-status--${status.toUpperCase() === "OK" ? "success" : "error"}`}
                        data-testid={this.toStatusTestId(healthCheckType, index)}
                    >
                        {status}
                    </span>
                </td>
            </tr>
            );
        });
    }

    render(): ReactNode {
        if (this.state.loading) {
            return <LoadingPanel message={"Loading Blaise status."} />;
        }

        if (this.state.listError !== "") {
            return <Panel data-testid="blaise-status-info-panel">{this.state.listError}</Panel>;
        }

        return <Table columns={["Health check type", "Status"]}>{this.renderStatusRows()}</Table>;
    }
}