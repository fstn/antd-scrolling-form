import React, {useEffect, useState} from 'react';
import styled, {FlattenInterpolation, FlattenSimpleInterpolation, ThemeProps} from 'styled-components'
import {AutoScrollFormContext} from "./AutoScrollFormContext";
import {FormProps} from "antd/es/form";

// @ts-ignore
const Style = styled.div.withConfig({displayName: "AutoScrollForm"})
// language=LESS prefix=*{ suffix=}
        `
`

export interface AutoScrollFormProps extends FormProps {
    focusedStyle?: FlattenInterpolation<ThemeProps<boolean>>
}

const InternalAutoScrollForm = (props: AutoScrollFormProps) => {
    const [state, setState] = useState<AutoScrollFormProps>(
        {
            form: props.form,
            focusedStyle: props.focusedStyle
        }
    )

    useEffect(() => {
        setState({
            ...state,
            form: props.form,
            focusedStyle: props.focusedStyle
        })
    }, [props.form])
    return (
        <Style>
            <AutoScrollFormContext.Provider value={[state, setState]}>
                {props.children}
            </AutoScrollFormContext.Provider>
        </Style>
    );
}

const AutoScrollForm = InternalAutoScrollForm;
export default AutoScrollForm;

