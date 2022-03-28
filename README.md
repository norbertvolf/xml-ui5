# i18n-xml

![Node.js CI](https://github.com/norbertvolf/xml-ui5/actions/workflows/node.js.yml/badge.svg)

CLI interface to [di.code-validation.xml](https://www.npmjs.com/package/@sap/di.code-validation.xml)
to check SAPUI5/OpenUI5 xml files

## Install

```
	npm install xml-ui5
```

## Usage

By default check \*.view.xml and \*.fragment.xml files in webapp directory of the project.

```
	npx xml-ui5
```

Just change project path and use default files definition

```
	npx xml-ui5 --project-path  "/path/to/your/project/webapp/"

```

Manually define all parameters

```
	npx xml-ui5 --files "/projectPath/**/*.view.xml" --ignore "/projectPath/node_modules/**/*.xml" --files "/projectPath/**/*.fragment.xml" --project-path  "/projectPath/"

```

## Parameters

--files
: Define file sources to check by patterns

--ignore
: Negative to files. Define file sources which is ignored

--path-project
: Define path to project which is used to read project definitions (if exists) and default file definitions
(`./**/*.view.xml`, `./**/*.fragment.xml`) are relative to the project path
