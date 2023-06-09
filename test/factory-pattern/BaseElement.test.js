import $ from 'jquery';
import { JSDOM } from "jsdom";
import {BaseElement} from "../../bin/scripts/factory-pattern/BaseElement.js"

describe('BaseElement', function() {
    let baseElement, el;

    beforeEach(() => {
        const dom = new JSDOM(`<!DOCTYPE html><div></div>`);
        const $dom = $(dom.window);
        el = $dom('div');
        baseElement = new BaseElement($dom, el, 'base-example');
    });

    it('should return true when hasDescription is given a non-empty string', () => {
        const result = baseElement.hasDescription('description');
        expect(result).toBe(true);
        expect(baseElement.description).toBe('description');
    });

    it('should return false when hasDescription is given an empty string', () => {
        const result = baseElement.hasDescription('');
        expect(result).toBe(false);
        expect(baseElement.description).toBeNull();
    });

    it('should throw error when process method is called', async () => {
        await expect(baseElement.process()).rejects.toThrow('process() method not implemented');
    });

    it('should throw error when pushData method is called', () => {
        expect(() => baseElement.pushData()).toThrow('process() method not implemented');
    });

    it('should throw error when getListElement method is called', () => {
        expect(() => baseElement.getListElement()).toThrow('getListElement() method not implemented');
    });
});
