import path from "path";

export default class ValidationMetadata {
    constructor(projPath, levels) {
        this.projPath = projPath;
        this.levels = levels || ["error", "info", "warning"];
    }

    getRootPath() {
        return this.projPath;
    }

    getName() {
        return path.basename(this.projPath);
    }

    getFilters() {
        return {
            levels: this.levels
        };
    }

    getLevels() {
        return this.levels;
    }
}
