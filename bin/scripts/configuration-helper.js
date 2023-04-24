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
        this.uiAppsPath = this.getUiApps();
    }

    getProjectPath() {
        let configData = this.configData;
        if (!configData.project) {
            throw new Error(`No project path is defined in the configuration file`);
        }
        return checkIfPathExists(configData.project.projectPath,'projectPath');
    }

    getJavaDestination() {
        let rootPackage = this.getProjectField("rootPackage");
        if (this.projectPath && rootPackage) {
            let rootPackageSlashes = rootPackage.replace(/\./g, path.sep);
            return checkIfPathExists(
                path.join(this.projectPath, 'core', 'src', 'main', 'java', rootPackageSlashes, 'models'),
                'rootPackage'
            );
        }
    }

    getDialogDestination() {
        if (this.projectPath && this.uiAppsPath) {
            return checkIfPathExists(
                path.join(this.getUiApps(),'components'),
                'componentParentPath'
            );
        }
    }

    getUiApps(){
        let uiAppsName = this.getProjectField("uiAppsName");
        if (this.projectPath && uiAppsName) {
            return checkIfPathExists(
                path.join(this.projectPath, 'ui.apps', 'src', 'main', 'content','jcr_root','apps', uiAppsName),
                'uiAppsName'
            );
        }
    }

    /**
     * Check if the htmlPath is defined in the configuration file
     * @returns {Promise<*>}
     */
    getHtmlPath() {
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
        if (this.projectPath && this.uiAppsPath) {
            return checkIfPathExists(
                path.join(this.getUiApps(),'i18n'),
                'i18nPath'
            );
        }
    }

    getTemplatesDirectory() {
        let uiAppsName = this.getProjectField("uiAppsName");
        if (this.projectPath && uiAppsName) {
            return checkIfPathExists(
                path.join(this.projectPath, 'ui.content', 'src', 'main', 'content','jcr_root','conf', uiAppsName,
                    'settings', 'wcm','templates'),
                'templatesPath'
            );
        }
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
    return configData.html["useAbsolutePath"];
}

export function getHtmlPath(configData) {
    const field = configData.html["htmlPath"];
    return checkIfPathExists(field,'htmlPath');
}

export function getHtmlDirectoryPath(configData,){
    const directory = configData.html["dirContainingHtmlFiles"];
    return checkIfPathExists(directory,'dirContainingHtmlFiles');
}

export function checkIfPathExists(pathValue,keyName) {
    // Use the path module to convert the path to the appropriate format for the current platform
    const platformIndependentFilePath = path.join(pathValue);

    if (!fs.existsSync(platformIndependentFilePath)) {
        console.error(`The specified path: ${platformIndependentFilePath} for ${keyName} does not exist. Make sure that path is valid`);
        process.exit(1);
    }
    return platformIndependentFilePath;
}