import "@testing-library/jest-dom/vitest";
import React from "react";
import { vi } from "vitest";

type MockComponentProps = Record<string, unknown> & { children?: React.ReactNode };

vi.mock("blaise-design-system-react-components", () => {
    const Header = ({ title, ...props }: { title?: React.ReactNode } & Record<string, unknown>) => React.createElement("header", props, title);
    const Footer = ({ children, ...props }: MockComponentProps) => React.createElement("footer", props, children);
    const LoadingPanel = ({ message, children, ...props }: { message?: React.ReactNode; children?: React.ReactNode } & Record<string, unknown>) =>
        React.createElement("div", props, children ?? message);
    const Panel = ({ children, ...props }: MockComponentProps) => React.createElement("div", props, children);
    const Collapsible = ({ title, children, ...props }: { title?: React.ReactNode; children?: React.ReactNode } & Record<string, unknown>) =>
        React.createElement(
            "section",
            props,
            React.createElement("h3", null, title),
            children
        );

    const flattenChildren = (children: React.ReactNode): React.ReactNode[] =>
        React.Children.toArray(children).flatMap((child) => {
            if (React.isValidElement<{ children?: React.ReactNode }>(child) && child.type === React.Fragment) {
                return flattenChildren(child.props.children);
            }
            return [child];
        });

    const Table = ({ children, id, ...props }: { children?: React.ReactNode; id?: string } & Record<string, unknown>) => {
        const dataTestId = (props["data-testid"] as string | undefined) ?? id;
        const childNodes = flattenChildren(children);
        const hasTableSection = childNodes.some((child) =>
            React.isValidElement(child)
            && ["thead", "tbody", "tfoot", "caption", "colgroup"].includes(String(child.type))
        );

        const normalizedChildren = hasTableSection
            ? children
            : React.createElement("tbody", null, childNodes);

        return React.createElement("table", { ...props, "data-testid": dataTestId }, normalizedChildren);
    };

    return {
        Header,
        Footer,
        LoadingPanel,
        Panel,
        Collapsible,
        Table
    };
});
