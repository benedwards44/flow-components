import { LightningElement, api, track } from 'lwc';

export default class FlowFooterPlus extends LightningElement {
    @api availableActions = [];

    @api auraComponent = false;

    @api canPause;
    @api labelPause;

    @api canBack;
    @api labelBack;

    @api canNext;
    @api labelNext;

    @api canFinish;
    @api labelFinish;

    @api canSaveAndNew;
    @api labelSaveAndNew;

    @api saveAndNewOutputVariable;

    @track showPause;
    @track showBack;
    @track showNext;
    @track showFinish;
    @track showSaveAndNew;
    @track variantNext;
    @track finalNextLabel;

    connectedCallback() {
        // Figure out which buttons to display
        for (let i = 0; i < this.availableActions.length; i++) {
            if (this.availableActions[i] === "PAUSE" && this.canPause) {
                this.showPause = true;
            } else if (this.availableActions[i] === "BACK" && this.canBack) {
                this.showBack = true;
            } else if (this.availableActions[i] === "NEXT" && (this.canNext || this.canFinish)) {
                this.variantNext = 'neutral';
                this.finalNextLabel = this.labelNext;
                this.showNext = true;

                // This is because it's only finish when the screen is the last element, but when it's not, it's coming as a next button and we need to use the label for the finish
                if (this.canFinish) {
                    this.finalNextLabel = this.labelFinish;
                    this.variantNext = 'brand';
                }
            } else if (this.availableActions[i] === "FINISH" && this.canFinish) {
                this.showFinish = true;
            }
        }

        if (this.canSaveAndNew) {
            this.showSaveAndNew = true;
        }
    }

    handleClick (event) {
        // Figure out which action was called
        const actionClicked = event.target.name;
        let params = { detail: { actionClicked } };

        if (actionClicked === 'SAVEANDNEW') {
            if (this.auraComponent) {
                params.detail.saveAndNewVariable = true;
            }
        }

        const fireEvent = new CustomEvent('ButtonPressed', params);

        //Fire Event
        this.dispatchEvent(fireEvent);
    }

}