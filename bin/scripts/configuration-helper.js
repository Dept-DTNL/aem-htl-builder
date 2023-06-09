import * as fs from "fs";
import {posix as path} from "path";


/**
 * This class provides helper methods for reading and processing the content of the configuration file.
 */
export class ConfigurationHelper {
    constructor(configData) {
        this.configData = configData;
        this.projectPath = this.getProjectPath("aemProjectPath");
        this.uiAppsPath = this.getUiApps();
    }

    getProjectPath() {
        let configData = this.configData;
        if (!configData.project) {
            throw new Error(`No project path is defined in the configuration file`);
        }
        return checkIfPathExists(configData.project.aemProjectPath,'aemProjectPath');
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
        let appName = this.getProjectField("appName");
        if (this.projectPath && appName) {
            return checkIfPathExists(
                path.join(this.projectPath, 'ui.apps', 'src', 'main', 'content','jcr_root','apps', appName),
                'appName'
            );
        }
    }

    /**
     * Check if the singleFilePath is defined in the configuration file
     * @returns {Promise<*>}
     */
    getHtmlPath() {
        let configData = this.configData;
        // Check if the output file name is set in the configuration file
        if (!configData.html.singleFilePath) {
            console.log(`No file path is defined in the configuration file`);
            return; // Exit the function
        }
        // Check if the file path is valid and has a .html extension
        const singleFilePath = configData.html.singleFilePath;
        const extname = path.extname(singleFilePath);
        if (extname !== '.html') {
            console.log(`The specified file is not an HTML file. Make sure that file is an HTML file`);
            return; // Exit the function
        }
        if (!checkIfPathExists(singleFilePath)) {
            console.log(`The specified file path is not valid. Make sure that path is valid in configuration`);
            return; // Exit the function
        }
        return singleFilePath;
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
        let appName = this.getProjectField("appName");
        if (this.projectPath && appName) {
            return checkIfPathExists(
                path.join(this.projectPath, 'ui.content', 'src', 'main', 'content','jcr_root','conf', appName,
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
    return configData.html["useSingleFile"];
}

export function getSingleFilePath(configData) {
    const field = configData.html["singleFilePath"];
    return checkIfPathExists(field,'singleFilePath');
}

export function getHtmlDirectoryPath(configData,){
    const directory = configData.html["directoryPath"];
    return checkIfPathExists(directory,'directoryPath');
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