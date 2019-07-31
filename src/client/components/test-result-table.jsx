import React, {useState, useEffect} from "react";
import {Table} from "react-bootstrap";
import RowStyles from "./row-styles"
import AddVariantButton from './add-variant-button'
import AddOptionButton from './add-option-button'

import TestResultRow from "./test-result-row"

export default function  TestResultTable (props){

    let tableRows = props.results
    const addRow =  () => {}
    const testNames = props.testNames

    const loadRows = () => {
        let rows = []
        let addItemButton = null
        return props.results.map((result, index) => {
            if (result.variants && result.variants.length > 0) {
                // We have some variants
                addItemButton = <AddVariantButton/>
                rows.push({
                    name: result.name,
                    methods: [],
                    units: [],
                    style: RowStyles.STANDARD,
                    addItemButton

                })
                result.variants.map(variant => {
                    // The variant has options
                    if (variant.options && variant.options.length > 0) {
                        addItemButton = <AddOptionButton/>
                        rows.push({
                            name: variant.name,
                            methods: [],
                            units: [],
                            style: RowStyles.VARIANT,
                            addItemButton

                        })

                        variant.options.map(option => {
                            rows.push({
                                name: option,
                                units: result.units,
                                methods: result.methods,
                                style: RowStyles.OPTION

                            })
                        })
                    } else {
                        // The variant does have any options
                        rows.push({
                            name: variant.name,
                            units: result.units,
                            methods: result.methods,
                            style: RowStyles.VARIANT

                        })
                    }
                })

            } else {
                // We dont have any variants
                rows.push({
                    name: result.name,
                    methods: result.methods,
                    units: result.units,
                    style: RowStyles.STANDARD
                })
            }
        })
    }

    return(

        <Table hover variant="dark">
            <thead>
            <tr>
                <th>#Id</th>
                <th></th>
                <th>Test</th>
                <th>Unit</th>
                <th>Method</th>
                <th>Ghana Specification</th>
                <th>Result</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
              {
                  tableRows.map((row, index) => {
                      if (row) {
                          return <TestResultRow id={index + 1}
                                                key={index + 1}
                                                testNames={testNames}
                                                units={row.units}
                                                methods={row.methods}
                                                style={row.style}
                                                addItemButton={row.addItemButton}
                                                onTestSelect={props.onTestSelect}
                                                showRowControls={row.showRowControls}
                                                onChecked={props.onChecked}/>
                      } else {
                          return null
                      }


                })
              }
            </tbody>
        </Table>

    );

}
