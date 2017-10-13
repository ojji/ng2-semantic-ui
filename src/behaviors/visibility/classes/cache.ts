import { IElement } from "../interfaces/element";
import { IScreen } from "../interfaces/screen";
import { IScrollPosition } from "../interfaces/scroll-position";
import { IPassingStep } from "../interfaces/passing-step";

class ScrollPosition implements IScrollPosition {
    public x:number;
    public y:number;
}

class Screen implements IScreen {
    public height:number;
    public top:number;
    public bottom:number;
}

class Element implements IElement {
    public top:number;
    public bottom:number;
    public height:number;
    public width:number;
    public fits:boolean;
    public offset:{
        top:number;
        left:number;
    };
    public topPassed:boolean;
    public bottomPassed:boolean;
    public topVisible:boolean;
    public bottomVisible:boolean;
    public pixelsPassed:number;
    public percentagePassed:number;
    public onScreen:boolean;
    public passing:boolean;
    public offScreen:boolean;
}

export class Cache {
    public element:IElement;
    public screen:IScreen;
    public scroll:IScrollPosition;
    public direction:"up" | "down" | "static";
    public sortedSteps:IPassingStep[] | "*";
    public occuredCallbacks:{
        down:(IPassingStep | "*")[];
        up:(IPassingStep | "*")[];
    };

    constructor() {
        this.element = new Element();
        this.screen = new Screen();
        this.scroll = new ScrollPosition();
    }
}

export {IElement};
export {IScreen};
export {IScrollPosition};
export {IPassingStep};
