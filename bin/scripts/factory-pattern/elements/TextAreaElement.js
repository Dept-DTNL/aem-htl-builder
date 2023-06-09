import {data} from "../../file_helper.js";
import {BaseElement} from "../BaseElement.js";

export class TextAreaElement extends BaseElement {
    constructor($, el, attrName) {
        super($, el, attrName);
    }

    async process() {
        this.variableName = this.attrName.slice(9);
        let modelName = this.listName ? this.listName : 'model';
        let tagValue = "${" + modelName + "." + this.variableName + "}";
        this.$(this.el).text(tagValue);
        this.$(this.el).removeAttr(this.attrName);
    }

    pushData() {
        if (!data.fields.map(field => field.name).includes(this.variableName)) {
            data.fields.push({
                name: this.variableName, javaType: "String", resourceType: "textarea", description: this.description
            });
        } else {
            console.log('Field already exists: ' + this.variableName);
        }
    }

    getListElement() {
        return {
            name: this.variableName,
            javaType: "String",
            resourceType: "textarea",
            description: this.description,
            element: this.$(this.el)
        };
    }
}