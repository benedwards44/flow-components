import { LightningElement, api, track } from 'lwc';
import { 
    FlowAttributeChangeEvent,
    FlowNavigationPauseEvent, 
    FlowNavigationNextEvent, 
    FlowNavigationBackEvent, 
    FlowNavigationFinishEvent 
} from 'lightning/flowSupport';

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

    @api canSaveAndDone;
    @api labelSaveAndDone;

    @api saveAndNewOutputVariable = false;
    @api saveAndDoneOutputVariable = false;

    @track showPause;
    @track showBack;
    @track showNext;
    @track showFinish;
    @track showSaveAndDone;
    @track showSaveAndNew;
    @track variantNext;
    @track finalNextLabel;

    connectedCallback() {

        this.variantNext = 'neutral';

        // Figure out which buttons to display
        for (let i = 0; i < this.availableActions.length; i++) {
            if (this.availableActions[i] === "PAUSE" && this.canPause) {
                this.showPause = true;
            } 
            else if (this.availableActions[i] === "BACK" && this.canBack) {
                this.showBack = true;
            } 
            else if (this.availableActions[i] === "NEXT" && (this.canNext || this.canFinish)) {
                this.showNext = true;
                this.finalNextLabel = this.labelNext ? this.labelNext : 'Next';
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

        if (this.canSaveAndDone) {
            this.showSaveAndDone = true;
        }
    }

    handleClick (event) {
        // Figure out which action was called
        const actionClicked = event.target.name;
        let navigateEvent;
        switch(actionClicked) {
            case 'PAUSE': 
                navigateEvent = new FlowNavigationPauseEvent();
                break;
            case 'BACK': 
                navigateEvent = new FlowNavigationBackEvent();
                break;
            case 'NEXT': 
                navigateEvent = new FlowNavigationNextEvent();
                break;
            case 'SAVEANDNEW': 
                navigateEvent = new FlowNavigationNextEvent();
                this.saveAndNewOutputVariable = true;
                this.fireFlowChangeEvent('saveAndNewOutputVariable', this.saveAndNewOutputVariable);
                break;
            case 'SAVEANDDONE': 
                navigateEvent = new FlowNavigationNextEvent();
                this.saveAndDoneOutputVariable = true;
                this.fireFlowChangeEvent('saveAndDoneOutputVariable', this.saveAndDoneOutputVariable);
               break;
            case 'FINISH': 
                navigateEvent = new FlowNavigationFinishEvent();
                break;
            default:                   
        }

        this.dispatchEvent(navigateEvent);
    }

    // Fire variable changes back to the Flow
    fireFlowChangeEvent(flowVariableName, value) {
        const attributeChangeEvent = new FlowAttributeChangeEvent(flowVariableName, value);
        this.dispatchEvent(attributeChangeEvent);
    }

}