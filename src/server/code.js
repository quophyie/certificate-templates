import * as publicFunctions from './sheets-utilities.js';
import * as docsPublicFunctions from './docs-utilities.js';

// Expose public functions
/*
global.onOpen = publicFunctions.onOpen;
global.openDialog = publicFunctions.openDialog;
global.openAboutSidebar = publicFunctions.openAboutSidebar;
global.getSheetsData = publicFunctions.getSheetsData;
global.addSheet = publicFunctions.addSheet;
global.deleteSheet = publicFunctions.deleteSheet;
global.setActiveSheet = publicFunctions.setActiveSheet;
*/
global.onOpen = docsPublicFunctions.onOpen;
global.openDialog = docsPublicFunctions.openDialog;
global.openAboutSidebar = docsPublicFunctions.openAboutSidebar;
global.openById = docsPublicFunctions.openById;
global.getActiveDocument = docsPublicFunctions.getActiveDocument;
global.openByUrl = docsPublicFunctions.openByUrl;
global.logger = docsPublicFunctions.logger
