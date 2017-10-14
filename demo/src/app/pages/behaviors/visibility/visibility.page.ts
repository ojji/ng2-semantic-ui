import { Component } from "@angular/core";
import { ApiDefinition } from "../../../components/api/api.component";
@Component({
    selector: "demo-page-visibility",
    templateUrl: "./visibility.page.html"
})
export class VisibilityPage {
    public exampleInfiniteScrollTemplate:string = exampleInfiniteScrollTemplate;
    public api:ApiDefinition = [
        {
            selector: "[suiVisibility]",
            properties: [
                {
                    name: "disabled",
                    type: "boolean",
                    description: `Set whether the element events should be enabled or not. 
                    This is useful if you need to adjust scroll position and do not want to trigger callbacks during the position change.`,
                    defaultValue: "false",
                    required: false
                },
                {
                    name: "observeChanges",
                    type: "boolean",
                    description: "Set whether the element should watch for content changes.",
                    defaultValue: "true",
                    required: false
                },
                {
                    name: "checkOnRefresh",
                    type: "boolean",
                    description: "Set whether the element should re-evaluate the visibility event conditions after a refresh call.",
                    defaultValue: "true",
                    required: false
                },
                {
                    name: "refreshOnResize",
                    type: "boolean",
                    description: "Set whether the element should refresh on viewport resizing.",
                    defaultValue: "true",
                    required: false
                },
                {
                    name: "once",
                    type: "boolean",
                    description: `If set to <code>false</code>, the visibility events are firing every time their conditions 
                    are becoming true. If <code>true</code>, the events fire only once.`,
                    defaultValue: "false",
                    required: false
                },
                {
                    name: "continuous",
                    type: "boolean",
                    description: `If set to <code>true</code>, the visibility events are firing 
                    every time their conditions are evaluating to true.`,
                    defaultValue: "false",
                    required: false
                },
                {
                    name: "steps",
                    type: "Array<number|string> | '*'",
                    description: `Sets the steps for the onPassing and the onPassingReverse events.
                    When supplied an array, a step value can be given either in pixel amount (number) 
                    or in percentage of the element height (string). You can mix these values aswell.
                    Example values that are valid for the <code>steps</code> array:
                    <code>[steps]="[100, 200]"</code>, <code>[steps]="['25%', '50%', '75%']"</code>.
                    If it is set to <code>'*'</code>, the events fire on every scroll change.`,
                    defaultValue: "'*'",
                    required: false
                }
            ],
            events: [
                {
                    name: "onRefresh",
                    type: "void",
                    description: "Fires when the element has to refresh, for example on DOM changes or viewport resizes."
                },
                {
                    name: "onPassing",
                    type: "PassingAmount",
                    description: "Fires when the element is passed a given step downwards on the top of the viewport."
                },
                {
                    name: "onPassingReverse",
                    type: "PassingAmount",
                    description: "Fires when the element is passed a given step upwards on the top of the viewport."
                },
                {
                    name: "onOnScreen",
                    type: "void",
                    description: "Fires when any part of the element is in the viewport."
                },
                {
                    name: "onOffScreen",
                    type: "void",
                    description: "Fires when the element leaves the viewport."
                },
                {
                    name: "onTopPassed",
                    type: "void",
                    description: "Fires when the top part of the element passes the top of the viewport."
                },
                {
                    name: "onTopNotPassed",
                    type: "void",
                    description: "Fires when the top part of the element does not pass the top of the viewport."
                },
                {
                    name: "onTopVisible",
                    type: "void",
                    description: "Fires when the top part of the element is visible in the viewport."
                },
                {
                    name: "onTopNotVisible",
                    type: "void",
                    description: "Fires when the top part of the element is not visible in the viewport."
                },
                {
                    name: "onBottomPassed",
                    type: "void",
                    description: "Fires when the bottom part of the element passed the top of the viewport."
                },
                {
                    name: "onBottomNotPassed",
                    type: "void",
                    description: "Fires when the bottom part of the element does not pass the top of the viewport."
                },
                {
                    name: "onBottomVisible",
                    type: "void",
                    description: "Fires when the bottom part of the element is visible in the viewport."
                },
                {
                    name: "onBottomNotVisible",
                    type: "void",
                    description: "Fires when the bottom part of the element is not visible in the viewport."
                }
            ]
        },
        {
            selector: "PassingAmount",
            properties: [
                {
                    name: "inPixels",
                    type: "number",
                    description: "A distance from the top of an element's content has been passed in pixels."
                },
                {
                    name: "inPercentage",
                    type: "number",
                    description: "A distance from the top of an element's content has been passed as a percentage of the element's height."
                }
            ]
        }
    ];
}

const exampleInfiniteScrollTemplate = `
<div class="ui segment" suiVisibility
    (onBottomVisible)="loadAdditionalContent()"
    [once]="false"
    [observeChanges]="true">
    <h3 class="ui dividing center aligned header">Infinite scroll example</h3>
    <img src="https://semantic-ui.com/images/wireframe/centered-paragraph.png" class="ui image">
    <div class="ui divider"></div>
    <img src="https://semantic-ui.com/images/wireframe/short-paragraph.png" class="ui image">
    <div class="ui divider"></div>
    <img src="https://semantic-ui.com/images/wireframe/media-paragraph.png" class="ui image">
    <div class="ui divider"></div>
    <img src="https://semantic-ui.com/images/wireframe/short-paragraph.png" class="ui image">
    <div class="ui divider"></div>
    <img src="https://semantic-ui.com/images/wireframe/media-paragraph.png" class="ui image">
    <div class="ui divider"></div>
    <img src="https://semantic-ui.com/images/wireframe/media-paragraph.png" class="ui image">
    <div class="ui divider"></div>
    <img src="https://semantic-ui.com/images/wireframe/media-paragraph.png" class="ui image">
    <div class="ui divider"></div>
    <img src="https://semantic-ui.com/images/wireframe/media-paragraph.png" class="ui image">
    <div class="ui divider"></div>
    <div *ngFor="let content of contents; let i = index">
        <h3 class="ui header">Additional content #{{i+1}}</h3>
        <img src="https://semantic-ui.com/images/wireframe/centered-paragraph.png" class="ui image">
        <div class="ui divider"></div>
        <img src="https://semantic-ui.com/images/wireframe/short-paragraph.png" class="ui image">
        <div class="ui divider"></div>
        <img src="https://semantic-ui.com/images/wireframe/media-paragraph.png" class="ui image">
        <div class="ui divider"></div>
    </div>
    <div class="ui large centered inline text loader" [class.active]="loading">
        Adding more content...
    </div>
</div>
`;

@Component({
    selector: "example-visibility-infinite-scroll",
    template: exampleInfiniteScrollTemplate
})
export class VisibilityExampleInfiniteScroll {
    public loading:boolean = false;
    public contents:string[] = [];

    constructor() {
    }

    public loadAdditionalContent():void {
        if (this.contents.length < 3 && !this.loading) {
            this.loading = true;
            setTimeout(() => {
                this.contents.push("new item");
                this.loading = false;
            }, 3000);
        }
    }
}

export const VisibilityPageComponents = [VisibilityPage, VisibilityExampleInfiniteScroll];
