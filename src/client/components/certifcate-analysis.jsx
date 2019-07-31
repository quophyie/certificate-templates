import React, {useState, useEffect} from 'react';
import TestResultTable from './test-result-table'
import CertificateOfAnalysisDetails from './certifcate-analysis-details'

import server from '../server';
import {Col, Container, Row, Button} from "react-bootstrap";
import TestResultRow from "./test-result-row";


// https://veritylabs-5738.restdb.io

// The initial data that is displayed in the row when `Add Test is clicked`
const insertableRowData = [
    {
        name: "-",
        units: [],
        methods: []
    },
    {
        name: "Density at 300oC",
        units: ["kg/m3", "vol %", "wt %", "cSt"],
        methods: [
            "ASTM D4052",
            "ASTM D86",
            "ASTM D1500",
            "ASTM D93",
            "ASTM D445",
            "ASTM D189",
            "ASTM D6304",
            "ASTM D976"
        ]
    },

    {
        name: "Density at 15oC",
        units: ["kg/m3", "vol %", "wt %", "cSt"],
        methods: [
            "ASTM D4052",
            "ASTM D86",
            "ASTM D1500",
            "ASTM D93",
            "ASTM D445",
            "ASTM D189",
            "ASTM D6304",
            "ASTM D976"
        ]
    },
    {
        name: "Density at 200oC",
        variants:[
            {
                name: "Temperature, Max. for",
                options: [
                    "10% evaporated",
                    "50% evaporated",
                    "90% evaporated"
                ]
            },
            {
                name: "Final boiling point, Max.",
                options:[]
            },
            {
                name: "Residue, Max.",
                options: []
            }
        ],

        units: ["kg/m3", "vol %", "wt %", "cSt"],
        methods: [
            "ASTM D4052",
            "ASTM D86",
            "ASTM D1500",
            "ASTM D93",
            "ASTM D445",
            "ASTM D189",
            "ASTM D6304",
            "ASTM D976"
        ]
    },
    {
        name: "Density at 400oC",
        units: ["kg/m3", "vol %", "wt %", "cSt"],
        methods: [
            "ASTM D4052",
            "ASTM D86",
            "ASTM D1500",
            "ASTM D93",
            "ASTM D445",
            "ASTM D189",
            "ASTM D6304",
            "ASTM D976"
        ]
    },
    {
        name: "Density at 900oC",
        units: ["kg/m3", "vol %", "wt %", "cSt"],
        methods: [
            "ASTM D4052",
            "ASTM D86",
            "ASTM D1500",
            "ASTM D93",
            "ASTM D445",
            "ASTM D189",
            "ASTM D6304",
            "ASTM D976"
        ]
    }

]
export default function CertificateOfAnalysis () {

    let [tests, setTests] = useState([])
    let [testNames, setTestNames] = useState([])
    let [checkedRows, setCheckedRows] = useState([])

    useEffect(() => {

        setTestNames(insertableRowData.map(test => test.name))
    })

    const {logger, getActiveDocument, openById} = server;

    const handleAddTest = (e) => {

        debugger
       // const newTest = e.target.value;
        if (!tests) {
            tests = []
        }

        const newTest = {
            insertableRowData,
            showRowControls: false,
            id: tests.length
        }
        console.log("new test to add: ", newTest)
        tests.push(newTest)
        setTests(tests)
        console.log("added test")

    }

    const handleTestSelect = (e, rowIndex) => {
        const testName = e.target.value
        console.log('handleTestSelect -> Selected TestName: ', testName)
        console.log('handleTestSelect -> index: ', e, "\nindex: ",rowIndex)
        console.log('handleTestSelect -> tests: ', tests)

        const row = tests[rowIndex]

        row.showRowControls = true
        console.log('Found Test Row: ', row)
        setTests(tests)
        console.log('Displayed Tests: ', tests)
    }

    const handleDeleteTest = () => {

        //logger.then((lg) => lg.log('Logger', lg))
        const doc = getActiveDocument()
        console.log("Document: ", doc)
        openById("1whfixRNIKNK7mpIvaQsN2R9e0TI60RopoaEZE0UUHp0").then(doc => console.log("Active doc: ", doc))
            .catch(alert)
        // logger.log('Checked rows: %s', checkedRows)
        checkedRows.forEach((rowIdx) => {
            console.log('deleted    row index: ', rowIdx)
             //tests.splice(rowIdx, 1)
            tests[rowIdx] = null
            console.log('tests remaining after row index delete: ', tests)
            console.log('checked rows remaining after row index delete: ', checkedRows)
        })
        checkedRows = []
        setCheckedRows(checkedRows)
        console.log('Tests Remaining after delete: ', tests)
        //setTests(tests)
        //tests = tests.filter(test => test !== null && test !== undefined)
        setTests(tests)

    }

    const handleCheck = (e, rowIndex) =>{
        const idxCheckedRow = checkedRows.indexOf(rowIndex)
        console.log(`checked state ${e.target.checked}`)
        if ( idxCheckedRow > -1  && !e.target.checked) {
            checkedRows.splice(idxCheckedRow, 1)
            console.log(`row ${rowIndex + 1} unchecked`)
        } else if ( idxCheckedRow < 0  && e.target.checked) {
            checkedRows.push(rowIndex)
            console.log(`row ${rowIndex + 1} checked`)
        }

        setCheckedRows(checkedRows)

    }

    const savedTests ={
        "Density at 300oC":{
        units: ["kg/m3", "vol %", "wt %", "cSt"],
        methods: [
            "ASTM D4052",
            "ASTM D86",
            "ASTM D1500",
            "ASTM D93",
            "ASTM D445",
            "ASTM D189",
            "ASTM D6304",
            "ASTM D976"
        ]

        }
    }

    /*// The initial data that is displayed in the row when `Add Test is clicked`
    const insertableRowData = [
        {
        name: "Density at 300oC",
        units: ["kg/m3", "vol %", "wt %", "cSt"],
        methods: [
            "ASTM D4052",
            "ASTM D86",
            "ASTM D1500",
            "ASTM D93",
            "ASTM D445",
            "ASTM D189",
            "ASTM D6304",
            "ASTM D976"
        ]
    },

        {
            name: "Density at 15oC",
            units: ["kg/m3", "vol %", "wt %", "cSt"],
            methods: [
                "ASTM D4052",
                "ASTM D86",
                "ASTM D1500",
                "ASTM D93",
                "ASTM D445",
                "ASTM D189",
                "ASTM D6304",
                "ASTM D976"
            ]
        },
        {
            name: "Density at 200oC",
            variants:[
                {
                    name: "Temperature, Max. for",
                    options: [
                        "10% evaporated",
                        "50% evaporated",
                        "90% evaporated"
                    ]
                },
                {
                  name: "Final boiling point, Max.",
                  options:[]
                },
                {
                    name: "Residue, Max.",
                    options: []
                }
            ],

            units: ["kg/m3", "vol %", "wt %", "cSt"],
            methods: [
                "ASTM D4052",
                "ASTM D86",
                "ASTM D1500",
                "ASTM D93",
                "ASTM D445",
                "ASTM D189",
                "ASTM D6304",
                "ASTM D976"
            ]
        },
        {
            name: "Density at 400oC",
            units: ["kg/m3", "vol %", "wt %", "cSt"],
            methods: [
                "ASTM D4052",
                "ASTM D86",
                "ASTM D1500",
                "ASTM D93",
                "ASTM D445",
                "ASTM D189",
                "ASTM D6304",
                "ASTM D976"
            ]
        },
        {
            name: "Density at 900oC",
            units: ["kg/m3", "vol %", "wt %", "cSt"],
            methods: [
                "ASTM D4052",
                "ASTM D86",
                "ASTM D1500",
                "ASTM D93",
                "ASTM D445",
                "ASTM D189",
                "ASTM D6304",
                "ASTM D976"
            ]
        }

    ]*/
    return (
        <Container fluid={true}>
            <Row>
                <Col lg={10}>
                    <CertificateOfAnalysisDetails/>
                </Col>
            </Row>

            <Row>
                <Col lg={10}>
                    <TestResultTable results={tests}
                                     savedTests={savedTests}
                                     testNames={testNames}
                                     onAddTest={handleAddTest}
                                     onTestSelect={handleTestSelect}
                                     onChecked={handleCheck}/>
                </Col>
                <Col lg={2}>
                    <Button variant="primary" size="sm" block onClick={handleAddTest}>Add Test</Button>
                    <Button variant="danger" size="sm" block onClick={handleDeleteTest}>Delete Test</Button>
                    <Button variant="success" size="sm" block>Save Test</Button>
                </Col>
            </Row>

        </Container>


    );

}
