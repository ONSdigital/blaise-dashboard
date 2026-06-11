import React, { Component, ReactNode } from "react";
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
    }

    async componentDidMount(): Promise<void> {
        await this.loadStatus();
    }

    async loadStatus(): Promise<void> {
        this.setState({ statusList: [], loading: true, listError: "" });

        try {
            const statusList = await getBlaiseStatus();
            if (!Array.isArray(statusList)) {
                throw new Error("Blaise status response is not a list");
            }

            if (statusList.length === 0) {
                this.setState({ statusList: [], loading: false, listError: "No connection details found." });
                return;
            }

            this.setState({ statusList, loading: false, listError: "" });
        } catch {
            this.setState({ statusList: [], loading: false, listError: "Unable to get Blaise status" });
        }
    }

    renderStatusRows(): ReactNode[] {
        return this.state.statusList.map((item: BlaiseStatus) => (
            <tr key={item["health check type"]}>
                <td>{item["health check type"]}</td>
                <td>
                    <span
                        className={`ons-status ons-status--${item.status.toUpperCase() === "OK" ? "success" : "error"}`}
                        data-testid={`blaise-status-${item["health check type"].replace(/\s+/g, "-").toLowerCase()}`}
                    >
                        {item.status}
                    </span>
                </td>
            </tr>
        ));
    }

    render(): ReactNode {
        if (this.state.loading) {
            return <LoadingPanel message={"Loading Blaise status."} />;
        }

        if (this.state.listError !== "") {
            return <Panel>{this.state.listError}</Panel>;
        }

        return <Table columns={["Health check type", "Status"]}>{this.renderStatusRows()}</Table>;
    }
}