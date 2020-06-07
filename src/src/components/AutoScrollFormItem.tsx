import React, {useCallback, useContext, useEffect, useState} from 'react';
import styled from 'styled-components'
import {AutoScrollFormContext, AutoScrollFormContextState} from "./AutoScrollFormContext";
import {Form} from 'antd';
import {FormItemProps} from "antd/lib/form";
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
    children: any
    absoluteName?: string
}

const AutoScrollFormItem = (props: AutoScrollFormItemProps) => {
    const id = React.useMemo(() => uuid(), [])
    const [context] = useContext<[AutoScrollFormContextState, any]>(AutoScrollFormContext);
    const [focus, setFocus] = useState(context?.focusedItemId === id)
    const [index, setIndex] = useState(0)

    useEffect(() => {
        const _context = {...context}
        if (_context?.fields.findIndex((f:any)=>f.id==id) === -1) {
            // _context?.fieldsRef.push(ref)

            _context.autoScrollFormInstance.addField(id, props.absoluteName || props.name as any)
            // _context?.fieldsName.set(id, ref)
        }
        // const newIndex = getCurrentPosition(_context)
        // if (newIndex !== index) {
        //     setIndex(newIndex)
        // }
    }, [props])


    // @ts-ignore
    useEffect(() => {
        const _context = {...context}
        return () => {
            _context.autoScrollFormInstance.removeField(id, props.absoluteName || props.name!)
        };
    }, [])



    useEffect(() => {
        const _focus = context?.focusedItemId === id
        setFocus(_focus)
        if (_focus) {
            console.log("scroll to ", context.form)
            context?.form?.scrollToField(props.absoluteName || props.name!, {
                block: "center",
                behavior: 'smooth',
                scrollMode: "always"
            })
        }
    }, [context.focusedItemId, id, props.absoluteName, props.name])


    return (
        <Style aria-autoScrollItem={true} css={context.focusedStyle} id={id}
               focus={focus} onFocus={(e: FocusEvent) => {
            e.preventDefault()
            e.stopPropagation()
            context.autoScrollFormInstance.focus(id)
        }}
        >
            {index}
            <>
                <Form.Item {...props} >
                    {props.children(context.autoScrollFormInstance.next)}
                </Form.Item>
                {/*<Button onClick={() => next()}>Next</Button>*/}
            </>
        </Style>
    );
}

export default AutoScrollFormItem;
