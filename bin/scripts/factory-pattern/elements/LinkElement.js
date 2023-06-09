import {data} from "../../file_helper.js";
import {BaseElement, checkBoxNames} from "../BaseElement.js";

export class LinkElement extends BaseElement {
    constructor($, el, attrName) {
        super($, el, attrName);
        this.checkBoxName = null;
    }

    async process() {
        this.variableName = this.attrName.slice(5);
        let checkBoxName = this.variableName + "Checkbox";

        let modelName = this.listName ? this.listName : 'model';
        this.$(this.el).attr('href', "${" + modelName + `.${this.variableName}` + "}");
        this.$(this.el).attr('target', "${" + modelName + `.${checkBoxName} ? '_blank' : '_self'` + "}");
        this.$(this.el).removeAttr(this.attrName);
        this.checkBoxName = checkBoxName;
        if (!checkBoxNames.includes(checkBoxName)) {
            checkBoxNames.push(checkBoxName);
        }
    }

    pushData() {
        if (!data.links.map(link => link.name).includes(this.variableName)) {
            data.links.push({
                name: this.variableName, checkBox: this.checkBoxName, description: this.description,
            })
        } else {
            console.log('You already used: ' + this.variableName + ' as an Link name');
        }
    }

    getListElement() {
        //TODO : Remove the name from here and update ejs files
        return {
            name: this.variableName, link: {
                name: this.variableName, checkBox: this.checkBoxName, description: this.description,
            }, element: this.$(this.el)
        };
    }
}