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
  return DocumentApp.openById(documentId);
}

const getActiveDocument = ()=> {
  return DocumentApp.getActiveDocument()
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
