import $ from 'jquery';
import { JSDOM } from "jsdom";
import {RichTextElement} from "../../../bin/scripts/factory-pattern/elements/RichTextElement.js";
import {data} from "../../../bin/scripts/file_helper.js";
describe('RichTextElement', function() {
    let richTextElement, el;

    beforeEach(() => {
        const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
        const $dom = $(dom.window);
        el = $dom('p');
        richTextElement = new RichTextElement($dom, el, 'richtext-content');
        richTextElement.variableName = 'content';
        richTextElement.description = 'rich text description';
        data.richTexts = [];  // <---- Reset the richTexts array
    });

    it('should process element correctly', async () => {
        await richTextElement.process();
        expect(richTextElement.variableName).toEqual('content');
        expect(el.text()).toEqual('${model.content @ context=\'html\'}');
        expect(el.attr('richtext-content')).toBeUndefined();
    });

    it('should add an element to the data object if an element does not already exist', function() {
        richTextElement.pushData();

        expect(data.richTexts[0]).toEqual({
            name: 'content',
            description: 'rich text description'
        });
    });

    it('should not add an element to the data object if an element already exist', function() {
        data.richTexts.push({
            name: 'content',
            description: 'this is a rich text description'
        });

        richTextElement.pushData();

        const existingVariables = data.richTexts.filter(richTexts => richTexts.name === 'content');
        expect(existingVariables.length).toBe(1);
    });

    it('should get list element correctly', () => {
        const listElement = richTextElement.getListElement();
        expect(listElement.richText.name).toEqual('content');
        expect(listElement.richText.description).toEqual('rich text description');
        expect(listElement.element.get()).toContainEqual(el.get(0));
    });
});