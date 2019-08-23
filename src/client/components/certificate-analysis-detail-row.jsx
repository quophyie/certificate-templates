import React from "react";
import {Col, Form, FormGroup, Row} from "react-bootstrap";

export default function CertificateAnalysisDetailRow(props = {
    leftLabel: "",
    rightLabel: "",
    leftHtmlElement: "input",
    rightHtmlElement: "input",
    leftHtmlType : "text",
    rightHtmlType: "text",
    leftElementChildren: [],
    rightElementChildren: [],
    leftHtmlElementStyle: null,
    rightHtmlElementStyle: null

}) {

    let leftControl = <div>&nbsp;&nbsp;</div>

    let rightControl = <React.Fragment>
        <Form.Label column sm={2}>{props.rightLabel}</Form.Label>
        <div>&nbsp;&nbsp;</div>
    </React.Fragment>

    if(props.leftLabel) {
        leftControl = <React.Fragment>
            <Form.Label  column sm={2}>{props.leftLabel}</Form.Label>
            <Col sm={4}>
                <Form.Control as={props.leftHtmlElement} type={props.leftHtmlType} style={props.leftHtmlElementStyle}>
                    {props.leftElementChildren}
                </Form.Control>
            </Col>
        </React.Fragment>
    }

    if (props.rightLabel){

        rightControl = (
            <React.Fragment>
                <Form.Label column sm={2}>{props.rightLabel}</Form.Label>
                <Col sm={4}>
                    <Form.Control  as={props.rightHtmlElement} type={props.rightHtmlType} style={props.rightHtmlElementStyle}>
                        {props.rightElementChildren}
                    </Form.Control>
                </Col>
            </React.Fragment>
            )
    }


    return (
        <Form.Group as={Row}>
            {leftControl}
            {rightControl}
        </Form.Group>
    );

}
