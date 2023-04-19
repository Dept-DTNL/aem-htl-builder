import fs from "fs";
import {posix as path} from "path";

export class ConfigurationHelper{
    constructor(configData) {
        this.configData = configData;
    }

    getJavaDestination() {
        let configData=this.configData;
        if(!configData.destination.javaDirectory){
            throw new Error('No java Destination is defined in the configuration file');
        }
        const javaDestination = configData.destination.javaDirectory;
        if(!fs.existsSync(javaDestination)){
            throw new Error(`The specified Destination for java file is not valid. Make sure that path is valid in configuration`);
        }
        return javaDestination;
    }
    getDialogDestination() {
        let configData=this.configData;
        if(!configData.destination.dialogDirectory){
            throw new Error(`No dialog Destination is defined in the configuration file`);
        }
        const dialogDestination = configData.destination.dialogDirectory;
        if(!fs.existsSync(dialogDestination)){
            throw new Error(`The specified Destination for dialog files is not valid. Make sure that path is valid in configuration`);
        }
        return dialogDestination;
    }

    /**
     * Check if the htmlAbsolutePath is defined in the configuration file
     * @returns {Promise<*>}
     */
    getHtmlPath() {
        let configData=this.configData;
        // Check if the output file name is set in the configuration file
        if (!configData.resource.htmlAbsolutePath) {
            console.log(`No file path is defined in the configuration file`);
            return; // Exit the function
        }
        // Check if the file path is valid and has a .html extension
        const htmlPath = configData.resource.htmlAbsolutePath;
        const extname = path.extname(htmlPath);
        if (extname !== '.html') {
            console.log(`The specified file is not an HTML file. Make sure that file is an HTML file`);
            return; // Exit the function
        }
        if (!fs.existsSync(htmlPath)) {
            console.log(`The specified file path is not valid. Make sure that path is valid in configuration`);
            return; // Exit the function
        }
        console.log('Reading the HTML file at ' + htmlPath);
        return htmlPath;
    }

    getProjectPath(){
        let configData=this.configData;
        if(!configData.project){
            throw new Error(`No project path is defined in the configuration file`);
        }
        const projectPath = configData.project.projectPath;
        if(!fs.existsSync(projectPath)){
            throw new Error(`The specified Project path is not valid/does not exist. Make sure that path is valid in configuration`);
        }
        return projectPath;
    }

    buildMain(){
        let configData=this.configData;
        if(!configData.project){
            throw new Error(`No project path is defined in the configuration file`);
        }
        const projectPath = this.getProjectPath();
    }
}