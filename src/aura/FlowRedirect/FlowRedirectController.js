({    
    invoke : function(component, event, helper) {
        
        // Get the attributes passed to the component
        let record = component.get("v.recordId");
        let redirectUrl = component.get("v.redirectUrl");

        // Build the redirect function based on where we're going
        let redirect = record ? $A.get("e.force:navigateToSObject") : $A.get("e.force:navigateToURL");

        // Redirect to record
        if (record) {
        
            // Pass the record ID to the event
            redirect.setParams({
                "recordId": record
            });
        }
        // Or to full URL
        else {

            // Set redirect URL
            redirect.setParams({
                "url": redirectUrl
            });
        }
            
        // Open the record
        redirect.fire();
    }
})