import _ from "lodash";
import chalk from "chalk";

const format = {
    COLORS: {
        error: chalk.red,
        warning: chalk.yellow,
        info: chalk.blue
    }
};

format.address = function(issue) {
    const column = parseInt(_.get(issue, "column"), 10);
    const line = parseInt(_.get(issue, "line"), 10);
    let address;
    if (!isNaN(column) && !isNaN(line)) {
        address = `${line}:${column}`.padEnd(8);
    } else {
        throw new Error(`Invalid address for issue ${JSON.stringify(issue, null, 2)}`);
    }
    return `  ${chalk.grey(address)} `;
};

format.severity = function(issue) {
    let severity = _.get(issue, "severity");

    if (!_.isString(severity)) {
        throw new Error(`Invalid severity for issue ${JSON.stringify(issue, null, 2)}`);
    }

    if (format.COLORS[severity]) {
        severity = format.COLORS[severity](severity);
    }

    return severity;
};

format.xmlIssue = function(issue) {
    return format.address(issue) + `${format.severity(issue)} ${issue.message} [${chalk.grey(issue.id)}]`;
};

format.print = function(issues) {
    const groupedIssues = _.reduce(
        issues,
        (issuesByFileName, issue) => {
            if (!_.has(issuesByFileName, issue.path)) {
                issuesByFileName[issue.path] = [];
            }
            issuesByFileName[issue.path].push(format.xmlIssue(issue));
            return issuesByFileName;
        },
        {}
    );
    /* eslint-disable no-console */
    _.each(groupedIssues, (issueMessages, filePath) => {
        console.log(`\n\n${chalk.underline(filePath)}`);
        _.each(issueMessages, issueMessage => {
            console.log(issueMessage);
        });
    });
    /* eslint-enable no-console */
};

export default format;
