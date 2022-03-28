import assert from "assert/strict";
import sinon from "sinon";
import FileResource from "../../lib/FileResource.js";
import fsPromises from "fs/promises";

const sandbox = sinon.createSandbox();

describe("lib/FileResource", function() {
    let fileResource;

    beforeEach(function() {
        sandbox.stub(fsPromises, "readFile").returns(Promise.resolve(Buffer.from("TEXT")));
        sandbox.stub(fsPromises, "stat").returns(
            Promise.resolve({
                size: "SIZE"
            })
        );
        fileResource = new FileResource("FILE_PATH");
        return fileResource.initialized;
    });

    afterEach(function() {
        sandbox.restore();
    });

    it("constructor", function() {
        return fileResource.initialized.then(result => {
            assert.equal(result, fileResource);
        });
    });

    it("getPath", function() {
        assert.equal(fileResource.getPath(), "FILE_PATH");
    });

    it("getText", function() {
        assert.equal(fileResource.getText(), "TEXT");
    });

    it("getSize", function() {
        assert.equal(fileResource.getSize(), "SIZE");
    });
});
