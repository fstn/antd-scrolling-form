/// <reference types="react" />
import { FormInstance, FormItemProps } from "antd/lib/form";
export interface AutoScrollFormItemProps extends FormItemProps {
    children: any;
}
declare const AutoScrollFormItem: (props: AutoScrollFormItemProps) => JSX.Element;
export interface AutoScrollFormInstance extends FormInstance {
    focusedItem?: any;
}
export default AutoScrollFormItem;
