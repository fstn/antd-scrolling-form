import React, {useContext, useEffect, useRef, useState} from 'react';
import styled from 'styled-components'
import {AppContextState, AutoScrollFormContext} from "./AutoScrollFormContext";
import {uuid} from 'uuidv4';
import { Form } from 'antd';
import {FormInstance, FormItemProps} from "antd/lib/form";
// @ts-ignore
const Style = styled.div.withConfig({displayName: "AutoScrollFormItem"})
// language=LESS prefix=*{ suffix=}
    `
    padding: 1rem;
    ${(props:any)=>props.css}
`

export interface AutoScrollFormItemProps extends FormItemProps {
}

const AutoScrollFormItem = (props: AutoScrollFormItemProps,) => {
    const id = React.useMemo(()=>uuid(),[])
    const ref = useRef()
    const [context, setContext] = useContext<[AppContextState,any]>(AutoScrollFormContext);
    const [focus, setFocus] = useState(context?.focusedItemId === id)
    useEffect(() => {
        const _focus = context?.focusedItemId === id
        setFocus(_focus)
        if(_focus) {
            console.log("scroll to ",context.form)
            context?.form?.scrollToField(props.name!,{
                block:"center",
                behavior: 'smooth',
                scrollMode:"always"
            })
        }
    }, [context?.focusedItemId])
    return (
        <Style ref={ref} css={context.focusedStyle}
               focus={focus} onFocus={() => {
            console.log("focus "+id)
            setContext({...context, focusedItemId: id})
        }}
        >
            <>
                <Form.Item {...props}/>
            </>
        </Style>
    );
}

export interface AutoScrollFormInstance extends FormInstance {
    focusedItem?: any
}

export default AutoScrollFormItem;
