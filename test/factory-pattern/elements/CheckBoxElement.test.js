import $ from 'jquery';
import { JSDOM } from "jsdom";
import {CheckBoxElement} from "../../../bin/scripts/factory-pattern/elements/CheckBoxElement.js";
import {data} from "../../../bin/scripts/file_helper.js";
import {checkBoxNames} from "../../../bin/scripts/factory-pattern/BaseElement.js";

describe('CheckBoxElement', function() {
    let checkBoxElement, el;

    beforeEach(() => {
        const dom = new JSDOM(`<!DOCTYPE html><input type="checkbox">`);
        const $dom = $(dom.window);
        el = $dom('input');
        checkBoxElement = new CheckBoxElement($dom, el, 'checkbox-example');
        checkBoxElement.variableName = 'example';
        checkBoxElement.description = 'this is an example checkbox';
    });

    afterEach(() => {
        data.fields = [];
        checkBoxNames.length = 0;
    });

    it('should process correctly', async () => {
        await checkBoxElement.process();
        expect(checkBoxElement.variableName).toEqual('example');
        expect(el.attr('data-sly-test')).toEqual('${model.example}');
        expect(el.attr('checkbox-example')).toBeUndefined();
    });

    it('should add checkbox to data object when it does not exist', function() {
        checkBoxElement.pushData();
        expect(data.fields[0]).toEqual({
            name: 'example',
            javaType: 'boolean',
            resourceType: 'checkbox',
            description: 'this is an example checkbox'
        });
    });

    it('should not add checkbox to data object when checkbox already exists', function() {
        data.fields.push({
            name: 'example',
            javaType: 'boolean',
            resourceType: 'checkbox',
            description: 'this is an example checkbox'
        });
        checkBoxNames.push(checkBoxElement.variableName);

        checkBoxElement.pushData();

        const existingCheckboxes = data.fields.filter(field => field.name === 'example');
        expect(existingCheckboxes.length).toBe(1);
    });

    it('should get list element correctly', () => {
        const listElement = checkBoxElement.getListElement();
        expect(listElement.name).toEqual('example');
        expect(listElement.javaType).toEqual('boolean');
        expect(listElement.resourceType).toEqual('checkbox');
        expect(listElement.description).toEqual('this is an example checkbox');
        expect(listElement.element.get()).toContainEqual(el.get(0));
    });

});
