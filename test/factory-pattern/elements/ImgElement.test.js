import $ from 'jquery';
import { JSDOM } from "jsdom";
import {ImgElement} from "../../../bin/scripts/factory-pattern/elements/ImgElement.js";
import {data} from "../../../bin/scripts/file_helper.js";
import {i18nElements} from "../../../bin/scripts/factory-pattern/BaseElement.js";

describe('ImgElement', function() {
    let imgElement, el;

    beforeEach(() => {
        const dom = new JSDOM(`<!DOCTYPE html><img src="example.jpg"/>`);
        const $dom = $(dom.window);
        el = $dom('img');
        imgElement = new ImgElement($dom, el, 'img-example');
        imgElement.variableName = 'example';
        imgElement.description = 'this is an example image';
    });

    afterEach(() => {
        data.images = [];
    });

    it('should process correctly', async () => {
        await imgElement.process();
        expect(imgElement.variableName).toEqual('example');
        expect(el.attr('data-sly-test')).toEqual('${model.exampleReference}');
        expect(el.attr('src')).toEqual('${model.exampleReference @ context=\'uri\'}');
        expect(el.attr('img-example')).toBeUndefined();
    });

    it('should add image to data object when it does not exist', function() {
        imgElement.pushData();
        expect(data.images[0]).toEqual({
            name: 'example',
            fileName: 'exampleName',
            fileReference: 'exampleReference',
            description: 'this is an example image'
        });
    });

    it('should not add image to data object when image already exists', function() {
        data.images.push({
            name: 'example',
            fileName: 'exampleName',
            fileReference: 'exampleReference',
            description: 'this is an example image'
        });

        imgElement.pushData();

        const existingImages = data.images.filter(img => img.name === 'example');
        expect(existingImages.length).toBe(1);
    });

    it('should get list element correctly', () => {
        const listElement = imgElement.getListElement();
        expect(listElement.img.name).toEqual('example');
        expect(listElement.img.fileName).toEqual('exampleName');
        expect(listElement.img.fileReference).toEqual('exampleReference');
        expect(listElement.img.description).toEqual('this is an example image');
        expect(listElement.element.get()).toContainEqual(el.get(0));
    });
});
