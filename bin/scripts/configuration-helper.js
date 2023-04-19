import * as fs from "fs";
import {posix as path} from "path";


/**
 * Read the content of the JSON file
 * @returns {Promise<unknown>}
 */
export function readConfigFile() {
    //TODO: 1. Check if the file exists
    return new Promise((resolve, reject) => {
        fs.readFile(path.resolve(process.cwd(), '../config.json'), 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                const config = JSON.parse(data);
                if (!config.useCustomConfig) {
                    resolve(false);
                }
                resolve(config);
            }
        });
    });
}

export function useHtmlAbsoluteFile() {
    return new Promise((resolve, reject) => {
        fs.readFile(path.resolve(process.cwd(), '../config.json'), 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                const config = JSON.parse(data);
                if (!config.html.useAbsolutePath) {
                    resolve(false);
                }
                resolve(true);
            }
        });
    });
}

export function readConfigProperty(property) {
    return new Promise((resolve, reject) => {
        fs.readFile(path.resolve(process.cwd(), '../config.json'), 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                const config = JSON.parse(data);
                if (!config.useCustomConfig) {
                    resolve(false);
                }
                if (config[property]) {
                    resolve(path.join(config[property]));
                } else {
                    const propertyParts = property.split('.');
                    let nestedObject = config;
                    for (const part of propertyParts) {
                        nestedObject = nestedObject[part];
                        if (nestedObject === undefined) {
                            throw new Error(`${property} not found in config.json`);
                        }
                    }
                    resolve(path.join(nestedObject));
                }
            }
        });
    });
}

/**
 * This class provides helper methods for reading and processing the content of the configuration file.
 */
export class ConfigurationHelper {
    constructor(configData) {
        this.configData = configData;
        this.projectPath = this.getProjectPath("projectPath");
    }

    getProjectPath() {
        console.log("Reading the 'projectPath' value from config.json");
        let configData = this.configData;
        if (!configData.project) {
            throw new Error(`No project path is defined in the configuration file`);
        }
        return checkIfPathExists(configData.project.projectPath);
    }

    getJavaDestination() {
        console.log("Reading the 'rootPackage' value from config.json");
        let rootPackage = this.getProjectField("rootPackage");
        if (this.projectPath && rootPackage) {
            let rootPackageSlashes = rootPackage.replace(/\./g, path.sep);
            return checkIfPathExists(this.projectPath + "\\core\\src\\main\\java\\" + rootPackageSlashes + "\\models");
        }
        // "D:\\projects\\Graduation-project\\dtnl-edelweiss\\core\\src\\main\\java\\nl\\dept\\aem\\edelweiss\\core\\models"
    }

    getDialogDestination() {
        console.log("Reading the 'componentParentPath' value from config.json");
        let componentParentPath = this.getProjectField("componentParentPath");
        if (this.projectPath && componentParentPath) {
            return checkIfPathExists(this.projectPath + "\\ui.apps\\src\\main\\content\\jcr_root\\apps\\" + componentParentPath);
        }
        // "D:\\projects\\Graduation-project\\dtnl-edelweiss\\ui.apps\\src\\main\\content\\jcr_root\\apps\\edelweiss\\components"
    }

    /**
     * Check if the htmlPath is defined in the configuration file
     * @returns {Promise<*>}
     */
    getHtmlPath() {
        console.log("Reading the 'htmlPath' value from config.json");
        let configData = this.configData;
        // Check if the output file name is set in the configuration file
        if (!configData.html.htmlPath) {
            console.log(`No file path is defined in the configuration file`);
            return; // Exit the function
        }
        // Check if the file path is valid and has a .html extension
        const htmlPath = configData.html.htmlPath;
        const extname = path.extname(htmlPath);
        if (extname !== '.html') {
            console.log(`The specified file is not an HTML file. Make sure that file is an HTML file`);
            return; // Exit the function
        }
        if (!checkIfPathExists(htmlPath)) {
            console.log(`The specified file path is not valid. Make sure that path is valid in configuration`);
            return; // Exit the function
        }
        // console.log('Reading the HTML file at ' + htmlPath);
        return htmlPath;
    }

    getI18nDestination() {
        console.log("Reading the 'i18nPath' value from config.json");
        let i18nPath = this.getProjectField("i18nPath", true);
        if (this.projectPath && i18nPath) {
            return checkIfPathExists(this.projectPath + "\\ui.apps\\src\\main\\content\\jcr_root\\apps\\" + i18nPath, true);
        }
        // "D:\\projects\\Graduation-project\\dtnl-edelweiss\\ui.apps\\src\\main\\content\\jcr_root\\apps\\edelweiss\\components"
    }

    getTemplatesDirectory() {
        console.log("Reading the 'tempalatesDirectory' value from config.json");
        let templatesDirectory = this.configData.templatesPath;
        if (this.projectPath && templatesDirectory) {
            return checkIfPathExists(this.projectPath + "\\" + templatesDirectory);
        }
        // "D:\\projects\\Graduation-project\\dtnl-edelweiss\\ui.apps\\src\\main\\content\\jcr_root\\apps\\edelweiss\\components"
    }


    getProjectField(key, optional) {
        let configData = this.configData;
        const path = configData.project[key];
        if (!path && !optional) {
            throw new Error(`No ${path} path is defined in the configuration file`);
        }
        if (!path && optional) {
            return false;
        }
        return path;
    }
}
export function getUseHtmlAbsoluteFile(configData) {
    console.log("Reading the 'useAbsolutePath' value from config.json");
    return configData.html["useAbsolutePath"];
}

export function getHtmlPath(configData) {
    console.log("Reading the 'htmlPath' value from config.json");
    const field = configData.html["htmlPath"];
    return checkIfPathExists(field);
}

export function checkIfPathExists(pathValue) {
    // Use the path module to convert the path to the appropriate format for the current platform
    const platformIndependentFilePath = path.join(pathValue);

    if (!fs.existsSync(platformIndependentFilePath)) {
        console.error(`The specified path: ${platformIndependentFilePath} does not exist. Make sure that path is valid`);
        process.exit(1);
    }
    return platformIndependentFilePath;
}