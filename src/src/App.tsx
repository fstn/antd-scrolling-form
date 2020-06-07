import React from 'react';
import './App.css';
import AutoScrollFormItem from "./components/AutoScrollFormItem";
import {AutoComplete, Button, Card, Form, Input, Radio} from "antd";
import AutoScrollForm from "./components/AutoScrollForm";
import 'antd/dist/antd.css';
import {useForm} from "antd/es/form/util";
import {css} from "styled-components";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons/lib";

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
                        <AutoScrollFormItem label={"Genre"} name="gender" children={(next: any) =>
                            <Radio.Group name="radiogroup" defaultValue={"m"} onChange={next}>
                                <Radio value={"m"}>Homme</Radio>
                                <Radio value={"f"}>Femme</Radio>
                            </Radio.Group>}/>
                        <AutoScrollFormItem label={"Prenom"} name="firstname" children={(next: any) =>
                            <Input placeholder={""}/>}/>
                        <AutoScrollFormItem label={"Nom"} name="lastName" children={(next: any) =>
                            <Input placeholder={""}/>}/>
                        <AutoScrollFormItem label={"Email"} name="email" rules={[{type: "email"}]}
                                            children={(next: any) =>
                                                <Input placeholder={""}/>}/>
                        <AutoScrollFormItem label={"Diplôme en cours ou obtenu"} name="diploma" children={(next: any) =>
                            <AutoComplete
                            />}/>
                        <AutoScrollFormItem label={"Etablissement d'origine"} name="school" children={(next: any) =>
                            <AutoComplete
                            />}/>
                        <AutoScrollFormItem label={"Studies"} name="studies" children={(next: any) =>
                            <Form.List name="studies">
                                {(fields, {add, remove}) => {
                                    // noinspection JSUnusedLocalSymbols
                                    return (
                                        <div>
                                            {fields.map((field: any, index: any) =>
                                                <Form.Item
                                                    name="studies"
                                                    required={false}
                                                    key={field.key}>
                                                        <>
                                                            <AutoScrollFormItem
                                                                {...field}
                                                                name={[field.name,"content"]}
                                                                absoluteName={["studies",field.name,"content"]}
                                                                style={{flex: "2 0 150px"}}
                                                                validateTrigger={['onChange', 'onBlur']}
                                                                noStyle  children={(next: any) =>
                                                                <Input placeholder="/home/"
                                                                       style={{flex: "2 0 150px"}}/>
                                                            }/>
                                                            <MinusCircleOutlined
                                                                className="dynamic-delete-button"
                                                                style={{margin: '0 8px'}}
                                                                onClick={() => {
                                                                    remove(field.name);
                                                                }}
                                                            />

                                                        </>
                                                </Form.Item>
                                            )}
                                            <Form.Item>
                                                <Button
                                                    type="dashed"
                                                    onClick={() => {
                                                        add();
                                                    }}
                                                    style={{width: '100%'}}
                                                >
                                                    <PlusOutlined/> Add Url
                                                </Button>
                                            </Form.Item>
                                        </div>
                                    );
                                }}
                            </Form.List>
                        }/>
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
