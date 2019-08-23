import {Button} from "react-bootstrap";
import React from "react";

import RowTypes from './row-types'

export default function AddOptionButton(props) {

    return (
            <Button variant="primary" size="sm" onClick={(e) => props.onAddTest(e, RowTypes.OPTION, props.parentId, props.defaultTestName)}>Add Option</Button>
    )

}
