import $ from 'jquery';
import { JSDOM } from "jsdom";
import {TextAreaElement} from "../../../bin/scripts/factory-pattern/elements/TextAreaElement.js";
import {data} from "../../../bin/scripts/file_helper.js";
describe('TextAreaElement', function() {
    let textAreaElement, el;

    beforeEach(() => {
        const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
        const $dom = $(dom.window);
        el = $dom('p');
        textAreaElement = new TextAreaElement($dom, el, 'textarea-message');
        textAreaElement.variableName = 'message';
        textAreaElement.description = 'this is component text area description';
        data.fields = [];  // <---- Reset the fields array
    });

    it('should process element correctly', async () => {
        await textAreaElement.process();
        expect(textAreaElement.variableName).toEqual('message');
        expect(el.text()).toEqual('${model.message}');
        expect(el.attr('textarea-message')).toBeUndefined();
    });

    it('should add an element to the data object if an element does not already exist', function() {
        textAreaElement.pushData();

        expect(data.fields[0]).toEqual({
            name: 'message',
            javaType: 'String',
            resourceType: 'textarea',
            description: 'this is component text area description'
        });
    });

    it('should not add an element to the data object if an element already exist', function() {
        data.fields.push({
            name: 'message',
            javaType: 'String',
            resourceType: 'textarea',
            description: 'this is component text area description'
        });

        textAreaElement.pushData();

        const existingVariables = data.fields.filter(field => field.name === 'message');
        expect(existingVariables.length).toBe(1);
    });

    it('should get list element correctly', () => {
        const listElement = textAreaElement.getListElement();
        expect(listElement.name).toEqual('message');
        expect(listElement.javaType).toEqual('String');
        expect(listElement.resourceType).toEqual('textarea');
        expect(listElement.description).toEqual('this is component text area description');
        expect(listElement.element.get()).toContainEqual(el.get(0));
    });
});