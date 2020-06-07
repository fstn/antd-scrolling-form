import React, {Dispatch, MutableRefObject} from "react";
import {FormInstance} from "antd/es/form";

export type AutoScrollFormContextState = {
    fields: any[string];
    form?: FormInstance,
    focusedItemId?: string,
    focusedStyle?: any,
    autoScrollFormInstance: {
        removeField(id: string, name: any): void;
        addField(id: string, name: any): void;
        focus(id: string):void;
        next():void;
    }

}

export const AutoScrollFormContext = React.createContext<[AutoScrollFormContextState, Dispatch<any>]>([{
    fields: [],
    autoScrollFormInstance: {
        removeField: (id: string, name: any) => {
        },
        addField: (id: string, name: any) => {
        },
        focus: (id: string) => {
        },
        next:()=>{}
    },

}, () => {
}]);
