import {data} from "../../file_helper.js";
import {BaseElement} from "../BaseElement.js";

export class VideoElement extends BaseElement {
    constructor($, el, attrName) {
        super($, el, attrName);
        this.poster = null;
    }

    async process() {
        this.variableName = this.attrName.slice(6);
        let modelName = this.listName ? this.listName : 'model';

        let sourceTags = this.$(this.el).find('source');
        sourceTags.each((index, element) => {
            this.$(element).attr('src',"${" + modelName + `.${this.variableName}` + "Reference}");
        });
        let poster = this.$(this.el).attr('poster');
        if(poster){
            this.poster = this.variableName+'PosterReference';
            this.$(this.el).attr('poster',"${" + modelName + `.${this.poster}`+"}");
        }
        this.$(this.el).removeAttr(this.attrName);
        this.$(this.el).append(sourceTags);
    }

    pushData() {
        if (!data.videos.map(video => video.name).includes(this.variableName)) {
            data.videos.push({
                name: this.variableName,
                fileName: this.variableName + 'Name',
                fileReference: this.variableName + 'Reference',
                poster : this.poster,
                description: this.description
            })
        } else {
            console.log('You already used: ' + this.variableName + ' as an video name');
        }
    }

    getListElement() {
        return {
            video: {
                name: this.variableName,
                fileName: this.variableName + 'Name',
                fileReference: this.variableName + 'Reference',
                poster : this.poster,
                description: this.description,
            }, element: this.$(this.el)
        };
    }
}