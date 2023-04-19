import {data} from "../file_helper.js";
import {i18nElements} from "./BaseElement.js";

let checkBoxNames = [];

class ListBaseElement {
    constructor($, el, attrName) {
        this.$ = $;
        this.el = el;
        this.attrName = attrName;
        this.variableName = null;
        this.description = null;
    }

    async process() {
        throw new Error('process() method not implemented');
    }

    hasDescription(descriptionValue) {
        if (typeof descriptionValue === 'string' && descriptionValue.length > 0) {
            this.description = descriptionValue;
            return true;
        }
        return false;
    }

    convertObject() {
        throw new Error('process() method not implemented');
    }

}

class TextFieldElement extends ListBaseElement {
    constructor($, el, attrName) {
        super($, el, attrName);
    }

    async process() {
        this.variableName = this.attrName.slice(10);
        let tagValue = "${model." + this.variableName + "}";
        this.$(this.el).text(tagValue);
        this.$(this.el).removeAttr(this.attrName);
        console.log('Processing TextFieldElement');
    }

    convertObject() {
        return {
            name: this.variableName,
            javaType: "String",
            resourceType: "textfield",
            description: this.description
        };
    }

}

class TextAreaElement extends ListBaseElement {
    constructor($, el, attrName) {
        super($, el, attrName);
    }

    async process() {
        // const textValue = $(el).text();
        this.variableName = this.attrName.slice(9);
        let tagValue = "${model." + this.variableName + "}";
        this.$(this.el).text(tagValue);
        this.$(this.el).removeAttr(this.attrName);
        console.log('Processing TextAreaElement');
    }

    convertObject() {
        // if (!data.fields.map(field => field.name).includes(this.variableName)) {
        //     data.fields.push({
        //         name: this.variableName,
        //         javaType: "String",
        //         resourceType: "textarea",
        //         description: this.description
        //     });
        // } else {
        //     console.log('Field already exists: ' + this.variableName);
        // }
        return {
            name: this.variableName,
            javaType: "String",
            resourceType: "textarea",
            description: this.description
        };
    }
}

class CheckBoxElement extends ListBaseElement {
    constructor($, el, attrName) {
        super($, el, attrName);
    }

    async process() {
        this.variableName = this.attrName.slice(9);
        // let tagValue = "${model." + variableName + "}";
        this.$(this.el).attr('data-sly-test', "${" + `model.${this.variableName}` + "}");
        this.$(this.el).removeAttr(this.attrName);
        console.log('Processing CheckBox');
    }

    convertObject() {
        // if (!checkBoxNames.includes(this.variableName)) {
        //     data.fields.push({
        //         name: this.variableName,
        //         javaType: "boolean",
        //         resourceType: "checkbox",
        //     })
        //     checkBoxNames.push(this.variableName);
        // }
        return {
            name: this.variableName,
            javaType: "boolean",
            resourceType: "checkbox",
            description: this.description
        };
    }
}

class LinkElement extends ListBaseElement {
    constructor($, el, attrName) {
        super($, el, attrName);
        this.checkBoxName = null;
    }

    async process() {
        this.variableName = this.attrName.slice(5);
        let checkBoxName = this.variableName + "Checkbox";

        this.$(this.el).attr('href', "${" + `model.${this.variableName}` + "}");
        this.$(this.el).attr('target', "${" + `model.${checkBoxName} ? '_blank' : '_self'` + "}");
        this.$(this.el).removeAttr(this.attrName);
        // TODO: Make sure that sending null value of checkbox is not a problem for dialog and sling model
        this.checkBoxName = checkBoxName;
        if (!checkBoxNames.includes(checkBoxName)) {
            checkBoxNames.push(checkBoxName);
        }
    }

    convertObject() {
        // if (!data.links.map(link => link.name).includes(this.variableName)) {
        //     data.links.push({
        //         name: this.variableName,
        //         checkBox: this.checkBoxName,
        //         description: this.description,
        //     })
        // } else {
        //     console.log('Link already exists: ' + this.variableName);
        // }
        return {
            name: this.variableName,
            checkBox: this.checkBoxName,
            description: this.description
        };
    }
}
class RichTextElement extends ListBaseElement {
    constructor($, el, attrName) {
        super($, el, attrName);
    }

    async process() {
        console.log('Processing RichTextElement');

        //Add the original content as a comment
        let originalContent = this.$(this.el).prop('outerHTML');
        let commentContent = `\n <!-- RichText original content:-->\n` + `<!-- ${originalContent} -->\n`;
        this.$(this.el).after(`${commentContent}`);

        this.variableName = this.attrName.slice(9);
        let tagValue = "${model." + this.variableName + " @ context='html'}";
        this.$(this.el).text(tagValue);
        this.$(this.el).removeAttr(this.attrName);
    }

    convertObject() {
        // if (!data.richTexts.map(richText => richText.name).includes(this.variableName)) {
        //     data.richTexts.push({
        //         name: this.variableName,
        //         description: this.description,
        //     })
        // } else {
        //     console.log('RichText already exists: ' + this.variableName);
        // }
        return {
            name: this.variableName,
            description: this.description
        };
    }
}

class I18nElement extends ListBaseElement {
    constructor($, el, attrName) {
        super($, el, attrName);
        this.value = null;
    }

    async process() {
        // TODO: Read the json file and check if the key already exists
        this.variableName = this.attrName.slice(5);
        this.variableName = this.variableName.charAt(0).toUpperCase() + this.variableName.slice(1);
        this.value = this.$(this.el).text();

        this.$(this.el).text("${'" + this.variableName + "' @ i18n}");
        this.$(this.el).removeAttr(this.attrName);
    }

    convertObject() {
        if (!i18nElements.hasOwnProperty(this.variableName)) {
            i18nElements[this.variableName] = this.value;
        }
    }
}
export class ListElementFactory {
    constructor($, el, element) {
        this.$ = $;
        this.el = el;
        this.liObject = element;
    }

    async convertAttributes() {
        let description;
        let element = new ListBaseElement();
        let liElem = false;
        if(this.liObject!=null){
            const objectName = this.liObject.name;
            if (objectName.startsWith('textfield-')) {
                element = new TextFieldElement(this.$, this.el, objectName);
                liElem = true;
            }
            else if (objectName.startsWith('textarea-')) {
                element = new TextAreaElement(this.$, this.el, objectName);
                liElem = true;

            } else if (objectName.startsWith('checkbox-')) {
                element = new CheckBoxElement(this.$, this.el, objectName);
                liElem = true;

            } else if (objectName.startsWith('link-')) {
                element = new LinkElement(this.$, this.el, objectName);
                liElem = true;

            } else if (objectName.startsWith('i18n-')) {
                element = new I18nElement(this.$, this.el, objectName);
                liElem = true;

            }else if (objectName.startsWith('richtext-')) {
                element = new RichTextElement(this.$, this.el, objectName);
                liElem = true;

            }
            if (objectName.startsWith('description')) {
                description = this.liObject.value;
                this.$(this.el).removeAttr(objectName);
            }
            if (element.el != null && liElem) {
                await element.process();
                element.hasDescription(description);
                return element.convertObject();
            }
        }else{
            console.log("Li attribute element is null");
            return false;
        }
    }
}
