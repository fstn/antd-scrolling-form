import React from 'react';
import './App.css';
import AutoScrollFormItem from "./components/AutoScrollFormItem";
import {Button, Card, Form, Input} from "antd";
import AutoScrollForm from "./components/AutoScrollForm";
import 'antd/dist/antd.css';
import {useForm} from "antd/es/form/util";
import {css} from "styled-components";
import TextArea from "antd/es/input/TextArea";

function App() {
    const [form] = useForm()
    return (
        <>
            <Card>
                <div style={{height:"50vh"}}></div>
                <Form form={form} labelCol={{span: 24}} onFinish={(values) => {
                    console.log(values)
                }}>
                    <AutoScrollForm form={form} focusedStyle={css`
                    opacity:${(props: any) => props.focus ? 1 : 0.5};
                    background-color:${(props: any) => props.focus ? "#EEE" : ""};
                    
                    `}>
                        <AutoScrollFormItem label={"FirstName"} name="firstname">
                            <Input placeholder={"FirstName"}/>
                        </AutoScrollFormItem>
                        <AutoScrollFormItem label={"LastName"} name="lastName">
                            <Input placeholder={"LastName"}/>
                        </AutoScrollFormItem>
                        <AutoScrollFormItem label={"Email"} name="email">
                            <Input placeholder={"Email"}/>
                        </AutoScrollFormItem>
                        <AutoScrollFormItem label={"Descriptiopn"} name="description">
                            <TextArea rows={20} placeholder={""}/>
                        </AutoScrollFormItem>
                        <AutoScrollFormItem label={"Email"} name="email3">
                            <Input placeholder={"Email"}/>
                        </AutoScrollFormItem>
                        <AutoScrollFormItem label={"Email"} name="email4">
                            <Input placeholder={"Email"}/>
                        </AutoScrollFormItem>
                        <AutoScrollFormItem label={"Email"} name="email5">
                            <Input placeholder={"Email"}/>
                        </AutoScrollFormItem>
                        <AutoScrollFormItem label={"Email"} name="email6">
                            <Input placeholder={"Email"}/>
                        </AutoScrollFormItem>
                        <Form.Item>
                            <Button htmlType="submit" type="primary">Submit</Button>
                        </Form.Item>
                    </AutoScrollForm>
                </Form>
            </Card>
        </>
    )
}

export default App;
