import $ from 'jquery';
import { JSDOM } from "jsdom";
import {VideoElement} from "../../../bin/scripts/factory-pattern/elements/VideoElement.js";
import {data} from "../../../bin/scripts/file_helper.js";

describe('VideoElement', function() {
    let videoElement, el;

    beforeEach(() => {
        const dom = new JSDOM(`<!DOCTYPE html><video><source src="example.mp4"></video>`);
        const $dom = $(dom.window);
        el = $dom('video');
        videoElement = new VideoElement($dom, el, 'video-example');
        videoElement.variableName = 'example';
        videoElement.description = 'this is an example video';
    });

    afterEach(() => {
        data.videos = [];
    });


    it('should process correctly', async () => {
        await videoElement.process();
        expect(videoElement.variableName).toEqual('example');
        expect(el.find('source').attr('src')).toEqual('${model.exampleReference}');
        expect(el.attr('video-example')).toBeUndefined();
    });

    it('should process correctly with poster', async () => {
        // el.attr('poster', 'example.jpg');
        // videoElement = new VideoElement($, el, 'video-example');
        // await videoElement.process();
        // expect(el.attr('poster')).toEqual('${model.examplePosterReference}');
    });

    it('should add video to data object when it does not exist', function() {
        videoElement.pushData();
        expect(data.videos[0]).toEqual({
            name: 'example',
            fileName: 'exampleName',
            fileReference: 'exampleReference',
            poster: null,
            description: 'this is an example video'
        });
    });

    it('should not add video to data object when video already exists', function() {
        data.videos.push({
            name: 'example',
            fileName: 'exampleName',
            fileReference: 'exampleReference',
            poster: null,
            description: 'this is an example video'
        });

        videoElement.pushData();

        const existingVideos = data.videos.filter(video => video.name === 'example');
        expect(existingVideos.length).toBe(1);
    });

    it('should get list element correctly', () => {
        const listElement = videoElement.getListElement();
        expect(listElement.video.name).toEqual('example');
        expect(listElement.video.fileName).toEqual('exampleName');
        expect(listElement.video.fileReference).toEqual('exampleReference');
        expect(listElement.video.poster).toBeNull();
        expect(listElement.video.description).toEqual('this is an example video');
        expect(listElement.element.get()).toContainEqual(el.get(0));
    });

});
