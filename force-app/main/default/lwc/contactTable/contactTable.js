import { api, LightningElement, track, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getContacts from '@salesforce/apex/AccountController.getContacts';
import FIRST_NAME_FIELD from '@salesforce/schema/Contact.FirstName';
import LAST_NAME_FIELD from '@salesforce/schema/Contact.LastName';
import BIRHTDATE_FIELD from '@salesforce/schema/Contact.Birthdate';
import PHONE_FIELD from '@salesforce/schema/Contact.Phone';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';
import MOBLIE_PHONE_FIELD from '@salesforce/schema/Contact.MobilePhone';

const COLUMNS = [
	{ label: 'Account Name', fieldName: 'AccName', type: 'text', sortable: 'true' },
	{ label: 'First Name', fieldName: FIRST_NAME_FIELD.fieldApiName, type: 'text', sortable: 'true' },
	{ label: 'Last Name', fieldName: LAST_NAME_FIELD.fieldApiName, type: 'test', sortable: 'true' },
	{ label: 'Date of Birth', fieldName: BIRHTDATE_FIELD.fieldApiName, type: 'text', sortable: 'true' },
	{ label: 'Phone', fieldName: PHONE_FIELD.fieldApiName, type: 'text', sortable: 'true' },
	{ label: 'Email', fieldName: EMAIL_FIELD.fieldApiName, type: 'text', sortable: 'true' },
	{ label: 'Mobile', fieldName: MOBLIE_PHONE_FIELD.fieldApiName, type: 'text', sortable: 'true' }
];

export default class ContactTable extends LightningElement {
	@track columns = COLUMNS;
	@track contacts;
	@track error;
	@track sortBy;
	@track sortDirection;
	@track showContactTable = false;
	@track showDeleteModal = false;
	@track showEditModal = false;

	@api idList;
	@api isAccountSelected = false;

	recordId;
	btnVisibility = false;
	refreshTable;

	@wire(getContacts, { idList: '$idList' })
	wiredCallback(result) {
		this.refreshTable = result;
		if (result.data) {
			result.data = result.data.map(row => {
				return {
					...row,
					AccName: (row.Account ? row.Account.Name : null),
				};
			});
			this.contacts = result.data;
			this.error = undefined;
			if (this.isAccountSelected == true && this.contacts.length > 0) {
				this.showContactTable = true;
			}
		}
		else {
			this.error = result.error;
			this.contacts = undefined;
		}
	}

	onSort(event) {
		this.sortBy = event.detail.fieldName;
		this.sortDirection = event.detail.sortDirection;
		this.sortData(this.sortBy, this.sortDirection);
	}

	sortData(fieldname, direction) {
		let parseData = JSON.parse(JSON.stringify(this.contacts));
		let keyValue = (a) => {
			return a[fieldname];
		};
		let isReverse = direction === 'asc' ? 1 : -1;
		parseData.sort((x, y) => {
			x = keyValue(x) ? keyValue(x) : '';
			y = keyValue(y) ? keyValue(y) : '';
			return isReverse * ((x > y) - (y > x));
		});
		this.contacts = parseData;
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
	}

	handleDelete() {
		this.showDeleteModal = true;
	}

	refreshData() {
		this.btnVisibility = false;
		this.showDeleteModal = false;
		this.showEditModal = false;
		return refreshApex(this.refreshTable);
	}

	handleCancel() {
		this.showDeleteModal = false;
	}

	handleEdit() {
		this.showEditModal = true;
	}

	closeModal() {
		this.showEditModal = false;
	}
}