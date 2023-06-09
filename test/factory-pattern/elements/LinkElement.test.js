import $ from 'jquery';
import { JSDOM } from "jsdom";
import {LinkElement} from "../../../bin/scripts/factory-pattern/elements/LinkElement.js";
import {data} from "../../../bin/scripts/file_helper.js";
import {checkBoxNames} from "../../../bin/scripts/factory-pattern/BaseElement.js";

describe('LinkElement', function() {
    let linkElement, el;

    beforeEach(() => {
        const dom = new JSDOM(`<!DOCTYPE html><a href=""></a>`);
        const $dom = $(dom.window);
        el = $dom('a');
        linkElement = new LinkElement($dom, el, 'link-example');
        linkElement.variableName = 'example';
        linkElement.description = 'this is an example link';
    });

    afterEach(() => {
        data.links = [];
        checkBoxNames.length = 0;
    });

    it('should process correctly', async () => {
        await linkElement.process();
        expect(linkElement.variableName).toEqual('example');
        expect(el.attr('href')).toEqual('${model.example}');
        expect(el.attr('target')).toEqual("${model.exampleCheckbox ? '_blank' : '_self'}");
        expect(el.attr('link-example')).toBeUndefined();
        expect(checkBoxNames).toContain('exampleCheckbox');
    });

    it('should add link to data object when it does not exist', function() {
        linkElement.checkBoxName = 'exampleCheckbox';
        linkElement.pushData();
        expect(data.links[0]).toEqual({
            name: 'example',
            checkBox: 'exampleCheckbox',
            description: 'this is an example link'
        });
    });

    it('should not add link to data object when link already exists', function() {
        data.links.push({
            name: 'example',
            checkBox: 'exampleCheckbox',
            description: 'this is an example link'
        });

        linkElement.pushData();

        const existingLinks = data.links.filter(link => link.name === 'example');
        expect(existingLinks.length).toBe(1);
    });

    it('should get list element correctly', () => {
        linkElement.checkBoxName = 'exampleCheckbox';
        const listElement = linkElement.getListElement();
        expect(listElement.link.name).toEqual('example');
        expect(listElement.link.checkBox).toEqual('exampleCheckbox');
        expect(listElement.link.description).toEqual('this is an example link');
        expect(listElement.element.get()).toContainEqual(el.get(0));
    });

});
