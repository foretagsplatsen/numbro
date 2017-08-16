const rewire = require("rewire");
const loadingModule = rewire("../../src/loading");
const loading = loadingModule(numbroStub);

function numbroStub(value) {
    return {_value: value};
}

describe("loading", () => {
    let require = undefined;
    let error = undefined;
    let revert = undefined;

    beforeEach(() => {
        require = jasmine.createSpy("require");
        error = jasmine.createSpy("error");
        revert = loadingModule.__set__({
            require,
            console: {error}
        });
    });

    afterEach(() => {
        revert();
    });

    it("requires all tags", () => {
        let tags = ["foo", "bar", "baz"];

        loading.loadLanguagesInNode(tags);

        tags.forEach((tag) => {
            expect(require).toHaveBeenCalledWith(`../languages/${tag}`);
        });
    });

    it("catches the exception when require fails", () => {
        let tags = ["foo"];
        require.and.throwError("not matching module");

        loading.loadLanguagesInNode(tags);

        expect(error).toHaveBeenCalledWith("Unable to load \"foo\". No matching language file found.");
    });

    it("registers data loaded through require", () => {
        let registerLanguage = jasmine.createSpy("registerLanguage");
        let data = jasmine.createSpy("data");
        numbroStub.registerLanguage = registerLanguage;
        require.and.returnValue(data);

        loading.loadLanguagesInNode(["foo"]);

        expect(registerLanguage).toHaveBeenCalledWith(data);
    });
});
