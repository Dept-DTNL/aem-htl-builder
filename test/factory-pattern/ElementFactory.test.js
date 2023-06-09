
// Import your modules
import {TextFieldElement} from "../../bin/scripts/factory-pattern/elements/TextFieldElement.js";
import {ElementFactory} from "../../bin/scripts/factory-pattern/ElementFactory.js";
import $ from 'jquery';
import {JSDOM} from "jsdom";
import * as fs from "fs";

// Read the HTML file
const html = fs.readFileSync('test/factory-pattern/test-file.html', 'utf8');

// Use jsdom to create a virtual DOM
let dom;
let container;

beforeEach(() => {
    // Construct a new JSDOM object with the HTML content
    dom = new JSDOM(html);
    // Get the container element
    container = dom.window.document.querySelector("#myDiv");
});

// Now you can write tests that use this HTML content
describe("ElementFactory", () => {
    // Mock the attributes
    const textFieldAttr = [{name: 'textfield-name', value: 'test value'}];
    const textAreaAttr = [{name: 'textarea-name', value: 'test value'}];

    it("renders a div element", () => {
        expect(container.textContent).toBe("Hello, World!");
    });

    it("has a button", () => {
        const button = dom.window.document.querySelector("#myButton");
        expect(button.textContent).toBe("Click me");
    });

    test("convertAttributes creates TextFieldElement when attribute starts with 'textfield-'", async () => {
        const factory = new ElementFactory($, el, textFieldAttr);
        const element = await factory.convertAttributes();

        // Ensure that the correct type of element is created
        expect(element).toBeInstanceOf(TextFieldElement);
    });
});