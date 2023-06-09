import $ from 'jquery';
import { JSDOM } from "jsdom";
import {TextFieldElement} from "../../../bin/scripts/factory-pattern/elements/TextFieldElement.js";
import {data} from "../../../bin/scripts/file_helper.js";
describe('TextFieldElement', function() {
    let textFieldElement, el;

    beforeEach(() => {
        const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`, { url: "http://localhost" });
        const $dom = $(dom.window);
        el = $dom('p');
        textFieldElement = new TextFieldElement($dom, el, 'textfield-title');
    });

    it('should process element correctly', async () => {
        await textFieldElement.process();
        expect(textFieldElement.variableName).toEqual('title');
        expect(el.text()).toEqual('${model.title}');
        expect(el.attr('textfield-title')).toBeUndefined();
    });

    it('should add an element to the data object if an element does not already exist', function() {
        textFieldElement.variableName = 'title';
        textFieldElement.description = 'this is component title';
        textFieldElement.pushData();

        expect(data.fields[0]).toEqual({
            name: 'title',
            javaType: 'String',
            resourceType: 'textfield',
            description: 'this is component title'
        });
    });

    it('should not add an element to the data object if an element already exist', function() {
        textFieldElement.variableName = 'existingVariable';
        textFieldElement.description = 'existingDescription';

        data.fields.push({
            name: 'existingVariable',
            javaType: 'String',
            resourceType: 'textfield',
            description: 'existingDescription'
        });

        textFieldElement.pushData();

        // We filter the array for items with the name 'existingVariable' and expect only one item in the resulting array
        const existingVariables = data.fields.filter(field => field.name === 'existingVariable');
        expect(existingVariables.length).toBe(1);
    });

    it('should get list element correctly', () => {
        textFieldElement.variableName = 'testVariable';
        textFieldElement.description = 'testDescription';
        const listElement = textFieldElement.getListElement();
        expect(listElement.name).toEqual('testVariable');
        expect(listElement.javaType).toEqual('String');
        expect(listElement.resourceType).toEqual('textfield');
        expect(listElement.description).toEqual('testDescription');
        expect(listElement.element.get()).toContainEqual(el.get(0));
    });
});