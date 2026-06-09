import "@testing-library/jest-dom";

jest.mock("blaise-design-system-react-components", () => {
	const React = require("react");

	const BetaBanner = ({ children, ...props }) => React.createElement("div", props, children);
	const Header = ({ title, ...props }) => React.createElement("header", props, title);
	const Footer = ({ children, ...props }) => React.createElement("footer", props, children);
	const ONSLoadingPanel = ({ message, children, ...props }) => React.createElement("div", props, children ?? message);
	const ONSPanel = ({ children, ...props }) => React.createElement("div", props, children);
	const Collapsible = ({ title, children, ...props }) => React.createElement(
		"section",
		props,
		React.createElement("h3", null, title),
		children
	);
	const ONSTable = ({ children, tableId, tableID, tableid, ...props }) => {
		const dataTestId = props["data-testid"] || tableID || tableId || tableid;
		return React.createElement("table", { ...props, "data-testid": dataTestId }, children);
	};

	return {
		__esModule: true,
		BetaBanner,
		Header,
		Footer,
		ONSLoadingPanel,
		ONSPanel,
		Collapsible,
		ONSTable
	};
}, { virtual: true });