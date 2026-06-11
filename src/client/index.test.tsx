const createRootMock = vi.hoisted(() => vi.fn());
const renderMock = vi.hoisted(() => vi.fn());

vi.mock("react-dom/client", () => ({
    createRoot: createRootMock.mockImplementation(() => ({
        render: renderMock
    }))
}));

vi.mock("./app", () => ({
    default: () => null
}));

describe("client index bootstrap", () => {
    beforeEach(() => {
        vi.resetModules();
        createRootMock.mockClear();
        renderMock.mockClear();
        document.body.innerHTML = "";
    });

    it("throws when root container is missing", async () => {
        await expect(import("./index")).rejects.toThrow("Root container element not found");
        expect(createRootMock).not.toHaveBeenCalled();
    });

    it("creates root and renders app when container exists", async () => {
        document.body.innerHTML = "<div id=\"root\"></div>";

        await import("./index");

        expect(createRootMock).toHaveBeenCalledWith(document.getElementById("root"));
        expect(renderMock).toHaveBeenCalledTimes(1);
    });
});
