import { LightningElement,track,wire,api } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getAccounts from '@salesforce/apex/AccountClass.getAccounts';
import getFilterAccounts from '@salesforce/apex/AccountClass.getFilterAccounts';

import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterAllListeners } from 'c/pubsub';

const COLS = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Type', fieldName: 'Type' },
    { label: 'Last Modified Date', fieldName: 'LastModifiedDate' },
    { label: 'Created Date', fieldName: 'CreatedDate' }
];

export default class AccountDatatable extends LightningElement {
    @wire(CurrentPageReference) pageRef;
    @track columns = COLS;
    @track page = 1;
    @track startingRecord = 1; 
    @track endingRecord = 0; 
    @track pageSize = 13; 
    @track totalRecountCount = 0; 
    @track totalPage = 0;
    @track error;
    @track data;
    @api searchKey = '';
    result;
    endDate;
    startDate;
    connectedCallback(){
        registerListener(
            'filter_event',
            this.handleFilterChange,
            this
        );
        registerListener(
            'clear_event',
            this.handleClearFilters,
            this
        );

        getAccounts({ searchKey: '' })
        .then(result => {
            this.result = result;
             this.totalRecountCount = result.length;
             this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize);        
             this.data = result.slice(0,this.pageSize);
            })
        .catch(error => {
            this.error = error;
        });
}
disconnectedCallback() {
    unregisterAllListeners(this);
}
    

    handleKeyChange( event ) {
        this.searchKey = event.target.value;
        //return refreshApex(this.result);
        getAccounts({ searchKey: this.searchKey })
        .then(result => {
            this.result = result;
             this.totalRecountCount = result.length;
             this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize);        
             this.data = this.result.slice(0,this.pageSize);
            })
        .catch(error => {
            this.error = error;
        });
       
    }
    //clicking on previous button this method will be called
    previousHandler() {
        if (this.page > 1) {
            this.page = this.page - 1; //decrease page by 1
            this.displayRecordPerPage(this.page);
        }
    }

    nextHandler() {
        if((this.page<this.totalPage) && this.page !== this.totalPage){
            this.page = this.page + 1; 
            this.displayRecordPerPage(this.page);            
        }             
    }

    displayRecordPerPage(page){
        this.startingRecord = ((page -1) * this.pageSize) ;
        this.endingRecord = (this.pageSize * page);

        this.endingRecord = (this.endingRecord > this.totalRecountCount)   ? this.totalRecountCount : this.endingRecord; 

        this.data = this.result.slice(this.startingRecord, this.endingRecord);
        this.startingRecord = this.startingRecord + 1;
    }
    
    
    
    handleFilterChange(filters) {
        this.startDate = filters.startDate;
        this.endDate = filters.endDate;
        console.log('start date'+ this.startDate);
        console.log('end date'+ this.endDate);
        getFilterAccounts({ startDate: this.startDate, endDate: this.endDate })
        .then(result => {
            console.log('result');
            console.log(result);
            this.result = result;
           this.totalRecountCount = result.length;
            this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize); 
            this.data = this.result.slice(0,this.pageSize);
        })
        .catch(error => {
            console.log('error');
            console.log(error);
            this.error = error;
        });
    }

    handleClearFilters(filters) {
        getAccounts({ searchKey: '' })
        .then(result => {
            this.result = result;
             this.totalRecountCount = result.length;
             this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize);        
             this.data = result.slice(0,this.pageSize);
            })
        .catch(error => {
            this.error = error;
        });
    }
    
}