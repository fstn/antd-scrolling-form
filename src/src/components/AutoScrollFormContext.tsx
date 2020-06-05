import React, {useState} from "react";
import {FormInstance} from "antd/es/form";
import {FlattenInterpolation, ThemeProps} from "styled-components";

export type AppContextState = {
    form?: FormInstance,
    focusedItemId?: string,
    focusedStyle?: FlattenInterpolation<ThemeProps<boolean>>
}

export const AutoScrollFormContext = React.createContext<[AppContextState,any]>([{},()=>{}]);

