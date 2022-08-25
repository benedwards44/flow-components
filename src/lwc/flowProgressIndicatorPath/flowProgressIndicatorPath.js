import { LightningElement, api} from 'lwc';

export default class ProgressIndicatorPathTypeWithIteration extends LightningElement {

    @api steps = '';
    @api currentStep = '';

    get progressSteps() {
        return this.steps.split(',').map((step, index) => {
            return {
                label: step.trim(),
                value: (index + 1).toString()
            }
        });
    }
   
}