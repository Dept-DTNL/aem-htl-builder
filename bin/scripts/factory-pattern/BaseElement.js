import {data} from "../file_helper.js";

let checkBoxNames = [];
/**
 * This variable is used to store the i18n elements
 * To check later if the element is already present in the json file
 * @type {{}}
 */
export let i18nElements = {};

class BaseElement {
    constructor($, el, attrName) {
        this.$ = $;
        this.el = el;
        this.attrName = attrName;
        this.variableName = null;
        this.description = null;
        this.listName = null;
        this.customElement = false;
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

    pushData() {
        throw new Error('process() method not implemented');
    }

    getListElement() {
        throw new Error('getListElement() method not implemented');
    }
}

class TextFieldElement extends BaseElement {
    constructor($, el, attrName) {
        super($, el, attrName);
    }

    async process() {
        this.variableName = this.attrName.slice(10);
        let modelName = this.listName ? this.listName : 'model';
        let tagValue = "${"+modelName+"." + this.variableName + "}";
        this.$(this.el).text(tagValue);
        this.$(this.el).removeAttr(this.attrName);
        // console.log('Processing TextFieldElement');
        // return Promise.resolve({attrName: 'textField', variableName: this.variableName});
    }

    pushData() {
        if (!data.fields.map(field => field.name).includes(this.variableName)) {
            data.fields.push({
                name: this.variableName,
                javaType: "String",
                resourceType: "textfield",
                description: this.description
            });
        } else {
            console.log('Field already exists: ' + this.variableName);
        }
    }

    getListElement() {
        return {
            name: this.variableName,
            javaType: "String",
            resourceType: "textfield",
            description: this.description,
            element : this.$(this.el)
        };
    }

}

class TextAreaElement extends BaseElement {
    constructor($, el, attrName) {
        super($, el, attrName);
    }

    async process() {
        this.variableName =this.attrName.slice(9);
        let modelName = this.listName ? this.listName : 'model';
        let tagValue = "${"+modelName+"." + this.variableName + "}";
        this.$(this.el).text(tagValue);
        this.$(this.el).removeAttr(this.attrName);
        // console.log('Processing TextAreaElement');
    }

    pushData() {
        if (!data.fields.map(field => field.name).includes(this.variableName)) {
            data.fields.push({
                name: this.variableName,
                javaType: "String",
                resourceType: "textarea",
                description: this.description
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
            element : this.$(this.el)
        };
    }
}

class CheckBoxElement extends BaseElement {
    constructor($, el, attrName) {
        super($, el, attrName);
    }

    async process() {
        this.variableName = this.attrName.slice(9);
        let modelName = this.listName ? this.listName : 'model';
        this.$(this.el).attr('data-sly-test', "${" + modelName+`.${this.variableName}` + "}");
        this.$(this.el).removeAttr(this.attrName);
        // console.log('Processing CheckBox');
    }

    pushData() {
        if (!checkBoxNames.includes(this.variableName)) {
            data.fields.push({
                name: this.variableName,
                javaType: "boolean",
                resourceType: "checkbox",
                description: this.description
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
            element : this.$(this.el)
        };
    }
}

class LinkElement extends BaseElement {
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
        // TODO: Make sure that sending null value of checkbox is not a problem for dialog and sling model
        this.checkBoxName = checkBoxName;
        if (!checkBoxNames.includes(checkBoxName)) {
            checkBoxNames.push(checkBoxName);
        }
    }

    pushData() {
        if (!data.links.map(link => link.name).includes(this.variableName)) {
            data.links.push({
                name: this.variableName,
                checkBox: this.checkBoxName,
                description: this.description,
            })
        } else {
            console.log('You already used: ' + this.variableName + ' as an Link name');
        }
    }

    getListElement() {
        return {
            name: this.variableName,
            link: {
                name: this.variableName,
                checkBox: this.checkBoxName,
                description: this.description,
            },
            element : this.$(this.el)
        };
    }
}

class ImgElement extends BaseElement {
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
            name: this.variableName,
            img: {
                name: this.variableName,
                fileName: this.variableName + 'Name',
                fileReference: this.variableName + 'Reference',
                description: this.description,
            },
            element : this.$(this.el)
        };
    }
}


class RichTextElement extends BaseElement {
    constructor($, el, attrName) {
        super($, el, attrName);
    }

    async process() {
        // console.log('Processing RichTextElement');
        this.variableName =this.attrName.slice(9);

        let modelName = this.listName ? this.listName : 'model';
        let tagValue = "${"+modelName+"." + this.variableName + " @ context='html'}";
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
                name: this.variableName,
                description: this.description,
            })
        } else {
            console.log('RichText already exists: ' + this.variableName);
        }
    }

    getListElement() {
        return {
            name: this.variableName,
            richText: {
                name: this.variableName,
                description: this.description,
            },
            element : this.$(this.el)
        };
    }
}

class I18nElement extends BaseElement {
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

    pushData() {
        if (!i18nElements.hasOwnProperty(this.variableName)) {
            i18nElements[this.variableName] = this.value;
        }
    }

    getListElement() {
        if (!i18nElements.hasOwnProperty(this.variableName)) {
            i18nElements[this.variableName] = this.value;
        }
        return {
            name: this.variableName,
            element : this.$(this.el)
        };
    }
}

export class ElementFactory {
    constructor($, el, attributes) {
        this.$ = $;
        this.el = el;
        this.attributes = attributes;
    }

    async convertAttributes() {
        let description;
        // let checkBox;
        let element = new BaseElement();
        for (const attr of this.attributes) {
            const attrName = attr.name;
            if (attrName.startsWith('textfield-')) {
                element = new TextFieldElement(this.$, this.el, attrName);
                element.customElement = true;
            } else if (attrName.startsWith('textarea-')) {
                element = new TextAreaElement(this.$, this.el, attrName);
                element.customElement = true;
            } else if (attrName.startsWith('checkbox-')) {
                element = new CheckBoxElement(this.$, this.el, attrName);
                element.customElement = true;
            } else if (attrName.startsWith('link-')) {
                element = new LinkElement(this.$, this.el, attrName);
                element.customElement = true;
            } else if (attrName.startsWith('img-')) {
                element = new ImgElement(this.$, this.el, attrName);
                element.customElement = true;
            } else if (attrName.startsWith('i18n-')) {
                element = new I18nElement(this.$, this.el, attrName);
                element.customElement = true;
            } else if (attrName.startsWith('richtext-')) {
                element = new RichTextElement(this.$, this.el, attrName);
                element.customElement = true;
            }
            if (attrName.startsWith('description')) {
                description = attr.value;
                this.$(this.el).removeAttr(attrName);
            }
            if (element.el != null && element.customElement) {
                await element.process();
            }
        }
        if (element.variableName != null) {
            element.hasDescription(description);
            element.pushData();
        }
        return element;
    }

    async convertList(listName) {
        let description;
        let element = new BaseElement();
        if (listName == null || listName === '') {
            // listName = 'default';
            return null;
        }
        for (const attr of this.attributes) {
            const objectName = attr.name;
            if (objectName.startsWith('textfield-')) {
                element = new TextFieldElement(this.$, this.el, objectName);
                element.listName = listName;
            } else if (objectName.startsWith('textarea-')) {
                element = new TextAreaElement(this.$, this.el, objectName);
                element.listName = listName;
            } else if (objectName.startsWith('checkbox-')) {
                element = new CheckBoxElement(this.$, this.el, objectName);
                element.listName = listName;
            } else if (objectName.startsWith('link-')) {
                element = new LinkElement(this.$, this.el, objectName);
                element.listName = listName;
            } else if (objectName.startsWith('img-')) {
                element = new ImgElement(this.$, this.el, objectName);
                element.listName = listName;
            }   else if (objectName.startsWith('i18n-')) {
                element = new I18nElement(this.$, this.el, objectName);
                element.listName = listName;
            } else if (objectName.startsWith('richtext-')) {
                element = new RichTextElement(this.$, this.el, objectName);
                element.listName = listName;
            }
            if (objectName.startsWith('description')) {
                description = this.attr.value;
                this.$(this.el).removeAttr(objectName);
            }
            if (element.el != null && (element.listName != null && element.listName !== 'default' && element.listName !== '')) {
                await element.process();
                element.hasDescription(description);
                return element.getListElement();
            }
        }
        return null;
    }
}