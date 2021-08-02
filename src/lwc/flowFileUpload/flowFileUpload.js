import { LightningElement, api, track } from 'lwc';
import { updateRecord } from 'lightning/uiRecordApi';

export default class FlowFileUpload extends LightningElement {

    // Variables passed in from the flow
    @api label;
    @api recordId;
    @api allowMultiple = false;
    @api acceptedFormatsString;
    @api fileNameOveride;
    @api uploadedFileNames;

    // Used to show the files that have been uploaded
    @api hasUploadedFiles = false;
    @track uploadedFiles = [];

    fileCounter = 1;

    // Take the accepted formats from the Flow
    // If none, we return an empty list which means all formats are accepted
    get acceptedFormats() {
        if (this.acceptedFormatsString) {
            return this.acceptedFormatsString.split(',');
        }
        return [];
    }

    connectedCallback() {
        // If we have pre-loaded files (eg. Flow already has context of them)
        // then we pre-load the list to present to the user
        if (this.uploadedFileNames) {
            // Mark component has having uploaded files
            this.hasUploadedFiles = true;
            let fileCount = 0;
            // Iterate over the string to build the file list
            this.uploadedFileNames.split(',').forEach(name => {
                this.uploadedFiles.push({
                    name: name,
                    key: fileCount
                });
                fileCount++;
            });
        }
    }

    // Once uploaded, we add to the array
    // In order to show the list of files to the user
    handleUploadFinished(event) {

        this.hasUploadedFiles = true;
        let filesToRename = [];

        event.detail.files.forEach(file => {

            this.uploadedFiles.push({
                name: file.name,
                key: file.contentVersionId
            });

            // If we are overriding the file name, set a custom file name
            if (this.fileNameOveride) {
                filesToRename.push({
                    Id: file.documentId,
                    Title: this.fileNameOveride + ' #' + this.fileCounter
                });
            }

            this.fileCounter++;
        });

        // Set the full list of uploaded file names to return to the Flow
        this.uploadedFileNames = this.uploadedFiles.map(file => file.name).join(',');

        if (filesToRename.length > 0) {

            const recordInputs =  filesToRename.slice().map(fileToRename => {
                const fields = Object.assign({}, fileToRename);
                return { fields };
            });

            const promises = recordInputs.map(recordInput => updateRecord(recordInput));
                Promise.all(promises).then(() => {
                    return null;
                })
                .catch(error => {
                });
        }
    }
}