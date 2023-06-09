import {FileGenerator} from "./FileGenerator.js";
import * as fs from "fs";

export class HtmlFileGenerator extends FileGenerator {
    constructor(templatePath,fileName,destinationDirectory) {
        super(templatePath,fileName,"html",destinationDirectory);
    }

    async getNewFileContent(modelName) {
        return fs.readFileSync(this._templatePath, 'utf8');
    }
    getNewFilePath() {
        return this.destinationDirectory + "/" + this._fileName + "." + this._fileType;
    }
}