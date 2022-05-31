public with sharing class AccountController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {
        return [
            SELECT Name, AccountNumber, AnnualRevenue, Industry, BillingCity, BillingCountry, BillingPostalCode
            FROM Account
            ORDER BY CreatedDate DESC
            LIMIT 5
       ];
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts(List<String> idList) {
        return [
            SELECT Account.Name, FirstName, LastName, BirthDate, Phone, Email, MobilePhone
            FROM Contact
            WHERE AccountId IN : idList];
    }
}
