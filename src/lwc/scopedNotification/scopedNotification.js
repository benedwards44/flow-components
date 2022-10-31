import { LightningElement, api } from 'lwc';

export default class ScopedNotification extends LightningElement {
    
    @api recordId;
    @api message;
    @api iconName = 'utility:info';
    @api theme = 'light'; // Should be "light" or "dark", or one of success, warning, and error.

    get themeClasses() {

        let themeClasses = 'slds-scoped-notification slds-media slds-media_center ';

        switch (this.theme) {
            case 'light':
                themeClasses += 'slds-scoped-notification_light';
                break;
            case 'dark':
                themeClasses += 'slds-scoped-notification_dark';
                break;
            case 'success':
                themeClasses += 'slds-theme_success';
                break;
            case 'warning':
                themeClasses += 'slds-theme_warning';
                break;
            case 'info':
                themeClasses += 'slds-theme_info';
                break;
            case 'error':
                themeClasses += 'slds-theme_error';
                break;
        }

        return themeClasses;
    }

    get hasVariant() {
        return this.theme !== 'light';
    }
}