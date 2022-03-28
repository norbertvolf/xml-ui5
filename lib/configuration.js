import _ from "lodash";
import fg from "fast-glob";
import fs from "fs";
import path from "path";

const config = {
    DEFAULTS: {
        files: [path.join("**", "*.fragment.xml"), path.join("**", "*.view.xml")],
        ignore: [],
        projectPath: path.join(".", "webapp"),
        isStableId: false
    },
    PARAMETERS_DEFINITIONS: {
        "--stable-id": function(args, index, options) {
            options.isStableId = true;
        },
        "--files": function(args, index, options) {
            options.files = (options.files || []).concat([args[index + 1]]);
            return true;
        },
        "--ignore": function(args, index, options) {
            options.ignore = (options.ignore || []).concat([args[index + 1]]);
            return true;
        },
        "--project-path": function(args, index, options) {
            options.projectPath = args[index + 1];
        }
    }
};

config.defaultArguments = function(projectPath) {
    const normalizedProjectPath = projectPath || config.DEFAULTS.projectPath;
    return _.assign({}, config.DEFAULTS, {
        files: _.map(config.DEFAULTS.files, filePath => {
            return path.join(normalizedProjectPath, filePath);
        })
    });
};

config.parseArguments = function(argv) {
    const normalizedArgv = [].concat(argv);
    let stepOver = false;

    normalizedArgv.shift();
    normalizedArgv.shift();

    const customParameters = normalizedArgv.reduce((acc, argPart, index) => {
        if (stepOver) {
            stepOver = false;
        } else if (config.PARAMETERS_DEFINITIONS[argPart]) {
            stepOver = config.PARAMETERS_DEFINITIONS[argPart](normalizedArgv, index, acc);
        } else if (argPart.match(/^-/)) {
            throw new Error(`Parameter "${argPart}" is not valid.`);
        }
        return acc;
    }, {});

    return _.assign({}, config.defaultArguments(customParameters.projectPath), customParameters);
};

Object.defineProperty(config, "projectPath", {
    get() {
        const parameters = config.parseArguments(process.argv);
        if (!fs.existsSync(parameters.projectPath)) {
            throw new Error(`Manifest file "${parameters.projectPath} " does not exists`);
        }
        return parameters.projectPath;
    }
});

Object.defineProperty(config, "files", {
    get() {
        const parameters = config.parseArguments(process.argv);
        //Use sync method to, because fg is default export
        //which is difuculty mockable
        const foundFilePaths = fg.sync(_.get(parameters, "files", []));
        const foundIgnoredFilePaths = fg.sync(_.get(parameters, "ignore", []));
        return Promise.resolve(
            _.filter(foundFilePaths, foundFilePath => {
                return _.indexOf(foundIgnoredFilePaths, foundFilePath) < 0;
            })
        );
    }
});

Object.defineProperty(config, "isStableId", {
    get() {
        return Boolean(config.parseArguments(process.argv).isStableId);
    }
});

export default config;
