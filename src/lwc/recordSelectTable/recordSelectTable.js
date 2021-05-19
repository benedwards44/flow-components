import { LightningElement, api, track, wire } from 'lwc';
import { FlowAttributeChangeEvent } from 'lightning/flowSupport';
import getRecords from '@salesforce/apex/NSS_RecordSelectTableController.getRecords'; 
import getColumns from '@salesforce/apex/NSS_RecordSelectTableController.getColumns'; 

export default class RecordSelectTable extends LightningElement {

    // Input fields
    @api fields;
    @api objectName;
    @api lookupField;
    @api recordId;
    @api isMultiSelect;

    // Output fields
    @api selectedRecordIds;

    @track isLoading = true;
    @track hasRows = false;
    @track queryTerm;
    @track errors;

    // Table properties
    @track records;
    @track recordsOriginal;
    @track columns;

    @wire(getRecords, { 
        fields: '$fields', 
        objectName: '$objectName', 
        lookupField: '$lookupField', 
        recordId: '$recordId'
    })
    wireRecords({ error, data }){ 

        this.isLoading = true;

        if (data) {
            this.records = data;
            this.recordsOriginal = data;
            this.hasRows = this.records.length > 0;
            this.isLoading = false; 
            this.errors = undefined;
        }  
        else if (error) {

            this.records = undefined;
            this.recordsOriginal = undefined;
            this.hasRows = false; 
            this.isLoading = false;
            this.errors = error;      
        }
    }

    @wire(getColumns, { 
        fields: '$fields', 
        objectName: '$objectName'
    })
    wireColumns({ error, data }){ 
        if (data) {
            this.columns = data;
            this.errors = undefined;
        }  
        else if (error) {
            this.columns = undefined;
            this.errors = error;      
        }
    }

    get renderTable() {
        return this.hasRows && !this.errors;
    }

    get renderNoRecordsMessage() {
        return !this.hasRows && !this.errors;
    }

    get maxRowSelection() {
        return this.isMultiSelect ? '1000' : '1';
    }

    get fieldsArray() {
        return this.fields.split(',');
    }

    selectedRows(event) {   
        let selectedRows = event.detail.selectedRows;   
        let selectedRecordIdsArray = [];
        for (var i = 0; i < selectedRows.length; i++) {
            selectedRecordIdsArray.push(selectedRows[i].Id);
        }
        this.selectedRecordIds = selectedCloseContactIdsArray.join(',');
        // Now need to add the change event to inform the Flow that the event has changed
        const attributeChangeEvent = new FlowAttributeChangeEvent('selectedRecordIds', this.selectedRecordIds);
        this.dispatchEvent(attributeChangeEvent);
    }

    handleSearchInput(evt) {
        if (this.queryTerm !== evt.target.value) {
            this.queryTerm = evt.target.value;
            this.doSearch();
        }
    }

    doSearch() {
        if (this.queryTerm && this.queryTerm.length >= 2) {
            // If we have this search already, clear it (debounce)
            if (this.delayTimeout) window.clearTimeout(this.delayTimeout);
            // Do the search
            this.delayTimeout = setTimeout(() => {
                // Reset the records filter
                this.records = this.recordsOriginal.slice();
                // Filter the records
                this.records = this.records.filter((record) => {
                    return Object.keys(record).filter(key => this.fieldsArray.includes(key)).reduce((x, curr) => {
                        return x || record[curr].toLowerCase().includes(this.queryTerm.toLowerCase());
                    }, false);
                });
            }, 500);
        }
        else {
            // Reset the records filter
            this.records = this.recordsOriginal.slice();
        }
    }
}