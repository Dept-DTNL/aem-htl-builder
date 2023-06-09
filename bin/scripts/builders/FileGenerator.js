import * as fs from "fs";
import {posix as path} from "path";

/**
 * Template design pattern
 * @param filePath - The path of the file we read
 * @param fileName - The name of the file which will be used to create new file
 * @param fileType - The type of the file we are creating
 * @param destinationDirectory - The directory where the new file will be created
 */
export class FileGenerator {
    constructor(templatePath, fileName, fileType,destinationDirectory) {
        this._templatePath = templatePath;
        this._fileName = fileName;
        this._fileType = fileType;
        this.destinationDirectory = destinationDirectory;
    }

    /**
     * Create the new file
     * @returns {Promise<void>}
     */
    async generateFile() {
        let newContent = await this.getNewFileContent(this._fileName);
        this.directoryExists()
        let filePath = this.getNewFilePath();
        fs.writeFileSync(filePath,newContent);
    }

    /**
     * Check if the directory exists, if not create it
     * @returns {boolean}
     */
    directoryExists() {
        try {
            const directoryPath = path.join(this.destinationDirectory);
            if (!fs.existsSync(directoryPath)) {
                fs.mkdirSync(directoryPath);
                return false;
            }
            return true;
        } catch (e) {
            throw new Error(e);
        }
    }

    /**
     * Get the content of the file
     * @param modelName
     * @returns {Promise<void>}
     */
    async getNewFileContent(modelName) {
        throw new Error('Not implemented');
    }

    /**
     * Get the path where the file will be placed
     */
    getNewFilePath() {
        throw new Error('Not implemented');
    }

}