import React, {useEffect, useState, useRef} from 'react';
import uuidv4 from 'uuid/v4'
import TestResultTable from './test-result-table'
import CertificateOfAnalysisDetails from './certifcate-analysis-details'
import RowTypes from "./row-types"

import * as _ from  'lodash'

import server from '../server';
import {Button, Col, Container, Row} from "react-bootstrap";


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
                    {
                        name: "10% evaporated"
                    },
                    {
                        name: "50% evaporated"
                    },
                    {
                        name: "90% evaporated"
                    }
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

    let [newTests, setNewTests] = useState([])
    let [testNames, setTestNames] = useState([])
    let [hiddenTests, setHiddenTests] = useState([{
        testName:"",
        id: null, // The rowId of the hidden test
        hiddenChildRows:[] // the hidden child rows of this hidden row
    }])

    let [checkedRows, setCheckedRows] = useState([])
    let [prevSelectedRowId, setPrevSelectedRowId] = useState(null)
    let  [selectedRowData, setSelectedRowData] = useState([{
        id: null,
        testName: null,
        method: null,
        unit: null
    }])

    // State of each row and the currently selected test on that row
    let  [rowAndCurrentlySelectedTest, setRowAndCurrentlySelectedTest] = useState([{
        id: null,
        testName: null
    }])
    const previouslySelectedRowData = usePrevious(selectedRowData)
    const previouslySelectedRowId = usePrevious(prevSelectedRowId)


    useEffect(() => {

        setTestNames(insertableRowData.map(test => test.name))
    })

    const {logger, getActiveDocument, openById} = server;


    const handleAddTest = (e, rowType, parentId, testName) => {

        if (!newTests) {
            newTests = []
        }

        //const parentId = findParentId(rowType)
        let showRowControls = true
        let showRow = true

        const newTest = {
            // insertableRowData,
            showRowControls,
            showRow,
            id: uuidv4(),
            style: rowType,
            parentId,
            defaultTestName: testName
        }

        newTest.testNames = getTestNames(newTest)
        insertRow(newTest, parentId, testName)

    }

    const handleTestSelect = (e, rowIndex) => {
        const selectedTestName = e.target.value
        let row = newTests[rowIndex]

        const prevSelRowData = previouslySelectedRowData.find(test => test && previouslySelectedRowId && test.id === previouslySelectedRowId)
        setPrevSelectedRowId(row.id)
        let allDescendantsCurrentlySelectedRow = findDescendants(row.id)

        // If there are no descendant  tests for the currently selected but we have a hidden test that matches the
        // same row id of the currently selected test, we set the test name of the hidden test to the currently selected test
        // This will allow us to correctly set the hidden parent of decendant tests when we add the row in insertRow
        if (allDescendantsCurrentlySelectedRow.length  === 0){
            const hiddenWithNoDescendants = hiddenTests.find(ht => ht.id === row.id)

            if (hiddenWithNoDescendants) {
                console.log("hiddenWithNoDescendants before update -> ", JSON.stringify(hiddenWithNoDescendants))
                hiddenWithNoDescendants.testName = selectedTestName
                console.log("hiddenWithNoDescendants after update -> ", hiddenWithNoDescendants)
            }
        }

        let hiddenRowData ;

        let hiddenRowDataRowsToShow =  hiddenTests.find(test => test  && test.id === row.id && test.testName === selectedTestName)
        let rowsToHide = []

        console.log("handleTestSelect rowAndCurrentlySelectedTest: ", rowAndCurrentlySelectedTest)
        console.log("handleTestSelect selectedTestName: ", selectedTestName)
        let currentlySelectedTestAndRow = rowAndCurrentlySelectedTest.find((r) => r && row && r.id === row.id)

        if (currentlySelectedTestAndRow){
            currentlySelectedTestAndRow.testName = selectedTestName
        } else {
            currentlySelectedTestAndRow = {
                testName: selectedTestName,
                id: row.id
            }

            rowAndCurrentlySelectedTest.push(currentlySelectedTestAndRow)
        }

        setRowAndCurrentlySelectedTest(rowAndCurrentlySelectedTest)
        console.log("currentlySelectedTestAndRow: ",currentlySelectedTestAndRow)
        console.log("rowAndCurrentlySelectedTest: ",rowAndCurrentlySelectedTest)

        // If there any rows of the currently hidden selected row that are still hidden, show them
        const rowsCurrentlySelectedThatAreHidden = hiddenTests.filter(ht => ht && ht.id === currentlySelectedTestAndRow.id && ht.testName === currentlySelectedTestAndRow.testName)
        const childrenRowsCurrentlySelectedThatAreHidden = rowsCurrentlySelectedThatAreHidden.flatMap(rcstah => hiddenTests.filter( ht => rcstah && ht && ht.id === rcstah.id && ht.testName === rcstah.testName)
            .flatMap(ht => ht.hiddenChildRows))

        console.log("rowsCurrentlySelectedThatAreHidden: ", rowsCurrentlySelectedThatAreHidden)
        console.log("childrenRowsCurrentlySelectedThatAreHidden: ", childrenRowsCurrentlySelectedThatAreHidden)

        if (prevSelRowData) {

            // The id used to get the children of the rows to hide must always be  the currently selected row
            const idRowsToHide = prevSelRowData.id === row.id ? prevSelRowData.id : row.id
            console.log("idRowsToHide: ", idRowsToHide)
            // make sure that we dont hide rows in a different group not related to the
            // rows we have selected
            rowsToHide = findDescendants(idRowsToHide, []).filter( r => r !== undefined && r !== null)

            hiddenRowData = hiddenTests.find(hrd => hrd && hrd.id === prevSelRowData.id && hrd.testName === prevSelRowData.testName)




            console.log("rowsToHide: ", JSON.stringify(rowsToHide))
            console.log("hiddenTests: ", JSON.stringify(hiddenTests))
            console.log("loaded hiddenRowData: ", JSON.stringify(hiddenRowData))
            console.log("prevSelRowData: ", JSON.stringify(prevSelRowData))


            if (hiddenRowData) {

                console.log("hiddenRowData.hiddenChildRows: ", hiddenRowData.hiddenChildRows)
                if (hiddenRowData.hiddenChildRows.length <=0 ) {

                    if (row.id  !== null && row.id !== undefined && row.id === prevSelRowData.id) {
                        //console.log("(hiddenRowData.hiddenChildRows <=  0) -> childrenToAddToHiddenRows: ", childrenToAddToHiddenRows)
                        console.log("(hiddenRowData.hiddenChildRows <=  0) -> hiddenRowData.hiddenChildRows: ", hiddenRowData.hiddenChildRows)
                        console.log("(hiddenRowData.hiddenChildRows <=  0) -> rowsToHide: ", rowsToHide)

                        const unattachedHiddenChildRowsToAddToCurrentlySelectedRow = _.differenceWith(rowsToHide, childrenRowsCurrentlySelectedThatAreHidden,
                            (left, right) => left.id === right.id && left.parentId === right.parentId)
                        console.log("unattachedHiddenChildRowsToAddToCurrentlySelectedRow: ", unattachedHiddenChildRowsToAddToCurrentlySelectedRow)
                        hiddenRowData.hiddenChildRows = [...unattachedHiddenChildRowsToAddToCurrentlySelectedRow]
                        console.log("(hiddenRowData.hiddenChildRows <=  0) after hiddenRowData.hiddenChildRows = [...rowsToHide] -> rowsToHide: ", hiddenRowData.hiddenChildRows)
                    }
                }
                console.log("hiddenRowData.hiddenChildRows after  childrenToAddToHiddenRows: ", hiddenRowData.hiddenChildRows)




            } else {
                let allHiddenTestsForGivenRowId = hiddenTests.filter(hrd => hrd && hrd.id === row.id).flatMap(hidden => hidden.hiddenChildRows)
                console.log("allHiddenTestsForGivenRowId: ", allHiddenTestsForGivenRowId)
                console.log("allHiddenTestsForGivenRowId -> hiddenTests: ", hiddenTests)
                let childrenToAddToHiddenRow = _.differenceWith(rowsToHide, allHiddenTestsForGivenRowId, (left, right) => left.id === right.id)

                console.log("childrenToAddToHiddenRow: ", childrenToAddToHiddenRow)
                const bAllRowsToHideHaveSameParent = childrenToAddToHiddenRow.every(ch => ch.parentId === row.id)

                // We only add to rows if the selection is one that has a parent
                console.log("bAllRowsToHideHaveSameParent: ", bAllRowsToHideHaveSameParent)
                if (bAllRowsToHideHaveSameParent) {
                   console.log("adding new hidden row data childrenToAddToHiddenRow: ", childrenToAddToHiddenRow)
                   const hiddenTestData = {
                       testName: prevSelRowData.testName,
                       id: prevSelRowData.id, // The rowId of the hidden test
                       //hiddenChildRows: [...childrenToAddToHiddenRow]
                   }
                   upsertHiddenRowDataWithHiddenRows(hiddenTestData, childrenToAddToHiddenRow)
                   console.log("old hidden row data: ", hiddenRowData)
                   console.log("adding new hidden row data: ", hiddenTestData)

                   const existingHiddenData = hiddenTests.find(ht => ht.id === hiddenTestData.id && ht.testName === hiddenTestData.testName)

                   // We only add to hiddenTests if we dont have an entry otherwise, we will overwrite the hidden test data for
                   // the given test
                   console.log("existingHiddenData: ", existingHiddenData)
                   if (!existingHiddenData) {
                       hiddenTests.push(hiddenTestData)
                   }
               } else {

                    // We are gonna handle tests that have been selected but have not been saved
                    console.log("all rows to hide dont have same parent: ", bAllRowsToHideHaveSameParent)
                    let allRowsNotDirectChildrenOfCurrRow = childrenToAddToHiddenRow.filter(ch => ch.parentId !== row.id)

                    let rowsWhichAreNotChildrenOfCurrentRow = _.differenceWith(allRowsNotDirectChildrenOfCurrRow, allDescendantsCurrentlySelectedRow,
                        (left, right) => left.id === right.id)
                    console.log("allRowsNotDirectChildrenOfCurrRow: ", allRowsNotDirectChildrenOfCurrRow)
                    console.log("allDescendantsCurrentlySelectedRow: ", allDescendantsCurrentlySelectedRow)
                    console.log("rowsWhichAreNotChildrenOfCurrentRow: ", rowsWhichAreNotChildrenOfCurrentRow)
                    console.log("rowAndCurrentlySelectedTest existing row: ", rowAndCurrentlySelectedTest)

                    rowsWhichAreNotChildrenOfCurrentRow.map(rowWhichIsNotChildOfCurrentSelectedRow => {

                        console.log("rowWhichIsNotChildOfCurrentSelectedRow 1st map: ", rowWhichIsNotChildOfCurrentSelectedRow)
                        const rowAndSelectedTest = rowAndCurrentlySelectedTest.find(rcst => rcst && rowWhichIsNotChildOfCurrentSelectedRow
                            && rowWhichIsNotChildOfCurrentSelectedRow.parentId === rcst.id)
                        let resRow = {}

                        if (rowAndSelectedTest) {
                            resRow = {
                                rowAndSelectedTest,
                                rowWhichIsNotChildOfCurrentSelectedRow
                            }
                        }
                        console.log("resRow: ", resRow)
                        return resRow
                    }).map(resRow => {
                        const rowAndSelectedTest = resRow.rowAndSelectedTest
                        const rowWhichIsNotChildOfCurrentSelectedRow = resRow.rowWhichIsNotChildOfCurrentSelectedRow

                        const hidden = hiddenTests.find(ht => rowAndSelectedTest && ht && ht.id === rowAndSelectedTest.id && ht.testName === rowAndSelectedTest.testName)

                        let allHiddenTestsForParentOfRowWhichIsNotChildOfCurrentSelectedRow = hiddenTests.filter(hrd => hrd && hrd.id === rowWhichIsNotChildOfCurrentSelectedRow.parentId)
                            .flatMap(hidden => hidden.hiddenChildRows)

                        console.log("allHiddenTestsForParentOfRowWhichIsNotChildOfCurrentSelectedRow: ", allHiddenTestsForParentOfRowWhichIsNotChildOfCurrentSelectedRow)
                        console.log("rowAndSelectedTest: ", rowAndSelectedTest)

                        const existingHiddenRow = allHiddenTestsForParentOfRowWhichIsNotChildOfCurrentSelectedRow.find(r => r.id === rowWhichIsNotChildOfCurrentSelectedRow.id)
                        if (hidden) {


                            if (!existingHiddenRow) {
                                // hidden.hiddenChildRows.push(rowWhichIsNotChildOfCurrentSelectedRow)
                                upsertHiddenRowDataWithHiddenRows(hidden, rowWhichIsNotChildOfCurrentSelectedRow)
                                console.log("pushed rowWhichIsNotChildOfCurrentSelectedRow into hiddenTests. Hidden: ", hidden, " rowWhichIsNotChildOfCurrentSelectedRow: ", rowWhichIsNotChildOfCurrentSelectedRow)
                                console.log("existingHiddenRow: ", existingHiddenRow)
                            } else {
                                console.log("rowWhichIsNotChildOfCurrentSelectedRow is already in hiddenTests: ", rowWhichIsNotChildOfCurrentSelectedRow)
                            }
                        } else {
                            // We
                            let  hiddChildRows = existingHiddenRow ? [] : [rowWhichIsNotChildOfCurrentSelectedRow]

                            const hiddenTestData = {
                                testName: rowAndSelectedTest.testName,
                                id: rowAndSelectedTest.id, // The rowId of the hidden test
                                //hiddenChildRows: [...hiddChildRows]
                            }

                            upsertHiddenRowDataWithHiddenRows(hiddenRowData, hiddChildRows)
                            hiddenTests.push(hiddenTestData)
                            console.log("added rowWhichIsNotChildOfCurrentSelectedRow into hiddenTests. hiddenTestData: ", hiddenTestData)
                        }
                        return rowWhichIsNotChildOfCurrentSelectedRow
                    })
                }
            }


            setHiddenTests(hiddenTests)
            console.log("newTests: ", newTests)
            console.log("hiddenRowData: ", hiddenRowData)

            console.log("rowsToHide after all: ", rowsToHide)
            showRows(rowsToHide, false)
            prevSelRowData.testName = selectedTestName
            console.log("hiddenTests after all: ", hiddenTests)

        } else {
            previouslySelectedRowData.push({
                id: row.id,
                testName: selectedTestName,
                method: null,
                option: null
            })
        }

        setSelectedRowData(previouslySelectedRowData)

        // Find children of prevSelRowData and their children's children etc
        // set all their showRows to false
        //Set current row to prev row

        if(row) {
            let rowsWithVariants = newTests.filter(test => test  && test.variants && test.variants.length > 0)
            const variants = rowsWithVariants.flatMap(rowsWithVariant => rowsWithVariant.variants)
            let variantParent
            if(variants)  {
                variantParent = newTests.find((test) => test  && test.id === row.parentId)
            }

            let rowVariantParentId
            let testData

            if (variantParent){
                rowVariantParentId = variantParent.id
            }


            if (row.style === RowTypes.STANDARD) {
                testData = insertableRowData.find(test => selectedTestName.trim().toLowerCase() === test.name.trim().toLowerCase())

            } else if ((row.style === RowTypes.VARIANT || row.style === RowTypes.OPTION)) {
                testData = newTests.find(test => test &&  test.id === rowVariantParentId)
            }

            let propsToPick = ["variants", "methods", "units", "addItemButton"]
            if (row.style === RowTypes.VARIANT && row.variants){
                let selectedVariant = row.variants.find(variant => variant.name.trim().toLowerCase() === selectedTestName.trim().toLowerCase())

               if (selectedVariant && selectedVariant.options && selectedVariant.options.length > 0) {
                    propsToPick = ["addItemButton"]
                    row.showRowControls = false
                } else {
                    row.showRowControls = true
                }

            } else {
                row.showRowControls = true
            }

            row = Object.assign(row,  Object.assign({}, _.pick(testData, propsToPick)))
            // show any child  rows which was previously hidden for the selected row

            const { currentlyDisplayedRowsFromRowsAndSelectedTests, hiddenChildrenOfAllCurrentlyDisplayedRowsExceptCurrentlySelectedTest, siblingsOfSelectedRowsToHide} =
                getAllCurrentlyDisplayedHiddenChildrenExceptCurrentlySelectedTestAndCurrentlyDisplayedAndSiblingOfCurrentlyDisplayed()

            const currentlyDisplayedRowIdsExcludingSelectedRowId = rowAndCurrentlySelectedTest.filter(rcst => rcst.id !== row.id && !isDescendant(row.id, rcst.id)).map(rcts  => rcts.id)
            const currentlyDisplayedRowsExcludingSelectedRowFromNewTestArray = newTests.filter(test => currentlyDisplayedRowIdsExcludingSelectedRowId.indexOf(test.id) > -1 && test.showRow === true)

            const descendantsFromCurrentlyDisplayedRowsExcludingSelectedRowFromRowsAndSelectedTests = currentlyDisplayedRowsFromRowsAndSelectedTests.map(ch => ch ? ch : null)
                .map(ch => hiddenTests.find(ht => ht.id !== null && ht.id !== undefined && ch.id !==null && ch.id !== undefined
                    && ht.id === ch.id && ht.testName === ch.testName))
                .flatMap(ch => ch ? ch.hiddenChildRows : [])
                .flatMap(ch => findDescendants(ch.id))

            const descendantsCurrentSelectedRowToHide = getDescendantsToHideToForCurrentlySelectedRow(row)

            console.log("currentlyDisplayedRowIdsExcludingSelectedRowId to show: ", currentlyDisplayedRowIdsExcludingSelectedRowId)
            console.log("currentlyDisplayedRowsExcludingSelectedRowFromNewTestArray to show: ", currentlyDisplayedRowsExcludingSelectedRowFromNewTestArray)
            console.log("descendantsFromCurrentlyDisplayedRowsExcludingSelectedRowFromRowsAndSelectedTests: ", descendantsFromCurrentlyDisplayedRowsExcludingSelectedRowFromRowsAndSelectedTests)
            console.log("currentlyDisplayedRowsFromRowsAndSelectedTests: ", currentlyDisplayedRowsFromRowsAndSelectedTests)
            console.log("hiddenTests: ", hiddenTests)
            console.log("descendantsCurrentSelectedRowToHide: ", descendantsCurrentSelectedRowToHide)

            if (descendantsCurrentSelectedRowToHide.length > 0){
                //  only hide children of currently selected row
                showRows(descendantsCurrentSelectedRowToHide, false)
                console.log("hidding descendantsCurrentSelectedRowToHide: ", JSON.stringify(descendantsCurrentSelectedRowToHide))
            }

            if (hiddenRowDataRowsToShow) {

                showRows([...hiddenRowDataRowsToShow.hiddenChildRows, ...currentlyDisplayedRowsExcludingSelectedRowFromNewTestArray, ...descendantsFromCurrentlyDisplayedRowsExcludingSelectedRowFromRowsAndSelectedTests], true)


                if (rowsCurrentlySelectedThatAreHidden && rowsCurrentlySelectedThatAreHidden.length > 0){

                    showRows([...rowsCurrentlySelectedThatAreHidden, ...childrenRowsCurrentlySelectedThatAreHidden], true)
                }

                console.log("hiddenTests: ", hiddenTests)
                console.log("hiddenRowDataRowsToShow.hiddenChildRows -> hiddenRowDataRowsToShow.hiddenChildRows: ", hiddenRowDataRowsToShow.hiddenChildRows)

                // console.log("hiddenRowDataRowsToShow -> currentlyDisplayedRowsFromRowsAndSelectedTests: ", currentlyDisplayedRowsFromRowsAndSelectedTests)
                console.log("hiddenRowDataRowsToShow -> hiddenChildrenOfAllCurrentlyDisplayedRowsExceptCurrentlySelectedTest: ", hiddenChildrenOfAllCurrentlyDisplayedRowsExceptCurrentlySelectedTest)
                console.log("hiddenRowDataRowsToShow -> siblingsOfSelectedRowsToHide: ", siblingsOfSelectedRowsToHide)

            } else {

                console.log("siblingsOfSelectedRowsToHide: ", siblingsOfSelectedRowsToHide)
                console.log("hiddenChildrenOfAllCurrentlyDisplayedRowsExceptCurrentlySelectedTest: ", hiddenChildrenOfAllCurrentlyDisplayedRowsExceptCurrentlySelectedTest)
                showRows(siblingsOfSelectedRowsToHide, false)


                showRows([...currentlyDisplayedRowsExcludingSelectedRowFromNewTestArray, ...currentlyDisplayedRowsFromRowsAndSelectedTests, ...descendantsFromCurrentlyDisplayedRowsExcludingSelectedRowFromRowsAndSelectedTests], true)

                console.log("NO hiddenRowDataRowsToShow  to show: ", currentlyDisplayedRowsExcludingSelectedRowFromNewTestArray)
            }
        }


        setNewTests(newTests)


    }

    const handleDeleteTest = () => {

        openById("1whfixRNIKNK7mpIvaQsN2R9e0TI60RopoaEZE0UUHp0").then(doc => console.log("Active doc: ", doc.toString()))
            .catch(alert)

        /*
        checkedRows.forEach((rowIdx) => {

            newTests[rowIdx] = null
        })
        */

        const parentsToDelete = checkedRows.map((rowIdx) => newTests[rowIdx])
        checkedRows.map((rowIdx) => [newTests[rowIdx], rowIdx])
            .map(result => {
                const [row, rowToDelIdx] = result
                newTests[rowToDelIdx] = null
                return findDescendants(row.id)
            })
            .flatMap(child => child)
            .map(r => {
                const rowToDeleteIdx = newTests.findIndex(test => test && r && test.id === r.id)
               // newTests.splice(rowToDeleteIdx, 1)
                newTests[rowToDeleteIdx] = null
            })

        checkedRows = []
        setCheckedRows(checkedRows)

        setNewTests(newTests)

    }

    const handleCheck = (e, rowIndex) =>{
        const idxCheckedRow = checkedRows.indexOf(rowIndex)

        if ( idxCheckedRow > -1  && !e.target.checked) {
            checkedRows.splice(idxCheckedRow, 1)
        } else if ( idxCheckedRow < 0  && e.target.checked) {
            checkedRows.push(rowIndex)
        }

        setCheckedRows(checkedRows)

    }

    // Hook
    function usePrevious(value) {
        // The ref object is a generic container whose current property is mutable ...
        // ... and can hold any value, similar to an instance property on a class
        const ref = useRef();

        // Store current value in ref
        useEffect(() => {
            ref.current = value;
        }, [value]); // Only re-run if value changes

        // Return previous value (happens before update in useEffect above)
        return ref.current;
    }

    const findParentId = (_currentRowStyle) => {
        for (let idx = newTests.length; idx > -1; idx--){
            const row = newTests[idx]
            if (row) {
                //True for variant parent Id
                if ((_currentRowStyle === RowTypes.VARIANT && row.style === RowTypes.STANDARD)
                    //True for option parent Id
                    || (_currentRowStyle === RowTypes.OPTION && row.style === RowTypes.VARIANT)){
                    return row.id;
                }

            }
        }
    }

    const getTestNames = (row) => {


        let rowsWithVariants = insertableRowData.filter(test => test.variants && test.variants.length > 0)
        const variants = rowsWithVariants.flatMap(rowsWithVariant => rowsWithVariant.variants)

        if (row.style === RowTypes.STANDARD){
            return insertableRowData.map(test => test.name)
        } else if (rowsWithVariants && row ){
            if (row.style === RowTypes.VARIANT && variants) {
                return variants.map(variant => variant.name)
            } else if (row.style === RowTypes.OPTION && variants) {
                return variants.flatMap(variant => variant.options)
                    .map(option => option.name)
            }
        }
    }

    function findDescendants (rowId, children = []) {
        if (!children){
            children = []
        }
        if (rowId === undefined || rowId === null){
            return []
        }


        let rowChildren =  newTests.filter(test => test && test.parentId === rowId)
        let rowChildGrandChildren
        if (rowChildren && rowChildren.length > 0){
            rowChildGrandChildren = rowChildren.map(ch => findDescendants(ch.id, children)).flatMap(val=>val)
            children = [...children, ...rowChildGrandChildren, ...rowChildren]
        }

        return children

    }


    const showRows = (rows, bShow) => {

        if (rows && rows.length > 0){

            rows.forEach(row => {
                if (row) {
                    row.showRow = bShow
                }
            })
        }
    }

    const isDescendant = (rowId, descendantRowId) => {
        if (rowId === null || rowId === undefined || descendantRowId === null || descendantRowId === undefined){
            return false
        }

        const descendants = findDescendants(rowId).filter(r => r.id === descendantRowId)
        return descendants.length > 0
    }

    const insertRow = (row, parId, defaultTestName) => {
        const parentId = row.parentId
        console.log("defaultTestName: ", defaultTestName)

        if ((parentId === null || parentId === undefined) && row.style === RowTypes.STANDARD){
            newTests.push(row)
        } else {
            const rowParentChildren = findDescendants(parentId).filter(r => r && row && r.style === row.style)

            if (rowParentChildren && rowParentChildren.length > 0){

                const lastChild = rowParentChildren[rowParentChildren.length - 1]
                let indexOfLastChild = newTests.findIndex(r => {

                    return r && r.id === lastChild.id
                })

                if (lastChild && (indexOfLastChild >= 0 && indexOfLastChild < newTests.length - 1)) {

                    indexOfLastChild += 1
                    newTests.splice(indexOfLastChild, 0, row)
                } else {
                    newTests.push(row)
                }

            } else {
                const parent = newTests.find(r => r && r.id === parentId)
                let indexOfParentRow = newTests.findIndex(r => r && r.id === parent.id)

                if (indexOfParentRow >= 0 && indexOfParentRow < newTests.length - 1){

                    indexOfParentRow += 1
                    newTests.splice(indexOfParentRow, 0, row)
                } else {
                    newTests.push(row)
                }
            }

        }

        const displayedParentOfNewRow = rowAndCurrentlySelectedTest.find((r) => r.id === row.parentId)


        // For newly added root tests
        if (!row.parentId) {
            const  hiddenTestData = {
                testName: defaultTestName,
                id: row.id, // The rowId of the hidden test
                hiddenChildRows: []
            }
            // hiddenTests.push(hiddenTestData)
            upsertHiddenRowDataWithHiddenRows(hiddenTestData, [])
            console.log("insertRow -> added hiddenTest for root row: ", hiddenTestData)

            const displayedRowAndSelectedTest = rowAndCurrentlySelectedTest.find((r) => r.id === row.id)

            if (!displayedRowAndSelectedTest) {
                const rowAndSelectedTest = {
                    id: row.id,
                    testName: defaultTestName
                }
                rowAndCurrentlySelectedTest.push(rowAndSelectedTest)
                setRowAndCurrentlySelectedTest(rowAndCurrentlySelectedTest)
                console.log("insertRow -> added root entry for rowAndCurrentlySelectedTest ", rowAndCurrentlySelectedTest)
            }
        }

        if (displayedParentOfNewRow) {

            const hiddenRowData = hiddenTests.find(hrd => hrd.id === row.parentId && hrd.testName === displayedParentOfNewRow.testName )
            console.log("insertRow -> hiddenTests: ", hiddenTests)
            console.log("insertRow -> hiddenRowData: ", hiddenRowData)

            if(hiddenRowData) {

                // hiddenRowData.hiddenChildRows.push(row)
                upsertHiddenRowDataWithHiddenRows(hiddenRowData, [row])
                console.log("insertRow -> added hidden row for hiddenRowData: row: ", row, " hiddenRowData: ", hiddenRowData)
                setHiddenTests(hiddenTests)
            }  else if(!hiddenRowData) {
                const hiddenRowDataToSave ={
                    id: displayedParentOfNewRow.id,
                    testName: displayedParentOfNewRow.testName
                }
                upsertHiddenRowDataWithHiddenRows(hiddenRowDataToSave, [row])
                console.log("insertRow -> NO hiddenRowData: row: ", row, " hiddenRowDataToSave: ", hiddenRowDataToSave)
            }
            //console.log("insertRow -> row: ", row)
            //console.log("insertRow -> displayedParentOfNewRow: ", displayedParentOfNewRow)
        }
        console.log("insertRow -> row: ", row)
        console.log("insertRow -> rowAndCurrentlySelectedTest: ", rowAndCurrentlySelectedTest)
        console.log("insertRow -> displayedParentOfNewRow: ", displayedParentOfNewRow)


        setNewTests(newTests)
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

    const getAllCurrentlyDisplayedHiddenChildrenExceptCurrentlySelectedTestAndCurrentlyDisplayedAndSiblingOfCurrentlyDisplayed = () => {
        const currentlyDisplayedRowsFromRowsAndSelectedTests = hiddenTests.map(ht => rowAndCurrentlySelectedTest
            .find(rcts => rcts.id !== null && rcts.id !== undefined && ht.id !== null && ht.id !== undefined
                && ht.id === rcts.id && ht.testName === rcts.testName
            )).filter( ccdr => ccdr !== null && ccdr !== undefined)

        const hiddenChildrenOfAllCurrentlyDisplayedRowsExceptCurrentlySelectedTest = currentlyDisplayedRowsFromRowsAndSelectedTests.flatMap(cddr => hiddenTests
            .filter(ht => {
                console.log("getAllCurrentlyDisplayedHiddenChildrenExceptCurrentlySelectedTestAndCurrentlyDisplayedAndSiblingOfCurrentlyDisplayed: cddr -> ", cddr)
                console.log("getAllCurrentlyDisplayedHiddenChildrenExceptCurrentlySelectedTestAndCurrentlyDisplayedAndSiblingOfCurrentlyDisplayed: ht -> ", ht)
                const bFoundHiddenChildren = ht && ht && ht.testName !== cddr.testName && ht.id === cddr.id
                console.log("bFoundHiddenChildren: ", bFoundHiddenChildren)
                return bFoundHiddenChildren
            }))
            .flatMap( ht => ht.hiddenChildRows)

        console.log("currentlyDisplayedRowsFromRowsAndSelectedTests: ", currentlyDisplayedRowsFromRowsAndSelectedTests)
        console.log("hiddenChildrenOfAllCurrentlyDisplayedRowsExceptCurrentlySelectedTest: ", hiddenChildrenOfAllCurrentlyDisplayedRowsExceptCurrentlySelectedTest)

        /*
        const hiddenRowDataRowsToShowParent = newTests.find((nt) => nt && nt.id === hiddenRowDataRowsToShow.id)
        let  siblingsOfSelectedRowsToHide = hiddenRowDataRowsToShowParent ? findDescendants(hiddenRowDataRowsToShowParent.id) : []

        console.log("hiddenRowDataRowsToShowParent: ", hiddenRowDataRowsToShowParent)
        console.log("siblingsOfSelectedRowsToHide: ", siblingsOfSelectedRowsToHide)
        console.log("hiddenRowDataRowsToShow to show: ", hiddenRowDataRowsToShow)
        console.log("hiddenRowDataRowsToShow Child rows to show: ", hiddenRowDataRowsToShow.hiddenChildRows)
        */


        let siblingsOfSelectedRowsToHide = hiddenChildrenOfAllCurrentlyDisplayedRowsExceptCurrentlySelectedTest.map(hccdr => hccdr && hccdr.parentId ?  hccdr.parentId: null)
            .map(parentId => hiddenTests.find(ht =>ht && parentId &&  ht.id === parentId))
            .flatMap(parent => parent.hiddenChildRows)

        // remove duplicates
        const uniqueSiblingsOfSelectedRowsToHide = new Set(siblingsOfSelectedRowsToHide)
        siblingsOfSelectedRowsToHide = Array.from(uniqueSiblingsOfSelectedRowsToHide)

        console.log("uniqueSiblingsOfSelectedRowsToHide: ",  uniqueSiblingsOfSelectedRowsToHide)

        return {
            currentlyDisplayedRowsFromRowsAndSelectedTests: currentlyDisplayedRowsFromRowsAndSelectedTests,
            hiddenChildrenOfAllCurrentlyDisplayedRowsExceptCurrentlySelectedTest: hiddenChildrenOfAllCurrentlyDisplayedRowsExceptCurrentlySelectedTest,
            siblingsOfSelectedRowsToHide
        }
    }

    const getDescendantsToHideToForCurrentlySelectedRow = (row) => {
        if (!row || row.id === null || row.id === undefined){
            return []
        }

       const directChildrenToHideForCurrentlySelectedRow =  hiddenTests.filter( ht => ht !== null && ht !== undefined
       && ht.id === row.id)
           .flatMap(ht => ht.hiddenChildRows)
           .filter(hcr => hcr.showRow === true)

        let descendants = []
        if (directChildrenToHideForCurrentlySelectedRow){
            let toHide = directChildrenToHideForCurrentlySelectedRow.filter(hccdr => hccdr && hccdr.parentId === row.id)

            const toHideChildren = toHide.flatMap( th => findDescendants(th.id))

            descendants = [...toHide, ...toHideChildren]
            console.log("getDescendantsToHideToForCurrentlySelectedRow -> row: ", row)
            console.log("getDescendantsToHideToForCurrentlySelectedRow -> directChildrenToHideForCurrentlySelectedRow: ", directChildrenToHideForCurrentlySelectedRow)
            console.log("getDescendantsToHideToForCurrentlySelectedRow -> toHide: ", toHide)
            console.log("getDescendantsToHideToForCurrentlySelectedRow -> toHideChildren: ", toHideChildren)
        }

        console.log("getDescendantsToHideToForCurrentlySelectedRow -> descendants: ", descendants)
        return descendants
    }

    const upsertHiddenRowDataWithHiddenRows = (hiddenRowData, newHiddenRowsToAdd) => {
        if (!hiddenRowData || !newHiddenRowsToAdd){
            return
        }

        const bFoundHiddenTest = hiddenTests.find(ht => ht && ht.id === hiddenRowData.id && ht.testName === hiddenRowData.testName) !== undefined
        if (!bFoundHiddenTest){
            console.log("upsertHiddenRowDataWithHiddenRows -> hiddenRowData not in hiddenTests ... adding hiddenRowData: ", hiddenRowData)
            hiddenTests.push(hiddenRowData)
        }

        let hiddenChildRows = hiddenRowData.hiddenChildRows
        console.log("upsertHiddenRowDataWithHiddenRows -> hiddenChildRows: ", hiddenChildRows)
        console.log("upsertHiddenRowDataWithHiddenRows -> newHiddenRowsToAdd: ", newHiddenRowsToAdd)


        let allCurrentlyDisplayedDescendantsOfHiddenRowsToAdd = []

        if (hiddenChildRows && hiddenChildRows.length > 0) {
            hiddenRowData.hiddenChildRows = [...hiddenRowData.hiddenChildRows, ...newHiddenRowsToAdd]
            allCurrentlyDisplayedDescendantsOfHiddenRowsToAdd  = newHiddenRowsToAdd.flatMap(newHiddenRowToAdd => findDescendants(newHiddenRowToAdd.id))
                .filter(newHiddenRowToAdd => newHiddenRowToAdd && newHiddenRowToAdd.showRow === true)

            console.log("upsertHiddenRowDataWithHiddenRows -> allCurrentlyDisplayedDescendantsOfHiddenRowsToAdd: ", allCurrentlyDisplayedDescendantsOfHiddenRowsToAdd)

            allCurrentlyDisplayedDescendantsOfHiddenRowsToAdd.filter(descendant => {
                const rowAndSelectedTest = rowAndCurrentlySelectedTest.find(rcst => descendant.id === rcst.id)
                const resRow = {
                    rowAndSelectedTest,
                    descendant
                }
                console.log("upsertHiddenRowDataWithHiddenRows -> resRow: ", resRow)
                return resRow
            })
                .map(resRow => {

                    // If the resRow is displayed but its not in rowAndCurrentlySelectedTest
                    // Add it  to rowAndCurrentlySelectedTest
                    if (!resRow.rowAndSelectedTest){
                        const rowAndSelectedTest = {
                            id: resRow.descendant.id,
                            testName: resRow.descendant.defaultTestName
                        }
                        rowAndCurrentlySelectedTest.push(rowAndSelectedTest)
                        console.log("upsertHiddenRowDataWithHiddenRows -> rowAndSelectedTest: ", rowAndSelectedTest)
                    }

                    return resRow.descendant
                })
                .map(descendant => {
                    // add the descendant to the hidden row if its not already in the hidden rows
                    if (descendant && !hiddenChildRows.find(hr => hr.id === descendant.id)){
                        hiddenRowData.hiddenChildRows = [...hiddenRowData.hiddenChildRows, descendant]
                        console.log("upsertHiddenRowDataWithHiddenRows ->  hiddenChildRows.push(descendant): ", descendant)
                    }
                    return descendant
                })
        } else {
            hiddenRowData.hiddenChildRows = [...newHiddenRowsToAdd]
        }


        console.log("upsertHiddenRowDataWithHiddenRows: ", hiddenRowData)
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
                    <TestResultTable newTests={newTests}
                                     insertableRowData={insertableRowData}
                                     savedTests={savedTests}
                                     onAddTest={handleAddTest}
                                     onTestSelect={handleTestSelect}
                                     onChecked={handleCheck}/>
                </Col>
                <Col lg={2}>
                    <Button variant="primary" size="sm" block onClick={ (e) => handleAddTest(e, RowTypes.STANDARD, null, insertableRowData[1].name) }>Add Test</Button>
                    <Button variant="danger" size="sm" block onClick={handleDeleteTest}>Delete Test</Button>
                    <Button variant="success" size="sm" block>Save Test</Button>
                </Col>
            </Row>

        </Container>


    );

}
