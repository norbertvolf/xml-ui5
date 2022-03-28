import assert from "assert/strict";
import sinon from "sinon";
import configuration from "../../lib/configuration.js";
import fg from "fast-glob";
import fs from "fs";
import _ from "lodash";

const sandbox = sinon.createSandbox();

describe("lib/configuration", function() {
    afterEach(function() {
        sandbox.restore();
    });

    it("isStableId", function() {
        sandbox.stub(configuration, "parseArguments").returns({
            isStableId: "IS_STABLE_ID"
        });

        assert.equal(configuration.isStableId, true);
        assert.ok(configuration.parseArguments.calledWithExactly(process.argv));
    });

    it("files", function() {
        sandbox.stub(configuration, "parseArguments").returns({
            files: "FILES",
            ignore: "IGNORE"
        });
        sandbox.stub(fg, "sync");
        fg.sync.onCall(0).returns(["FILE_1", "FILE_2"]);
        fg.sync.onCall(1).returns(["FILE_1"]);
        return configuration.files.then(files => {
            assert.ok(configuration.parseArguments.calledWithExactly(process.argv));
            assert.deepEqual(files, ["FILE_2"]);
            assert.ok(fg.sync.calledWithExactly("FILES"));
            assert.ok(fg.sync.calledWithExactly("IGNORE"));
        });
    });

    describe("projectPath", function() {
        beforeEach(function() {
            sandbox.stub(configuration, "parseArguments").returns({
                projectPath: "PROJECT_PATH"
            });
            sandbox.stub(fs, "existsSync");
        });

        it("project path does not exists", function() {
            assert.throws(() => {
                /* eslint-disable no-unused-vars */
                let projectPath = configuration.projectPath;
                /* eslint-enable no-unused-vars */
            });
        });

        it("project path exists", function() {
            fs.existsSync.returns(true);
            assert.equal(configuration.projectPath, "PROJECT_PATH");
        });
    });

    it("parseArguments", function() {
        assert.deepEqual(
            configuration.parseArguments([
                "/usr/bin/node",
                "/home/i332698/www/xml-ui5/bin/i18n-ui5.js",
                "--files",
                "../fin.co.allocation.manage/**/*.view.xml",
                "--ignore",
                "../fin.co.allocation.manage/node_modules/**/*.xml",
                "--files",
                "../fin.co.allocation.manage/**/*.fragment.xml",
                "--project-path",
                "../fin.co.allocation.manage/webapp/",
                "--stable-id"
            ]),
            {
                files: ["../fin.co.allocation.manage/**/*.view.xml", "../fin.co.allocation.manage/**/*.fragment.xml"],
                ignore: ["../fin.co.allocation.manage/node_modules/**/*.xml"],
                projectPath: "../fin.co.allocation.manage/webapp/",
                isStableId: true
            }
        );
        assert.deepEqual(
            configuration.parseArguments(["/usr/bin/node", "/home/i332698/www/xml-ui5/bin/i18n-ui5.js"]),
            configuration.defaultArguments()
        );

        assert.deepEqual(
            configuration.parseArguments([
                "/usr/bin/node",
                "/home/i332698/www/xml-ui5/bin/i18n-ui5.js",
                "--project-path",
                "../fin.co.allocation.manage/webapp/"
            ]),
            _.assign(configuration.defaultArguments("../fin.co.allocation.manage/webapp/"), {
                projectPath: "../fin.co.allocation.manage/webapp/"
            })
        );
    });
});
