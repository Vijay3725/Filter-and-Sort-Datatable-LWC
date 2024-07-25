public with sharing class contactAccountHandler {
    @AuraEnabled(cacheable=true)
    public static List<Contact> fetchContacts(){
        return [select Name, Email, Title from Contact];
    }
}