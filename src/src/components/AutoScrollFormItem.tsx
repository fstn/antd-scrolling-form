import React, {useContext, useEffect, useState} from 'react';
import styled from 'styled-components'
import {AutoScrollFormContext, AutoScrollFormContextState} from "./AutoScrollFormContext";
import {Form} from 'antd';
import {FormItemProps} from "antd/lib/form";
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

const getHash = (name: string[] | string | any) => {
    if (Array.isArray(name)) {
        return name.join("'")
    }
    return name
}

const AutoScrollFormItem = (props: AutoScrollFormItemProps) => {
    const id = React.useMemo(() => uuid(), [])
    const [context] = useContext<[AutoScrollFormContextState, any]>(AutoScrollFormContext);
    const [focus, setFocus] = useState(context?.focusedItemId === id)
    const [index, setIndex] = useState(0)

    useEffect(() => {
        const _context = {...context}
        const _existing = _context?.fields.find((f: any) => f.id == id)
        if (!_existing) {
            _context.autoScrollFormInstance.addField(id, props.absoluteName || props.name as any)
        } else if (_existing!.name !== props.absoluteName || props.name) {
            _context.autoScrollFormInstance.updateField(id, props.absoluteName || props.name as any)
        }
        // const newIndex = getCurrentPosition(_context)
        // if (newIndex !== index) {
        //     setIndex(newIndex)
        // }
    }, [getHash(props.absoluteName), getHash(props.name)])


    // @ts-ignore
    useEffect(() => {
        const _context = {...context}
        return () => {
            console.debug("removeField use Effect call",id)
            _context.autoScrollFormInstance.removeField(id, props.absoluteName || props.name!)
        };
    }, [])


    useEffect(() => {
        const _focus = context?.focusedItemId === id
        setFocus(_focus)
        if (_focus) {
            context?.form?.scrollToField(props.absoluteName || props.name!, {
                block: "center",
                behavior: 'smooth',
                scrollMode: "always"
            })
        }
    }, [context.focusedItemId, id, getHash(props.absoluteName), getHash(props.name)])


    return (
        <Style aria-autoScrollItem={true} css={context.focusedStyle} id={id}
               focus={focus} onFocus={(e: FocusEvent) => {
            e.preventDefault()
            e.stopPropagation()
            context.autoScrollFormInstance.focus(id)
        }}>
            <>
                <Form.Item {...props} >
                    {props.children(context.autoScrollFormInstance.next)}
                </Form.Item>
            </>
        </Style>
    );
}

export default AutoScrollFormItem;
