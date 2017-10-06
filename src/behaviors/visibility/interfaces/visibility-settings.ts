export interface IVisibilitySettings {
    observeChanges?:boolean;
    type?:boolean;
    checkOnRefresh?:boolean;
    includeMargins?:boolean;
    refreshOnResize?:boolean;
    once?:boolean;
    emitSteps:(number|string)[] | "*";
    continuous:boolean;
}
