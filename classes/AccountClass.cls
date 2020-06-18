public with sharing class AccountClass {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts(String searchKey) {
       
        String query = 'SELECT Type, Id, Name, LastModifiedDate, CreatedDate FROM Account ';
        if ( searchKey != null && searchKey != '' ) {
            String key = '%' + searchKey + '%';
            query += ' WHERE Name LIKE :key';
        }
        //return [SELECT Type, Id, Name, LastModifiedDate, CreatedDate FROM Account WITH SECURITY_ENFORCED LIMIT 2000];
        return Database.query( query );
    }
    @auraEnabled(cacheable=true)
    public static List<Account> getFilterAccounts( String startDate,String endDate) {
        system.debug('start/end date'+ startDate);
        Date dateFrom = Date.valueOf(startDate);
        Date dateTo = Date.valueOf(endDate);
        if(dateFrom==null)
        dateFrom = Date.newInstance(Date.today().year()-1,01,01);
        if(dateTo==null)
        dateTo = Date.newInstance(Date.today().year()+1,01,01);
        return [SELECT Type, Id, Name, LastModifiedDate ,CreatedDate
                                  FROM Account 
                                  WHERE CreatedDate >= :DateTime.newInstance(dateFrom.year(),dateFrom.month(),dateFrom.day())
                                  AND  CreatedDate  <= :DateTime.newInstance(dateTo.year(),dateTo.month(),dateTo.day())
                                  ORDER BY Name
                                  ];

    }
}
