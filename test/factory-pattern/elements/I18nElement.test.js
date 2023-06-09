import $ from 'jquery';
import {JSDOM} from "jsdom";
import {I18nElement} from "../../../bin/scripts/factory-pattern/elements/I18nElement.js";
import {i18nElements} from "../../../bin/scripts/factory-pattern/BaseElement.js";

describe('I18nElement', function () {
    let i18nElement, el;

    beforeEach(() => {
        const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
        const $dom = $(dom.window);
        el = $dom('p');
        i18nElement = new I18nElement($dom, el, 'i18n-message');
        i18nElement.variableName = 'message';
        i18nElement.value = 'This is a i18n message';
    });

    afterEach(() => {
        for (let prop in i18nElements) {
            if (i18nElements.hasOwnProperty(prop)) {
                delete i18nElements[prop];
            }
        }
    });


    it('should process correctly', async () => {
        await i18nElement.process();
        expect(i18nElement.variableName).toEqual('Message');
        expect(el.text()).toEqual("${'Message' @ i18n}");
        expect(el.attr('i18n-message')).toBeUndefined();
    });

    it('should add element to i18nElements object when it does not exist', function () {
        i18nElement.pushData();

        expect(i18nElements['message']).toEqual('This is a i18n message');
    });

    it('should not add element to i18nElements object when it already exists', function () {
        i18nElements['Message'] = 'This is a i18n message';

        i18nElement.pushData();

        const existingVariables = Object.keys(i18nElements).filter(key => key === 'Message');
        expect(existingVariables.length).toBe(1);
    });

    it('should get list element correctly', () => {
        const listElement = i18nElement.getListElement();
        expect(listElement.name).toEqual('message');
        expect(listElement.element.get()).toContainEqual(el.get(0));
    });
});