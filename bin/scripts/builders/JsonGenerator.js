import {FileGenerator} from "./FileGenerator.js";
import {i18nElements} from "../factory-pattern/BaseElement.js";
import fs from "fs";
import {posix as path} from "path";

export class JsonGenerator extends FileGenerator {
    constructor(templatePath, fileName, destinationDirectory) {
        super(templatePath, fileName, "json", destinationDirectory);
    }

    async getNewFileContent(modelName) {
            return new Promise((resolve, reject) => {
                fs.readFile(this.getNewFilePath(), 'utf8', (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        const fileData = JSON.parse(data);
                        //Check if the key already exists in the file
                        for (let key in i18nElements) {
                            if (fileData.hasOwnProperty(key)) {
                                delete i18nElements[key];
                            }
                        }
                        // Combine the objects into a single JSON object
                        let combinedObj = Object.assign({}, fileData, i18nElements);
                        resolve(JSON.stringify(combinedObj, null, 2));
                    }
                });
            });
    }

    getNewFilePath() {
        const fileName = `${this._fileName}.${this._fileType}`;

        let filePath = path.join(this.destinationDirectory + "/" + fileName);
        if(!fs.existsSync(filePath)){
            const data = {
                Hello : "Hello"
            };
            fs.writeFileSync(filePath,JSON.stringify(data, null, 4),'utf8');
        }
        return filePath;
    }


}