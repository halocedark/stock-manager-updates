
const fs = require('fs');
const ROOTPATH = require('electron-root-path');
const path = require('path');
const uuid = require('uuid');
const ipcIndexRenderer = require('electron').ipcRenderer;
const OS = require('os');
var QRCode = require('qrcode');
const date_time = require('date-and-time');
const IniFile = require(__dirname+'/assets/js/utils/IniFile.js');
const Calendar = require(__dirname+'/assets/js/include/Calendar');
const Chart = require(__dirname+'/assets/js/include/Chart.min');
const readXlsxFile = require('read-excel-file');

var MAIN_CONTENT_CONTAINER =  $('#MainContentContainer');
var SIDE_NAV_CONTAINER = $('#sideNavbarContainer');
var TOP_NAV_BAR = $('#topNavbarContainer');

var APP_NAME = 'Promag_Clinics';
var API_END_POINT = '';
var PROJECT_URL = '';
var APP_ICON = 'assets/img/logo/logo.png';
var APP_ROOT_PATH = ROOTPATH.rootPath+'/';
var APP_DIR_NAME = __dirname+'/';

const CURRENCY = {
	ar: 'دج',
	fr: 'DA'
};

const SETTINGS_FILE = 'settings';
const DISPLAY_LANG_FILE = APP_ROOT_PATH+'locale/lang.json';

var FUI_DISPLAY_LANG = undefined;

var LOGIN_SESSION = undefined;
var LOGIN_SESSION_FILE = OS.tmpdir()+'/'+APP_NAME+'/login/session.json';


var USER_CONFIG = {};
var USER_CONFIG_FILE = OS.tmpdir()+'/'+APP_NAME+'/login/config.json';

var DEFAULT_INI_SETTINGS = null;
var PERMISSIONS = [];

var GLOBALS_SCRIPT = null;

const TIME_NOW = new Date();
const CURRENT_DATE = date_time.format(TIME_NOW, 'YYYY-MM-DD');
const CURRENT_TIME = date_time.format(TIME_NOW, 'HH:mm:ss');

var NAVBAR_LINKS = {}

// Attendance
const ATT_NONE = 0;
const ATT_ABSENT = 1;
const ATT_PRESENT = 2;
const ATT_LATE = 3;
// status
const ST_YES = 2;
const ST_NO = 1;
const ST_NONE = 0;
const ST_DIRECTION_INSIDE = 'INSIDE';
const ST_DIRECTION_OUTSIDE = 'OUTSIDE';
const ST_DIRECTION_CENTER_SHIPPING = 'CENTER_SHIPPING';
const ORDER_ST_PREPARING_PHASE = 1;
const ORDER_ST_DELIVERY_PHASE = 2;
const ORDER_ST_RECEIVING_PHASE = 3;
// emploees types
const EMP_TYPE_TARGET_CENTER_CLINIC = 'CLINIC';
const EMP_TYPE_TARGET_CENTER_CENTRAL_ADMINISTRATION = 'CENTRAL_ADMINISTRATION';

const EMP_TYPE_MAID = 'MAID';
const EMP_TYPE_NURSE = 'NURSE';
const EMP_TYPE_DIET_SECRETARY = 'DIET_SECRETARY';
const EMP_TYPE_CHIEF_CENTER = 'CHIEF_CENTER';
const EMP_TYPE_DOCTOR = 'DOCTOR';
const EMP_TYPE_RECEPTION_SECRETARY = 'RECEPTION_SECRETARY';
const EMP_TYPE_CHIEF_ASSISTANCE = 'CHIEF_ASSISTANCE';
const EMP_TYPE_LOGISTIC_SERVICE = 'LOGISTIC_SERVICE';
const EMP_TYPE_FINANCE_ACCOUNTING_DIRECTOR = 'FINANCE_ACCOUNTING_DIRECTOR';
const EMP_TYPE_DEVELOPMENT_MARKETING = 'DEVELOPMENT_MARKETING';
const EMP_TYPE_HEALTH_SAFETY_DEPARTMENT = 'HEALTH_SAFETY_DEPARTMENT';
const EMP_TYPE_GENERAL_SECRETARY = 'GENERAL_SECRETARY';
const EMP_TYPE_CASH_DESK = 'CASH_DESK';
const EMP_TYPE_HUMAN_RESOURCES_DIRECTOR = 'HUMAN_RESOURCES_DIRECTOR';
const EMP_TYPE_CHIEF_DOCTOR = 'CHIEF_DOCTOR';
const EMP_TYPE_COMMERCIAL_DIRECTOR = 'COMMERCIAL_DIRECTOR';
const EMP_TYPE_ECOMMERCE_ASSISTANT = 'ECOMMERCE_ASSISTANT';
const EMP_TYPE_CONTACTS_APPOINTMENTS = 'CONTACTS_APPOINTMENTS';
const EMP_TYPE_GENERAL_MANAGER = 'GENERAL_MANAGER';
const EMP_TYPE_DEPUTY_GENERAL_MANAGER = 'DEPUTY_GENERAL_MANAGER';
const EMP_TYPE_WHOLESALE_EXTERNAL_SALES_MANAGER = 'WHOLESALE_EXTERNAL_SALES_MANAGER';
const EMP_TYPE_DISTRIBUTOR = 'DISTRIBUTOR';
// expense types
const EXP_TYPE_NORMAL = 'EXP_TYPE_NORMAL';
const EXP_TYPE_TRANSFER_TO_CENTRAL_ADMINISTRATION = 'EXP_TYPE_TRANSFER_TO_CENTRAL_ADMINISTRATION';
const EXP_TYPE_ENTERING_DISTRIBUTOR_TRANSACTION_MONEY = 'EXP_TYPE_ENTERING_DISTRIBUTOR_TRANSACTION_MONEY';
// message type
const MESSAGE_TYPE_REGULAR = 'regular';
const MESSAGE_TYPE_COMPLAIN = 'complain';

let removeFakeElement
let createFakeElement
let clearSessionData;
let sessionData;
let goToPage;
let goToPreviousPage
let loadNavbarLinks;
// let openDevTools;
let buildFormData;
let appendToFormData;
let fillFormFields;
let setupWelcomePage;
let getAllStates;
let setupUserAuth;
let getPage;
let sendGetRequest;
let sendAPIPostRequest;
let sendAPIFormDataRequest;
let imageToDataURL;
let extractFileExtension;
let setOptionSelected;
let loadIniSettings;
let loadIniSettingsSync;
let setConnectionHostname;
let getConnectionHostname;
let saveUserConfig;
let deleteFile;
let reloadUserConfig;
let getUserConfig;
let isConfigExists;
let setContainersDisabled;
let randomRange;
let shuffleArray;
let loadFile;
let setUIDisplayLang;
let loadDisplayLanguage;
let CreateToast;
let parseCSV;
let parseXLSX;
let TopProgressBar;
let getLoginSession;
let setLoginSession;
let loadLoginSession;
let toggleCheck;
let TopLoader;
let toggleSimilarNavbarsLinks;
let globalLogin;
let employeeLogin;
let patientLogin;
let addClinic;
let updateClinic;
let managerLogin;
let getManager;
let generateQRCode;
let getPatient;
let listenForBarcodeScanner;
let downloadFile;
let copyLinkToClipboard;
let recursiveCopyDirFilesSync;
let SectionLoader;
let PageLoader;
let updatePatient;
let searchClinics;
let listClinicTreatmentClasses;
let listTreatmentClasses;
let searchPatients;
let sendMessage;
let searchMessages;
let listMessagesInbox;
let listMessagesSent;
let listMessageReplies;
let addMessageReply;
let removeMessages;
let setMessagesRead;
let setMessageRead;
let openMessage;
let listMessageReplies2;
let searchTreatmentClasses;
let addAppointement;
let updateAppointement;
let getAppointement;
let searchAppointements;
let deleteAppointements;
let addAppointementSpecialCase;
let listAppointementsStatus;
let filterAppointementSpecialCases; 
let trimNumber;
let formatMoney;
let addToTreasury;
let takeFromTreasury;
let addEmployee;
let updateEmployee;
let listEmployeesTypes;
let filterEmployeeByTypeLocal;
let getTreasury;
let listAllTreasuryInfoLocal;
let treasurySearchRevenueFromClientsLocal;
let treasurysearchRevenueFromClientsBetweenDatesLocal;
let listPatientsLocal;
let listAppointementsLocal;
let listProductsLocal;
let listOrdersLocal;
let listPrescriptionsLocal;
let translateMonthName;
let createWindow;
let closeWindow;
let searchClinicEmployees;
let getEmployee;
let deleteEmployees;
let addProduct;
let batchAddProducts;
let batchAddProductsToCenter;
let batchDeleteProductsFromCenter;
let updateProduct;
let getProduct;
let searchProductsLocal;
let searchProducts;
let deleteProducts;
let deleteProduct;
let listTreasuryExpensesDates;
let filterExpensesByDate;
let filterExpensesBetweenDates;
let deleteExpenses;
let searchOrders;
let searchOrdersBetweenDates;
let searchOrdersBetweenDates2;
let searchOrdersBetweenDates3;
let searchOrdersBetweenDatesLocal;
let searchOrdersBetweenDatesLocal2;
let searchOrdersLocal;
let searchOrders2;
let searchOrders3;
let batchAddOrder;
let batchAddExternalOrder;
let deleteOrders;
let setOrderStatus;
let searchPatientsLocal;
let patientsHasAptSearchWithDateLocal;
let patientsHasChronicDiseaseSearchLocal;
let getClinic;
let deleteClinics;
let searchTreatmentClassesLocal;
let searchAppointementsLocal;
let addPatient;
let deletePatients;
let deleteChangedSetting;
let addChangedSettings;
let listChangedSettings;
let testServerConnection;
let addPrescription;
let searchPrescriptionsLocal;
let searchPrescriptionsInOrdersBetweenDatesLocal;
let searchPrescriptionsNotInOrdersBetweenDatesLocal;
let getPrescription;
let deletePrescriptions;
let updatePrescription;
let addOrder;
let getOrder;
let updateOrder;
let updateEmployeeAtt;
let searchEmployeesAttBetweenDates;
let acceptOrder;
let listAppointementSessions;
let listAppointementSessionPatients;
let addAppointementPatientsToSessions;
let deleteAppointementSessionPatient;
let addTreatmentClass;
let getTreatmentClass;
let updateTreatmentClass;
let deleteTreatmentClass;
let listAllTreasury;
let listPatients;
let listAppointements;
let listProducts;
let listOrders;
let approveClinic;
let addAppointementWithSessions;
let updateAppointementWithSessions;
let searchCashoutRecordsLocal;
let searchCashoutRecordsBetweenDatesLocal;
let removeCashoutRecords;
let addCashoutRecord;
let searchAppointementsGeneralLocal;
let filterAppointementsByDateGeneralLocal;
let setGeneralAppointementPaid;
let setGeneralAppointementAttendance;
let setGeneralAppointementTreated;
let setAppointementSessionPatientAttStatus;
let setTreatmentClassesForAdministration;
let inJSONArray;
let setPatientDept;
let isImageFile;
let isPDFFile;
let draggableScroll;
let filenameSnippet;
let strSnippet;
let addReport;
let updateReport;
let getReport;
let deleteReports;
let searchReportsLocal;
let searchReportsBetweenDatesLocal;
let setGeneralAppointementAccepted;
let addAdvertisement;
let listAdvertisementsTypes;
let updateAdvertisement;
let getAdvertisement;
let searchAdvertisements;
let deleteAdvertisements;
let filterAdvertisementsByDate;
let searchAdvertisementsClients;
let deleteAdvertisementsClients;
let searchAdvertisementsClientsBetweenDates;
let searchTestimonials;
let getTestimonial;
let deleteTestimonials;
let extractYTVideoId;
let addVideo;
let updateVideo;
let getVideo;

let deleteVideos
let searchVideos;
let searchOnlineAppointements;
let getOnlineAppointement;
let deleteOnlineAppointements;
let setOnlineAppointementAccepted;
let searchMembers;
let getMember;
let deleteMembers;
let setMemberSeenByAdmin;
let addSupplier;
let updateSupplier;
let searchSuppliers;
let getSupplier;
let deleteSuppliers;
let setSupplierDept;
let batchAddPatients;
let batchAddConsommables;
let updateConsommable;
let batchDeleteConsommables;
let searchConsommables;
let getConsommable;
let searchConsommablesLocal;
let batchAddConsommablesToCenter;
let batchDeleteConsommablesFromCenter;
let batchAddConsommablesToPatient;
let listConsommableClientsLocal;
let addPatientMedicalTest;
let listPatientAlbumslistPatientMedicalTests;
let deletePatientMedicalTest;
let addPatientAlbum;
let listPatientAlbums;
let deletePatientAlbum;
let batchSendProductsToDistributor;

let addPharmacy;
let updatePharmacy;
let searchPharmacyLocal;
let getPharmacy;

let distributorOrders;

let searchDistributorOrdersBetweenDates;

let setCenterProductQuantity;

let updateLandingPage;
let getLandingPage;
let deleteLandingPage;

let createDailyReport;
let searchDailyReports;
let searchDailyReportsGlobal;
let searchDailyReportsStaff;
let filterDailyReportsGlobal;
let filterDailyReportsStaff;
let showDailyReport;
let updateDailyReport;
let batchDeleteDailyReports;

// Employee Stats
let searchPatientsCreatedByEmployee;
let searchAppointementClassesCreatedByEmployee
let searchAppointementClassClientsByEmployee
let searchPrescriptionCreatedByEmployee

let addEmployeeTypePermissions;
let getEmployeeTypePermissions;

let updateMyAccount;
let getMyPermissions;
let setupPermissions;

$(async function()
{

GLOBALS_SCRIPT = $('#GLOBALS_SCRIPT');

// searchPrescriptionCreatedByEmployee
searchPrescriptionCreatedByEmployee = (data = {}) =>
{
	var url = API_END_POINT+'Prescriptions/Stats/searchCreatedByEmployee';

	return sendAPIPostRequest(url, data);
}
// searchAppointementClassClientsByEmployee
searchAppointementClassClientsByEmployee = (data = {}) =>
{
	var url = API_END_POINT+'Appointements/Stats/searchClassClientsByEmployee';

	return sendAPIPostRequest(url, data);
}
// searchAppointementClassesCreatedByEmployee
searchAppointementClassesCreatedByEmployee = (data = {}) =>
{
	var url = API_END_POINT+'Appointements/Stats/searchClassesCreatedByEmployee';

	return sendAPIPostRequest(url, data);
}
// searchPatientsCreatedByEmployee
searchPatientsCreatedByEmployee = (data = {}) =>
{
	var url = API_END_POINT+'Patients/Stats/searchCreatedByEmployee';

	return sendAPIPostRequest(url, data);
}

// batchDeleteDailyReports
batchDeleteDailyReports = (data) =>
{
	var url = API_END_POINT+'DailyReports/batchDelete';
	
	data['employee_id'] = USER_CONFIG.employee_id
	data['employee_name'] = USER_CONFIG.employee_name
	data['employee_type_id'] = USER_CONFIG.employee_type_id

	return sendAPIPostRequest(url, data);
}
// updateDailyReport
updateDailyReport = (data) =>
{
	var url = API_END_POINT+'DailyReports/update';
	
	data['employee_id'] = USER_CONFIG.employee_id
	data['employee_name'] = USER_CONFIG.employee_name
	data['employee_type_id'] = USER_CONFIG.employee_type_id

	return sendAPIPostRequest(url, data);
}
// showDailyReport
showDailyReport = (data) =>
{
	var url = API_END_POINT+'DailyReports/show';
	
	data['employee_id'] = USER_CONFIG.employee_id
	data['employee_name'] = USER_CONFIG.employee_name
	data['employee_type_id'] = USER_CONFIG.employee_type_id

	return sendAPIPostRequest(url, data);
}
// filterDailyReportsStaff
filterDailyReportsStaff = (data) =>
{
	var url = API_END_POINT+'DailyReports/filterByEmployeeTypeStaff';
	
	data['employee_id'] = USER_CONFIG.employee_id
	data['employee_name'] = USER_CONFIG.employee_name
	data['employee_type_id'] = USER_CONFIG.employee_type_id

	return sendAPIPostRequest(url, data);
}
// filterDailyReportsGlobal
filterDailyReportsGlobal = (data) =>
{
	var url = API_END_POINT+'DailyReports/filterByEmployeeTypeGlobal';
	
	data['employee_id'] = USER_CONFIG.employee_id
	data['employee_name'] = USER_CONFIG.employee_name
	// data['employee_type_id'] = USER_CONFIG.employee_type_id

	return sendAPIPostRequest(url, data);
}
// searchDailyReportsStaff
searchDailyReportsStaff = (data) =>
{
	var url = API_END_POINT+'DailyReports/searchStaff';
	
	data['employee_id'] = USER_CONFIG.employee_id
	data['employee_name'] = USER_CONFIG.employee_name
	data['employee_type_id'] = USER_CONFIG.employee_type_id

	return sendAPIPostRequest(url, data);
}
// searchDailyReportsGlobal
searchDailyReportsGlobal = (data) =>
{
	var url = API_END_POINT+'DailyReports/searchGlobal';
	
	data['employee_id'] = USER_CONFIG.employee_id
	data['employee_name'] = USER_CONFIG.employee_name
	data['employee_type_id'] = USER_CONFIG.employee_type_id

	return sendAPIPostRequest(url, data);
}
// searchDailyReports
searchDailyReports = (data) =>
{
	var url = API_END_POINT+'DailyReports/search';
	
	data['employee_id'] = USER_CONFIG.employee_id
	data['employee_name'] = USER_CONFIG.employee_name
	data['employee_type_id'] = USER_CONFIG.employee_type_id

	return sendAPIPostRequest(url, data);
}
// createDailyReport
createDailyReport = (data) =>
{
	var url = API_END_POINT+'DailyReports/store';
	
	data['employee_id'] = USER_CONFIG.employee_id
	data['employee_name'] = USER_CONFIG.employee_name
	data['employee_type_id'] = USER_CONFIG.employee_type_id

	return sendAPIPostRequest(url, data);
}

// distributorOrders
distributorOrders = (employee_id) =>
{
	var url = API_END_POINT+'Employees/Distributor/Orders/list';

	return sendAPIPostRequest(url, {
		employee_id: employee_id
	});
}
// addEmployeeTypePermissions
addEmployeeTypePermissions = (data) =>
{
	var url = API_END_POINT+'Employees/Permissions/set';

	return sendAPIPostRequest(url, data);
}
// deleteLandingPage
deleteLandingPage = (section, data) =>
{
	if ( section == 'feature' )
	{
		var url = API_END_POINT+'LandingPage/deleteFeature';

		return sendAPIPostRequest(url, data);
	}
	else if ( section == 'about_image' )
	{
		var url = API_END_POINT+'LandingPage/deleteAboutImage';

		return sendAPIPostRequest(url, data);
	}
	else if ( section == 'know_us_image' )
	{
		var url = API_END_POINT+'LandingPage/deleteKnowUsImage';

		return sendAPIPostRequest(url, data);
	}
	else if ( section == 'appointement_feature' )
	{
		var url = API_END_POINT+'LandingPage/deleteAppointementFeature';

		return sendAPIPostRequest(url, data);
	}
	else if ( section == 'service' )
	{
		var url = API_END_POINT+'LandingPage/deleteService';

		return sendAPIPostRequest(url, data);
	}
}
// getLandingPage
getLandingPage = () =>
{
	var url = API_END_POINT+'LandingPage/info';

	return sendAPIPostRequest(url, {id: 1});
}
// updateLandingPage
updateLandingPage = (data) =>
{
	var url = API_END_POINT+'LandingPage/update';

	return sendAPIFormDataRequest(url, data);
}
// setCenterProductQuantity
setCenterProductQuantity = (data) =>
{
	var url = API_END_POINT+'Products/setCenterProductQuantity';

	return sendAPIPostRequest(url, data);
}
// searchDistributorOrdersBetweenDates
searchDistributorOrdersBetweenDates = (data) =>
{
	var url = API_END_POINT+'Employees/Distributor/Orders/searchBetweenDates';

	return sendAPIPostRequest(url, data);
}
// getPharmacy
getPharmacy = (id) =>
{
	var url = API_END_POINT+'Pharmacies/info';

	data = {
		id: id
	}

	return sendAPIPostRequest(url, data);
}
// searchPharmacyLocal
searchPharmacyLocal = (data) =>
{
	var url = API_END_POINT+'Pharmacies/searchLocal';

	return sendAPIPostRequest(url, data);
}
// updatePharmacy
updatePharmacy = (data) =>
{
	var url = API_END_POINT+'Pharmacies/update';

	return sendAPIPostRequest(url, data);
}
// addPharmacy
addPharmacy = (data) =>
{
	var url = API_END_POINT+'Pharmacies/add';

	return sendAPIPostRequest(url, data);
}
// batchSendProductsToDistributor
batchSendProductsToDistributor = (ProductObjects) =>
{
	var url = API_END_POINT+'Products/batchAdd4';

	var data = {
		ProductObjects
	};

	return sendAPIPostRequest(url, data);
}
// deletePatientAlbum
deletePatientAlbum = (id) =>
{
	var url = API_END_POINT+'Patients/deleteAlbum';

	var data = {
		id: id
	};

	return sendAPIPostRequest(url, data);
}
// listPatientAlbums
listPatientAlbums = (patientId) =>
{
	var url = API_END_POINT+'Patients/listAlbums';

	var data = {
		patientId: patientId
	};

	return sendAPIPostRequest(url, data);
}
// addPatientAlbum
addPatientAlbum = (PatientObject, images) =>
{
	var url = API_END_POINT+'Patients/addAlbum';

	var fd = new FormData;

	fd.append('PatientObject', JSON.stringify(PatientObject));
	//console.log(images);
	for (let i = 0; i < images.length; i++)
	{
		var image = images[i];
		fd.append('images[]', image);
	}

	return sendAPIFormDataRequest(url, fd);
}

// deletePatientMedicalTest
deletePatientMedicalTest = (id) =>
{
	var url = API_END_POINT+'Patients/deleteMedicalTest';

	var data = {
		id: id
	};

	return sendAPIPostRequest(url, data);
}
// listPatientMedicalTests
listPatientMedicalTests = (patientId) =>
{
	var url = API_END_POINT+'Patients/listMedicalTests';

	var data = {
		patientId: patientId
	};

	return sendAPIPostRequest(url, data);
}
// addPatientMedicalTest
addPatientMedicalTest = (PatientObject, images) =>
{
	var url = API_END_POINT+'Patients/addMedicalTest';

	var fd = new FormData;

	fd.append('PatientObject', JSON.stringify(PatientObject));
	//console.log(images);
	for (let i = 0; i < images.length; i++)
	{
		var image = images[i];
		fd.append('images[]', image);
	}

	return sendAPIFormDataRequest(url, fd);
}
// listConsommableClientsLocal
listConsommableClientsLocal = (SearchObject) =>
{
	var url = API_END_POINT+'Consommables/listClients';

	return sendAPIPostRequest(url, {SearchObject});
}
// batchAddConsommablesToPatient
batchAddConsommablesToPatient = (ConsommableObject) =>
{
	var url = API_END_POINT+'Consommables/batchAddToPatient';

	return sendAPIPostRequest(url, {ConsommableObject});
}
// batchDeleteConsommablesFromCenter
batchDeleteConsommablesFromCenter = (ConsommableObjects) =>
{
	var url = API_END_POINT+'Consommables/batchDeleteFromCenter';

	return sendAPIPostRequest(url, {ConsommableObjects});
}
// batchAddConsommablesToCenter
batchAddConsommablesToCenter = (ConsommableObjects) =>
{
	var url = API_END_POINT+'Consommables/batchAddToCenter';

	return sendAPIPostRequest(url, {ConsommableObjects});
}
// searchConsommablesLocal
searchConsommablesLocal = (SearchObject) =>
{
	var url = API_END_POINT+'Consommables/searchLocal';

	return sendAPIPostRequest(url, {SearchObject});
}
// getConsommable
getConsommable = (id) =>
{
	var url = API_END_POINT+'Consommables/info';

	return sendAPIPostRequest(url, {id});
}
// batchDeleteConsommables
batchDeleteConsommables = (list) =>
{
	var url = API_END_POINT+'Consommables/batchDelete';

	return sendAPIPostRequest(url, {list});
}
// searchConsommables
searchConsommables = (SearchObject) =>
{
	var url = API_END_POINT+'Consommables/search';

	return sendAPIPostRequest(url, {SearchObject});
}
// updateConsommable
updateConsommable = (ConsommableObject) =>
{
	var url = API_END_POINT+'Consommables/update';

	return sendAPIFormDataRequest(url, ConsommableObject);
}
// batchAddConsommables
batchAddConsommables = (ConsommableObjects) =>
{
	var url = API_END_POINT+'Consommables/batchAdd';

	return sendAPIFormDataRequest(url, ConsommableObjects);
}

batchAddPatients = (list) =>
{
	var url = API_END_POINT+'Patients/batchAdd';

	return sendAPIPostRequest(url, {list});
}
// setup permissions

setupPermissions = () =>
{
	if ( !PERMISSIONS )
		return;

	// check if employee is eligible for all permissions
	if ( USER_CONFIG.LOGIN_TYPE == EMP_TYPE_GENERAL_MANAGER
		|| USER_CONFIG.LOGIN_TYPE == EMP_TYPE_DEPUTY_GENERAL_MANAGER )
		return

	var perm_elements = $('[data-perm]')
	// all
	for (let i = 0; i < perm_elements.length; i++) 
	{
		const element = $(perm_elements[i]);
		// granted
		for (let j = 0; j < PERMISSIONS.granted.length; j++) 
		{
			const perm = PERMISSIONS.granted[j];
			if ( element.data('perm') == perm )
				element.removeClass('d-none');
		}
		// denied
		for (let j = 0; j < PERMISSIONS.denied.length; j++) 
		{
			const perm = PERMISSIONS.denied[j];
			if ( element.data('perm') == perm )
				element.addClass('d-none');
		}
	}
	// navbar
	// var navlist = SIDE_NAV_CONTAINER.find('li');
	
	// for (let i = 0; i < navlist.length; i++) 
	// {
	// 	const li = $(navlist[i]);
	// 	// granted
	// 	for (let j = 0; j < PERMISSIONS.granted.length; j++) 
	// 	{
	// 		const perm = PERMISSIONS.granted[j];
	// 		if ( li.data('perm') == perm )
	// 			li.removeClass('d-none');
	// 	}
	// 	// denied
	// 	for (let j = 0; j < PERMISSIONS.denied.length; j++) 
	// 	{
	// 		const perm = PERMISSIONS.denied[j];
	// 		if ( li.data('perm') == perm )
	// 			li.addClass('d-none');
	// 	}
	// }

	var _edit = MAIN_CONTENT_CONTAINER.find('[data-role="EDIT"]');
	for (let i = 0; i < _edit.length; i++) 
	{
		const element = $(_edit[i]);
		// granted
		for (let j = 0; j < PERMISSIONS.granted.length; j++) 
		{
			const perm = PERMISSIONS.granted[j];
			if ( element.data('perm') == perm )
				element.removeClass('d-none');
		}
		// denied
		for (let j = 0; j < PERMISSIONS.denied.length; j++) 
		{
			const perm = PERMISSIONS.denied[j];
			if ( element.data('perm') == perm )
				element.addClass('d-none');
		}
	}

	var _update = MAIN_CONTENT_CONTAINER.find('[data-role="UPDATE"]');
	for (let i = 0; i < _update.length; i++) 
	{
		const element = $(_update[i]);
		// granted
		for (let j = 0; j < PERMISSIONS.granted.length; j++) 
		{
			const perm = PERMISSIONS.granted[j];
			if ( element.data('perm') == perm )
				element.removeClass('d-none');
		}
		// denied
		for (let j = 0; j < PERMISSIONS.denied.length; j++) 
		{
			const perm = PERMISSIONS.denied[j];
			if ( element.data('perm') == perm )
				element.addClass('d-none');
		}
	}

	var _delete = MAIN_CONTENT_CONTAINER.find('[data-role="DELETE"]');
	for (let i = 0; i < _delete.length; i++) 
	{
		const element = $(_delete[i]);
		// granted
		for (let j = 0; j < PERMISSIONS.granted.length; j++) 
		{
			const perm = PERMISSIONS.granted[j];
			if ( element.data('perm') == perm )
				element.removeClass('d-none');
		}
		// denied
		for (let j = 0; j < PERMISSIONS.denied.length; j++) 
		{
			const perm = PERMISSIONS.denied[j];
			if ( element.data('perm') == perm )
				element.addClass('d-none');
		}
	}
}
// get employee permissions
getEmployeeTypePermissions = (data) =>
{
	var url = API_END_POINT+'Employees/Permissions/index';

	return sendAPIPostRequest(url, data);
}
// getMyPermissions
getMyPermissions = async () =>
{
	if ( !isConfigExists() )
		return;
	var url = API_END_POINT+'Employees/Permissions/index';
	var data = {
		administration_id: USER_CONFIG.administration_id,
		employee_type_id: USER_CONFIG.employee_type_id
	}

	var response = await getEmployeeTypePermissions(data);
	if ( response.code == 404 )
	{
		PERMISSIONS = [];
		return;
	}

	PERMISSIONS = response.data;
	console.log(PERMISSIONS);
}
if( typeof updateMyAccount != 'function' )
{
	// update My Account
	updateMyAccount = (EmployeeObject) =>
	{
		var url = API_END_POINT+'Employees/updateMe';
		var data = {
			EmployeeObject: EmployeeObject
		}

		return sendAPIPostRequest(url, data);
	}	
}

// setSupplierDept
setSupplierDept = (data) =>
{
	var url = API_END_POINT+'Suppliers/setDept';

	return sendAPIPostRequest(url, data);
}
// delete Suppliers
deleteSuppliers = (list) =>
{
	var url = API_END_POINT+'Suppliers/deleteList';
	var data = {
		list: list
	}

	return sendAPIPostRequest(url, data);
}
// get Supplier
getSupplier = (supplier_id) =>
{
	var url = API_END_POINT+'Suppliers/info';
	var data = {
		supplier_id: supplier_id
	}

	return sendAPIPostRequest(url, data);
}
// search Suppliers
searchSuppliers = (SearchObject) =>
{
	var url = API_END_POINT+'Suppliers/search';
	var data = {
		SearchObject: SearchObject
	}

	return sendAPIPostRequest(url, data);
}
// update Supplier
updateSupplier = (SupplierObject) =>
{
	var url = API_END_POINT+'Suppliers/update';
	var fd = new FormData();
	fd.append('SupplierObject', JSON.stringify(SupplierObject));
	if ( SupplierObject.image )
		fd.append('image', SupplierObject.image);

	return sendAPIFormDataRequest(url, fd);
}
// add Supplier
addSupplier = (SupplierObject) =>
{
	var url = API_END_POINT+'Suppliers/add';
	var fd = new FormData();
	fd.append('SupplierObject', JSON.stringify(SupplierObject));
	if ( SupplierObject.image )
		fd.append('image', SupplierObject.image);

	return sendAPIFormDataRequest(url, fd);
}
// set Member Seen
setMemberSeenByAdmin = (MemberObject) =>
{
	var url = API_END_POINT+'Members/setSeenByAdmin';
	var data = {
		MemberObject: MemberObject
	}

	return sendAPIPostRequest(url, data);
}
// delete Members
deleteMembers = (list) =>
{
	var url = API_END_POINT+'Members/deleteList';
	var data = {
		list: list
	}

	return sendAPIPostRequest(url, data);
}
// get Member
getMember = (member_id) =>
{
	var url = API_END_POINT+'Members/info';
	var data = {
		member_id: member_id
	}

	return sendAPIPostRequest(url, data);
}
// search Members
searchMembers = (SearchObject) =>
{
	var url = API_END_POINT+'Members/search';
	var data = {
		SearchObject: SearchObject
	}

	return sendAPIPostRequest(url, data);
}
// set Online Appointement Accepted
setOnlineAppointementAccepted = (AppointementObject) =>
{
	var url = API_END_POINT+'OnlineAppointements/setAccepted';
	var data = {
		AppointementObject: AppointementObject
	}

	return sendAPIPostRequest(url, data);
}
// delete Online Appointements
deleteOnlineAppointements = (list) =>
{
	var url = API_END_POINT+'OnlineAppointements/deleteList';
	var data = {
		list: list
	}

	return sendAPIPostRequest(url, data);
}
// get Online Appointement
getOnlineAppointement = (apt_id) =>
{
	var url = API_END_POINT+'OnlineAppointements/info';
	var data = {
		apt_id: apt_id
	}

	return sendAPIPostRequest(url, data);
}
// search Online Appointements
searchOnlineAppointements = (SearchObject) =>
{
	var url = API_END_POINT+'OnlineAppointements/search';
	var data = {
		SearchObject: SearchObject
	}

	return sendAPIPostRequest(url, data);
}
// search videos
searchVideos = (SearchObject) =>
{
	var url = API_END_POINT+'Videos/search';
	var data = {
		SearchObject: SearchObject
	};

	return sendAPIPostRequest(url, data);
}
// delete Videos
deleteVideos = (list) =>
{
	var url = API_END_POINT+'Videos/deleteList';
	var data = {
		list: list
	};

	return sendAPIPostRequest(url, data);
}
// get Video
getVideo = (video_id) =>
{
	var url = API_END_POINT+'Videos/info';
	var data = {
		video_id: video_id
	};

	return sendAPIPostRequest(url, data);
}
// update Video
updateVideo = (VideoObject) =>
{
	var url = API_END_POINT+'Videos/update';
	var data = {
		VideoObject: VideoObject
	};

	return sendAPIPostRequest(url, data);
}
// add Video
addVideo = (VideoObject) =>
{
	var url = API_END_POINT+'Videos/add';
	var data = {
		VideoObject: VideoObject
	};

	return sendAPIPostRequest(url, data);
}
// extract youtube video id
extractYTVideoId = (url) =>
{
	var url = new URL(url);
	return url.searchParams.get('v');
}
// delete Testimonials
deleteTestimonials = (list) =>
{
	var url = API_END_POINT+'Testimonials/deleteList';
	var data = {
		list: list
	};

	return sendAPIPostRequest(url, data);
}
// get Testimonial
getTestimonial = (test_id) =>
{
	var url = API_END_POINT+'Testimonials/info';
	var data = {
		test_id: test_id
	};

	return sendAPIPostRequest(url, data);
}
// search Testimonials
searchTestimonials = (SearchObject) =>
{
	var url = API_END_POINT+'Testimonials/search';
	var data = {
		SearchObject: SearchObject
	};

	return sendAPIPostRequest(url, data);
}
// search Advertisements Clients between dates
searchAdvertisementsClientsBetweenDates = (SearchObject) =>
{
	var url = API_END_POINT+'Advertisements/searchClientsBetweenDates';
	var data = {
		SearchObject: SearchObject
	};

	return sendAPIPostRequest(url, data);
}
// delete Advertisements clients
deleteAdvertisementsClients = (list) =>
{
	var url = API_END_POINT+'Advertisements/deleteClients';
	var data = {
		list: list
	};

	return sendAPIPostRequest(url, data);
}
// search Advertisements Clients
searchAdvertisementsClients = (SearchObject) =>
{
	var url = API_END_POINT+'Advertisements/searchClients';
	var data = {
		SearchObject: SearchObject
	};

	return sendAPIPostRequest(url, data);
}
// filter Advertisements By Date
filterAdvertisementsByDate = (SearchObject) =>
{
	var url = API_END_POINT+'Advertisements/filterByDate';
	var data = {
		SearchObject: SearchObject
	};

	return sendAPIPostRequest(url, data);
}
// delete Advertisements
deleteAdvertisements = (list) =>
{
	var url = API_END_POINT+'Advertisements/deleteList';
	var data = {
		list: list
	};

	return sendAPIPostRequest(url, data);
}
// search Advertisements
searchAdvertisements = (SearchObject) =>
{
	var url = API_END_POINT+'Advertisements/search';
	var data = {
		SearchObject: SearchObject
	};

	return sendAPIPostRequest(url, data);
}
// get Advertisement
getAdvertisement = (ad_id) =>
{
	var url = API_END_POINT+'Advertisements/info';
	var data = {
		ad_id: ad_id
	};

	return sendAPIPostRequest(url, data);
}
// update Advertisement
updateAdvertisement = (AdvertisementObject) =>
{
	var url = API_END_POINT+'Advertisements/update';
	var fd = new FormData();
	fd.append('AdvertisementObject', JSON.stringify(AdvertisementObject));
	if ( AdvertisementObject.ad_image )
		fd.append('ad_image', AdvertisementObject.ad_image);

	return sendAPIFormDataRequest(url, fd);
}
// list Advertisements Types
listAdvertisementsTypes = () =>
{
	var url = API_END_POINT+'Advertisements/listTypes';
	var data = {};

	return sendAPIPostRequest(url, data);
}
// add Advertisement
addAdvertisement = (AdvertisementObject) =>
{
	var url = API_END_POINT+'Advertisements/add';
	var fd = new FormData();
	fd.append('AdvertisementObject', JSON.stringify(AdvertisementObject));
	if ( AdvertisementObject.ad_image )
		fd.append('ad_image', AdvertisementObject.ad_image);

	return sendAPIFormDataRequest(url, fd);
}
// set General Appointement Accepted
setGeneralAppointementAccepted = (AppointementObject) =>
{
	var url = API_END_POINT+'Appointements/setAccepted';
	var data = {
		AppointementObject: AppointementObject
	}

	return sendAPIPostRequest(url, data);
}
// search Reports Between Dates Local
searchReportsBetweenDatesLocal = (SearchObject) =>
{
	var url = API_END_POINT+'Reports/searchBetweenDatesLocal';
	var data = {
		SearchObject: SearchObject
	}

	return sendAPIPostRequest(url, data);
}
// search Reports Local
searchReportsLocal = (SearchObject) =>
{
	var url = API_END_POINT+'Reports/searchLocal';
	var data = {
		SearchObject: SearchObject
	}

	return sendAPIPostRequest(url, data);
}
// delete Reports
deleteReports = (list) =>
{
	var url = API_END_POINT+'Reports/deleteList';
	var data = {
		list: list
	}

	return sendAPIPostRequest(url, data);
}
// get Report
getReport = (report_id) =>
{
	var url = API_END_POINT+'Reports/info';
	var data = {
		report_id: report_id
	}

	return sendAPIPostRequest(url, data);
}
// update Report
updateReport = (ReportObject) =>
{
	var url = API_END_POINT+'Reports/update';
	var data = {
		ReportObject: ReportObject
	}

	return sendAPIPostRequest(url, data);
}
// add Report
addReport = (ReportObject) =>
{
	var url = API_END_POINT+'Reports/add';
	var data = {
		ReportObject: ReportObject
	}

	return sendAPIPostRequest(url, data);
}
// file Name Snippet
filenameSnippet = (filename, max = 20) =>
{
	if ( filename.length <= max )
		return filename;

	var ext = extractFileExtension(filename);
	var sub1 = filename.substr(0, 20)+'...';
	var sub2 = filename.substr(13, 6)+'.'+ext;

	return sub1+sub2;
}
//strSnippet
strSnippet = (str, max = 50) =>
{
	if ( str.length <= max )
		return str;

	var sub1 = str.substr(0,  max / 2 )+'...';
	var sub2 = str.substr(str.length / 2,   max)+'...';

	return sub1+sub2;
}
// make scroll draggable
draggableScroll = (element) =>
{
	let pos = { 
		top: 0, 
		left: 0, 
		x: 0, 
		y: 0 
	};

	element.off('mousedown')
	.on('mousedown', mouseDownHandler);

	// mouse down handler
	function mouseDownHandler(e)
	{
		pos = {
	        // The current scroll
	        left: element[0].scrollLeft,
	        top: element[0].scrollTop,
	        // Get the current mouse position
	        x: e.clientX,
	        y: e.clientY
	    };

	    element.on('mousemove', mouseMoveHandler);
	    element.on('mouseup', mouseUpHandler);
	}
	// mouse move handler
	function mouseMoveHandler(e)
	{
		// How far the mouse has been moved
	    var dx = e.clientX - pos.x;
	    var dy = e.clientY - pos.y;

	    // Scroll the element
	    element[0].scrollTop = pos.top - dy;
	    element[0].scrollLeft = pos.left - dx;
	}
	// mouse up handler
	function mouseUpHandler(e)
	{
		// How far the mouse has been moved
	    var dx = e.clientX - pos.x;
	    var dy = e.clientY - pos.y;

	    // Scroll the element
	    element[0].scrollTop = pos.top - dy;
	    element[0].scrollLeft = pos.left - dx;

	    element.off('mousemove', mouseMoveHandler);
	    element.off('mouseup', mouseUpHandler);
	}
}
// is pdf file
isPDFFile = (url) =>
{
	var ext = ['pdf'];
	
	return ext.includes( extractFileExtension(url) );
}
// is image file
isImageFile = (url) =>
{
	var ext = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'ico'];
	
	return ext.includes( extractFileExtension(url) );
}
// set Patient Dept
setPatientDept = (PatientObject) =>
{
	var url = API_END_POINT+'Patients/setDeptAmount';
	var data = {
		PatientObject: PatientObject
	}

	return sendAPIPostRequest(url, data);
}
// in JSON Array
inJSONArray = (json_arr, k, v) =>
{
	var isExists = false;
	for (var i = 0; i < json_arr.length; i++) 
	{
		var json = json_arr[i];

		if ( json[k] == v )
		{
			isExists = true;
			break;
		}
	}

	return isExists;
}
// set Administration Treatment Classes
setTreatmentClassesForAdministration = (ClassObject) =>
{
	var url = API_END_POINT+'TreatmentClasses/setListForAdministration';
	var data = {
		ClassObject: ClassObject
	}

	return sendAPIPostRequest(url, data);
}
// set Appointement Session Patient Att Status 
setAppointementSessionPatientAttStatus = (AppointementObject) =>
{
	var url = API_END_POINT+'Appointements/setSessionPatientAttStatus';
	var data = {
		AppointementObject: AppointementObject
	}

	return sendAPIPostRequest(url, data);
}
// set General Appointement Treated
setGeneralAppointementTreated = (AppointementObject) =>
{
	var url = API_END_POINT+'Appointements/setTreated';
	var data = {
		AppointementObject: AppointementObject
	}

	return sendAPIPostRequest(url, data);
}
// set General Appointement Attendance
setGeneralAppointementAttendance = (AppointementObject) =>
{
	var url = API_END_POINT+'Appointements/setAttendance';
	var data = {
		AppointementObject: AppointementObject
	}

	return sendAPIPostRequest(url, data);
}
// set General Appointement Paid
setGeneralAppointementPaid = (AppointementObject) =>
{
	var url = API_END_POINT+'Appointements/setPaid';
	var data = {
		AppointementObject: AppointementObject
	}

	return sendAPIPostRequest(url, data);
}
// filter Appointements By Date General Local
filterAppointementsByDateGeneralLocal = (SearchObject) =>
{
	var url = API_END_POINT+'Appointements/filterByDateGeneralLocal';
	var data = {
		SearchObject: SearchObject
	}

	return sendAPIPostRequest(url, data);
}
// search Appointements General Local
searchAppointementsGeneralLocal = (SearchObject) =>
{
	var url = API_END_POINT+'Appointements/searchGeneralLocal';
	var data = {
		SearchObject: SearchObject
	}

	return sendAPIPostRequest(url, data);
}
// add Cashout Record
addCashoutRecord = (CashoutRecordObject) =>
{
	var url = API_END_POINT+'CashoutRecords/add';
	var data = {
		CashoutRecordObject: CashoutRecordObject
	}

	return sendAPIPostRequest(url, data);
}
// remove Cashout Records
removeCashoutRecords = (list) =>
{
	var url = API_END_POINT+'CashoutRecords/deleteList';
	var data = {
		list: list
	}

	return sendAPIPostRequest(url, data);
}
// search Cashout Records Between Dates Local
searchCashoutRecordsBetweenDatesLocal = (SearchObject) =>
{
	var url = API_END_POINT+'CashoutRecords/searchBetweenDatesLocal';
	var data = {
		SearchObject: SearchObject
	}

	return sendAPIPostRequest(url, data);
}
// search Cashout Records Local
searchCashoutRecordsLocal = (SearchObject) =>
{
	var url = API_END_POINT+'CashoutRecords/searchLocal';
	var data = {
		SearchObject: SearchObject
	}

	return sendAPIPostRequest(url, data);
}
// update Appointement With Sessions
updateAppointementWithSessions = (AppointementObject) =>
{
	var url = API_END_POINT+'Appointements/updateWithSessions';
	var data = {
		AppointementObject: AppointementObject
	}

	return sendAPIPostRequest(url, data);
}
// add Appointement With Sessions
addAppointementWithSessions = (AppointementObject) =>
{
	var url = API_END_POINT+'Appointements/addWithSessions';
	var data = {
		AppointementObject: AppointementObject
	}

	return sendAPIPostRequest(url, data);
}
// approve Clinic
approveClinic = (clinicId) =>
{
	var url = API_END_POINT+'Clinics/approve';
	var data = {
		clinicId: clinicId
	}

	return sendAPIPostRequest(url, data);
}
// delete Treatment Class
deleteTreatmentClass = (list) =>
{
	var url = API_END_POINT+'TreatmentClasses/deleteList';
	var data = {
		list: list
	}

	return sendAPIPostRequest(url, data);
}
// update Treatment Class
updateTreatmentClass = (ClassObject) =>
{
	var url = API_END_POINT+'TreatmentClasses/update';
	var data = {
		ClassObject: ClassObject
	}

	return sendAPIPostRequest(url, data);
}
// get Treatment Class
getTreatmentClass = (classId) =>
{
	var url = API_END_POINT+'TreatmentClasses/info';
	var data = {
		classId: classId
	}

	return sendAPIPostRequest(url, data);
}
// add Treatment Class
addTreatmentClass = (ClassObject) =>
{
	var url = API_END_POINT+'TreatmentClasses/add';
	var data = {
		ClassObject: ClassObject
	}

	return sendAPIPostRequest(url, data);
}
// delete Appointement Session Patient
deleteAppointementSessionPatient = (AppointementObject) =>
{
	var url = API_END_POINT+'Appointements/deleteSessionPatient';
	var data = {
		AppointementObject: AppointementObject
	}

	return sendAPIPostRequest(url, data);
}
// add Appointement Patients To Sessions
addAppointementPatientsToSessions = (AppointementObject) =>
{
	var url = API_END_POINT+'Appointements/addPatientsToSessions';
	var data = {
		AppointementObject: AppointementObject
	}

	return sendAPIPostRequest(url, data);
}
// list Appointement Session Patients
listAppointementSessionPatients = (session_id) =>
{
	var url = API_END_POINT+'Appointements/listSessionPatients';
	var data = {
		session_id: session_id
	}

	return sendAPIPostRequest(url, data);
}
// list Appointement Sessions
listAppointementSessions = (aptId) =>
{
	var url = API_END_POINT+'Appointements/listSessions';
	var data = {
		aptId: aptId
	}

	return sendAPIPostRequest(url, data);
}
// accept Order
acceptOrder = (order_id) =>
{
	var url = API_END_POINT+'Orders/accept';
	var data = {
		order_id: order_id
	};

	return sendAPIPostRequest(url, data);
}
// search Employees Att Between Dates
searchEmployeesAttBetweenDates = (SearchObject) =>
{
	var url = API_END_POINT+'Employees/searchAttBetweenDates';
	var data = {
		SearchObject: SearchObject
	}

	return sendAPIPostRequest(url, data);
}
// update Employee Att
updateEmployeeAtt = (EmployeeObject) =>
{
	var url = API_END_POINT+'Employees/updateAtt';
	var data = {
		EmployeeObject: EmployeeObject
	}

	return sendAPIPostRequest(url, data);
}
// update Order
updateOrder = (OrderObject) =>
{
	var url = API_END_POINT+'Orders/update';
	var data = {
		OrderObject: OrderObject
	};

	return sendAPIPostRequest(url, data);
}
// get Order
getOrder = (order_id) =>
{
	var url = API_END_POINT+'Orders/info';
	var data = {
		order_id: order_id
	};

	return sendAPIPostRequest(url, data);
}
// add Order
addOrder = (OrderObject) =>
{
	var url = API_END_POINT+'Orders/add';
	var data = {
		OrderObject: OrderObject
	};

	return sendAPIPostRequest(url, data);
}

// update Prescription
updatePrescription = (PrescObject) =>
{
	var url = API_END_POINT+'Prescriptions/update';
	var data = {
		PrescObject: PrescObject
	};
	return sendAPIPostRequest(url, data);
}
// delete Prescriptions
deletePrescriptions = (list) =>
{
	var url = API_END_POINT+'Prescriptions/deleteList';
	var data = {
		list: list
	};
	return sendAPIPostRequest(url, data);
}
// get Prescription
getPrescription = (prescriptionId) =>
{
	var url = API_END_POINT+'Prescriptions/info';
	var data = {
		prescriptionId: prescriptionId
	};
	return sendAPIPostRequest(url, data);
}
// search Prescriptions not In Orders Local
searchPrescriptionsNotInOrdersBetweenDatesLocal = (SearchObject) =>
{
	var url = API_END_POINT+'Prescriptions/searchNotInOrdersBetweenDatesLocal';
	var data = {
		SearchObject: SearchObject
	};
	return sendAPIPostRequest(url, data);
}
// search Prescriptions In Orders Local
searchPrescriptionsInOrdersBetweenDatesLocal = (SearchObject) =>
{
	var url = API_END_POINT+'Prescriptions/searchInOrdersBetweenDatesLocal';
	var data = {
		SearchObject: SearchObject
	};
	return sendAPIPostRequest(url, data);
}
// search Prescriptions
searchPrescriptionsLocal = (SearchObject) =>
{
	var url = API_END_POINT+'Prescriptions/searchLocal';
	var data = {
		SearchObject: SearchObject
	};
	return sendAPIPostRequest(url, data);
}
// add Prescription
addPrescription = (PrescObject) =>
{
	var url = API_END_POINT+'Prescriptions/add';
	var data = {
		PrescObject: PrescObject
	};
	return sendAPIPostRequest(url, data);
}

// Test server connection
testServerConnection = () =>
{
	return new Promise((resolve, reject) =>
	{
		$.ajax({
			url: API_END_POINT+'ServerInfo',
			type: 'POST',
			success: function(response)
			{
				if ( response.code == 404 )
				{
					reject(response);
					return;
				}
				resolve(response);
			},
			error: function( jqXHR, textStatus, errorThrown)
			{
				if ( textStatus == 'error' )
				{
					reject({
						xhr: jqXHR,
						status: textStatus,
						error: errorThrown
					});
				}
			}
		});
	});
}
// delete Changed Setting
deleteChangedSetting = (PatientObject) =>
{
	var url = API_END_POINT+'Patients/deleteChangedSetting';

	var data = {
		PatientObject: PatientObject
	};

	return sendAPIPostRequest(url, data);
}
// list Changed Settings
listChangedSettings = (SearchObject) =>
{
	var url = API_END_POINT+'Patients/listChangedSettings';

	var data = {
		SearchObject: SearchObject
	};

	return sendAPIPostRequest(url, data);
}
// add Changed Settings
addChangedSettings = (PatientObject) =>
{
	var url = API_END_POINT+'Patients/addChangedSettings';

	var fd = new FormData();
	fd.append('PatientObject', JSON.stringify(PatientObject));
	if ( PatientObject.patient_doc )
		fd.append('patient_doc', PatientObject.patient_doc);

	var request = sendAPIFormDataRequest(url, fd);

	request.then(response =>
	{
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
				CreateToast('اشعار', response.message, 'الآن');
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			CreateToast('Notification', response.message, 'maintenant');
	});

	return request;
}
// delete Patients
deletePatients = (list) =>
{
	var url = API_END_POINT+'Patients/deleteList';
	var data = {
		list:list
	}

	return sendAPIPostRequest(url, data);
}
// add Patient
addPatient = (PatientObject) =>
{
	var url = API_END_POINT+'Patients/add';
	var data = {
		PatientObject:PatientObject
	}

	var request = sendAPIPostRequest(url, data);
	request.then(response =>
	{
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
				CreateToast('اشعار', response.message, 'الآن');
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			CreateToast('Notification', response.message, 'maintenant');
	});

	return request;
}
// search Appointements Local
searchAppointementsLocal = (SearchObject) =>
{
	var url = API_END_POINT+'Appointements/searchLocal';
	var data = {
		SearchObject: SearchObject
	}

	return sendAPIPostRequest(url, data);
}
// search Treatment Classes local
searchTreatmentClassesLocal = (SearchObject) =>
{
	var url = API_END_POINT+'TreatmentClasses/searchLocal';
	var data = {
		SearchObject: SearchObject
	}

	return sendAPIPostRequest(url, data);
}
// delete Clinics
deleteClinics = (list) =>
{
	var url = API_END_POINT+'Clinics/deleteList';
	var data = {
		list:list
	}

	return sendAPIPostRequest(url, data);
}
// get Clinic
getClinic = (clinicId) =>
{
	var url = API_END_POINT+'Clinics/info';
	var data = {
		clinicId:clinicId
	}

	return sendAPIPostRequest(url, data);
}
// search Patients local
patientsHasChronicDiseaseSearchLocal = (SearchObject) =>
{
	var url = API_END_POINT+'Patients/hasChronicDiseaseSearchLocal';
	var data = {
		SearchObject:SearchObject
	}

	return sendAPIPostRequest(url, data);
}
// search Patients local
patientsHasAptSearchWithDateLocal = (SearchObject) =>
{
	var url = API_END_POINT+'Patients/hasAptSearchWithDateLocal';
	var data = {
		SearchObject:SearchObject
	}

	return sendAPIPostRequest(url, data);
}
// search Patients local
searchPatientsLocal = (SearchObject) =>
{
	var url = API_END_POINT+'Patients/searchLocal';
	var data = {
		SearchObject:SearchObject
	}

	return sendAPIPostRequest(url, data);
}
// set order status
setOrderStatus = (order_id, status) =>
{
	var url = API_END_POINT+'Orders/setStatus';
	var data = {
		order_id: order_id,
		status: status
	};

	return sendAPIPostRequest(url, data);
}
// delete Orders
deleteOrders = (list) =>
{
	var url = API_END_POINT+'Orders/deleteList';
	var data = {
		list: list
	};

	return sendAPIPostRequest(url, data);
}
// batch Add External Order
batchAddExternalOrder = (OrderObject, PatientObject) =>
{
	var url = API_END_POINT+'Orders/batchAddExternal';
	var data = {
		OrderObject: OrderObject,
		PatientObject: PatientObject
	};

	return sendAPIPostRequest(url, data);
}
// batch Add Order
batchAddOrder = (OrderObject) =>
{
	var url = API_END_POINT+'Orders/batchAdd';
	var data = {
		OrderObject: OrderObject
	};

	return sendAPIPostRequest(url, data);
}
// search Orders3
searchOrders3 = (SearchObject) =>
{
	var url = API_END_POINT+'Orders/search3';
	var data = {
		SearchObject: SearchObject
	};

	return sendAPIPostRequest(url, data);
}
// search Orders2
searchOrders2 = (SearchObject) =>
{
	var url = API_END_POINT+'Orders/search2';
	var data = {
		SearchObject: SearchObject
	};

	return sendAPIPostRequest(url, data);
}
// search Orders
searchOrdersLocal = (SearchObject) =>
{
	var url = API_END_POINT+'Orders/searchLocal';
	var data = {
		SearchObject: SearchObject
	};

	return sendAPIPostRequest(url, data);
}
// search Orders Between Dates 2
searchOrdersBetweenDatesLocal2 = (SearchObject) =>
{
	var url = API_END_POINT+'Orders/searchBetweenDatesLocal2';
	var data = {
		SearchObject: SearchObject
	};

	return sendAPIPostRequest(url, data);
}
// search Orders Between Dates
searchOrdersBetweenDatesLocal = (SearchObject) =>
{
	var url = API_END_POINT+'Orders/searchBetweenDatesLocal';
	var data = {
		SearchObject: SearchObject
	};

	return sendAPIPostRequest(url, data);
}
// search Orders Between Dates3
searchOrdersBetweenDates3 = (SearchObject) =>
{
	var url = API_END_POINT+'Orders/searchBetweenDates3';
	var data = {
		SearchObject: SearchObject
	};

	return sendAPIPostRequest(url, data);
}
// search Orders Between Dates2
searchOrdersBetweenDates2 = (SearchObject) =>
{
	var url = API_END_POINT+'Orders/searchBetweenDates2';
	var data = {
		SearchObject: SearchObject
	};

	return sendAPIPostRequest(url, data);
}
// search Orders Between Dates
searchOrdersBetweenDates = (SearchObject) =>
{
	var url = API_END_POINT+'Orders/searchBetweenDates';
	var data = {
		SearchObject: SearchObject
	};

	return sendAPIPostRequest(url, data);
}
// search Orders
searchOrders = (SearchObject) =>
{
	var url = API_END_POINT+'Orders/search';
	var data = {
		SearchObject: SearchObject
	};

	return sendAPIPostRequest(url, data);
}
// delete Expenses
deleteExpenses = (list) =>
{
	var url = API_END_POINT+'Treasury/deleteList';
	var data = {
		list: list
	};

	return sendAPIPostRequest(url, data);
}
// filterExpensesBetweenDates
filterExpensesBetweenDates = (TreasuryObject) =>
{
	var url = API_END_POINT+'Treasury/filterExpensesBetweenDates';
	var data = {
		TreasuryObject: TreasuryObject
	};

	return sendAPIPostRequest(url, data);
}
// filter Expenses By Date
filterExpensesByDate = (TreasuryObject) =>
{
	var url = API_END_POINT+'Treasury/filterExpensesByDate';
	var data = {
		TreasuryObject: TreasuryObject
	};

	return sendAPIPostRequest(url, data);
}
//list Treasury Expenses
listTreasuryExpensesDates = (clinicId) =>
{
	var url = API_END_POINT+'Treasury/listExpenses';
	var data = {
		clinicId: clinicId
	};

	return sendAPIPostRequest(url, data);
}
// delete product
deleteProduct = (productId) =>
{
	var url = API_END_POINT+'Products/delete';
	var data = {
		productId: productId
	};

	return sendAPIPostRequest(url, data);
}
// delete Products
deleteProducts = (list) =>
{
	var url = API_END_POINT+'Products/deleteList';
	var data = {
		list: list
	};

	return sendAPIPostRequest(url, data);
}
// search Products
searchProducts = (SearchObject) =>
{
	var url = API_END_POINT+'Products/search';
	var data = {
		SearchObject: SearchObject
	};

	return sendAPIPostRequest(url, data);
}
// search Products
searchProductsLocal = (SearchObject) =>
{
	var url = API_END_POINT+'Products/searchLocal';
	var data = {
		SearchObject: SearchObject
	};

	return sendAPIPostRequest(url, data);
}
// get Product
getProduct = (productId) =>
{
	var url = API_END_POINT+'Products/info';
	var data = {
		productId: productId
	};

	return sendAPIPostRequest(url, data);
}
// update Product
updateProduct = (ProductObject) =>
{
	var url = API_END_POINT+'Products/update';
	var fd = new FormData();
	fd.append('ProductObject', JSON.stringify(ProductObject));
	if ( ProductObject.productImage )
		fd.append('productImage', ProductObject.productImage);

	return sendAPIFormDataRequest(url, fd);
}
// batch Delete Products From Center
batchDeleteProductsFromCenter = (ProductObject) =>
{
	var url = API_END_POINT+'Products/batchDeleteFromCenter';
	var data = {
		ProductObject:ProductObject
	};
	return sendAPIPostRequest(url, data);
}
// batch add products to center
batchAddProductsToCenter = (ProductObjects) =>
{
	var url = API_END_POINT+'Products/batchAdd3';
	var data = {
		ProductObjects:ProductObjects
	};
	return sendAPIPostRequest(url, data);
}
// batch add Products
batchAddProducts = (ProductObjects) =>
{
	var url = API_END_POINT+'Products/batchAdd2';
	var data = {
		ProductObjects:ProductObjects
	};
	return sendAPIPostRequest(url, data);
}
// add Product
addProduct = (ProductObject) =>
{
	var url = API_END_POINT+'Products/add';
	var fd = new FormData();
	fd.append('ProductObject', JSON.stringify(ProductObject));
	if ( ProductObject.productImage )
		fd.append('productImage', ProductObject.productImage);

	return sendAPIFormDataRequest(url, fd);
}
// delete Employees
deleteEmployees = (list) =>
{
	var url = API_END_POINT+'Employees/deleteList';
	var data = {
		list: list
	}

	return sendAPIPostRequest(url, data);
}
// get Employee
getEmployee = (employee_id, employee_phone = '') =>
{
	var url = API_END_POINT+'Employees/info';
	var data = {
		employee_id: employee_id,
		employee_phone: employee_phone
	}

	return sendAPIPostRequest(url, data);
}
// search Clinic Employees
searchClinicEmployees = (SearchObject) =>
{
	var url = API_END_POINT+'Employees/searchLocal';
	var data = {
		SearchObject: SearchObject
	}

	return sendAPIPostRequest(url, data);
}
// close Window
closeWindow = (name) =>
{
	ipcIndexRenderer.send('close-window', {
		name: name
	});
}
// create window
createWindow = (options = null) =>
{
	ipcIndexRenderer.send('create-window', {
		options: options
	});
}
// translate Month Name
translateMonthName = (month) =>
{
	const AR_MONTHS = {
		january: 'جانفي',
		february: 'فيفري',
		march: 'مارس',
		april: 'افريل',
		may: 'ماي',
		june: 'جوان',
		july: 'جويلية',
		august: 'اوت',
		september: 'سبتمبر',
		october: 'اكتوبر',
		november: 'نوفمبر',
		december: 'ديسمبر'
	};
	const FR_MONTHS = {
		january: 'Janvier',
		february: 'Février',
		march: 'Mars',
		april: 'Avril',
		may: 'Mai',
		june: 'Juin',
		july: 'Juillet',
		august: 'Août',
		september: 'Septembre',
		october: 'Octobre',
		november: 'Novembre',
		december: 'Décembre'
	};

	if ( FUI_DISPLAY_LANG.lang == 'ar' )
		return AR_MONTHS[month.toLowerCase()];
	else if ( FUI_DISPLAY_LANG.lang == 'fr' )
		return FR_MONTHS[month.toLowerCase()];
}
// list Prescriptions Local
listPrescriptionsLocal = (SearchObject) =>
{
	var url = API_END_POINT+'Prescriptions/listAllLocal';
	var data = {
		SearchObject: SearchObject
	};
	return sendAPIPostRequest(url, data);
}
// listOrders
listOrders = (args) =>
{
	var url = API_END_POINT+'Orders/listAll';

	return sendAPIPostRequest(url, args);
}
// list Orders Local
listOrdersLocal = (SearchObject) =>
{
	var url = API_END_POINT+'Orders/listAllLocal';
	var data = {
		SearchObject: SearchObject
	};

	return sendAPIPostRequest(url, data);
}
// list products local
listProductsLocal = (SearchObject) =>
{
	var url = API_END_POINT+'Products/listAllLocal';
	var data = {
		SearchObject: SearchObject
	};

	return sendAPIPostRequest(url, data);
}
// list Appointements Local
listAppointementsLocal = (SearchObject) =>
{
	var url = API_END_POINT+'Appointements/listAllLocal';
	var data = {
		SearchObject: SearchObject
	}

	return sendAPIPostRequest(url, data);
}
// list Patients
listPatientsLocal = (SearchObject) =>
{
	var url = API_END_POINT+'Patients/listAllLocal';
	var data = {
		SearchObject: SearchObject
	}

	return sendAPIPostRequest(url, data);
}
// list All Treasury Info Local
treasurySearchRevenueFromClientsBetweenDatesLocal = (SearchObject) =>
{
	var url = API_END_POINT+'Treasury/searchRevenueFromClientsBetweenDatesLocal';
	var data = {
		SearchObject: SearchObject
	};

	return sendAPIPostRequest(url, data);
}
// list All Treasury Info Local
treasurySearchRevenueFromClientsLocal = (SearchObject) =>
{
	var url = API_END_POINT+'Treasury/searchRevenueFromClientsLocal';
	var data = {
		SearchObject: SearchObject
	};

	return sendAPIPostRequest(url, data);
}
// list All Treasury Info Local
listAllTreasuryInfoLocal = (SearchObject) =>
{
	var url = API_END_POINT+'Treasury/listAllLocal';
	var data = {
		SearchObject: SearchObject
	};

	return sendAPIPostRequest(url, data);
}
// get Treasury
getTreasury = (clinicId) =>
{
	var url = API_END_POINT+'Treasury/info';
	var data = {
		clinicId: clinicId
	};

	return sendAPIPostRequest(url, data);
}
// filterEmployeeByType
filterEmployeeByTypeLocal = (data) =>
{
	var url = API_END_POINT+'Employees/filterByTypeLocal';

	return sendAPIPostRequest(url, data);
}
// list Employees Types
listEmployeesTypes = (employee_type_target_center = '') =>
{
	var url = API_END_POINT+'Employees/listTypes';
	var data = {
		employee_type_target_center: employee_type_target_center
	}

	return sendAPIPostRequest(url, data);
}
// update Employee
updateEmployee = (EmployeeObject) =>
{
	var url = API_END_POINT+'Employees/update';
	var data = {
		EmployeeObject: EmployeeObject
	}

	return sendAPIPostRequest(url, data);
}
// add Employee
addEmployee = (EmployeeObject) =>
{
	var url = API_END_POINT+'Employees/add';
	var data = {
		EmployeeObject: EmployeeObject
	}

	return sendAPIPostRequest(url, data);
}
// take From Treasury
takeFromTreasury = (TreasuryObject) =>
{
	var url = API_END_POINT+'Treasury/take';
	var fd = new FormData();
	fd.append('TreasuryObject', JSON.stringify(TreasuryObject));
	if ( TreasuryObject.expense_file )
		fd.append('expense_file', TreasuryObject.expense_file);

	return sendAPIFormDataRequest(url, fd);
}
// add To Treasury
addToTreasury = (TreasuryObject) =>
{
	var url = API_END_POINT+'Treasury/add';
	var fd = new FormData();
	fd.append('TreasuryObject', JSON.stringify(TreasuryObject));
	if ( TreasuryObject.expense_file )
		fd.append('expense_file', TreasuryObject.expense_file);

	return sendAPIFormDataRequest(url, fd);
}
//trim currency Number
trimCurrencyNumber = (num, prefix = '+', currency = (FUI_DISPLAY_LANG.lang == 'ar') ? 'دج' : 'DA' ) =>
{
	if ( num >= 10000 )
		num = (num / 10000).toFixed(2) + prefix+' '+currency;

	return num;
}
// format money
formatMoney = (num) =>
{
	/*
	if ( FUI_DISPLAY_LANG.lang == 'ar' )
	{
		if ( num >= 10000000 )
			num = (num / 10000000).toFixed(2) + ' مليار ';
		else if ( num >= 10000 )
			num = (num / 10000).toFixed(2) + 'مليون ';
		else if ( num >= 1000 )
			num = (num / 1000).toFixed(2) + 'ألف ';	
	}
	else if ( FUI_DISPLAY_LANG.lang == 'fr' )
	{
		if ( num >= 10000000 )
			num = (num / 10000000).toFixed(2) + ' milliards';
		else if ( num >= 10000 )
			num = (num / 10000).toFixed(2) + ' millions';
		else if ( num >= 1000 )
			num = (num / 1000).toFixed(2) + ' mille';	
	}
	*/

	return parseFloat(num).toFixed(2);
}
//trim Number
trimNumber = (num, prefix = '+') =>
{
	if ( num >= 10000 )
		num = (num / 10000).toFixed(2) + prefix;
	else if ( num >= 1000 )
		num = (num / 1000).toFixed(2) + prefix;
	else if ( num >= 100 )
		num = (num / 100).toFixed(2) + prefix;

	return num;
}
// filterAppointementSpecialCases
filterAppointementSpecialCases = (data) =>
{
	var url = API_END_POINT+'Appointements/filterSpecialCases';

	return sendAPIPostRequest(url, data);
}
// listAppointementsStatus
listAppointementsStatus = () =>
{
	var url = API_END_POINT+'Appointements/listStatus';

	return sendAPIPostRequest(url, {});
}
// addAppointementSpecialCase
addAppointementSpecialCase = (data) =>
{
	var url = API_END_POINT+'Appointements/addSpecialCase';

	return sendAPIPostRequest(url, data);
}
// delete Appointements
deleteAppointements = (list) =>
{
	var url = API_END_POINT+'Appointements/deleteList';
	var data = {
		employee_id: USER_CONFIG.employee_id,
		list: list
	}

	return sendAPIPostRequest(url, data);
}
// search Appointements
searchAppointements = (query) =>
{
	var url = API_END_POINT+'Appointements/search';
	var data = {
		query: query
	}

	return sendAPIPostRequest(url, data);
}
// get Appointement
getAppointement = (aptId) =>
{
	var url = API_END_POINT+'Appointements/info';
	var data = {
		aptId: aptId
	}

	return sendAPIPostRequest(url, data);
} 
// update Appointement
updateAppointement = (AppointementObject) =>
{
	var url = API_END_POINT+'Appointements/update';
	AppointementObject['employee_id'] = USER_CONFIG.employee_id;
	var data = {
		AppointementObject: AppointementObject
	}

	return sendAPIPostRequest(url, data);
}
// add Appointement
addAppointement = (AppointementObject) =>
{
	var url = API_END_POINT+'Appointements/add';
	AppointementObject['employee_id'] = USER_CONFIG.employee_id;
	var data = {
		AppointementObject: AppointementObject
	}

	return sendAPIPostRequest(url, data);
}
// search Treatment Classes
searchTreatmentClasses = (query) =>
{
	var url = API_END_POINT+'TreatmentClasses/search';
	var data = {
		query: query
	}

	return sendAPIPostRequest(url, data);
}
// list Message Replies2
listMessageReplies2 = (MessageObject) =>
{
	var url = API_END_POINT+'Messages/replies';
	var data = {
		MessageObject: MessageObject
	}

	return sendAPIPostRequest(url, data);
}
// open Message
openMessage = (MessageObject) =>
{
	var url = API_END_POINT+'Messages/open';
	var data = {
		MessageObject: MessageObject
	}

	return sendAPIPostRequest(url, data);
}
// set Message Read
setMessageRead = (data) =>
{
	var url = API_END_POINT+'Messages/setRead';
	var data = {
		msgId: data.msgId,
		read: data.read,
		userHash: data.userHash
	}

	return sendAPIPostRequest(url, data);
}
// set Messages Read
setMessagesRead = (data) =>
{
	var url = API_END_POINT+'Messages/setReadList';
	var data = {
		list: data.list,
		read: data.read,
		userHash: data.userHash
	}

	return sendAPIPostRequest(url, data);
}
// remove Messages
removeMessages = (list) =>
{
	var url = API_END_POINT+'Messages/removeList';
	var data = {
		list: list
	}

	return sendAPIPostRequest(url, data);
}
// add Message Reply
addMessageReply = (MessageObject) =>
{
	var url = API_END_POINT+'Messages/reply';
	var data = {
		MessageObject:MessageObject
	}

	return sendAPIPostRequest(url, data);
}
// list Message Replies
listMessageReplies = (msgId) =>
{
	var url = API_END_POINT+'Messages/replies';
	var data = {
		msgId:msgId
	}

	return sendAPIPostRequest(url, data);
}
// list Message sent
listMessagesSent = (MessageObject) =>
{
	var url = API_END_POINT+'Messages/sent';
	var data = {
		MessageObject:MessageObject
	}

	return sendAPIPostRequest(url, data);
}
// search Messages
searchMessages = (SearchObject) =>
{
	var url = API_END_POINT+'Messages/search';
	var data = {
		SearchObject:SearchObject
	}

	return sendAPIPostRequest(url, data);
}
// list Message Inbox
listMessagesInbox = (MessageObject) =>
{
	var url = API_END_POINT+'Messages/inbox';
	var data = {
		MessageObject:MessageObject
	}

	return sendAPIPostRequest(url, data);
}
// send Message
sendMessage = (MessageObject) =>
{
	var url = API_END_POINT+'Messages/send';
	var fd = new FormData();
	fd.append('MessageObject', JSON.stringify(MessageObject));

	if ( MessageObject.attachments )
	{
		for (var i = 0; i < MessageObject.attachments.length; i++) 
		{
			fd.append('attachments[]', MessageObject.attachments[i]);
		}	
	}
	
	return sendAPIFormDataRequest(url, fd);
}
// search Patients
searchPatients = (query) =>
{
	var url = API_END_POINT+'Patients/search';
	var data = {
		query:query
	}

	return sendAPIPostRequest(url, data);
}
// list Treatment Classes
listTreatmentClasses = () =>
{
	var url = API_END_POINT+'TreatmentClasses/listAll';
	var data = {

	}

	return sendAPIPostRequest(url, data);
}
// list Clinic Treatment Classes
listClinicTreatmentClasses = (clinicId) =>
{
	var url = API_END_POINT+'TreatmentClasses/listLocal';
	var data = {
		clinicId:clinicId
	}

	return sendAPIPostRequest(url, data);
}
// search Clinics
searchClinics = (query) =>
{
	var url = API_END_POINT+'Clinics/search';
	var data = {
		query:query
	}

	return sendAPIPostRequest(url, data);
}
// update Patient
updatePatient = (PatientObject) =>
{
	var url = API_END_POINT+'Patients/update';
	var data = {
		PatientObject:PatientObject
	}

	var request = sendAPIPostRequest(url, data);

	request.then(response =>
	{
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
				CreateToast('اشعار', response.message, 'الآن');
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			CreateToast('Notification', response.message, 'maintenant');
	});

	return request;
}
// Page Loader
PageLoader = (visible = true) =>
{
	var PAGE_LOADER = $('#PAGE_LOADER');

	if ( visible )
		PAGE_LOADER.fadeIn(200);
	else
		PAGE_LOADER.fadeOut(200);
}
// Section Loader
SectionLoader = (parent,loader = 'loader-01') =>
{
	var loaderHTML = `<div class="loader-container" id="BlockLoaderqsdqsdqsd">
							<span class="${loader}"></span>
					</div>`;
	var loaderElement = parent.find('#BlockLoaderqsdqsdqsd');

	if ( loaderElement.length == 0 )
	{
		parent.addClass('position-relative');
		parent.append(loaderHTML);	
	}
	loaderElement = parent.find('#BlockLoaderqsdqsdqsd');
	if ( loader == '' )
		loaderElement.remove();
}
// recursive Copy Dir Files Sync
recursiveCopyDirFilesSync = (source, dest) =>
{
	var files = fs.readdirSync(source);
	//create dest dir
	if ( !fs.existsSync(dest) )
		fs.mkdirSync(dest, {recursive:true});

	files.forEach(file =>
	{
		var filename = source+file;
		var dest_filename = dest+file;
		if ( fs.lstatSync(filename).isFile() )
			fs.copyFileSync(filename, dest_filename);
	});
}
// Copy To Clipboard
copyLinkToClipboard = (element, val) =>
{
	var inputHTML = '<input type="text" id="copyToClipboardHiddenInput" style="display: none;">';
	var input = $(inputHTML).insertAfter(element);
	input = $('#copyToClipboardHiddenInput');
	input.val(val);
	input.focus();
	input.select();
	input[0].setSelectionRange(0, 99999);
	navigator.clipboard.writeText( input.val() );
	input.remove();
}
// download file
downloadFile = (url, filename, progressInfo, onComplete) =>
{
	var DOWNLOAD_START_TIME = undefined;
	var request = $.ajax({
		xhr: function() 
		{
		  var xhr = new XMLHttpRequest();
			xhr.responseType = 'blob';
			xhr.addEventListener('progress', (e) =>
			{
			    if (e.lengthComputable) 
		        {
		            var percentComplete = (e.loaded / e.total) * 100;
		            // Time Remaining
		            var seconds_elapsed = ( new Date().getTime() - DOWNLOAD_START_TIME ) / 1000;
		            bytes_per_second = e.loaded / seconds_elapsed;
		            //var bytes_per_second = seconds_elapsed ? e.loaded / seconds_elapsed : 0 ;
		            var timeleft = (new Date).getTime() - DOWNLOAD_START_TIME;
		            timeleft = e.total - e.loaded;
		            timeleft = timeleft / bytes_per_second;
		            // Upload speed
		            var Kbytes_per_second = bytes_per_second / 1024 ;
		            var transferSpeed = Math.floor(Kbytes_per_second);
		            progressInfo({e: e, timeleft: timeleft.toFixed(0), transferSpeed: transferSpeed, percent: percentComplete});
		        }
			}, false);
		   return xhr;
		},
		type: 'GET',
		url: url,
		async: true,
		cache: false,
		data: {},
		beforeSend: function(e)
		{
			// Set start time
			DOWNLOAD_START_TIME = new Date().getTime();
		},
		success: function(response)
		{
			var reader = new FileReader();
			reader.readAsArrayBuffer( response );
			reader.onload = () =>
		    {
		    	var buffer = Buffer.from(reader.result);
		    	fs.writeFile( filename, buffer, (err) => 
		    	{
		    		if ( err )
		    		{
		    			console.error(err);
		    			return;
		    		}

		    		if ( typeof onComplete == 'function' )
		    			onComplete(filename);
		    	});
		    };
		}
	});

	return request;
}
// Listen for barcode scanner
listenForBarcodeScanner = (CALLBACK) =>
{
	var scannedBarcode = '';
	var timer = undefined;
	$(window).off('keypress');
	$(window).on('keypress', e =>
	{
		scannedBarcode += e.key;
	    if (timer) 
	    {
	        clearTimeout(timer);
	    }

	    timer = setTimeout(() => 
	    {
	    	CALLBACK(scannedBarcode);
	        scannedBarcode = '';   
	    }, 500);
	});
}
// get Patient
getPatient = (patientId) =>
{
	var url = API_END_POINT+'Patients/info';
	var data = {
		patientId:patientId
	}

	return sendAPIPostRequest(url, data);
}
// generate QRCode
generateQRCode = (data) =>
{
	return new Promise((resolve, reject) =>
	{
		QRCode.toDataURL(data,{ errorCorrectionLevel: 'H' }, (err, url) =>
		{
			if ( err )
			{
				reject(err);
				return;
			}
			resolve(url);
		});	
	});
}
// get Manager
getManager = (ManagerObject) =>
{
	var url = API_END_POINT+'Manager/info';
	var data = {
		ManagerObject: ManagerObject
	};
	return sendAPIPostRequest(url, data);
}
// manager Login
managerLogin = (data) =>
{
	var url = API_END_POINT+'Manager/login';
	var data = {
		username: data.username,
		password: data.password
	};
	return sendAPIPostRequest(url, data);
}
// update Clinic
updateClinic = (ClinicObject) =>
{
	var url = API_END_POINT+'Clinics/update';
	var data = {
		ClinicObject: ClinicObject
	};

	return sendAPIPostRequest(url, data);
}
// register new clinic
addClinic = (ClinicObject) =>
{
	var url = API_END_POINT+'Clinics/add';
	var data = {
		ClinicObject: ClinicObject
	};

	return sendAPIPostRequest(url, data);
}
// patient Login
patientLogin = (data) =>
{
	var url = API_END_POINT+'Patients/login';
	var data = {
		phone: data.phone,
		password: data.password
	};
	return sendAPIPostRequest(url, data);
}
// employee Login
employeeLogin = (data) =>
{
	var url = API_END_POINT+'Employees/login';
	var data = {
		username: data.username,
		password: data.password
	};
	return sendAPIPostRequest(url, data);
}
// global Login
globalLogin = (login) =>
{
	if ( login.loginType == 'CLINIC' )
	{
		return employeeLogin(login);
	}
	if ( login.loginType == 'PATIENT' )
	{
		return patientLogin(login);
	}
}
// toggle Similar Navbars Links
toggleSimilarNavbarsLinks = (href) =>
{
	var sbLinks = SIDE_NAV_CONTAINER.find('[data-role="NAV_LINK"]');
	var tbLinks = TOP_NAV_BAR.find('[data-role="NAV_LINK"]');

	// toggle side bar links
	sbLinks.removeClass('active');
	for (var i = 0; i < sbLinks.length; i++) 
	{
		var link = $(sbLinks[i]);
		if ( link.attr('href') == href )
		{
			link.addClass('active');
			var parent = link.closest('.list-dropdown-toggle');
			if ( parent[0] != undefined )
			{
				if ( parent[0].nodeName == 'LI' )
				{
					$(parent.find('[data-role="NAV_LINK"]')[0]).addClass('active');
				}
			}
			break;
		}
	}
	// toggle top bar links
	tbLinks.removeClass('active');
	for (var i = 0; i < tbLinks.length; i++) 
	{
		var link = $(tbLinks[i]);
		if ( link.attr('href') == href )
		{
			link.addClass('active');
			break;
		}
	}
}
// Top loader
TopLoader = (text, visible = true) =>
{
	var sideNavLoader = $('#topLoader');

	sideNavLoader.find('#text').text(text);
	if ( visible )
	{
		sideNavLoader.css('display', 'block');
	}
	else
	{
		sideNavLoader.css('display', 'none');
	}
}
// toggle checkbox checked
toggleCheck = (checkbox, isChecked = null) =>
{
	if ( isChecked != null )
	{
		checkbox.attr('checked', isChecked);
		return;
	}
	checkbox.attr('checked', !checkbox.prop('checked') );
}
// load Login Session
loadLoginSession = () =>
{
	if ( !fs.existsSync(LOGIN_SESSION_FILE) )
		return;

	fs.readFile(LOGIN_SESSION_FILE, (err, data) =>
	{
		setLoginSession(JSON.parse(data));
	});
}
// set Login Session
setLoginSession = (sessionObject) =>
{
	LOGIN_SESSION = sessionObject;
}
// get login session
getLoginSession = () =>
{
	return LOGIN_SESSION;
}
// top progress bar
TopProgressBar = (options) => 
{
	var topProgressBarContainer = $('#topProgressBarContainer');
	var closeBTN = topProgressBarContainer.find('#closeBTN');
	var titleElement = topProgressBarContainer.find('#titleElement');
	var versionElement = topProgressBarContainer.find('#versionElement');
	var progressElement = topProgressBarContainer.find('#progressElement');

	// display
	show();
	// set title
	titleElement.text(options.title);
	// set version
	versionElement.text(options.version);
	// set progress
	progressElement.find('.progress-bar').css('width', options.progress.percent.toFixed(0)+'%')
	.text(options.progress.percent.toFixed(2)+'%');
	
	if ( options.hideOnComplete == true )
		hide();
	// close
	closeBTN.off('click');
	closeBTN.on('click', e =>
	{
		forceHide();
	});
	// show
	function show()
	{
		if ( !topProgressBarContainer.hasClass('active') )
			topProgressBarContainer.addClass('active');
	}
	// hide
	function hide()
	{
		topProgressBarContainer.removeClass('active');
	}
	// Force Hide dialog
	function forceHide()
	{
		topProgressBarContainer.css('display', 'none');
	}
}
// parse xlsx
parseXLSX = (xlsxFile, CALLBACK) =>
{
	readXlsxFile(xlsxFile).then(data =>
	{
		CALLBACK(data);
	});
}
// parse csv
parseCSV = (csvFile, CALLBACK) =>
{
	var config = {
		download: false,
		encoding: 'utf-8',
		complete: function(results)
		{
			CALLBACK(results);
		},
		error: function(error)
		{
			if ( error )
			{
				console.log(error);
			}
		}
	};
	Papa.parse(csvFile, config);
}
// Unique id
uniqid = () =>
{
	return uuid.v4();
}
// Toast
CreateToast = (title = '', body = '', time = 'À présent', delay = 10000) =>
{
	var toastContainer = $('#toastContainer');

	// Create toast
	var tclass = uniqid();
	var toastHTML = `<div class="${tclass} toast" role="alert" aria-live="polite" aria-atomic="true" data-delay="${delay}">
						<div class="toast-header">
							<img src="assets/img/utils/notify.png" style="width: 15px; height:15px;" class="rounded me-2" alt="...">
							<strong class="me-auto">${title}</strong>
							<small class="text-muted">${time}</small>
							<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
						</div>
						<div class="toast-body" style="font-weight: 300;">
							${body}
						</div>
					</div>`;
	toastContainer.append(toastHTML);
	// Get list of toasts
	var toastEl = toastContainer.find('.'+tclass)[0];
	var toast = new bootstrap.Toast(toastEl, 'show');
	// Delete all toasts when finished hiding
	//for (var i = 0; i < toastList.length; i++) 
	//{
		//var toast = toastList[i];
		//toast._config.autohide = false;
		toast._config.delay = $(toast._element).data('delay');
		toast.show();
		toast._element.addEventListener('hidden.bs.toast', () =>
		{
			$(toast._element).remove();
		});
		setTimeout(() => { $(toast._element).remove(); }, toast._config.delay);
	//}
}
// set ui display lang
setUIDisplayLang = (lang) =>
{
	/*
	// delete lang file
	fs.unlinkSync(DISPLAY_LANG_FILE);
	var fini = new IniFile(APP_ROOT_PATH);

	var UI_Settings = {
		DISPLAY_LANG: lang,
	};

	return fini.write(SETTINGS_FILE, UI_Settings, 'UI_Settings');
	*/
	ipcIndexRenderer.send('change-ui-language', lang);

	return new Promise((resolve, reject) =>
	{
		ipcIndexRenderer.removeAllListeners('ui-language-changed');
		ipcIndexRenderer.on('ui-language-changed', (e,args) =>
		{
			if( args )
				resolve(args);
			else
				reject(args);
		});		
	});
}
// Load display language
loadDisplayLanguage = () =>
{
	
	if ( fs.existsSync(DISPLAY_LANG_FILE) )
	{
		var data = fs.readFileSync(DISPLAY_LANG_FILE).toString('utf-8');
		FUI_DISPLAY_LANG = JSON.parse(data);
	}
	
	/*
	return new Promise(resolve =>
	{
		ipcIndexRenderer.removeAllListeners('translation-file-created');
		ipcIndexRenderer.on('translation-file-created', (e,info) =>
		{
			FUI_DISPLAY_LANG = info;
			resolve(info);
		});	
	});	
	*/
}
// load file
loadFile = (filepath, CALLBACK) =>
{
	if ( !fs.existsSync(filepath) )
		return '';

	fs.readFile(filepath, 'utf8', (error, data) =>
	{
		if ( error )
		{
			console.log(error);
			return;
		}
		CALLBACK(data);
	});
}
// Print file to pdf
printFileToPdf = (filepath = '', textDir = 'rtl') =>
{
	loadFile(filepath, filedata =>
	{
		var printWindow = window.open('', '', `width=${ $(window).width() }, height=${ $(window).height() }`);
	    // open the window
	    printWindow.document.open();
	    var domHTML = document.head.outerHTML;
	    domHTML+= `<body style="padding: 1em 2em;" dir="${textDir}">${filedata}</body>`;
		printWindow.document.write( domHTML );
		var winDomElement = $(printWindow.document);
		printWindow.document.close();
		printWindow.focus();
		printWindow.onload = (event) => 
		{
		  	printWindow.print();
	        printWindow.close();
		};
		/*
		setTimeout(function() {
	        printWindow.print();
	        printWindow.close();
	    }, 2000);
	    */
	})
	
}
// Print to pdf
printHTMLToPdf = (printableElement = '', options) =>
{
	// A4 landscape 299mm X 220mm | margin: -4cm -4.9cm -4cm -5.3cm
	// A5 portrait 150mm X 206.5mm | margin: 0cm 0cm 0cm -1cm

	var width = (!options.width) ? $(window).width() : options.width
	var height = (!options.height) ? $(window).height() : options.height

	var top = (!options.top) ? 0 : options.top
	var left = (!options.left) ? 0 : options.left

	var page = {
		size: 'A4',
		margin: '0cm'
	}

	if ( options.page )
	{
		page.size = (options.page.size) ?? page.size
		page.margin = (options.page.margin) ?? page.margin
	}

	var printWindow = window.open('', '', `width=${ width }, height=${ height }, top=${top}, left=${left}`);
	// open the window
	printWindow.document.open();
	var domHTML = document.head.outerHTML;
	// console.log( domHTML )
	domHTML+= `<body style="padding: 1em 2em;" dir="${options.direction}">
					<style>
					
						@page {
							size: ${page.size};
							margin: ${page.margin};
						}		

					</style>
					${printableElement}
				</body>`;
	printWindow.document.write( domHTML );
	var winDomElement = $(printWindow.document);
	printWindow.document.close();
	printWindow.focus();
	printWindow.onload = (event) => 
	{
		setTimeout(function() {
			printWindow.print();
			printWindow.close();
		}, 2*1000);
	};
	/*
	setTimeout(function() {
        printWindow.print();
        printWindow.close();
    }, 2000);
    */
}
shuffleArray = (array) => 
{
  return array.sort(() => Math.random() - 0.5);
}
// Random range
randomRange = (min, max) => 
{ 
  return Math.floor(Math.random() * (max - min + 1) + min)
}
// Set containers disabled
setContainersDisabled = (disabled = false) =>
{
	if ( disabled )
	{
		MAIN_CONTENT_CONTAINER.addClass('disabled');
		SIDE_NAV_CONTAINER.addClass('disabled');
		TOP_NAV_BAR.addClass('disabled');
	}
	else
	{
		MAIN_CONTENT_CONTAINER.removeClass('disabled');
		SIDE_NAV_CONTAINER.removeClass('disabled');
		TOP_NAV_BAR.removeClass('disabled');
	}
}
//Save user data
saveUserConfig = (json, CALLBACK) =>
{
	var dir = path.dirname(USER_CONFIG_FILE);
	if ( !fs.existsSync(dir) )
		fs.mkdirSync(dir, {recursive: true});

	data = JSON.stringify(json);
	fs.writeFile(USER_CONFIG_FILE, data, (error) => 
	{
		if ( typeof CALLBACK == 'function' )
			CALLBACK(error);

		// reload User Config
		reloadUserConfig();
	});
}
// Delete file
deleteFile = (file, CALLBACK) =>
{
	if (fs.existsSync(file)) 
	{
		fs.unlink(file, (error) =>
		{
			CALLBACK(error);
		});
  	}
}
// reload user config
reloadUserConfig = () =>
{
	var data = getUserConfig()
	USER_CONFIG = (data) ?? {}
	// sessionStorage.setItem('USER_CONFIG', JSON.stringify(USER_CONFIG))
}
// Get user data
getUserConfig = () =>
{
	if ( !isConfigExists() )
		return null;
	config = fs.readFileSync(USER_CONFIG_FILE, 'utf-8');
	json = JSON.parse(config);
	return json;
}
// Check config file exists
isConfigExists = () =>
{
	// console.log(USER_CONFIG_FILE);
	exists = false;
	if ( fs.existsSync(USER_CONFIG_FILE) )
		exists = true;

	return exists;
}
// Get connection hostname
getConnectionHostname = () =>
{
	var settings = loadIniSettingsSync();

	if ( !settings )
		return 'localhost';

	if ( settings.Server_Settings == null )
		return 'localhost';

	return settings.Server_Settings.HOSTNAME;

}
// Set connection hostname
setConnectionHostname = (hostname) =>
{
	var fini = new IniFile(APP_ROOT_PATH);

	var Server_Settings = {
		HOSTNAME: $.trim(hostname)
	};

	fini.writeSync(SETTINGS_FILE, Server_Settings, 'Server_Settings');
	setupAPISettings();
}
// Load ini settings
loadIniSettings = (CALLBACK) =>
{
	var fini = new IniFile(APP_ROOT_PATH);
	fini.read(SETTINGS_FILE).then(data =>
	{
		CALLBACK(data);
	});
}
// Load ini settings sync
loadIniSettingsSync = () =>
{
	var fini = new IniFile(APP_ROOT_PATH);
	DEFAULT_INI_SETTINGS = fini.readSync(SETTINGS_FILE);
	return DEFAULT_INI_SETTINGS;
}
// Set setect option selected
setOptionSelected = (selectElement, val, triggerEvent = false) =>
{
	selectElement.find('option').each((k, v) =>
	{
		var option = $(v);
		// Remove selection
		option.removeAttr('selected', '');
		if ( val == option.val() )
		{
			option.attr('selected', 'selected');
			return;
		}
	});
	// Trigger event
	if (triggerEvent)
		selectElement.trigger('change');
}
// Extract file extension
extractFileExtension = (filename) =>
{
	return path.extname(filename).replace('.', '');
}
// Image to data url
imageToDataURL = (File) =>
{
	return new Promise((resolve, reject) =>
	{
		var reader = new FileReader();

		reader.onload = () =>
		{
			resolve( reader.result );
		};

		if ( File == null )
		{
			reject('Image File is not specified');
			return;
		}

		reader.readAsDataURL(File);
	});
}
// Get page
getPage = (page) =>
{
	var promise = new Promise((resolve, reject) =>
	{
		sendGetRequest(page, response =>
		{
			if ( response.length == 0 )
			{
				reject('Error empty response');
				return;
			}
			resolve(response);
		});
	});

	return promise;
}
// Send Get Request
sendGetRequest = (url, CALLBACK) =>
{
	$.ajax({
		url: url,
		type: 'GET',
		success: function(response)
		{
			CALLBACK(response);
		},
		error: function( jqXHR, textStatus, errorThrown)
		{
			console.error(jqXHR)
			if ( textStatus == 'error' )
			{
				TopLoader('', false);
			}
		}
	});
}
// Send Post Request
sendAPIPostRequest = (url, data) =>
{
	console.log(url);
	data['lang'] = FUI_DISPLAY_LANG.lang;
	data['current_employee_id'] = USER_CONFIG.employee_id
	var request = $.ajax({
		url: url,
		type: 'POST',
		data: data,
		success: function(response)
		{
			console.log(response);
		},
		error: function( jqXHR, textStatus, errorThrown)
		{
			console.error(jqXHR)
			if ( textStatus == 'error' )
			{
				TopLoader('', false);
				var ERROR_BOX = $('#ERROR_BOX');
				if ( !ERROR_BOX[0] )
					return;

				if ( FUI_DISPLAY_LANG.lang == 'ar' )
					ERROR_BOX.show(0).find('#text').text("حدث خطأ أثناء الاتصال بالسيرفر");
				else if ( FUI_DISPLAY_LANG.lang == 'fr' )
					ERROR_BOX.show(0).find('#text').text("Une erreur s'est produite lors de la connexion au serveur");
			}
		}
	});

	return request;
}
// Send formdata Post Request
sendAPIFormDataRequest = (url, formData) =>
{
	console.log(url);
	formData.append('lang', FUI_DISPLAY_LANG.lang);
	formData.append('current_employee_id', USER_CONFIG.employee_id);

	var request = $.ajax({
		url: url,
		type: 'POST',
		processData: false,
		contentType: false,
		data: formData,
		success: function(response)
		{
			console.log(response);
		},
		error: function( jqXHR, textStatus, errorThrown)
		{
			console.error(jqXHR)
			if ( textStatus == 'error' )
			{
				TopLoader('', false);
				
				if ( FUI_DISPLAY_LANG.lang == 'ar' )
					DialogBox('خطأ', "حدث خطأ أثناء الاتصال بالسيرفر");
				else if ( FUI_DISPLAY_LANG.lang == 'fr' )
					DialogBox('Erreur', "Une erreur s'est produite lors de la connexion au serveur");
			}
		}
	});

	return request;
}
// fillFormFields
fillFormFields = (form, data) =>
{
	form.find('input[type="text"], input[type="number"], input[type="file"], textarea, select')
	.each((k,v) =>
	{
		var field = $(v);
		var name = field.attr('form.data.field');
		var ignore_fill = field.attr('form.data.ignore.fill');
		var data_array = field.attr('form.data.array');
		
		if ( ignore_fill == undefined )
		{
			if ( data_array != undefined )
			{
				if ( v.nodeName == 'INPUT' || v.nodeName == 'TEXTAREA' )
				{
					if ( field.attr('type') != 'file' )
						field.val( (data[data_array]) ? data[data_array][name] : null );
				}
				else if ( v.nodeName == 'SELECT' )
				{
					// field.find('option').each((k1,v1) =>
					// {
					// 	var option = $(v1);
					// 	option.removeAttr('selected', '');
					// 	if ( option.val() == data[data_array][name] )
					// 	{
					// 		option.attr('selected', 'selected');
					// 		return;
					// 	}
					// });
				}
				return;
			}

			if ( v.nodeName == 'INPUT' || v.nodeName == 'TEXTAREA' )
			{
				if ( field.attr('type') != 'file' )
					field.val(data[name]);
			}
			else if ( v.nodeName == 'SELECT' )
			{
				field.find('option').each((k1,v1) =>
				{
					var option = $(v1);
					option.removeAttr('selected', '');
					if ( option.val() == data[name] )
					{
						option.attr('selected', 'selected');
						return;
					}
				});
			}	
		}
	});
}
// appendToFormData
appendToFormData = (form_data, data, key) =>
{
	form_data.append(key, data);
}
// buildFormData
buildFormData = (form) =>
{
	var fd = new FormData;

	form.find('input[type="text"], input[type="number"], input[type="file"], textarea, select')
	.each((k,v) =>
	{
		var field = $(v);
		var name = field.attr('form.data.field');
		var data_array = field.attr('form.data.array');

		if ( data_array == undefined )
		{
			if ( v.nodeName == 'INPUT' || v.nodeName == 'TEXTAREA' )
			{
				if ( field.attr('type') == 'file' )
				{
					if ( v.files.length > 0 )
					{
						if ( field.attr('multiple') )
						{
							for (let i = 0; i < v.files.length; i++) 
							{
								const file = v.files[i];
								fd.append(name+'[]', file);
							}
						}
						else
							fd.append(name, v.files[0]);
					}
				}
				else
					fd.append(name, field.val());
			}
			else if ( v.nodeName == 'SELECT' )
			{
				// fd.append(name, field.find(':selected').val());
			}	
		}
		else
		{
			if ( v.nodeName == 'INPUT' || v.nodeName == 'TEXTAREA' )
			{
				if ( field.attr('type') != 'file' )
				{
					fd.append(data_array+'['+name+']', field.val());
				}
			}
			else if ( v.nodeName == 'SELECT' )
			{
				// fd.append(data_array+'['+name+']', field.find(':selected').val());
			}
			
			// fd.append('feature[]', field.val());
		}
	});

	return fd;
}
// setup welcome page
setupWelcomePage = async () =>
{
	var response = await getPage(DEFAULT_INI_SETTINGS.UI_Settings.MAIN_DIR_NAME+'views/pages/welcome.ejs');
	MAIN_CONTENT_CONTAINER.html(response);
	var welcomePageContainer = $('#welcomePageContainer');
	if ( !welcomePageContainer[0] )
		return;
	
	var welcomeIcon = welcomePageContainer.find('#welcomeIcon');
	var username = welcomePageContainer.find('#username');

	welcomeIcon.attr('src', DEFAULT_INI_SETTINGS.UI_Settings.MAIN_DIR_NAME+'assets/img/utils/welcome.png');
	username.text( (USER_CONFIG) ? USER_CONFIG.employee_name : '' );
	// console.log(DEFAULT_INI_SETTINGS.UI_Settings.MAIN_DIR_NAME);
}
// get all states
getAllStates = (element = null) =>
{
	var url = API_END_POINT+'States/list';
	var data = {};
	var request = sendAPIPostRequest(url, data);

	if ( element )
	{
		request.then(response =>
		{
			if ( response.code == 404 )
				return;

			var data = response.data;
			var html = '';
			$.each(data, (k,v) =>
			{
				html += `<option value="${v.wilaya_name}">${v.wilaya_name}</option>`;
			});
			element.html(html);	
		});
	}

	return request;
}
// // open dev tools
// openDevTools = () =>
// {
// 	// window key press
// 	var winkeys = {}
// 	$(window).off('keydown')
// 	.on('keydown', e =>
// 	{
// 		winkeys[e.code] = e.type == 'keydown'
	
// 		if ( winkeys.ControlLeft 
// 			&& winkeys.ShiftLeft 
// 			&& winkeys.KeyI
// 		)
// 		{
// 			ipcIndexRenderer.send('open-dev-console', '')
// 			winkeys = {}
// 		}
// 	})
// }
// loadNavbarLinks
loadNavbarLinks = () =>
{
	var links = SIDE_NAV_CONTAINER.find('[data-role="NAV_LINK"]')

	for (let i = 0; i < links.length; i++) 
	{
		const link = $(links[i]);
		const href = link.attr('href')
		if ( href == '#' || href == '' )
			continue

		// NAVBAR_LINKS.push()
		var name = ( link.data('name') ) ? link.data('name') : path.basename(href).split('.')[0]
		NAVBAR_LINKS[name] = href
	}
}
// go to page
goToPage = (name, data) =>
{
	var page = APP_DIR_NAME+NAVBAR_LINKS[name]

	getPage(page).then(response =>
	{
		// console.log( sessionStorage.getItem('current_page') )
		// store previous page
		sessionStorage.setItem('previous_page', sessionStorage.getItem('current_page'));
		// store current page
    	sessionStorage.setItem('current_page', page);
		MAIN_CONTENT_CONTAINER.html(response);
		// toggleSimilarNavbarsLinks(page)
		if (data)
			sessionStorage.setItem('session', JSON.stringify(data) )

		// previous page button
		$('.back-button').off('click').on('click', e =>
		{
			var target = $(e.target)

			if ( target.data('name') )
			{
				getPage(APP_DIR_NAME+NAVBAR_LINKS[target.data('name')]).then(response =>
				{
					sessionStorage.setItem('previous_page', sessionStorage.getItem('current_page'));
					// store current page
					sessionStorage.setItem('current_page', page);
					MAIN_CONTENT_CONTAINER.html(response);
				})
				return
			}
			goToPreviousPage()
		})
	});
}
// go to previous page
goToPreviousPage = (data = {}) =>
{
	var page = sessionStorage.getItem('previous_page')
	
	getPage(page).then(response =>
	{
		MAIN_CONTENT_CONTAINER.html(response);
		toggleSimilarNavbarsLinks(page)
		if (data)
			sessionStorage.setItem('session', JSON.stringify(data) )
	});
}
// session
sessionData = (clear_after_retrieve = false) =>
{
	var data = {}
	try {
		data = JSON.parse( sessionStorage.getItem('session') )
	} catch (error) {
		return data
	}

	if ( clear_after_retrieve )
		sessionStorage.removeItem('session')

	return (data) ?? {}
}
// clear session data
clearSessionData = () =>
{
	sessionStorage.removeItem('session')
}
// removeFakeElement
removeFakeElement = (id) =>
{
	var element = $('#'+id)

	if ( !element[0] ) return

	element.remove()
}
// createFakeElement
createFakeElement = (id, html) =>
{
	var element = $('#'+id)

	if ( element[0] ) 
	{
		element.html(html)
		return element
	}

	$(`<div class="d-none" id="${id}">${html}</div>`).insertAfter(MAIN_CONTENT_CONTAINER)

	element = $('#'+id)

	return element
}
// load navbar links
loadNavbarLinks()
// display loader
PageLoader();
// Call globally
loadDisplayLanguage();
// // dev console
// openDevTools()
//loadLoginSession();
reloadUserConfig();
// load ini settings
loadIniSettingsSync();
API_END_POINT = DEFAULT_INI_SETTINGS.Server_Settings.API_END_POINT;
PROJECT_URL = DEFAULT_INI_SETTINGS.Server_Settings.PROJECT_URL;
// display info in welcome page
setupWelcomePage();
// load permissions
await getMyPermissions();
setupPermissions();
var privChecker = setInterval(() => {
	setupPermissions();
}, 1*50);

// set window title
if ( USER_CONFIG )
{
	if ( USER_CONFIG.type )
	{
		emp_type_name = (FUI_DISPLAY_LANG.lang == 'ar') ? USER_CONFIG.type.employee_type_name_ar : USER_CONFIG.type.employee_type_name_fr

		$('head title').text(emp_type_name)
	}
}


// hide loader
PageLoader(false);
// console.log(FUI_DISPLAY_LANG)

});
