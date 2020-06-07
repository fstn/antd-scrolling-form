import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { AutoScrollFormContext } from "./AutoScrollFormContext";
import { Form } from 'antd';
import { getFieldId, toArray } from "antd/es/form/util";
import { uuid } from "uuidv4";
const Style = styled.div.withConfig({ displayName: "AutoScrollFormItem" }) `
    padding: 1rem;
    ${(props) => props.css}
`;
const AutoScrollFormItem = (props) => {
    const id = React.useMemo(() => uuid(), []);
    const ref = useRef();
    const [context, setContext] = useContext(AutoScrollFormContext);
    const [focus, setFocus] = useState((context === null || context === void 0 ? void 0 : context.focusedItemId) === id);
    useEffect(() => {
        if ((context === null || context === void 0 ? void 0 : context.fields.indexOf(id)) == -1) {
            context === null || context === void 0 ? void 0 : context.fields.push(id);
            context === null || context === void 0 ? void 0 : context.fieldsName.set(id, props.name);
        }
    }, [context === null || context === void 0 ? void 0 : context.fields]);
    useEffect(() => {
        var _a;
        const _focus = (context === null || context === void 0 ? void 0 : context.focusedItemId) === id;
        setFocus(_focus);
        if (_focus) {
            console.log("scroll to ", context.form);
            (_a = context === null || context === void 0 ? void 0 : context.form) === null || _a === void 0 ? void 0 : _a.scrollToField(props.name, {
                block: "center",
                behavior: 'smooth',
                scrollMode: "always"
            });
        }
    }, [context === null || context === void 0 ? void 0 : context.focusedItemId, id]);
    const next = () => {
        var _a;
        const position = context === null || context === void 0 ? void 0 : context.fields.indexOf(id);
        const name = context === null || context === void 0 ? void 0 : context.fieldsName.get(context.fields[position + 1]);
        const namePath = toArray(name);
        const fieldId = getFieldId(namePath, (_a = context === null || context === void 0 ? void 0 : context.form) === null || _a === void 0 ? void 0 : _a.__INTERNAL__.name);
        const node = fieldId ? document.getElementById(fieldId) : null;
        node === null || node === void 0 ? void 0 : node.focus();
    };
    return (React.createElement(Style, { ref: ref, css: context.focusedStyle, focus: focus, onFocus: () => {
            console.log("focus " + id);
            setContext(Object.assign(Object.assign({}, context), { focusedItemId: id }));
        } },
        React.createElement(React.Fragment, null,
            React.createElement(Form.Item, Object.assign({}, props), props.children(next)))));
};
export default AutoScrollFormItem;
