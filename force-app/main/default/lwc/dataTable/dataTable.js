import { LightningElement, track, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';
import ACCOUNT_NAME_FIELD from '@salesforce/schema/Account.Name';
import ACCOUNT_NUMBER_FIELD from '@salesforce/schema/Account.AccountNumber';
import ANNUAL_REVENUE_FIELD from '@salesforce/schema/Account.AnnualRevenue';
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';
import BILLING_CITY_FIELD from '@salesforce/schema/Account.BillingCity';
import BILLING_COUNTRY_FIELD from '@salesforce/schema/Account.BillingCountry';
import BILLING_ZIP_FIELD from '@salesforce/schema/Account.BillingPostalCode';

const COLUMNS = [
  { label: 'Account Name', fieldName: ACCOUNT_NAME_FIELD.fieldApiName, type: 'text', sortable: 'true' },
  { label: 'Account Number', fieldName: ACCOUNT_NUMBER_FIELD.fieldApiName, type: 'text', sortable: 'true' },
  { label: 'Annual Revenue', fieldName: ANNUAL_REVENUE_FIELD.fieldApiName, type: 'currency', sortable: 'true' },
  { label: 'Industry', fieldName: INDUSTRY_FIELD.fieldApiName, type: 'text', sortable: 'true' },
  { label: 'Billing City', fieldName: BILLING_CITY_FIELD.fieldApiName, type: 'text', sortable: 'true' },
  { label: 'Billing Country', fieldName: BILLING_COUNTRY_FIELD.fieldApiName, type: 'text', sortable: 'true' },
  { label: 'Billing Zip', fieldName: BILLING_ZIP_FIELD.fieldApiName, type: 'text', sortable: 'true' }
];
export default class DataTable extends LightningElement {
  @track columns = COLUMNS;
  @track sortBy;
  @track sortDirection;
  @track accounts;
  @track showModal = false;
  @track showDeleteModal = false;
  @track error;
  @track accountIdList = [];
  @track isAccountSelected = false;

  recordId;
  refreshTable;
  btnVisibility = false;

  @wire(getAccounts)
  wiredCallback(result) {
    this.refreshTable = result;
    if (result.data) {
      this.accounts = result.data;
      this.error = undefined;
    }
    else {
      this.error = result.error;
      this.accounts = undefined;
    }
  }
  onSort(event) {
    this.sortBy = event.detail.fieldName;
    this.sortDirection = event.detail.sortDirection;
    this.sortData(this.sortBy, this.sortDirection);
  }

  sortData(fieldname, direction) {
    let parseData = JSON.parse(JSON.stringify(this.accounts));
    let keyValue = (a) => {
      return a[fieldname];
    };
    let isReverse = direction === 'asc' ? 1 : -1;
    parseData.sort((x, y) => {
      x = keyValue(x) ? keyValue(x) : '';
      y = keyValue(y) ? keyValue(y) : '';
      return isReverse * ((x > y) - (y > x));
    });
    this.accounts = parseData;
  }

  handleRowSelection() {
    let selectedRows = this.template.querySelector("lightning-datatable").getSelectedRows();
    if (selectedRows.length === 1) {
      this.btnVisibility = true;
      const Id = JSON.stringify(selectedRows.map(s => s.Id));
      this.recordId = Id.substring(Id.indexOf('"') + 1, Id.lastIndexOf('"'));
    }
    else {
      this.btnVisibility = false;
    }
    const idList = [];
    selectedRows.forEach(currentItem => { idList.push(currentItem.Id) });
    this.accountIdList = idList;

    if (this.accountIdList.length > 0) {
      this.isAccountSelected = true;
    }
    else {
      this.isAccountSelected = false;
    }
  }

  showModalPopUp() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    return refreshApex(this.refreshTable);
  }

  handleDelete() {
    this.showDeleteModal = true;
  }

  refreshData() {
    this.btnVisibility = false;
    this.showDeleteModal = false;
    return refreshApex(this.refreshTable);
  }

  handleCancel() {
    this.showDeleteModal = false;
  }
}