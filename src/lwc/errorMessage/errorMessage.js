import { LightningElement, api } from 'lwc';

export default class ErrorMessage extends LightningElement {

    @api errors;

    get errorString() {

        let error;

        if (this.errors) {

            error = 'Unknown Error';

            if (Array.isArray(this.errors.body)) {

                error = this.errors.body.map(e => e.message).join(', ');
            } 
            else if (typeof this.errors.body.message === 'string') {
    
                error = this.errors.body.message;
            }
        }

        return error;
    }
}