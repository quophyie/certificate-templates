import React from 'react';
import {Col, Form, Button} from "react-bootstrap";

export default function TestResultVariantRow(props) {

    const units = props.units && props.units.length > 0 ? props.units : []
    const methods = props.methods && props.methods.length > 0 ? props.methods : []
    const testName = props.name
    const variants = props.variants && props.variants.length > 0 ? props.variants : []
    return (
        <tr>
            <td>{props.id}</td>
            <td style={ {width: "20px"}}>
                <Form.Check
                    type="checkbox"
                    id={props.id}
                    style={ {width: "20px"}}
                />
            </td>
            {/* Test Name */}
            <td>{testName}</td>

            {/* Units */}
            <td>
                <Form.Control as="select">
                    {units.map(unit => <option>{unit}</option>)}
                </Form.Control>
            </td>

            {/* Methods */}
            <td>
                <Form.Control as="select">
                    {methods.map(method => <option>{method}</option>)}
                </Form.Control>
            </td>

            {/* Ghana Specification */}
            <td>
                <Form.Control/>
            </td>

            {/* Result */}
            <td>
                <Form.Control/>
            </td>

            {/* Result */}
            <td>
                <Form.Control/>
            </td>

            {/* Button */}
            <td>
                <Button variant="primary">Add Variant</Button>
            </td>
        </tr>
    );

}
