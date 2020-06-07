import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import ReactDOM from 'react-dom';
import styled, {FlattenInterpolation, ThemeProps} from 'styled-components'
import {AutoScrollFormContext, AutoScrollFormContextState, Field} from "./AutoScrollFormContext";
import {FormProps} from "antd/es/form";
import {getFieldId, toArray} from "antd/es/form/util";
import ButtonGroup from "antd/es/button/button-group";
import {Button, Progress} from "antd";
import {DownOutlined, UpOutlined} from "@ant-design/icons"
import {Reducer, useImmerReducer} from "use-immer";
import {Draft, enableMapSet} from "immer";

// @ts-ignore
const Style = styled.div.withConfig({displayName: "AutoScrollForm"})
// language=LESS prefix=*{ suffix=}
        `
`
enableMapSet()

export interface AutoScrollFormProps extends FormProps {
    focusedStyle?: FlattenInterpolation<ThemeProps<boolean>>
}

export type SetContextType = (f: (draft: Draft<AutoScrollFormContextState>) => void | Draft<AutoScrollFormContextState>) => void


const InternalAutoScrollForm = (props: AutoScrollFormProps) => {
    const ref = useRef<HTMLElement>()

    const initialState = {
        focusedItemId: "",
        fields: [] as Field[],
        form: props.form,
        focusedStyle: props.focusedStyle as any,
        autoScrollFormInstance: {
            removeField: function (id: string, name: string) {
                dispatch({type: "removeField", payload: {id, name}})
            },
            addField: function (id: string, name: string) {
                dispatch({type: "addField", payload: {id, name}})
            },
            updateField: function (id: string, name: string) {
                dispatch({type: "updateField", payload: {id, name}})
            },
            focus: function (id: string) {
                dispatch({type: "focus", payload: id})
            },
            next: function () {
            }
        }
    };

    const reducer: Reducer<AutoScrollFormContextState> = (draft, action): any => {
        switch (action.type) {
            case "reset":
                console.debug("reset")
                return initialState;
            case "addForm":
                console.debug("addForm")
                draft.form = action.payload;
                return
            case "orderFields":
                draft.fields.forEach(f => {
                        // const field = document.getElementById(f.id) as HTMLElement | undefined
                        f.position = f.field?.getBoundingClientRect().y
                        return f
                    }
                )
                draft.fields = draft.fields.sort((f1: Field,f2:Field) => f1!.position!-f2!.position!)
                return
            case "addField":
                console.debug("addField", action.payload)
                const id = action.payload.id
                const name = action.payload.name
                const field = document.getElementById(action.payload.id) as HTMLElement | undefined
                const position = field?.getBoundingClientRect().y
                draft.fields.push({id, name, field, position});
                return
            case "updateField": {
                console.debug("updateField", action.payload)
                const id = action.payload.id
                const name = action.payload.name
                const field = getNodeForId(id)
                const existing = draft.fields.find(f => f.id === id)
                if (existing && existing!.name !== name) {
                    existing!.name = name
                }
                return
            }
            case "removeField":
                console.debug("removeField", action.payload)
                draft.fields = draft.fields.filter((f: any) => f.id !== action.payload.id);
                return
            case "focus":
                console.debug("focus")
                if (action.payload !== draft.focusedItemId)
                    draft.focusedItemId = action.payload;
                return
        }
    }

    const [state, dispatch] = useImmerReducer<AutoScrollFormContextState>(reducer, initialState)


    useEffect(()=>{
        dispatch({type:"orderFields"})
    },[state.fields.length])

    useEffect(() => {
        console.log("InternalAutoScrollForm ue 1")
        dispatch({type: "addForm", payload: props.form})
        dispatch({type: "addFocusedStyle", payload: props.focusedStyle})
    }, [props.form, props.focusedStyle, dispatch])

    useEffect(() => {
        if (!state.focusedItemId)
            dispatch({type: "focus", payload: state.fields[0]?.id})
    }, [state.fields, dispatch, state.focusedItemId])


    const getCurrentPosition = useCallback(function (id?: string) {
        if (!id) {
            id = state.focusedItemId
            console.debug("getCurrentPosition using focusedItemId", state.focusedItemId)
        }
        let _orderedFieldsIds = state.fields;
        let _currentPosition = _orderedFieldsIds.findIndex((f: Field) => f.id === id)
        if (_currentPosition === -1) {
            console.error("Unable to find field with id", id, _orderedFieldsIds)
        }
        console.debug("getCurrentPosition", id, _currentPosition)
        return _currentPosition
    }, [state.focusedItemId])

    const hasNext = useCallback(function (position?: number) {
        console.debug("hasNext")
        if (position === undefined) {
            position = getCurrentPosition()
        }
        return state.fields.length - 1 > position!;
    }, [getCurrentPosition, state.fields])

    const hasPrevious = useCallback(function (position?: number) {
        console.debug("hasPrevious")
        if (position === undefined) {
            position = getCurrentPosition()
        }
        return position! >= 1;
    }, [getCurrentPosition])

    function getPreviousPosition(position: number) {
        console.debug("getPreviousPosition")
        if (hasPrevious(position))
            return position - 1;
        else
            return position
    }


    function getNextId(id: string): string | undefined {
        console.debug("getNextId")
        let _currentPosition = state.fields.findIndex((f: Field) => f.id === id)
        const _nextId = state.fields[getNextPosition(_currentPosition)]?.id
        return _nextId
    }

    function getPreviousId(id: string): string | undefined {
        console.debug("getPreviousId")
        let _currentPosition = state.fields.findIndex((f: Field) => f.id === id)
        const _previousId = state.fields[getPreviousPosition(_currentPosition)]?.id
        return _previousId
    }

    const previous = () => {
        console.debug("previous")
        const previousFieldId = getPreviousId(state.focusedItemId!)
        if (!previousFieldId) {
            console.debug("previousField doesn't exists")
            return
        }
        let node = getNodeForId(previousFieldId);
        node?.focus()
    }

    function getNextPosition(position: number) {
        console.debug("getNextPosition")
        if (hasNext(position))
            return position + 1;
        else
            return position
    }


    function getNodeForId(fieldId: string) {
        const position = getCurrentPosition(fieldId)
        const name = state?.fields[position]?.name
        const namePath = toArray(name);
        const focusableFieldItemId = getFieldId(namePath, state?.form?.__INTERNAL__.name);
        let node: HTMLElement | null = focusableFieldItemId ? document.getElementById(focusableFieldItemId) : null;
        // if(!node){
        //     node = focusableId ? document.getElementById(focusableId+"_0") : null;
        // }
        if (!node) {
            const container = fieldId ? document.getElementById(fieldId) : null;
            node = ((ReactDOM.findDOMNode(container!) as Element).getElementsByClassName('ant-btn')[0] as HTMLElement)
        } else {
            if ((node as any).className.indexOf("group") !== -1) {
                node = (node!.firstChild! as HTMLElement)
            }
        }
        return node;
    }

    const next = () => {
        console.debug("next")
        const nextFieldContainerId = getNextId(state.focusedItemId!)
        if (!nextFieldContainerId) {
            return
        }
        let node = getNodeForId(nextFieldContainerId);
        node?.focus()
    }

    const hasPreviousVal = useMemo(hasPrevious, [hasPrevious])
    const hasNextVal = useMemo(hasNext, [hasNext])
    return (
        <Style ref={ref}>
            {/*{JSON.stringify(state)}*/}
            <div style={{height: "50vh"}}></div>
            <AutoScrollFormContext.Provider value={[state, dispatch]}>
                {props.children}
            </AutoScrollFormContext.Provider>

            <div style={{
                position: "fixed",
                bottom: "0",
                right: "0",
                width: "300px",
                padding: "1rem",
                background: "white"
            }}>
                <ButtonGroup style={{
                    display: "flex",
                    justifyContent: "space-evenly"
                }}>
                    {hasPreviousVal && <Button onClick={previous}><UpOutlined/></Button>}
                    {hasNextVal && <Button onClick={next}><DownOutlined/></Button>}
                    <Progress style={{width: "100px"}}
                              percent={Math.round(getCurrentPosition() / state.fields.length * 100)}/>
                </ButtonGroup>
            </div>
            <div style={{height: "50vh"}}></div>
        </Style>
    );
}

const AutoScrollForm = InternalAutoScrollForm;
export default AutoScrollForm;

