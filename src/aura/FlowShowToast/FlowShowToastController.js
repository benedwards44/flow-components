({    
    invoke : function(component, event, helper) {

        // Get the attributes passed to the component
        let title = component.get("v.title");
        let message = component.get("v.message");
        let type = component.get("v.type");

        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": title,
            "message": message,
            "type": type
        });
        toastEvent.fire();
    }
})