import {TextFieldElement} from "./elements/TextFieldElement.js";
import {BaseElement} from "./BaseElement.js";
import {TextAreaElement} from "./elements/TextAreaElement.js";
import {CheckBoxElement} from "./elements/CheckBoxElement.js";
import {LinkElement} from "./elements/LinkElement.js";
import {ImgElement} from "./elements/ImgElement.js";
import {VideoElement} from "./elements/VideoElement.js";
import {I18nElement} from "./elements/I18nElement.js";
import {RichTextElement} from "./elements/RichTextElement.js";

export class ElementFactory {
    constructor($, el, attributes) {
        this.$ = $;
        this.el = el;
        this.attributes = attributes;
    }

    async convertAttributes() {
        let description;
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
            } else if (attrName.startsWith('video-')) {
                element = new VideoElement(this.$, this.el, attrName);
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
            } else if (objectName.startsWith('video-')) {
                element = new VideoElement(this.$, this.el, objectName);
                element.listName = listName;
            } else if (objectName.startsWith('i18n-')) {
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