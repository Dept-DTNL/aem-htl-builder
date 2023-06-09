import {data} from "../../file_helper.js";
import {BaseElement} from "../BaseElement.js";

export class RichTextElement extends BaseElement {
    constructor($, el, attrName) {
        super($, el, attrName);
    }

    async process() {
        this.variableName = this.attrName.slice(9);

        let modelName = this.listName ? this.listName : 'model';
        let tagValue = "${" + modelName + "." + this.variableName + " @ context='html'}";
        //Add the original content as a comment
        let originalContent = this.$(this.el).prop('outerHTML');
        let commentContent = `\n <!-- RichText original content:-->\n` + `<!-- ${originalContent} -->\n`;
        this.$(this.el).after(`${commentContent}`);

        this.$(this.el).text(tagValue);
        this.$(this.el).removeAttr(this.attrName);
    }

    pushData() {
        if (!data.richTexts.map(richText => richText.name).includes(this.variableName)) {
            data.richTexts.push({
                name: this.variableName, description: this.description,
            })
        } else {
            console.log('RichText already exists: ' + this.variableName);
        }
    }

    getListElement() {
        return {
            richText: {
                name: this.variableName,
                description: this.description,
            }, element: this.$(this.el)
        };
    }
}