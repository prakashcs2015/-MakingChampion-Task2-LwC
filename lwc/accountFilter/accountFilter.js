import { LightningElement,track,api,wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { fireEvent } from 'c/pubsub';
 


export default class AccountFilter extends LightningElement {
    @wire(CurrentPageReference) pageRef;
     startDate;  
     endDate;
     handleFromDateChange(event) {
        this.startDate = event.target.value;
        console.log('handlefromDateChange<<<<<' + this.startDate);
    }
    handleToDateChange(event) {
        this.endDate = event.target.value;
    }
    handleApplyFilter(){
        const filters = {
            startDate: this.startDate,
            endDate: this.endDate
        };
        fireEvent(this.pageRef, 'filter_event', filters);
    }

    clearFilter(){
        this.startDate ='';
        this.endDate =''
        const filters = {
            startDate: this.startDate,
            endDate: this.endDate
        };
        fireEvent(this.pageRef, 'clear_event', filters);
    }
}