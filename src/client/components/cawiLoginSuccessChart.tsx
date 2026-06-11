import { Component, ReactElement } from "react";
import { LoadingPanel, Panel } from "blaise-design-system-react-components";
import { CawiLoginCount, getCawiLoginSuccessCounts } from "../api/cawiLoginCounts";

type CawiLoginSuccessChartState = {
    loading: boolean;
    data: CawiLoginCount[];
    errorMessage: string;
};

const CHART_WIDTH = 900;
const CHART_HEIGHT = 260;
const PADDING = { top: 20, right: 20, bottom: 40, left: 50 };

export default class CawiLoginSuccessChart extends Component<Record<string, never>, CawiLoginSuccessChartState> {
    constructor(props: Record<string, never>) {
        super(props);
        this.state = {
            loading: true,
            data: [],
            errorMessage: ""
        };

        this.loadData = this.loadData.bind(this);
    }

    componentDidMount(): void {
        void this.loadData();
    }

    async loadData(): Promise<void> {
        try {
            const data = await getCawiLoginSuccessCounts();
            this.setState({ loading: false, data, errorMessage: "" });
        } catch (reason: unknown) {
            let errorMessage = "Unable to get CAWI successful login counts.";
            if (typeof reason === "object" && reason !== null && "response" in reason) {
                const response = (reason as { response?: { data?: unknown } }).response;
                if (typeof response?.data === "string" && response.data.trim().length > 0) {
                    errorMessage = response.data;
                }
            }
            this.setState({ loading: false, data: [], errorMessage });
        }
    }

    getTotalCount(): number {
        return this.state.data.reduce((total, point) => total + point.count, 0);
    }

    formatHourLabel(timestamp: string): string {
        const parsed = new Date(timestamp);
        if (Number.isNaN(parsed.getTime())) {
            return timestamp;
        }
        const hours = String(parsed.getUTCHours()).padStart(2, "0");
        return `${hours}:00`;
    }

    renderChart(): ReactElement {
        const maxCount = Math.max(...this.state.data.map((point) => point.count), 1);
        const plotWidth = CHART_WIDTH - PADDING.left - PADDING.right;
        const plotHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;

        const points = this.state.data.map((point, index) => {
            const x = this.state.data.length === 1
                ? PADDING.left + (plotWidth / 2)
                : PADDING.left + ((index / (this.state.data.length - 1)) * plotWidth);
            const y = PADDING.top + ((maxCount - point.count) / maxCount) * plotHeight;
            return { x, y, point };
        });

        const polylinePoints = points.map((point) => `${point.x},${point.y}`).join(" ");

        const yAxisTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const value = Math.round(maxCount * (1 - ratio));
            const y = PADDING.top + (ratio * plotHeight);
            return { value, y };
        });

        const xAxisLabels = [
            this.state.data[0],
            this.state.data[Math.floor(this.state.data.length / 2)],
            this.state.data[this.state.data.length - 1]
        ].filter((value): value is CawiLoginCount => Boolean(value));

        return (
            <svg
                aria-label="CAWI successful login count line chart"
                data-testid="cawi-login-line-chart"
                height={CHART_HEIGHT}
                role="img"
                viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
                width="100%"
            >
                <line
                    stroke="#b1b4b6"
                    x1={PADDING.left}
                    x2={PADDING.left}
                    y1={PADDING.top}
                    y2={CHART_HEIGHT - PADDING.bottom}
                />
                <line
                    stroke="#b1b4b6"
                    x1={PADDING.left}
                    x2={CHART_WIDTH - PADDING.right}
                    y1={CHART_HEIGHT - PADDING.bottom}
                    y2={CHART_HEIGHT - PADDING.bottom}
                />

                {yAxisTicks.map((tick) => (
                    <g key={tick.y}>
                        <line
                            stroke="#e0e0e0"
                            strokeDasharray="3 3"
                            x1={PADDING.left}
                            x2={CHART_WIDTH - PADDING.right}
                            y1={tick.y}
                            y2={tick.y}
                        />
                        <text
                            fill="#3d3d3d"
                            fontSize="10"
                            textAnchor="end"
                            x={PADDING.left - 6}
                            y={tick.y + 4}
                        >
                            {tick.value}
                        </text>
                    </g>
                ))}

                <polyline
                    fill="none"
                    points={polylinePoints}
                    stroke="#005ea5"
                    strokeWidth="2"
                />

                {points.map((point) => (
                    <circle
                        cx={point.x}
                        cy={point.y}
                        fill="#005ea5"
                        key={`${point.point.timestamp}-${point.point.count}`}
                        r="2.5"
                    />
                ))}

                {xAxisLabels.map((point, index) => {
                    const sourceIndex = this.state.data.indexOf(point);
                    const x = this.state.data.length === 1
                        ? PADDING.left + (plotWidth / 2)
                        : PADDING.left + ((sourceIndex / (this.state.data.length - 1)) * plotWidth);
                    return (
                        <text
                            fill="#3d3d3d"
                            fontSize="10"
                            key={`${point.timestamp}-${index}`}
                            textAnchor="middle"
                            x={x}
                            y={CHART_HEIGHT - PADDING.bottom + 18}
                        >
                            {this.formatHourLabel(point.timestamp)}
                        </text>
                    );
                })}
            </svg>
        );
    }

    render(): ReactElement {
        if (this.state.loading) {
            return <LoadingPanel message={"Getting successful CAWI login counts for last 24 hours."} />;
        }

        if (this.state.errorMessage !== "") {
            return <Panel status="error">{this.state.errorMessage}</Panel>;
        }

        if (this.state.data.length === 0) {
            return <Panel>No successful CAWI login data found in the last 24 hours.</Panel>;
        }

        return (
            <>
                <p className="ons-u-mt-s ons-u-mb-s" data-testid="cawi-login-total">
                    Total successful CAWI logins (24h): <strong>{this.getTotalCount()}</strong>
                </p>
                {this.renderChart()}
            </>
        );
    }
}
