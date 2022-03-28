import assert from "assert/strict";
import sinon from "sinon";
import ValidationMetadata from "../../lib/ValidationMetadata.js";
import path from "path";

const sandbox = sinon.createSandbox();

describe("lib/FileResource", function() {
    let validationMetadata;

    beforeEach(function() {
        validationMetadata = new ValidationMetadata("PROJECT_PATH", "LEVELS");
    });

    afterEach(function() {
        sandbox.restore();
    });

    it("getRootPath", function() {
        assert.equal(validationMetadata.getRootPath(), "PROJECT_PATH");
    });

    it("getName", function() {
        sandbox.stub(path, "basename").returns("BASENAME");
        assert.equal(validationMetadata.getName(), "BASENAME");
        assert.ok(path.basename.calledWithExactly("PROJECT_PATH"));
    });

    it("getFilters", function() {
        assert.deepEqual(validationMetadata.getFilters(), {
            levels: "LEVELS"
        });
        validationMetadata = new ValidationMetadata("PROJECT_PATH");
        assert.deepEqual(validationMetadata.getFilters(), {
            levels: ["error", "info", "warning"]
        });
    });

    it("getLevels", function() {
        assert.equal(validationMetadata.getLevels(), "LEVELS");
        validationMetadata = new ValidationMetadata("PROJECT_PATH");
        assert.deepEqual(validationMetadata.getLevels(), ["error", "info", "warning"]);
    });
});
