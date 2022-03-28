import config from "./configuration.js";
import ui5XMLValidator from "@sap/di.code-validation.xml/src/xmlValidator.js";
import ValidationMetadata from "./ValidationMetadata.js";
import FileResource from "./FileResource.js";
import _ from "lodash";
import format from "./format.js";

export default function checkUi5XMLFiles() {
    config.files
        .then(filePaths => {
            return Promise.all(_.map(filePaths, filePath => new FileResource(filePath).initialized));
        })
        .then(fileResources => {
            let issues = _.get(
                ui5XMLValidator.validateFiles(new ValidationMetadata(config.projectPath), fileResources),
                "issues",
                []
            );
            format.print(issues);
            if (issues.length > 0) {
                process.exit(1);
            }
        });
}
