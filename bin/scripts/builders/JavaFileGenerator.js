import {FileGenerator} from "./FileGenerator.js";
import * as ejs from "ejs";
import {data} from "../file_helper.js";
import path, {dirname} from "path";
import { fileURLToPath } from 'url';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirname = dirname(currentFilePath);

export class JavaFileGenerator extends FileGenerator {
    constructor(templatePath, fileName, destinationDirectory) {
        super(templatePath, fileName, "java", destinationDirectory);
    }

    getNewFileContent(modelName) {
        return new Promise((resolve, reject) => {
            const filePath = path.join(currentDirname,'../../java-files/' + this._templatePath);
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
        const fileName = `${this._fileName.charAt(0).toUpperCase() + this._fileName.slice(1)}.${this._fileType}`;
        return this.destinationDirectory + "/" + fileName;
    }


}