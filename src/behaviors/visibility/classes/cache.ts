import { IElement } from "../interfaces/element";
import { IScreen } from "../interfaces/screen";
import { IScrollPosition } from "../interfaces/scroll-position";
import { IPassingStep } from "../interfaces/passing-step";

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
}

export {IElement};
export {IScreen};
export {IScrollPosition};
export {IPassingStep};
