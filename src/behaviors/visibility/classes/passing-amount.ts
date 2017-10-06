export class PassingAmount {
    constructor(public inPixels:number, public inPercentage:number) { }

    public static comparer(left:PassingAmount, right:PassingAmount):boolean {
        return left.inPercentage === right.inPercentage && left.inPixels === right.inPixels;
    }
}
