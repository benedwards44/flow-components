/**
* @author Ben Edwards (ben@edwards.nz)
* @date 14th May 2020
* @description Controller for the pickList LWC
*
* CHANGE LOG
**/
public with sharing class PickListController {

    /**
    *   @author Ben Edwards (ben@edwards.nz)
    *   @description Retrieve the list of picklist options for given object and field name
    *   @return void
    **/
    @AuraEnabled(cacheable=true)
    public static List<PicklistOption> getPicklistOptions (String objectName, String fieldName, Boolean addNone) {

        List<PicklistOption> picklistOptions = new List<PicklistOption>();

        // Add none option if specificed
        if (addNone) {
            picklistOptions.add(new PicklistOption('', '--None--'));
        }

        for (Schema.PicklistEntry picklistEntry : Schema.getGlobalDescribe().get(objectName).getDescribe().fields.getMap().get(fieldName).getDescribe().getPicklistValues()) {

            if (picklistEntry.isActive()) {

                picklistOptions.add(new PicklistOption(picklistEntry.getValue(), picklistEntry.getLabel()));
            }
        }

        return picklistOptions;
    }

    public class PicklistOption {

        @AuraEnabled
        public String value {get; set;}

        @AuraEnabled
        public String label {get; set;}

        public PicklistOption(String value, String label) {
            this.value = value;
            this.label = label;
        }
    }
}