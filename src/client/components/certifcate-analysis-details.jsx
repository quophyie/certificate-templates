import React, {useState, useEffect} from 'react';

import server from '../server';
import CertificateAnalysisDetailRow from './certificate-analysis-detail-row'
import {Col, Form, FormGroup, Row} from "react-bootstrap";

export default function CertificateOfAnalysisDetails () {

    return (


        <Form>
            <CertificateAnalysisDetailRow leftLabel="Report No" rightLabel="Composite prep date" rightHtmlType="date"/>
            <CertificateAnalysisDetailRow leftLabel="Subject" rightLabel="Place of sampling"/>
            <CertificateAnalysisDetailRow leftLabel="Report Date" leftHtmlType="date" rightLabel="Date received" rightHtmlType="date"/>
            <CertificateAnalysisDetailRow leftLabel="Date of issue" leftHtmlType="date" rightLabel="Date completed" rightHtmlType="date"/>
            <CertificateAnalysisDetailRow leftLabel="Sample type" rightLabel="Sample no"/>
            <CertificateAnalysisDetailRow leftLabel="Product type" leftHtmlElement="select" leftHtmlElementStyle={{marginLeft: "0px"}}/>
            <CertificateAnalysisDetailRow leftLabel="Laboratory Manager" leftHtmlElement="select" rightLabel="Analyst" rightHtmlElement="select" />
        </Form>


    );

}
