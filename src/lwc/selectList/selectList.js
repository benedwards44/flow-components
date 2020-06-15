import { LightningElement, api, wire, track } from 'lwc';
import getPicklistOptions from '@salesforce/apex/NSS_SelectListController.getPicklistOptions';

export default class SelectList extends LightningElement {

    @api objectName;
    @api fieldName;
    @api label;
    @api required;
    @api picklistValues;
    @api value; 

    @track options;

    @track error;

    @wire(getPicklistOptions, {objectName: '$objectName', fieldName: '$fieldName', addNone: true})
    wiredResult(result) { 
        if (this.picklistValues) {
            this.options = [];
            let optionsArray = this.picklistValues.split(',');
            for (let i = 0; i < optionsArray.length; i++) {
                this.options.push({
                    value: optionsArray[i],
                    label: optionsArray[i]
                });
            }
        }
        else {
            if (result.data) {
                this.options = result.data;
            }
            else if (result.error) {
                this.error = error;
            }
        }
    }

    handleChange(event) {
        this.value = event.detail.value;
    }
}