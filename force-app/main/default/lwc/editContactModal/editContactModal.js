import { api, LightningElement } from 'lwc';
import CONTACT_OBJECT from '@salesforce/schema/Contact';
import ACCOUNT_NAME_FIELD from '@salesforce/schema/Contact.AccountId';
import FIRST_NAME_FIELD from '@salesforce/schema/Contact.FirstName';
import LAST_NAME_FIELD from '@salesforce/schema/Contact.LastName';
import BIRHTDATE_FIELD from '@salesforce/schema/Contact.Birthdate';
import PHONE_FIELD from '@salesforce/schema/Contact.Phone';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';
import MOBLIE_PHONE_FIELD from '@salesforce/schema/Contact.MobilePhone';

export default class EditContactModal extends LightningElement {
	@api showModal;
	@api recordId;

	contactObject = CONTACT_OBJECT;
	accountNameField = ACCOUNT_NAME_FIELD;
	firstNameField = FIRST_NAME_FIELD;
	lastNameField = LAST_NAME_FIELD;
	birthDateField = BIRHTDATE_FIELD;
	phoneField = PHONE_FIELD;
	emailField = EMAIL_FIELD;
	mobilePhoneField = MOBLIE_PHONE_FIELD;
	// myFields = [ACCOUNT_NAME_FIELD, FIRST_NAME_FIELD, LAST_NAME_FIELD,
	//             BIRHTDATE_FIELD, PHONE_FIELD, EMAIL_FIELD, MOBLIE_PHONE_FIELD];

	constructor() {
		super();
		this.showModal = false;
	}

	handleCancel() {
		this.dispatchEvent(new CustomEvent('cancel'));
	}

	

	handleError(event) {
		console.log(event.type);
		console.log(event.detail);
		console.log(event.detail.detail);
	}

	handleSave(event) {
		this.template.querySelector("lightning-record-edit-form").submit(event.detail.fields);
		setTimeout(()=>{
			this.dispatchEvent(new CustomEvent('save'));
		},1000);
	}
}