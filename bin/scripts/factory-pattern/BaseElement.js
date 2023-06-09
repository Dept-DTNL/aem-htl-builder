
export let checkBoxNames = [];
/**
 * This variable is used to store the i18n elements
 * To check later if the element is already present in the json file
 * @type {{}}
 */
export let i18nElements = {};

export class BaseElement {
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