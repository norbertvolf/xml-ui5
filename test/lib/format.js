import assert from "assert/strict";
import sinon from "sinon";
import format from "../../lib/format.js";
import chalk from "chalk";

const sandbox = sinon.createSandbox();

describe("lib/format", function() {
    afterEach(function() {
        sandbox.restore();
    });

    it("address", function() {
        assert.equal(
            format.address({
                column: 1,
                line: 1
            }),
            "  " + chalk.grey("1:1     ") + " "
        );
        assert.equal(
            format.address({
                column: "1",
                line: "1"
            }),
            "  " + chalk.grey("1:1     ") + " "
        );
        assert.throws(() => {
            format.address({
                line: "1"
            });
        });
    });

    it("severity", function() {
        assert.equal(
            format.severity({
                severity: "error"
            }),
            chalk.red("error")
        );
        assert.equal(
            format.severity({
                severity: "warning"
            }),
            chalk.yellow("warning")
        );
        assert.equal(
            format.severity({
                severity: "info"
            }),
            chalk.blue("info")
        );
        assert.throws(() => {
            format.severity();
        });
        assert.throws(() => {
            format.severity({});
        });
    });

    it("xmlIssue", function() {
        const issue = {
            message: "MESSAGE",
            id: "ID"
        };
        sandbox.stub(format, "address").returns("ADDRESS ");
        sandbox.stub(format, "severity").returns("SEVERITY");
        assert.equal(format.xmlIssue(issue), "ADDRESS SEVERITY MESSAGE [" + chalk.grey("ID") + "]");
    });

    it("print", function() {
        sandbox.stub(format, "xmlIssue").returns("FORMATTED_ISSUE_MESSAGE");
        sandbox.stub(console, "log");

        format.print([{ path: "PATH_1" }, { path: "PATH_1" }, { path: "PATH_2" }]);

        /* eslint-disable no-console */
        assert.equal(console.log.getCall(0).args[0], "\n\n" + chalk.underline("PATH_1"));
        assert.equal(console.log.getCall(1).args[0], "FORMATTED_ISSUE_MESSAGE");
        assert.equal(console.log.getCall(2).args[0], "FORMATTED_ISSUE_MESSAGE");
        assert.equal(console.log.getCall(3).args[0], "\n\n" + chalk.underline("PATH_2"));
        assert.equal(console.log.getCall(4).args[0], "FORMATTED_ISSUE_MESSAGE");
        /* eslint-enable no-console */
    });
});
