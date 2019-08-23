import React, {useState, useEffect} from "react";
import {Table} from "react-bootstrap";
import RowTypes from "./row-types"
import AddVariantButton from './add-variant-button'
import AddOptionButton from './add-option-button'

import TestResultRow from "./test-result-row"



const loadRows = (props) => {
    let rows = []
    let addItemButton = null
    props.newTests.map((newTest, index) => {
        if (newTest) {
            if (newTest.variants && newTest.variants.length > 0) {
                // We have some variants
                addItemButton = <AddVariantButton onAddTest={props.onAddTest}/>
                rows.push({
                    name: newTest.name,
                    methods: [],
                    units: [],
                    style: RowTypes.STANDARD,
                    addItemButton

                })
                newTest.variants.map(variant => {
                    // The variant has options
                    if (variant.options && variant.options.length > 0) {
                        addItemButton = <AddOptionButton onAddTest={props.onAddTest}/>
                        rows.push({
                            name: variant.name,
                            methods: [],
                            units: [],
                            style: RowTypes.VARIANT,
                            addItemButton

                        })

                        variant.options.map(option => {
                            rows.push({
                                name: option,
                                units: newTest.units,
                                methods: newTest.methods,
                                style: RowTypes.OPTION

                            })
                        })
                    } else {
                        // The variant does have any options
                        rows.push({
                            name: variant.name,
                            units: newTest.units,
                            methods: newTest.methods,
                            style: RowTypes.VARIANT

                        })
                    }
                })

            } else {
                // We dont have any variants
                rows.push({
                    name: newTest.name,
                    methods: newTest.methods,
                    units: newTest.units,
                    style: RowTypes.STANDARD
                })
            }
        }
    })

    return rows;
}

const loadRowData = (props) => {
    let addItemButton = null

    return  props.newTests.map((newTest) => {
        if (newTest) {
            if (newTest.style ===  RowTypes.STANDARD
                && newTest.variants
                && newTest.variants.length > 0) {
                // We have some variants
                addItemButton = <AddVariantButton onAddTest={props.onAddTest} parentId={newTest.id} defaultTestName={newTest.variants[0].name}/>
                newTest.addItemButton = addItemButton

            } else if (newTest.style ===  RowTypes.VARIANT && newTest.variants) {


                const options = newTest.variants.flatMap(variant => variant.options)
                // We have some options
                if (newTest.style ===  RowTypes.VARIANT && options && options.length > 0) {
                    addItemButton = <AddOptionButton onAddTest={props.onAddTest} parentId={newTest.id} defaultTestName={options[0].name}/>
                    newTest.addItemButton = addItemButton
                }
            }

        }
        return newTest
    })
}


function getTestNames(props) {

}
export default function  TestResultTable (props){

    //let tableRows = props.results
    let tableRows = loadRowData(props)
    const addRow =  () => {}

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

                      if (row && row.showRow) {
                          return <TestResultRow id={index + 1}
                                                key={index + 1}
                                                testNames={row.testNames}
                                                units={row.units}
                                                methods={row.methods}
                                                style={row.style}
                                                addItemButton={row.addItemButton}
                                                onTestSelect={props.onTestSelect}
                                                showRowControls={row.showRowControls}
                                                onChecked={props.onChecked}
                                                onAddTest={props.onAddTest}/>
                      } else {
                          return null
                      }


                })

              }
            </tbody>
        </Table>

    );

}
