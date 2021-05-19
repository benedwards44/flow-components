/**
 * @File Name          : NSS_RecordSelectTableController.cls
 * @Description        : Controller for the recordSelectTable LWC
 * @Author             : beedwards@deloitte.co.nz
 * @Group              : Controllers
 * @Last Modified By   : beedwards@deloitte.co.nz
 * @Last Modified On   : 17th July 2020
 * @Modification Log   :
 *==============================================================================
 * Ver         Date                     Author      		      Modification
 *==============================================================================
 * 1.0        17th July 2020             beedwards@deloitte.co.nz   Initial Version
**/
public with sharing class NSS_RecordSelectTableController {
    
    /**************************************************************************************
    *   @author      : Ben Edwards (beedwards@deloitte.co.nz)
    *   @description : Retrieve records for the given parameters
    *   @date        : 17th July 2020
    ***************************************************************************************/
    @AuraEnabled(cacheable=true)
    public static List<SObject> getRecords (String fields, String objectName, String lookupField, Id recordId) {
        return Database.query(
            'SELECT ' + fields + ' FROM ' + objectName + ' WHERE ' + lookupField + ' = :recordId'
        );
    }

    /**************************************************************************************
    *   @author      : Ben Edwards (beedwards@deloitte.co.nz)
    *   @description : Retrieve records for the given parameters
    *   @date        : 17th July 2020
    ***************************************************************************************/
    @AuraEnabled(cacheable=true)
    public static List<Column> getColumns (String fields, String objectName) {

        List<Column> columns = new List<Column>();

        for (String fieldName :fields.split(',')) {

            columns.add(new Column(
                ApexServices.getFieldResult(objectName, fieldName)
            ));
        }
        
        return columns;
    }

    public class Column {
        
        @AuraEnabled
        public String label;

        @AuraEnabled
        public String fieldName;

        @AuraEnabled
        public String type;

        public Column(DescribeFieldResult fieldResult) {
            this.label = fieldResult.getLabel();
            this.fieldName = fieldResult.getName();
            this.type = 'text'; // Default to text
            // If we have a mapping, retrieve it
            if (fieldTypeConversionMap().containsKey(String.valueOf(fieldResult.getType()))) {
                this.type = fieldTypeConversionMap().get(String.valueOf(fieldResult.getType()));
            }
        }
    }

    public static Map<String, String> fieldTypeConversionMap() {
        return new Map<String, String>{
            'BOOLEAN' => 'boolean',
            'CURRENCY' => 'currency',
            'DATE' => 'date',
            'EMAIL' => 'email',
            'LOCATION' => 'location',
            'NUMBER' => 'number',
            'PERCENT' => 'percent',
            'PHONE' => 'phone',
            'STRING' => 'text',
            'URL' => 'url'
        };
    }
}