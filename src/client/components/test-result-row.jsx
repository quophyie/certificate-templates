import React from 'react';
import RowTypes from './row-types'

import {ButtonToolbar, Col, Form, FormGroup, Row} from "react-bootstrap";

export default function TestResultRow(props) {

    const units = props.units && props.units.length > 0 ? props.units : []
    const methods = props.methods && props.methods.length > 0 ? props.methods : []
    const testNames = props.testNames
    const rowIndex = props.id - 1
    let rowStyle
    let rowClass
    let addButton = props.addItemButton
    let showAddTestButton = props.showRowControls // || (units.length > 0 || methods.length > 0)



    switch (props.style) {
        case RowTypes.STANDARD: {
            rowStyle = {

            }
            rowClass = ""
            break
        }
        case RowTypes.VARIANT: {
            rowClass = "row-variant"
            rowStyle = {
                //marginLeft: "40px",
                paddingLeft: "40px"
            }
            break
        }
        case RowTypes.OPTION : {
            rowClass = "row-option"
            rowStyle = {
                //marginLeft: "80px",
                paddingLeft: "80px"
            }
            break
        }
    }

    return (
            <tr className={rowClass}>
                <td>{props.id}</td>
                <td style={ {width: "20px"}}>
                    <Form.Check
                        onClick={ (e) => props.onChecked(e, rowIndex)}
                        type="checkbox"
                        id={props.id}
                        style={ {width: "20px"}}
                    />
                </td>
                {/* Test Name */}
                {/*<td style={rowStyle}>{testNames}</td> */}
                <td style={rowStyle}>
                    <Form.Control as="select" onChange={(e) => props.onTestSelect(e, rowIndex)} >
                        {testNames.map(testName => <option>{testName}</option>)}
                    </Form.Control>
                </td>

                {/* Units */}
                <td>
                    {showAddTestButton &&
                        <Form.Control as="select">
                            {units.map(unit => <option>{unit}</option>)}
                        </Form.Control>
                    }
                </td>

                {/* Methods */}
                <td>
                    {showAddTestButton &&
                        <Form.Control as="select">
                            {methods.map(method => <option>{method}</option>)}
                        </Form.Control>
                    }
                </td>

                {/* Ghana Specification */}
                <td>
                    {showAddTestButton && <Form.Control/> }
                </td>

                {/* Result */}
                <td>
                    {showAddTestButton && <Form.Control/> }
                </td>

                <td>
                    {addButton}
                </td>
            </tr>
    );

}
