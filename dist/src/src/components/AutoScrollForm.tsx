import React, {useEffect, useState} from 'react';
import styled, {FlattenInterpolation, ThemeProps} from 'styled-components'
import {AutoScrollFormContext, AutoScrollFormContextState} from "./AutoScrollFormContext";
import {FormProps} from "antd/es/form";
import {getFieldId, toArray} from "antd/es/form/util";
import ButtonGroup from "antd/es/button/button-group";
import {Button, Progress} from "antd";
import {DownOutlined, UpOutlined} from "@ant-design/icons"

// @ts-ignore
const Style = styled.div.withConfig({displayName: "AutoScrollForm"})
// language=LESS prefix=*{ suffix=}
        `
`

export interface AutoScrollFormProps extends FormProps {
    focusedStyle?: FlattenInterpolation<ThemeProps<boolean>>
}

const InternalAutoScrollForm = (props: AutoScrollFormProps) => {
    const [state, setState] = useState<AutoScrollFormContextState>(
        {
            fieldsName: new Map<string, any>(),
            fields: [],
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

    useEffect(() => {
        setState({
            ...state,
            focusedItemId: state.fields[0]
        })
    }, [state.fields])


    function getCurrentPosition() {
        const position = state?.fields.indexOf(state.focusedItemId)
        return position ;
    }

    function hasNext(position?: number) {
        if (position === undefined) {
            position = getCurrentPosition()
        }
        return state.fields.length >= position!;
    }

    function hasPrevious(position?: number) {
        if (position === undefined) {
            position = getCurrentPosition()
        }
        return position! >= 1;
    }

    function getPreviousPosition(position: number) {
        if (hasPrevious(position))
            return position - 1;
        else
            return position
    }

    const previous = () => {
        const position = getCurrentPosition()
        const name = state?.fieldsName.get(state.fields[getPreviousPosition(position)])
        const namePath = toArray(name);
        const fieldId = getFieldId(namePath, state?.form?.__INTERNAL__.name);
        const node: HTMLElement | null = fieldId ? document.getElementById(fieldId) : null;
        node?.focus()
    }

    function getNextPosition(position: number) {
        if (hasNext(position))
            return position + 1;
        else
            return position
    }

    const next = () => {
        const position = state?.fields.indexOf(state.focusedItemId)
        const name = state?.fieldsName.get(state.fields[getNextPosition(position)])
        const namePath = toArray(name);
        const fieldId = getFieldId(namePath, state?.form?.__INTERNAL__.name);
        const node: HTMLElement | null = fieldId ? document.getElementById(fieldId) : null;
        node?.focus()
    }
    return (
        <Style>
            <div style={{height: "50vh"}}></div>
            <AutoScrollFormContext.Provider value={[state, setState]}>
                {props.children}
            </AutoScrollFormContext.Provider>

            <div style={{position:"fixed",bottom:"0",right:"0",width:"300px", padding: "1rem", background: "white"}}>
            <ButtonGroup style={{display:"flex",
                justifyContent: "space-evenly"}}>
                {hasPrevious() && <Button onClick={previous}><UpOutlined/></Button>}
                {hasNext() && <Button onClick={next}><DownOutlined/></Button>}
                <Progress style={{width:"100px"}} percent={Math.round(getCurrentPosition()/state.fields.length*100)} />
            </ButtonGroup>
            </div>
            <div style={{height: "50vh"}}></div>
        </Style>
    );
}

const AutoScrollForm = InternalAutoScrollForm;
export default AutoScrollForm;

