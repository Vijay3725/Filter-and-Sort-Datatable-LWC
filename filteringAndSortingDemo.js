import { LightningElement, track, wire } from 'lwc';
import fetchContacts from '@salesforce/apex/contactAccountHandler.fetchContacts';
import Name from '@salesforce/schema/Contact.Name';
import Email from '@salesforce/schema/Contact.Email';
import Title from '@salesforce/schema/Contact.Title';
const COLUMNS = [
    {label: "Name", fieldName: Name.fieldApiName, type: "text"},
    {label: "Email", fieldName: Email.fieldApiName, type: "email"},
    {label: "Title", fieldName: Title.fieldApiName, type: "text"}
];

export default class FilteringAndSortingDemo extends LightningElement {
    @track data = [];
    @track filteredData = [];
    @track selectedFilter = 'Name';
    @track filterValue = '';
    @track sortedBy = 'Name';
    sortDirection = 'asc';
    error;

    columns = COLUMNS;

    get filterOptions(){
        return [
            {label: "Name", value: "Name"},
            {label: "Title", value: "Title"},
            {label: "Email", value: "Email"}
        ];
    }

    handleFilterOptionChange(event){
        this.selectedFilter = event.detail.value;
        this.applyFilter();
    }

    handleFilter(event){
        this.filterValue = event.target.value;
        this.applyFilter();
    }

    applyFilter(){
        const filterValue = this.filterValue.toLowerCase();
        this.filteredData = this.data.filter(record => {
            return record[this.selectedFilter]?.toLowerCase().includes(filterValue);
        });
        this.sortData();
    }

    sortHandler(event){
        this.sortedBy = event.detail.value;
        this.sortData();
    }

    sortData(){
        const sortField = this.sortedBy;
        this.filteredData = [...this.filteredData].sort((a, b) => {
            let aValue = a[sortField] ? a[sortField].toLowerCase() : '';
            let bValue = b[sortField] ? b[sortField].toLowerCase() : '';
            return aValue.localeCompare(bValue);
        });
    }

    @wire(fetchContacts)
    contactData({data,error}){
        if(data){
            this.data = data;
            this.filteredData = [...data];
            this.sortData();
        }
        else if(error){
            this.error = error;
        }
    }
}