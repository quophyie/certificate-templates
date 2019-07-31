import React, {useState, useEffect} from 'react';

import server from '../server';
import AnalysisRow from './analysis-row'
import {Col, Form, FormGroup, Row} from "react-bootstrap";

export default function CertificateOfAnalysisDetails () {

    return (


        <Form>
            <AnalysisRow leftLabel="Report No" rightLabel="Composite prep date" rightHtmlType="date"/>
            <AnalysisRow leftLabel="Subject" rightLabel="Place of sampling"/>
            <AnalysisRow leftLabel="Report Date" leftHtmlType="date" rightLabel="Date received" rightHtmlType="date"/>
            <AnalysisRow leftLabel="Date of issue" leftHtmlType="date" rightLabel="Date completed" rightHtmlType="date"/>
            <AnalysisRow leftLabel="Sample type" rightLabel="Sample no"/>
            <AnalysisRow leftLabel="Product type" leftHtmlElement="select"  leftHtmlElementStyle={{marginLeft: "0px"}}/>
            <AnalysisRow leftLabel="Laboratory Manager" leftHtmlElement="select"  rightLabel="Analyst" rightHtmlElement="select" />
        </Form>


    );

}
