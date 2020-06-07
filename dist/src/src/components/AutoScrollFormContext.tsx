import React, {useState} from "react";
import {FormInstance} from "antd/es/form";
import {FlattenInterpolation, ThemeProps} from "styled-components";

export type AutoScrollFormContextState = {
    fieldsName: Map<string,any>;
    fields: any[string];
    form?: FormInstance,
    focusedItemId?: string,
    focusedStyle?: FlattenInterpolation<ThemeProps<boolean>>,

}

export const AutoScrollFormContext = React.createContext<[AutoScrollFormContextState,any]>([{fields:[],fieldsName:new Map<string, any>()},()=>{}]);

