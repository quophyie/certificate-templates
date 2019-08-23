// Use ES6/7 code
const onOpen = () => {
  DocumentApp.getUi() // Or DocumentApp or FormApp.
    .createMenu('Verity Labs Certificates')
    .addItem('Manage Certificate', 'openDialog')
   // .addItem('About me', 'openAboutSidebar')
    .addToUi();
};

const openDialog = () => {
  const html = HtmlService.createHtmlOutputFromFile('main')
    .setWidth(1700)
    .setHeight(1000);
  DocumentApp
    .getUi() // Or DocumentApp or FormApp.
    .showModalDialog(html, 'Certificate Of Analysis Editor');
};

const openAboutSidebar = () => {
  const html = HtmlService.createHtmlOutputFromFile('about');
  SpreadsheetApp
    .getUi()
    .showSidebar(html);
};

const openById = (documentId) => {
  const doc =  DocumentApp.openById(documentId);
  Logger.log("DocumentId is: %s", documentId);
  Logger.log("OpenById Document is: %s",  JSON.stringify(doc.getName()));
  return doc.getName();
}

const getActiveDocument = ()=> {
  const doc =  DocumentApp.getActiveDocument();
  Logger.log("getActiveDocument Document is %s: ", JSON.stringify(doc));
  return doc;
}


const openByUrl = (url) => {
  return DocumentApp.openByUrl(url);
}

const logger = () =>  Logger

export {
  onOpen,
  openDialog,
  openAboutSidebar,
  openById,
  getActiveDocument,
  openByUrl,
  logger
};
