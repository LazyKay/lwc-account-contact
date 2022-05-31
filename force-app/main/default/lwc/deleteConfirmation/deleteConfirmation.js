import { api, LightningElement } from 'lwc';
import { deleteRecord } from 'lightning/uiRecordApi';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

export default class DeleteConfirmation extends LightningElement {
	@api showDeleteModal;
	@api recordId;

	constructor() {
		super();
		this.showDeleteModal = false;
	}

	handleDelete() {
		deleteRecord(this.recordId)
			.then(() => {
				const toastEvent = new ShowToastEvent({
					title: 'Record Delted',
					message: 'Record Delted Successfully',
					vaiation: 'Success'
				})
				this.dispatchEvent(new CustomEvent('deleted'));
				this.dispatchEvent(toastEvent);
			})
			.catch(error => {
				this.dispatchEvent(
					new ShowToastEvent({
						title: 'Error deleting record',
						message: error.body.message,
						variant: 'error'
					})
				);
			});
	}

	handleCancel() {
	 this.dispatchEvent(new CustomEvent('canceled'));
	}
}