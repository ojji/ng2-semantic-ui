import { DateUtil, IDateUtil } from "./helpers/date";

// Keyboard keycodes.
export enum KeyCode {
    Left = 37,
    Up = 38,
    Right = 39,
    Down = 40,

    Escape = 27,
    Enter = 13,

    Space = 32,
    Backspace = 8
}

interface IRecursiveObject { [name:string]:IRecursiveObject; }

export interface ITemplateRefContext<T> { $implicit:T; }

export interface IAugmentedElement extends Element {
    closest(selector:string):IAugmentedElement;
}

export class HandledEvent {
    public eventHandled:boolean;
}

export interface IDynamicClasses {
    [name:string]:true;
}

export const Util = {
    Array: {
        range(n:number, offset:number = 0):number[] {
            return Array(n).fill(0).map((z, i) => i + offset);
        },
        group<T>(items:T[], groupLength:number):T[][] {
            const groups:T[][] = [];
            while (items.length > 0) {
                groups.push(items.splice(0, groupLength));
            }
            return groups;
        }
    },

    String: {
        padLeft(str:string, length:number, padding:string):string {
            let s = str;
            while (s.length < length) {
                s = padding + s;
            }
            return s;
        }
    },

    DOM: {
        parseBooleanAttribute(attributeValue:boolean):boolean {
            let value = attributeValue;
            if (typeof attributeValue === "string") {
                value = true;
            }

            return value;
        }
    },

    Object: {
        readValue<T, U>(object:T, path?:string):U {
            if (!path) {
                return object as any as U;
            }

            let recursed:IRecursiveObject | undefined;

            for (let i = 0, p = path.split("."), len = p.length; i < len; i++) {
                recursed = (object as any as IRecursiveObject)[p[i]];
            }

            return recursed as any as U;
        }
    },

    Date: DateUtil
};
