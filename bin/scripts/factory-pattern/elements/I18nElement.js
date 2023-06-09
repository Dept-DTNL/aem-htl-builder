import {BaseElement, i18nElements} from "../BaseElement.js";

export class I18nElement extends BaseElement {
    constructor($, el, attrName) {
        super($, el, attrName);
        this.value = null;
    }

    async process() {
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
            name: this.variableName, element: this.$(this.el)
        };
    }
}