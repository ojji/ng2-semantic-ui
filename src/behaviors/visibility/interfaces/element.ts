export interface IElement {
    top:number;
    bottom:number;
    height:number;
    width:number;
    fits:boolean;

    offset:{
        top:number;
        left:number;
    };

    topPassed:boolean;
    bottomPassed:boolean;
    topVisible:boolean;
    bottomVisible:boolean;
    pixelsPassed:number;
    percentagePassed:number;
    onScreen:boolean;
    passing:boolean;
    offScreen:boolean;
}
