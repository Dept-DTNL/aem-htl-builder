import {data} from "../../file_helper.js";
import {BaseElement} from "../BaseElement.js";

export class ImgElement extends BaseElement {
    constructor($, el, attrName) {
        super($, el, attrName);
        this.checkBoxName = null;
    }

    async process() {
        this.variableName = this.attrName.slice(4);
        let modelName = this.listName ? this.listName : 'model';

        this.$(this.el).attr('data-sly-test', "${" + modelName + `.${this.variableName}` + "Reference}");
        this.$(this.el).attr('src', "${" + modelName + `.${this.variableName}Reference @ context='uri'` + "}");
        this.$(this.el).removeAttr(this.attrName);
    }

    pushData() {
        if (!data.images.map(img => img.name).includes(this.variableName)) {
            data.images.push({
                name: this.variableName,
                fileName: this.variableName + 'Name',
                fileReference: this.variableName + 'Reference',
                description: this.description
            })
        } else {
            console.log('You already used: ' + this.variableName + ' as an image name');
        }
    }

    getListElement() {
        return {
            img: {
                name: this.variableName,
                fileName: this.variableName + 'Name',
                fileReference: this.variableName + 'Reference',
                description: this.description,
            }, element: this.$(this.el)
        };
    }
}