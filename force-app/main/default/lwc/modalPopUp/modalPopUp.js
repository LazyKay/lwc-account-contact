import { api, LightningElement, track } from 'lwc';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import ACCOUNT_NAME_FIELD from '@salesforce/schema/Account.Name';
import ACCOUNT_NUMBER_FIELD from '@salesforce/schema/Account.AccountNumber';
import ANNUAL_REVENUE_FIELD from '@salesforce/schema/Account.AnnualRevenue';
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';
import BILLING_CITY_FIELD from '@salesforce/schema/Account.BillingCity';
import BILLING_COUNTRY_FIELD from '@salesforce/schema/Account.BillingCountry';
import BILLING_ZIP_FIELD from '@salesforce/schema/Account.BillingPostalCode';

export default class ModalPopUp extends LightningElement {
	@api showModal;
	accountObject = ACCOUNT_OBJECT;
	myFields = [ACCOUNT_NAME_FIELD, ACCOUNT_NUMBER_FIELD, ANNUAL_REVENUE_FIELD,
		INDUSTRY_FIELD, BILLING_CITY_FIELD, BILLING_COUNTRY_FIELD,
		BILLING_ZIP_FIELD];

	constructor() {
		super();
		this.showModal = false;
	}

	handleCancel() {
		this.dispatchEvent(new CustomEvent('cancel'));
	}

	handleSave() {
		this.dispatchEvent(new CustomEvent('save'));
	}

}