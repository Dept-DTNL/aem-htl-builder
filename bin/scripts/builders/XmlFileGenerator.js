import {FileGenerator} from "./FileGenerator.js";
import * as ejs from "ejs";
import {data} from "../file_helper.js";
import path, {dirname} from "path";
import {fileURLToPath} from "url";
const currentFilePath = fileURLToPath(import.meta.url);
const currentDirname = dirname(currentFilePath);

export class XmlFileGenerator extends FileGenerator {
    constructor(templatePath, fileName,destinationDirectory) {
        super(templatePath, fileName, "xml",destinationDirectory);
    }

    getNewFileContent(modelName) {
        return new Promise((resolve, reject) => {
            const filePath = path.join(currentDirname,'../../xml-files/' + this._templatePath);
            ejs.renderFile(filePath, data, (err, str) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(str);
                }
            });
        });
    }

    getNewFilePath() {
        return this.destinationDirectory + "/" + this._fileName + "." + this._fileType;
    }

}