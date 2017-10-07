import { Directive, Renderer2, ElementRef, OnDestroy, OnInit, EventEmitter, Output, Input } from "@angular/core";
import { IPassingStep } from "../interfaces/passing-step";
import { Cache, IElement, IScreen, IScrollPosition } from "../classes/cache";
import { PassingAmount } from "../classes/passing-amount";
import { Subject } from "rxjs/Subject";
import { Subscription } from "rxjs/Subscription";
import "rxjs/add/operator/distinctUntilChanged";

@Directive({
    selector: "[suiVisibility]"
})
export class SuiVisibility implements OnDestroy, OnInit {

    @Input()
    public observeChanges:boolean = true;

    @Input()
    public checkOnRefresh:boolean = true;

    @Input()
    public refreshOnResize:boolean = true;

    @Input()
    public disabled:boolean = false;

    @Output()
    public onRefresh:EventEmitter<void> = new EventEmitter<void>();
    @Input()
    public once:boolean = false;

    @Input()
    public continuous:boolean = false;

    @Input()
    public steps:(number|string)[] | "*";

    @Output()
    public cacheUpdated:EventEmitter<Cache> = new EventEmitter<Cache>();

    @Output()
    public onPassing:EventEmitter<PassingAmount> = new EventEmitter<PassingAmount>();
    private _onPassing:Subject<PassingAmount> = new Subject<PassingAmount>();
    private _onPassingSubcription:Subscription;

    @Output()
    public onPassingReverse:EventEmitter<PassingAmount> = new EventEmitter<PassingAmount>();
    private _onPassingReverse:Subject<PassingAmount> = new Subject<PassingAmount>();
    private _onPassingReverseSubcription:Subscription;

    @Output()
    public onOnScreen:EventEmitter<void> = new EventEmitter<void>();
    private _onOnScreen:Subject<boolean> = new Subject<boolean>();
    private _onOnScreenSubscription:Subscription;

    @Output()
    public onOffScreen:EventEmitter<void> = new EventEmitter<void>();
    private _onOffScreen:Subject<boolean> = new Subject<boolean>();
    private _onOffScreenSubscription:Subscription;

    @Output()
    public onTopPassed:EventEmitter<void> = new EventEmitter<void>();
    private _onTopPassed:Subject<boolean> = new Subject<boolean>();
    private _onTopPassedSubscription:Subscription;

    @Output()
    public onTopNotPassed:EventEmitter<void> = new EventEmitter<void>();
    private _onTopNotPassed:Subject<boolean> = new Subject<boolean>();
    private _onTopNotPassedSubscription:Subscription;

    @Output()
    public onTopVisible:EventEmitter<void> = new EventEmitter<void>();
    private _onTopVisible:Subject<boolean> = new Subject<boolean>();
    private _onTopVisibleSubscription:Subscription;

    @Output()
    public onTopNotVisible:EventEmitter<void> = new EventEmitter<void>();
    private _onTopNotVisible:Subject<boolean> = new Subject<boolean>();
    private _onTopNotVisibleSubscription:Subscription;

    @Output()
    public onBottomPassed:EventEmitter<void> = new EventEmitter<void>();
    private _onBottomPassed:Subject<boolean> = new Subject<boolean>();
    private _onBottomPassedSubscription:Subscription;

    @Output()
    public onBottomNotPassed:EventEmitter<void> = new EventEmitter<void>();
    private _onBottomNotPassed:Subject<boolean> = new Subject<boolean>();
    private _onBottomNotPassedSubscription:Subscription;

    @Output()
    public onBottomVisible:EventEmitter<void> = new EventEmitter<void>();
    private _onBottomVisible:Subject<boolean> = new Subject<boolean>();
    private _onBottomVisibleSubscription:Subscription;

    @Output()
    public onBottomNotVisible:EventEmitter<void> = new EventEmitter<void>();
    private _onBottomNotVisible:Subject<boolean> = new Subject<boolean>();
    private _onBottomNotVisibleSubscription:Subscription;

    private _scrollChanged:EventEmitter<IScrollPosition> = new EventEmitter<IScrollPosition>();

    private _observer:MutationObserver;
    private _cache:Cache;
    private _resizeListener:() => void;
    private _scrollListener:() => void;

    constructor(private _renderer:Renderer2, private _element:ElementRef) { }

    public ngOnInit():void {
        this.initialize();
    }

    public ngOnDestroy():void {
        this.unbindEvents();
    }

    private initialize():void {
        if (this.observeChanges) {
            this.setupObserver();
        }
        this.refresh();
        this.savePosition();
        this.bindEvents();
    }

    private savePosition():void {
        this.saveScreenSize();
        this.saveElementPosition();
    }

    private saveScreenSize():void {
        this._cache.screen.height = window.innerHeight;
    }

    private getOffset():any {
        const rect:ClientRect = this._element.nativeElement.getBoundingClientRect();
        return {
            top: rect.top + window.pageYOffset,
            left: rect.left + window.pageXOffset
        };
    }

    private getHeight():number {
        const rect:ClientRect = this._element.nativeElement.getBoundingClientRect();
        return rect.height;
    }

    private getWidth():number {
        const rect:ClientRect = this._element.nativeElement.getBoundingClientRect();
        return rect.width;
    }

    private getElementPosition():IElement {
        if (!this._cache.element) {
            this.saveElementPosition();
        }
        return this._cache.element;
    }

    private saveElementPosition():void {
        const element:any = {};
        const screen:IScreen = this._cache.screen;
        element.height = this.getHeight();
        element.width  = this.getWidth();
        element.fits   = (element.height < screen.height);
        element.offset = this.getOffset();

        this._cache.element = element;
    }

    private getScrollPosition():IScrollPosition {
        if (!this._cache.scroll) {
            this.saveScrollPosition();
        }
        return this._cache.scroll;
    }

    private saveScrollPosition(scrollPosition?:IScrollPosition):void {
        const scrollPositionValue:IScrollPosition = scrollPosition || { x: window.pageXOffset, y: window.pageYOffset };
        this._cache.scroll = scrollPositionValue;
    }

    private setupObserver():void {
        this._observer = new MutationObserver((records:MutationRecord[]) => {
            this.refresh();
        });
        this._observer.observe(this._element.nativeElement, {
            childList: true,
            subtree: true
        });
    }

    private refresh():void {
        this.reset();
        this.savePosition();
        this.saveSortedSteps();
        if (this.checkOnRefresh) {
            this.checkVisibility();
        }
        this.onRefresh.emit();
    }

    private reset():void {
        this._cache = new Cache();
    }

    private saveCalculations():void {
        this.saveScreenCalculations();
        this.saveElementCalculations();
    }

    private getElementCalculations():IElement {
        if (!this._cache.element) {
            this.saveElementCalculations();
        }
        return this._cache.element;
    }

    private saveElementCalculations():void {
        const screen:IScreen = this.getScreenCalculations();
        const element:IElement = this.getElementPosition();
        element.top = element.offset.top;
        element.bottom = element.offset.top + element.height;

        // visibility
        element.topPassed        = (screen.top >= element.top);
        element.bottomPassed     = (screen.top >= element.bottom);
        element.topVisible       = (screen.bottom >= element.top) && !element.topPassed;
        element.bottomVisible    = (screen.bottom >= element.bottom) && !element.bottomPassed;
        element.pixelsPassed     = 0;
        element.percentagePassed = 0;

        // meta calculations
        element.offScreen = (element.top >= screen.bottom || element.bottom <= screen.top);
        element.onScreen  = (!element.offScreen);
        element.passing   = (element.topPassed && !element.bottomPassed);

        // passing calculations
        if (element.passing) {
            element.pixelsPassed     = (screen.top - element.top);
            element.percentagePassed = (screen.top - element.top) / element.height;
        }
        this._cache.element = element;
    }

    private getScreenCalculations():IScreen {
        if (!this._cache.screen) {
            this.saveScreenCalculations();
        }
        return this._cache.screen;
    }

    private saveScreenCalculations():void {
        const scroll:IScrollPosition = this.getScrollPosition();
        this.saveDirection();
        this._cache.screen.top = scroll.y;
        this._cache.screen.bottom = scroll.y + this._cache.screen.height;
    }

    private getLastScroll():number | boolean {
        if (!this._cache.screen.top) {
            return false;
        }
        return this._cache.screen.top;
    }

    private getDirection():"up" | "down" | "static" {
        if (!this._cache.direction) {
            this.saveDirection();
        }
        return this._cache.direction;
    }

    private saveDirection():void {
        const scroll = this.getScrollPosition();
        const lastScroll = this.getLastScroll();
        let direction:"up" | "down" | "static";
        if (lastScroll && scroll.y > lastScroll) {
            direction = "down";
        } else if (lastScroll && scroll.y < lastScroll) {
            direction = "up";
        } else {
            direction = "static";
        }
        this._cache.direction = direction;
    }

    private checkVisibility(scrollPosition?:IScrollPosition):void {
        if (!this.disabled) {
            this.saveScrollPosition(scrollPosition);
            this.saveCalculations();
            this.cacheUpdated.emit(this._cache);
            this.checkPassing();

            this.checkOnScreen();
            this.checkOffScreen();

            this.checkTopPassed();
            this.checkTopNotPassed();
            this.checkTopVisible();
            this.checkTopNotVisible();

            this.checkBottomPassed();
            this.checkBottomNotPassed();
            this.checkBottomVisible();
            this.checkBottomNotVisible();
        }
    }

    private checkBottomNotPassed():void {
        const element:IElement = this.getElementCalculations();
        if (!element.bottomPassed) {
            this._onBottomNotPassed.next(true);
        } else if (!this.once) {
            this._onBottomNotPassed.next(false);
        }
    }

    private checkBottomPassed():void {
        const element:IElement = this.getElementCalculations();
        if (element.bottomPassed) {
            this._onBottomPassed.next(true);
        } else if (!this.once) {
            this._onBottomPassed.next(false);
        }
    }

    private checkTopNotPassed():void {
        const element:IElement = this.getElementCalculations();
        if (!element.topPassed) {
            this._onTopNotPassed.next(true);
        } else if (!this.once) {
            this._onTopNotPassed.next(false);
        }
    }

    private checkTopPassed():void {
        const element:IElement = this.getElementCalculations();
        if (element.topPassed) {
            this._onTopPassed.next(true);
        } else if (!this.once) {
            this._onTopPassed.next(false);
        }
    }

    private checkTopNotVisible():void {
        const element:IElement = this.getElementCalculations();
        if (!element.topVisible) {
            this._onTopNotVisible.next(true);
        } else if (!this.once) {
            this._onTopNotVisible.next(false);
        }
    }

    private checkTopVisible():void {
        const element:IElement = this.getElementCalculations();
        if (element.topVisible) {
            this._onTopVisible.next(true);
        } else if (!this.once) {
            this._onTopVisible.next(false);
        }
    }

    private checkBottomNotVisible():void {
        const element:IElement = this.getElementCalculations();
        if (!element.bottomVisible) {
            this._onBottomNotVisible.next(true);
        } else if (!this.once) {
            this._onBottomNotVisible.next(false);
        }
    }

    private checkBottomVisible():void {
        const element:IElement = this.getElementCalculations();
        if (element.bottomVisible) {
            this._onBottomVisible.next(true);
        } else if (!this.once) {
            this._onBottomVisible.next(false);
        }
    }

    private checkOnScreen():void {
        const element:IElement = this.getElementCalculations();
        if (element.onScreen) {
            this._onOnScreen.next(true);
        } else if (!this.once) {
            this._onOnScreen.next(false);
        }
    }

    private checkOffScreen():void {
        const element:IElement = this.getElementCalculations();
        if (element.offScreen) {
            this._onOffScreen.next(true);
        } else if (!this.once) {
            this._onOffScreen.next(false);
        }
    }

    private getNextAvailableStep(element:IElement, direction:"up" | "down"):PassingAmount|false {
        const sortedSteps = this.getSortedSteps();
        const occuredCallbacks = this.getOccuredCallbacks(direction);
        if (typeof sortedSteps === "string" && (sortedSteps as string) === "*") {
            return new PassingAmount(element.pixelsPassed, element.percentagePassed);
        } else {
            const amountClosest:IPassingStep|false = direction === "down"
            ? this.findClosestStepPassedDownwards(element.pixelsPassed)
            : this.findClosestStepPassedUpwards(element.pixelsPassed);
            if (amountClosest && !(this.once && occuredCallbacks.indexOf(amountClosest) >= 0)) {
                if (this.once) {
                    this._cache.occuredCallbacks[direction].push(amountClosest);
                }
                return new PassingAmount(amountClosest.normalizedValue, amountClosest.normalizedValue / element.height);
            } else {
                return false;
            }
        }
    }

    private getOccuredCallbacks(direction:"up" | "down"):(IPassingStep | "*")[] {
        if (!this._cache.occuredCallbacks) {
            this._cache.occuredCallbacks = { down: [], up: [] };
        }
        return this._cache.occuredCallbacks[direction];
    }

    private findClosestStepPassedDownwards(pixelsPassed:number):IPassingStep|false {
        const sortedSteps = this.getSortedSteps() as IPassingStep[];
        let found = false;
        let index = -1;
        for (let i = 0; i < sortedSteps.length; i++) {
            if (pixelsPassed >= sortedSteps[i].normalizedValue) {
                found = true;
                index = i;
            } else {
                break;
            }
        }
        return (found ? sortedSteps[index] : false);
    }

    private findClosestStepPassedUpwards(pixelsPassed:number):IPassingStep|false {
        const sortedSteps = this.getSortedSteps() as IPassingStep[];
        let found = false;
        let index = -1;
        for (let i = sortedSteps.length - 1; i >= 0; i--) {
            if (pixelsPassed <= sortedSteps[i].normalizedValue) {
                found = true;
                index = i;
            } else {
                break;
            }
        }
        return (found ? sortedSteps[index] : false);
    }

    private checkPassing():void {
        const element = this.getElementCalculations();
        const direction = this.getDirection();
        const scroll = this.getScrollPosition();
        if (element.passing && (direction === "down" || direction === "up")) {
            const nextStep = this.getNextAvailableStep(element, direction);
            if (nextStep && direction === "down") {
                this._onPassing.next(nextStep);
            } else if (nextStep && direction === "up") {
                this._onPassingReverse.next(nextStep);
            }
        }
    }

    private bindEvents():void {
        this._resizeListener = this._renderer.listen("window", "resize", (e:UIEvent) => {
            if (this.refreshOnResize) {
                this.refresh();
            }
        });

        this._scrollListener = this._renderer.listen("window", "scroll", (e:UIEvent) => {
            window.requestAnimationFrame((highResTime:number) => {
                this._scrollChanged.emit({ x: window.pageXOffset, y: window.pageYOffset });
            });
        });

        this._scrollChanged.subscribe((e:IScrollPosition) => {
            this.checkVisibility(e);
        });

        if (!this.continuous) {
            this._onPassingSubcription = this._onPassing.distinctUntilChanged(PassingAmount.comparer)
            .subscribe(amount => {
                this.onPassing.emit(amount);
            });

            this._onPassingReverseSubcription = this._onPassingReverse.distinctUntilChanged(PassingAmount.comparer)
            .subscribe(amount => {
                this.onPassingReverse.emit(amount);
            });

            this._onOnScreenSubscription = this._onOnScreen.distinctUntilChanged()
            .subscribe(isOnScreen => {
                if (isOnScreen) {
                    this.onOnScreen.emit();
                }
            });

            this._onOffScreenSubscription = this._onOffScreen.distinctUntilChanged()
            .subscribe(isOffScreen => {
                if (isOffScreen) {
                    this.onOffScreen.emit();
                }
            });

            this._onTopPassedSubscription = this._onTopPassed.distinctUntilChanged()
            .subscribe(isTopPassed => {
                if (isTopPassed) {
                    this.onTopPassed.emit();
                }
            });

            this._onTopNotPassedSubscription = this._onTopNotPassed.distinctUntilChanged()
            .subscribe(isTopNotPassed => {
                if (isTopNotPassed) {
                    this.onTopNotPassed.emit();
                }
            });

            this._onTopVisibleSubscription = this._onTopVisible.distinctUntilChanged()
            .subscribe(isTopVisible => {
                if (isTopVisible) {
                    this.onTopVisible.emit();
                }
            });

            this._onTopNotVisibleSubscription = this._onTopNotVisible.distinctUntilChanged()
            .subscribe(isTopNotVisible => {
                if (isTopNotVisible) {
                    this.onTopNotVisible.emit();
                }
            });

            this._onBottomPassedSubscription = this._onBottomPassed.distinctUntilChanged()
            .subscribe(isBottomPassed => {
                if (isBottomPassed) {
                    this.onBottomPassed.emit();
                }
            });

            this._onBottomNotPassedSubscription = this._onBottomNotPassed.distinctUntilChanged()
            .subscribe(isBottomNotPassed => {
                if (isBottomNotPassed) {
                    this.onBottomNotPassed.emit();
                }
            });

            this._onBottomVisibleSubscription = this._onBottomVisible.distinctUntilChanged()
            .subscribe(isBottomVisible => {
                if (isBottomVisible) {
                    this.onBottomVisible.emit();
                }
            });

            this._onBottomNotVisibleSubscription = this._onBottomNotVisible.distinctUntilChanged()
            .subscribe(isBottomNotVisible => {
                if (isBottomNotVisible) {
                    this.onBottomNotVisible.emit();
                }
            });
        } else {
            this._onPassingSubcription = this._onPassing
            .subscribe(amount => {
                this.onPassing.emit(amount);
            });

            this._onPassingReverseSubcription = this._onPassingReverse
            .subscribe(amount => {
                this.onPassingReverse.emit(amount);
            });

            this._onOnScreenSubscription = this._onOnScreen
            .subscribe(isOnScreen => {
                if (isOnScreen) {
                    this.onOnScreen.emit();
                }
            });

            this._onOffScreenSubscription = this._onOffScreen
            .subscribe(isOffScreen => {
                if (isOffScreen) {
                    this.onOffScreen.emit();
                }
            });

            this._onTopPassedSubscription = this._onTopPassed
            .subscribe(isTopPassed => {
                if (isTopPassed) {
                    this.onTopPassed.emit();
                }
            });

            this._onTopNotPassedSubscription = this._onTopNotPassed
            .subscribe(isTopNotPassed => {
                if (isTopNotPassed) {
                    this.onTopNotPassed.emit();
                }
            });

            this._onTopVisibleSubscription = this._onTopVisible
            .subscribe(isTopVisible => {
                if (isTopVisible) {
                    this.onTopVisible.emit();
                }
            });

            this._onTopNotVisibleSubscription = this._onTopNotVisible
            .subscribe(isTopNotVisible => {
                if (isTopNotVisible) {
                    this.onTopNotVisible.emit();
                }
            });

            this._onBottomPassedSubscription = this._onBottomPassed
            .subscribe(isBottomPassed => {
                if (isBottomPassed) {
                    this.onBottomPassed.emit();
                }
            });

            this._onBottomNotPassedSubscription = this._onBottomNotPassed
            .subscribe(isBottomNotPassed => {
                if (isBottomNotPassed) {
                    this.onBottomNotPassed.emit();
                }
            });

            this._onBottomVisibleSubscription = this._onBottomVisible
            .subscribe(isBottomVisible => {
                if (isBottomVisible) {
                    this.onBottomVisible.emit();
                }
            });

            this._onBottomNotVisibleSubscription = this._onBottomNotVisible
            .subscribe(isBottomNotVisible => {
                if (isBottomNotVisible) {
                    this.onBottomNotVisible.emit();
                }
            });
        }
    }

    private unbindEvents():void {
        if (this._observer) {
            this._observer.disconnect();
        }
        this._resizeListener();
        this._scrollListener();
        this._scrollChanged.unsubscribe();

        this._onPassingSubcription.unsubscribe();
        this._onPassingReverseSubcription.unsubscribe();
        this._onOnScreenSubscription.unsubscribe();
        this._onOffScreenSubscription.unsubscribe();

        this._onTopPassedSubscription.unsubscribe();
        this._onTopNotPassedSubscription.unsubscribe();
        this._onTopVisibleSubscription.unsubscribe();
        this._onTopNotVisibleSubscription.unsubscribe();

        this._onBottomPassedSubscription.unsubscribe();
        this._onBottomNotPassedSubscription.unsubscribe();
        this._onBottomVisibleSubscription.unsubscribe();
        this._onBottomNotVisibleSubscription.unsubscribe();
    }

    private getSortedSteps():IPassingStep[] | "*" {
        if (!this._cache.sortedSteps) {
            this.saveSortedSteps();
        }
        return this._cache.sortedSteps;
    }

    private saveSortedSteps():void {
        if (typeof this.steps === "string" && (this.steps as string) === "*") {
            this._cache.sortedSteps = "*";
        } else {
            const element = this.getElementCalculations();
            const passingSteps:IPassingStep[] = [];
            // populate the passingSteps array
            (this.steps as (string|number)[]).forEach(elem => {
                if (typeof elem === "number") {
                    passingSteps.push({
                        originalValue: elem,
                        normalizedValue: elem
                    });
                } else {
                    passingSteps.push({
                        originalValue: elem,
                        normalizedValue: element.height * (parseFloat(elem.slice(0, -1)) / 100)
                    });
                }
            });
            // sort passingsteps array by normalizedvalue
            this._cache.sortedSteps = passingSteps.sort((left, right) => {
                return left.normalizedValue - right.normalizedValue;
            });
        }
    }
}
