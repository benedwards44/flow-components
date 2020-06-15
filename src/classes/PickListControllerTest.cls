/**
* @author Ben Edwards (ben@edwards.nz)
* @date 14th May 2020
* @description Test class for PickListController
*
* CHANGE LOG
**/
@isTest 
public class PickListControllerTest {


    @isTest 
    static void testGetPicklistOptions() {

        Test.startTest();

        system.assertNotEquals(null, PickListController.getPicklistOptions('Account', 'AccountSource', true));

        Test.stopTest();
    }
}