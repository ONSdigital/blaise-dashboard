import "@testing-library/jest-dom/vitest";
import React from "react";
import { vi } from "vitest";

vi.mock("blaise-design-system-react-components", () => {
    const BetaBanner = ({ children, ...props }: Record<string, unknown> & { children?: unknown }) => React.createElement("div", props, children);
    const Header = ({ title, ...props }: { title?: unknown } & Record<string, unknown>) => React.createElement("header", props, title);
    const Footer = ({ children, ...props }: Record<string, unknown> & { children?: unknown }) => React.createElement("footer", props, children);
    const LoadingPanel = ({ message, children, ...props }: { message?: unknown; children?: unknown } & Record<string, unknown>) =>
        React.createElement("div", props, children ?? message);
    const Panel = ({ children, ...props }: Record<string, unknown> & { children?: unknown }) => React.createElement("div", props, children);
    const Collapsible = ({ title, children, ...props }: { title?: unknown; children?: unknown } & Record<string, unknown>) =>
        React.createElement(
            "section",
            props,
            React.createElement("h3", null, title),
            children
        );
    const Table = ({ children, id, ...props }: { children?: unknown; id?: string } & Record<string, unknown>) => {
        const dataTestId = (props["data-testid"] as string | undefined) ?? id;
        return React.createElement("table", { ...props, "data-testid": dataTestId }, children);
    };

    return {
        BetaBanner,
        Header,
        Footer,
        LoadingPanel,
        Panel,
        Collapsible,
        Table
    };
});

process.env = Object.assign(process.env, {
    BLAISE_API_URL: "mock-api",
    SERVER_PARK: "server-park"
});
