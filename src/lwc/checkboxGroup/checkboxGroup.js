import { LightningElement, api, wire, track } from 'lwc';
import getPicklistOptions from '@salesforce/apex/NSS_SelectListController.getPicklistOptions';

export default class CheckboxGroup extends LightningElement {

    @api objectName;
    @api fieldName;
    @api label;
    @api required;
    @api defaultValues;
    @api selectedValues;
 
    @track options = [];
    @track error;

    @wire(getPicklistOptions, {objectName: '$objectName', fieldName: '$fieldName', addNone: false})
    wiredResult(result) { 
        if (result.data) {
            this.options = result.data;
            this.error = undefined;
        }
        else if (result.error) {
            this.error = error;
            this.options = undefined;
        }
    }

    connectedCallback() { 
        // IF we have a value, we need to process it into correct format
        // As Flow passed in a value it doesn't like... go figure.
        if (this.defaultValues) {
            let array = this.defaultValues.substr(1, this.defaultValues.length - 2).split(';');
            this.selectedValues = this.arrayToString(array);
        }   
    }

    // Take the Flow passed variables and convert to LWC format
    get defaultValuesProcessed() {
        return this.defaultValues ? (this.defaultValues.toString()).split(';').join(',') : [];
    }

    handleChange(event) {
        let selectedValuesArray = Array.from(event.detail.value);
        this.selectedValues = this.arrayToString(selectedValuesArray);
    }

    arrayToString(array) {
        return (array.toString()).split(',').join(';');
    }
}