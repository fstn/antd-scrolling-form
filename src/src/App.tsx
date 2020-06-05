import React from 'react';
import './App.css';
import AutoScrollFormItem from "./components/AutoScrollFormItem";
import {AutoComplete, Button, Card, Form, Input, Radio} from "antd";
import AutoScrollForm from "./components/AutoScrollForm";
import 'antd/dist/antd.css';
import {useForm} from "antd/es/form/util";
import {css} from "styled-components";

function App() {
    const [form] = useForm()
    return (
        <>
            <Card>
                <div style={{height: "50vh"}}></div>
                <Form form={form} labelCol={{span: 24}} onFinish={(values) => {
                    console.log(values)
                }}>
                    <AutoScrollForm form={form} focusedStyle={css`
                    opacity:${(props: any) => props.focus ? 1 : 0.5};
                    background-color:${(props: any) => props.focus ? "#EEE" : ""};
                    
                    `}>
                        <AutoScrollFormItem label={"Genre"} name="firstname">
                            <Radio.Group name="radiogroup" defaultValue={"m"}>
                                <Radio value={"m"}>Homme</Radio>
                                <Radio value={"f"}>Femme</Radio>
                            </Radio.Group>

                        </AutoScrollFormItem>
                        <AutoScrollFormItem label={"Prenom"} name="firstname">
                            <Input placeholder={""}/>
                        </AutoScrollFormItem>
                        <AutoScrollFormItem label={"Nom"} name="lastName">
                            <Input placeholder={""}/>
                        </AutoScrollFormItem>
                        <AutoScrollFormItem label={"Email"} name="email" rules={[{type:"email"}]}>
                            <Input placeholder={""}/>
                        </AutoScrollFormItem>
                        <AutoScrollFormItem label={"Diplôme en cours ou obtenu"} name="diplome">
                            <AutoComplete
                            />
                        </AutoScrollFormItem>
                        <AutoScrollFormItem label={"Etablissement d'origine"} name="school">
                            <AutoComplete
                            />
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
