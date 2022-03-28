import fsPromises from "fs/promises";

export default class FileResource {
    constructor(filePath) {
        const initialized = Promise.all([fsPromises.readFile(filePath), fsPromises.stat(filePath)]).then(results => {
            Object.defineProperty(this, "fileText", {
                get() {
                    return results[0].toString();
                }
            });
            Object.defineProperty(this, "fileStat", {
                get() {
                    return results[1];
                }
            });
            return this;
        });
        Object.defineProperty(this, "filePath", {
            value: filePath,
            writeable: false
        });
        Object.defineProperty(this, "initialized", {
            value: initialized,
            writeable: false
        });
    }

    getPath() {
        return this.filePath;
    }

    getText() {
        return this.fileText;
    }

    getSize() {
        return this.fileStat.size;
    }
}
