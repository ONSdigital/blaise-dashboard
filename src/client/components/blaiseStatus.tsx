import { ReactElement } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  LoadingPanel,
  Panel,
  Table,
} from "blaise-design-system-react-components";
import { BlaiseStatus, getBlaiseStatus } from "../api/blaiseStatus";

function getHealthCheckType(item: BlaiseStatus): string {
  const typedItem = item;

  if (
    typeof typedItem["health check type"] === "string" &&
    typedItem["health check type"].trim().length > 0
  ) {
    return typedItem["health check type"];
  }

  if (
    typeof typedItem.healthCheckType === "string" &&
    typedItem.healthCheckType.trim().length > 0
  ) {
    return typedItem.healthCheckType;
  }

  return "Unknown health check";
}

function getStatusValue(item: unknown): string {
  const typedItem = item as BlaiseStatus;

  if (
    typeof typedItem.status === "string" &&
    typedItem.status.trim().length > 0
  ) {
    return typedItem.status;
  }

  return "Unknown";
}

function toStatusTestId(healthCheckType: string, index: number): string {
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

export default function BlaiseStatusPanel(): ReactElement {
  const statusQuery = useQuery<BlaiseStatus[]>({
    queryKey: ["blaise-status"],
    queryFn: async () => {
      const statusList = await getBlaiseStatus();
      if (!Array.isArray(statusList)) {
        throw new Error("Blaise status response is not a list");
      }

      return statusList.filter(
        (item): item is BlaiseStatus =>
          typeof item === "object" && item !== null,
      );
    },
    staleTime: 30 * 1000,
  });

  const statusList = statusQuery.data ?? [];

  if (statusQuery.isLoading) {
    return <LoadingPanel message={"Loading Blaise status."} />;
  }

  if (statusQuery.isError) {
    return (
      <Panel data-testid="blaise-status-info-panel">
        Unable to get Blaise status
      </Panel>
    );
  }

  if (statusList.length === 0) {
    return (
      <Panel data-testid="blaise-status-info-panel">
        No connection details found.
      </Panel>
    );
  }

  return (
    <Table columns={["Health check type", "Status"]}>
      {statusList.map((item, index) => {
        const healthCheckType = getHealthCheckType(item);
        const status = getStatusValue(item);

        return (
          <tr className="ons-table__row" key={`${healthCheckType}-${index}`}>
            <td className="ons-table__cell">{healthCheckType}</td>
            <td className="ons-table__cell">
              <span
                className={`ons-status ons-status--${status.toUpperCase() === "OK" ? "success" : "error"}`}
                data-testid={toStatusTestId(healthCheckType, index)}
              >
                {status}
              </span>
            </td>
          </tr>
        );
      })}
    </Table>
  );
}
