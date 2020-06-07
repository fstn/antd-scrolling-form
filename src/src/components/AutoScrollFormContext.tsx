import React, {Dispatch, MutableRefObject} from "react";
import {FormInstance} from "antd/es/form";

export type Field={
    id: string,
    name: string,
    field: any,
    position?: number,
}

export type AutoScrollFormContextState = {
    fields: Field[];
    form?: FormInstance,
    focusedItemId?: string,
    focusedStyle?: any,
    autoScrollFormInstance: {
        removeField(id: string, name: any): void;
        addField(id: string, name: any): void;
        updateField(id: string, name: any): void;
        focus(id: string):void;
        next():void;
    }

}

export const AutoScrollFormContext = React.createContext<[AutoScrollFormContextState, Dispatch<any>]>([{
    fields: [] as Field[],
    autoScrollFormInstance: {
        removeField: (id: string, name: any) => {
        },
        addField: (id: string, name: any) => {
        },
        updateField: (id: string, name: any) => {
        },
        focus: (id: string) => {
        },
        next:()=>{}
    },

}, () => {
}]);
