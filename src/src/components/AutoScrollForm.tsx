import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import ReactDOM from 'react-dom';
import styled, {FlattenInterpolation, ThemeProps} from 'styled-components'
import {AutoScrollFormContext, AutoScrollFormContextState} from "./AutoScrollFormContext";
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
        fields: [] as string[],
        form: props.form,
        focusedStyle: props.focusedStyle as any,
        autoScrollFormInstance: {
            removeField: function (id: string, name: string) {
                previous();
                setTimeout(()=>dispatch({type: "removeField", payload: {id,name}}),0)
            },
            addField: function (id: string, name: string) {
                dispatch({type: "addField", payload: {id, name}})
            },
            focus: function (id: string) {
                dispatch({type: "focus", payload: id})
            },
            next: function(){}
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
            case "addField":
                console.debug("addField")
                draft.fields.push({id:action.payload.id,name:action.payload.name});
                return
            case "removeField":
                console.debug("removeField")
                draft.fields = draft.fields.filter((f:any) => f.id !== action.payload.id);
                return
            case "focus":
                console.debug("focus")
                if(action.payload !== draft.focusedItemId)
                    draft.focusedItemId = action.payload;
                return
        }
    }


    const [state, dispatch] = useImmerReducer<AutoScrollFormContextState>(reducer, initialState)

    useEffect(() => {
        console.log("InternalAutoScrollForm ue 1")
        dispatch({type: "addForm", payload: props.form})
        dispatch({type: "addFocusedStyle", payload: props.focusedStyle})
    }, [props.form, props.focusedStyle, dispatch])

    useEffect(() => {
        if (!state.focusedItemId)
            dispatch({type: "focus", payload: state.fields[0]?.id})
    }, [state.fields, dispatch, state.focusedItemId])


    type FieldsPositionForId = { id: string, position: number }

    const getOrderedFieldsId: () => FieldsPositionForId[] = useCallback((): FieldsPositionForId[] => {
        let _fieldsPosition: FieldsPositionForId[] = []
        for (const field of state.fields) {
            const _field = document.getElementById(field.id) as HTMLElement | undefined
            if (!!_field) {
                _fieldsPosition.push({id:field.id, position: _field.getBoundingClientRect().y})
            }

        }
        _fieldsPosition.sort(r => r.position)
        return _fieldsPosition;
    }, [state.fields])

    const getCurrentPosition = useCallback(function (id?: string) {
        if (!id) {
            id = state.focusedItemId
            console.debug("getCurrentPosition using focusedItemId", state.focusedItemId)
        }
        let _orderedFieldsIds = getOrderedFieldsId();
        let _currentPosition = _orderedFieldsIds.findIndex(f => f.id === id)
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
        return getOrderedFieldsId().length - 1 > position!;
    },[getCurrentPosition,getOrderedFieldsId])

    const hasPrevious = useCallback(function (position?: number) {
        console.debug("hasPrevious")
        if (position === undefined) {
            position = getCurrentPosition()
        }
        return position! >= 1;
    },[getCurrentPosition])

    function getPreviousPosition(position: number) {
        console.debug("getPreviousPosition")
        if (hasPrevious(position))
            return position - 1;
        else
            return position
    }


    function getNextId(id: string): string | undefined {
        console.debug("getNextId")
        let _orderedFieldsIds = getOrderedFieldsId();
        let _currentPosition = _orderedFieldsIds.findIndex(f => f.id === id)
        const _nextId = _orderedFieldsIds[getNextPosition(_currentPosition)]?.id
        return _nextId
    }

    function getPreviousId(id: string): string | undefined {
        console.debug("getPreviousId")
        let _orderedFieldsIds = getOrderedFieldsId();
        let _currentPosition = _orderedFieldsIds.findIndex(f => f.id === id)
        const _previousId = _orderedFieldsIds[getPreviousPosition(_currentPosition)]?.id
        return _previousId
    }

    const previous = () => {
        debugger
        console.debug("previous")
        const previousId = getPreviousId(state.focusedItemId!)
        if (!previousId) {

            return
        }
        const position = getCurrentPosition(previousId)
        const name = state?.fields[position].name
        const namePath = toArray(name);
        const fieldId = getFieldId(namePath, state?.form?.__INTERNAL__.name);
        const node: HTMLElement | null = fieldId ? document.getElementById(fieldId) : null;
        node?.focus()
    }

    function getNextPosition(position: number) {
        console.debug("getNextPosition")
        if (hasNext(position))
            return position + 1;
        else
            return position
    }

    const next = () => {
        console.debug("next")
        const nextId = getNextId(state.focusedItemId!)
        if (!nextId) {
            return
        }
        const position = getCurrentPosition(nextId)
        const name = state?.fields[position]?.name
        const namePath = toArray(name);
        const fieldId = getFieldId(namePath, state?.form?.__INTERNAL__.name);
        let node: HTMLElement | null = fieldId ? document.getElementById(fieldId) : null;
        // if(!node){
        //     node = fieldId ? document.getElementById(fieldId+"_0") : null;
        // }
        if (!node) {
            node = nextId ? document.getElementById(nextId) : null;
            node = ((ReactDOM.findDOMNode(node!) as Element).getElementsByClassName('ant-btn')[0] as HTMLElement)
        }
        node?.focus()
    }

    const hasPreviousVal = useMemo(hasPrevious,[hasPrevious])
    const hasNextVal = useMemo(hasNext,[hasNext])
    return (
        <Style ref={ref}>
            {JSON.stringify(state)}
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

