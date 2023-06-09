import {FileGenerator} from "./FileGenerator.js";
import * as fs from "fs";
import * as cheerio from "cheerio";
import {
    replaceWithSlyTag,
    selectFinder,
    translateDynamicElements
} from "../file_helper.js";

export class SightlyFileGenerator extends FileGenerator {
    constructor(templatePath,fileName,destinationDirectory) {
        super(templatePath,fileName,"html",destinationDirectory);
    }

    async getNewFileContent(modelName) {

        const htmlFile = fs.readFileSync(this._templatePath, 'utf8');
        // Load the HTML into Cheerio
        // set xmlMode to true to disable automatic tag creation
        // set decodeEntities too false to prevent encoding of special characters

        // Replace the closing tag with a self-closing tag
        //It seems that Cheerio always adds a closing tag to void elements like <img> even when the decodeEntities option is set to false
        const fixedHtml = htmlFile.replace(/(<img[^>]+)>(<\/img>)?/gi, '$1/>');
        const $ = cheerio.load(fixedHtml, {xmlMode: true, decodeEntities: false});

        await replaceWithSlyTag($, modelName);
        await translateDynamicElements($);
        await selectFinder($);

        //Remove the empty lines using regex expression
        return $.html().replace(/^\s*\n/gm, '');
    }
    getNewFilePath() {
        return this.destinationDirectory + "/" + this._fileName + "." + this._fileType;
    }
}