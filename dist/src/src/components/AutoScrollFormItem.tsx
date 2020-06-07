import React, {useContext, useEffect, useRef, useState} from 'react';
import styled from 'styled-components'
import {AutoScrollFormContext, AutoScrollFormContextState} from "./AutoScrollFormContext";
import {Button, Form} from 'antd';
import {FormInstance, FormItemProps} from "antd/lib/form";
import {getFieldId, toArray} from "antd/es/form/util";
import {uuid} from "uuidv4";
// @ts-ignore
const Style = styled.div.withConfig({displayName: "AutoScrollFormItem"})
// language=LESS prefix=*{ suffix=}
    `
    padding: 1rem;
    ${(props: any) => props.css}
`

export interface AutoScrollFormItemProps extends FormItemProps {
    children : any
}

const AutoScrollFormItem = (props: AutoScrollFormItemProps,) => {
    const id = React.useMemo(()=>uuid(),[])
    const ref = useRef()
    const [context, setContext] = useContext<[AutoScrollFormContextState, any]>(AutoScrollFormContext);
    const [focus, setFocus] = useState(context?.focusedItemId === id)

    useEffect(() => {
        if(context?.fields.indexOf(id) == -1){
            context?.fields.push(id)
            context?.fieldsName.set(id,props.name)
        }
    },[context?.fields])
    useEffect(() => {
        const _focus = context?.focusedItemId === id
        setFocus(_focus)
        if (_focus) {
            console.log("scroll to ", context.form)
            context?.form?.scrollToField(props.name!, {
                block: "center",
                behavior: 'smooth',
                scrollMode: "always"
            })
        }
    }, [context?.focusedItemId,id])

    const next = ()=> {
        const position = context?.fields.indexOf(id)
        const name = context?.fieldsName.get(context.fields[position + 1])
        const namePath = toArray(name);
        const fieldId = getFieldId(namePath, context?.form?.__INTERNAL__.name);
        const node: HTMLElement | null = fieldId ? document.getElementById(fieldId) : null;
        node?.focus()
    }

    return (
        <Style ref={ref} css={context.focusedStyle}
               focus={focus} onFocus={() => {
            console.log("focus " + id)
            setContext({...context, focusedItemId: id})
        }}
        >
            <>
                <Form.Item {...props} >
                {props.children(next)}
                </Form.Item>
                {/*<Button onClick={() => next()}>Next</Button>*/}
            </>
        </Style>
    );
}

export interface AutoScrollFormInstance extends FormInstance {
    focusedItem?: any
}

export default AutoScrollFormItem;
