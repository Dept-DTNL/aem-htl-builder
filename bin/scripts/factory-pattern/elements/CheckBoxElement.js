import {data} from "../../file_helper.js";
import {BaseElement, checkBoxNames} from "../BaseElement.js";

export class CheckBoxElement extends BaseElement {
    constructor($, el, attrName) {
        super($, el, attrName);
    }

    async process() {
        this.variableName = this.attrName.slice(9);
        let modelName = this.listName ? this.listName : 'model';
        this.$(this.el).attr('data-sly-test', "${" + modelName + `.${this.variableName}` + "}");
        this.$(this.el).removeAttr(this.attrName);
    }

    pushData() {
        if (!checkBoxNames.includes(this.variableName)) {
            data.fields.push({
                name: this.variableName, javaType: "boolean", resourceType: "checkbox", description: this.description
            })
            checkBoxNames.push(this.variableName);
        }
    }

    getListElement() {
        return {
            name: this.variableName,
            javaType: "boolean",
            resourceType: "checkbox",
            description: this.description,
            element: this.$(this.el)
        };
    }
}