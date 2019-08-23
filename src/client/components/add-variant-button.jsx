import {Button} from "react-bootstrap";
import React from "react";
import RowTypes from "./row-types";

export default function AddVariantButton(props) {

    return (
        <Button variant="primary" size="sm" onClick={(e) => props.onAddTest(e, RowTypes.VARIANT, props.parentId, props.defaultTestName)}>Add Variant</Button>
    )

}
