
const fs = require('fs');
const ROOTPATH = require('electron-root-path');
const path = require('path');
const uuid = require('uuid');
const ipcIndexRenderer = require('electron').ipcRenderer;
const OS = require('os');
var QRCode = require('qrcode');
const date_time = require('date-and-time');
// const { map } = require('jquery');
const IniFile = require(__dirname+'/assets/js/utils/IniFile.js');
const Calendar = require(__dirname+'/assets/js/include/Calendar');
const Chart = require(__dirname+'/assets/js/include/Chart.min');
// const ejs = require('ejs')
// const _ = require('lodash')
// const readXlsxFile = require('read-excel-file');
// const axios = require('axios');

// Super globals
function asyncMessageToMain(name)
{
	ipcIndexRenderer.send('asynchronous-message', {message: name})
	ipcIndexRenderer.removeAllListeners(name)
	ipcIndexRenderer.on(name, (e, args) =>
	{
		return Promise.resolve(e, args)
	})
}

var PACKAGE_JSON_FILE = __dirname+'/package.json'
var PACKAGE_JSON = {}

if ( fs.existsSync(PACKAGE_JSON_FILE) )
{
	PACKAGE_JSON = require(PACKAGE_JSON_FILE)
}
else
{
	PACKAGE_JSON_FILE = path.dirname(__dirname)+'/package.json'
	PACKAGE_JSON = require(PACKAGE_JSON_FILE)
}

var APP_NAME = PACKAGE_JSON.productName;
var API_END_POINT = '';
var PROJECT_URL = '';
var APP_ICON = 'assets/img/logo/logo.png';
var APP_ROOT_PATH = ROOTPATH.rootPath+'/';
var APP_DIR_NAME = __dirname+'/';

const APP_TMP_DIR = OS.tmpdir()+'/'+APP_NAME

const CURRENCY = {
	ar: 'دج',
	fr: 'DA',
	dzd: 'DZD',
};

const SETTINGS_FILE = 'settings';
const DISPLAY_LANG_FILE = APP_ROOT_PATH+'locale/lang.json';

var FUI_DISPLAY_LANG = undefined;

var LOGIN_SESSION = undefined;
var LOGIN_SESSION_FILE = APP_TMP_DIR+'/login/session.json';


var USER_CONFIG = {};
var USER_CONFIG_FILE = APP_TMP_DIR+'/login/config.json';

var DEFAULT_INI_SETTINGS = null;
var PERMISSIONS = [];

var GLOBALS_SCRIPT = null;

const TIME_NOW = new Date();
const CURRENT_DATE = date_time.format(TIME_NOW, 'YYYY-MM-DD');
const CURRENT_TIME = date_time.format(TIME_NOW, 'HH:mm:ss');

const CURRENT_DATE_DD_MM_YYYY = date_time.format(TIME_NOW, 'DD-MM-YYYY')
const CURRENT_DATE_SLASH_DD_MM_YYYY = date_time.format(TIME_NOW, 'DD/MM/YYYY')

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
const STATUS_WAITING = 'waiting'
const STATUS_IN_PROGRESS = 'in_progress'
const STATUS_COMPLETED = 'completed'
const STATUS_CANCELED = 'canceled'
const STATUS_LAUNCHED = 'launched'
const STATUS_APPROVED = 'approved'
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
const EMP_TYPE_AL_ASL_FOOD_INDUSTRIES = 'AL_ASL_FOOD_INDUSTRIES';
const EMP_TYPE_DRIVER = 'DRIVER';
// expense types
const EXP_TYPE_NORMAL = 'EXP_TYPE_NORMAL';
const EXP_TYPE_TRANSFER_TO_CENTRAL_ADMINISTRATION = 'EXP_TYPE_TRANSFER_TO_CENTRAL_ADMINISTRATION';
const EXP_TYPE_ENTERING_DISTRIBUTOR_TRANSACTION_MONEY = 'EXP_TYPE_ENTERING_DISTRIBUTOR_TRANSACTION_MONEY';
// message type
const MESSAGE_TYPE_REGULAR = 'regular';
const MESSAGE_TYPE_COMPLAIN = 'complain';
// certificates
const CERT_TARGET_PATIENT = 'CERT_TARGET_PATIENT'
const CERT_TARGET_EMPLOYEE = 'CERT_TARGET_EMPLOYEE'
// APT SPECIAL CASES
const CASE_PHONE_CLOSED = 'CASE_PHONE_CLOSED';
const CASE_PHONE_NO_ANSWER = 'CASE_PHONE_NO_ANSWER';
const CASE_POSTPONE_APT = 'CASE_POSTPONE_APT';
const CASE_CONFIRM_CANCEL_APT = 'CASE_CONFIRM_CANCEL_APT';
const CASE_CONFIRM_APT = 'CASE_CONFIRM_APT';
// group roles
const CHAT_GROUP_ADMIN = 'CHAT_GROUP_ADMIN'
const CHAT_GROUP_CONTRIBUTOR = 'CHAT_GROUP_CONTRIBUTOR'
// Chat Group Post Reactions
const CHAT_GROUP_POST_REACTIONS = {
	like: {
		code: 'like',
		color: '',
		icon: '<i class="xfb xfb-like js_fb_like_button_icon" data-code="like"></i>',
		url: '../assets/img/reactions/like.svg',
	},
	haha: {
		code: 'haha',
		color: 'text-color-care',
		icon: '<img src="../assets/img/reactions/haha.svg" class="width-18px height-18px js_fb_like_button_icon" data-code="haha">',
		url: '../assets/img/reactions/haha.svg',
	},
	love: {
		code: 'love',
		color: 'text-color-love',
		icon: '<img src="../assets/img/reactions/love.svg" class="width-18px height-18px js_fb_like_button_icon" data-code="love">',
		url: '../assets/img/reactions/love.svg',
	},
	sad: {
		code: 'sad',
		color: 'text-color-care',
		icon: '<img src="../assets/img/reactions/sad.svg" class="width-18px height-18px js_fb_like_button_icon" data-code="sad">',
		url: '../assets/img/reactions/sad.svg',
	},
	wow: {
		code: 'wow',
		color: 'text-color-care',
		icon: '<img src="../assets/img/reactions/wow.svg" class="width-18px height-18px js_fb_like_button_icon" data-code="wow">',
		url: '../assets/img/reactions/wow.svg',
	},
	care: {
		code: 'care',
		color: 'text-color-care',
		icon: '<img src="../assets/img/reactions/care.svg" class="width-18px height-18px js_fb_like_button_icon" data-code="care">',
		url: '../assets/img/reactions/care.svg',
	},
	angry: {
		code: 'angry',
		color: 'text-color-angry',
		icon: '<img src="../assets/img/reactions/angry.svg" class="width-18px height-18px js_fb_like_button_icon" data-code="angry">',
		url: '../assets/img/reactions/angry.svg',
	},
}

let reloadUserConfig
let loadIniSettings
let loadIniSettingsSync
let openDevTools
let loadDisplayLanguage
let PageLoader
let getUserConfig
let saveUserConfig
let saveUserConfigSync
let deleteFile
let deleteFileSync
let isConfigExists
let getConnectionHostname
let setConnectionHostname
let createWindow
let closeWindow
let indexDirFiles
let arrayToJson
let blobToFile
let bufferToBlob
let urlToBlob
let urlToFile
let xlsxToJson
let getRandomColor
let escapeArabic
let uploadFile
let uniqid
let escapeJsonCharacters
let imgPlaceholder
let imgFallback
let formatDateTimeToDate
let syncImagesThread
let showInMap
let batchShowInMap
let fillForm
let lastArrayElement
let firstArrayElement
let receipt7_5cmPrint
let moneyFormat
let convertCoordinates
let checkContentEditableEmpty
let formatNumberToStr
let detectTypingEnd
let objectValues
let convertPptToImage
let setCursorAtEnd
let renderView
let openFile
let openFolder
let commerceMoney
let printPrescription
let previewPrescription
let printMedicalAnalysis
let previewMedicalAnalysis
let detectScrollEnd
// dispatched events
let dispatch_onNewAjaxContentLoaded
let dispatch_onRefreshGroupPosts
let dispatchCustomEvent

// Global
// extract extension from data url
function extractExtensionFromDataUrl(dataUrl) 
{
	const mimeTypeMatch = dataUrl.match(/^data:(.*?);/);
	if (mimeTypeMatch && mimeTypeMatch[1]) 
	{
		const mimeType = mimeTypeMatch[1];
		const extensionMatch = mimeType.match(/\/([a-zA-Z]+)/);
		if (extensionMatch && extensionMatch[1]) 
		{
			return extensionMatch[1];
		}
	}
	return null;
}
  
// rotate image
function rotateImage(imageUrl, degrees, callback) 
{
	const img = new Image();
	
	img.onload = function() {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		// Calculate the new dimensions to fit the rotated image
		const radians = (degrees * Math.PI) / 180;
		const width = img.width;
		const height = img.height;
		const newWidth = Math.abs(Math.cos(radians) * width) + Math.abs(Math.sin(radians) * height);
		const newHeight = Math.abs(Math.sin(radians) * width) + Math.abs(Math.cos(radians) * height);

		// Set the canvas dimensions
		canvas.width = newWidth;
		canvas.height = newHeight;

		// Rotate the image
		ctx.translate(newWidth / 2, newHeight / 2);
		ctx.rotate(radians);
		ctx.drawImage(img, -width / 2, -height / 2);

		// Convert the rotated canvas back to an image
		const rotatedImageUrl = canvas.toDataURL('image/png');

		// Call the callback function with the rotated image URL
		callback(rotatedImageUrl);
	};

	// Load the image
	img.src = imageUrl;
}
  
// Print to pdf
function printHTMLToPdf(printableElement = '', options = {})
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

function printSourceUrl(url, options = {}) 
{
	var width = (!options.width) ? $(window).width() : options.width;
	var height = (!options.height) ? $(window).height() : options.height;
	var top = (!options.top) ? 0 : options.top;
	var left = (!options.left) ? 0 : options.left;

	const printWindow = window.open(url, '_blank', `width=${width}, height=${height}, top=${top}, left=${left}`);

	// Wait for the window to load
	printWindow.onload = (e) => {
		// Register the onbeforeprint event handler to trigger the print dialog
		printWindow.onbeforeprint = function() {
			printWindow.print();
		};

		// You can also use onafterprint to close the window after printing (optional)
		printWindow.onafterprint = function() {
			printWindow.close();
		};

		// Trigger the print dialog programmatically
		printWindow.focus();
		printWindow.print();
	};
}

function downloadFileWithProgress(url, filename, progressCallback) 
{
	// Set start time
	var DOWNLOAD_START_TIME = new Date().getTime();

	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.responseType = 'blob';

	xhr.upload.addEventListener('progress', function(e)
	{
		console.log(e.lengthComputable)
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
			// console.log(percentComplete)
			progressCallback({
				e,
				percentComplete,
				timeleft: timeleft.toFixed(0),
				transferSpeed,
			});
		}
	})

	xhr.onload = function () {
		if (xhr.status === 200) 
		{
			var reader = new FileReader();
			reader.readAsArrayBuffer( xhr.response );
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
	};

	xhr.send();

	return xhr
}
// isNull
function isNull (variable)
{
	if ( variable == null || variable == 'null' ) return true
	if ( variable == undefined || variable == 'undefined' ) return true
	if ( variable == '' ) return true

	return false
}
// checkNull
function checkNull(variable)
{
	return (isNull(variable)) ? FUI_DISPLAY_LANG.views.messages.nothing : variable
}

// append script
function appendScript(options) 
{
	// Default options
	const defaultOptions = 
	{
		appendPosition: 'end',
		script: {
			src: '',
			async: false,
		}
	};

	// Merge provided options with default options
	options = { ...defaultOptions, ...options };

	// Get the container element
	const containerElement = options.container;

	// Create a script element
	const scriptElement = document.createElement('script');

	// Set the script source URL
	scriptElement.src = options.script.src;
	scriptElement.async = options.script.async;

	// Depending on the appendPosition option, add the script to the beginning or end of the container
	if (options.appendPosition === 'begin') {
		containerElement.insertBefore(scriptElement, containerElement.firstChild);
	} else {
		containerElement.appendChild(scriptElement);
	}
}

// containsArabic
function containsArabic(text) 
{
	// Regular expression to match Arabic Unicode range
	var arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDCF\uFDF0-\uFDFF\uFE70-\uFEFF]/;

	return arabicPattern.test(text);
}
// file to data url
function fileToDataUrlWorker(files)
{
	const FileToDataUrlWorker = new Worker('../assets/js/workers/FileToDataUrlWorker.js')

	FileToDataUrlWorker.postMessage({
		files: files,
	})

	return new Promise( (resolve) =>
	{
		FileToDataUrlWorker.onmessage = (e) =>
		{
			resolve(e.data)
			FileToDataUrlWorker.terminate()
		}
	})
}
// url to file
function urlToFileWorker(options)
{
	const UrlToFileWorker = new Worker('../assets/js/workers/UrlToFileWorker.js')

	UrlToFileWorker.postMessage({
		data: options.data,
	})

	return new Promise( (resolve) =>
	{
		UrlToFileWorker.onmessage = (e) =>
		{
			resolve(e.data)
			UrlToFileWorker.terminate()
		}
	})
}
//
// Function to observe any HTML element for changes
function observeElement(element, callback) 
{
	// Create a new MutationObserver
	const observer = new MutationObserver((mutationsList, observer) => 
	{
		mutationsList.forEach((mutation) => 
		{
			if (mutation.type === 'childList') 
			{
				// Check if nodes were added
				if (mutation.addedNodes.length > 0) 
				{
					callback(mutation.addedNodes);
				}
			}
		});
	});

	// Configure the observer to watch for changes to child nodes (subtree)
	const observerConfig = { childList: true, subtree: true };

	// Start observing the element
	observer.observe(element, observerConfig);

	// Return the observer instance so it can be disconnected when needed
	return observer;
}
//compareDates
function compareDates(dateStr1, dateStr2 = CURRENT_DATE) 
{
	// Convert the input date strings to Date objects
	const date1 = new Date(dateStr1);
	const date2 = new Date(dateStr2);

	// Check if the conversion was successful
	if (isNaN(date1) || isNaN(date2)) 
	{
		throw new Error('Invalid date input');
	}

	// Compare the dates
	if (date1 < date2) {
		return -1; // date1 is earlier than date2
	} else if (date1 > date2) {
		return 1; // date1 is later than date2
	} else {
		return 0; // dates are equal
	}
}
// compareTimes
function compareTimes(time1, time2 = 'current_time') 
{
	if ( time2 == 'current_time' )
	{
		var currentTime = date_time.format(new Date(), 'HH:mm:ss');
		time2 = currentTime
	}
	// Regular expressions to extract time components and meridian (AM/PM)
	const timeFormat = /(\d{1,2}):(\d{2})\s?([APap][Mm])?/;

	// Extract time components and meridian for time1
	const [, hours1, minutes1, meridian1] = time1.match(timeFormat);
	const hoursParsed1 = parseInt(hours1, 10);

	// Extract time components and meridian for time2
	const [, hours2, minutes2, meridian2] = time2.match(timeFormat);
	const hoursParsed2 = parseInt(hours2, 10);

	// Adjust hours for PM times
	if (meridian1 && meridian1.toLowerCase() === 'pm') {
		hoursParsed1 += 12;
	}
	if (meridian2 && meridian2.toLowerCase() === 'pm') {
		hoursParsed2 += 12;
	}

	// Compare the times
	if (hoursParsed1 < hoursParsed2) 
	{
		return -1; // time1 is earlier than time2
	} 
	else if (hoursParsed1 > hoursParsed2) 
	{
		return 1; // time1 is later than time2
	} 
	else 
	{
		// If hours are the same, compare minutes
		if (parseInt(minutes1, 10) < parseInt(minutes2, 10)) 
		{
			return -1; // time1 is earlier than time2
		} 
		else if (parseInt(minutes1, 10) > parseInt(minutes2, 10)) 
		{
			return 1; // time1 is later than time2
		} 
		else 
		{
			return 0; // time1 and time2 are equal
		}
	}
}
	
function getDatetimeDifference(datetime) 
{
	const locale = FUI_DISPLAY_LANG.lang;

    const TIME_DIFF = {
        ar: {
            seconds: "منذ :attribute ثواني",
            minutes: "منذ :attribute دقائق",
            hours: "منذ :attribute ساعات",
            days: "منذ :attribute ايام",
            months: "منذ :attribute اشهر",
            years: "منذ :attribute سنوات"
        },
        fr: {
            seconds: "il y a :attribute secondes",
            minutes: "il y a :attribute minutes",
            hours: "il y a :attribute heures",
            days: "il y a :attribute jours",
            months: "il y a :attribute mois",
            years: "il y a :attribute ans"
        }
    };

    const TIME_DIFF_REMAINING = {
        ar: {
            seconds: "باقي :attribute ثواني",
            minutes: "باقي :attribute دقائق",
            hours: "باقي :attribute ساعات",
            days: "باقي :attribute ايام",
            months: "باقي :attribute اشهر",
            years: "باقي :attribute سنوات"
        },
        fr: {
            seconds: "il reste :attribute secondes",
            minutes: "il reste :attribute minutes",
            hours: "il reste :attribute heures",
            days: "il reste :attribute jours",
            months: "il reste :attribute mois",
            years: "il reste :attribute ans"
        }
    };

	// Parse the input datetime string to a Date object
	const inputDate = new Date(datetime);

	// Get the current date and time
	const currentDate = new Date();

	// Calculate the difference in milliseconds
	const difference = Math.abs(inputDate - currentDate);
	var diff = {
		years: 0,
		months: 0,
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
		auto: '',
		auto_remaining: '',
	}

	// Check if the input date is in the future, past, or present
	if (difference > 0) 
	{
		diff = getPositiveDifference(difference);
	} 
	else if (difference < 0) 
	{
		diff = getNegativeDifference( Math.abs(difference) );
	}
	else 
	{
		diff = getZeroDifference();
	}

	// Determine the largest applicable unit for the current difference
	let largestUnit = 'seconds';
	
	for (const unit in diff) 
	{
		if (diff[unit] > 0) 
		{
			largestUnit = unit;
			break;
		}
	}

	
	const datediff = TIME_DIFF[locale][largestUnit].replace(':attribute', diff[largestUnit]);

    // Assign the current difference to the "auto" property
    diff.auto = datediff;

    const remainingDatediff = TIME_DIFF_REMAINING[locale][largestUnit].replace(':attribute', diff[largestUnit]);

    // Assign the current difference to the "auto_remaining" property
    diff.auto_remaining = remainingDatediff;

	return diff
}

function getPositiveDifference(difference) 
{
	// Calculate the absolute values of years, months, days, hours, minutes, and seconds
	const absoluteYears = Math.floor(difference / (365 * 24 * 60 * 60 * 1000));
	const absoluteMonths = Math.floor(difference / (30 * 24 * 60 * 60 * 1000));
	const absoluteDays = Math.floor(difference / (24 * 60 * 60 * 1000));
	const absoluteHours = Math.floor((difference % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
	const absoluteMinutes = Math.floor((difference % (60 * 60 * 1000)) / (60 * 1000));
	const absoluteSeconds = Math.floor((difference % (60 * 1000)) / 1000);

	// Create an object to store the results
	const differenceObj = {
		years: absoluteYears,
		months: absoluteMonths,
		days: absoluteDays,
		hours: absoluteHours,
		minutes: absoluteMinutes,
		seconds: absoluteSeconds,
	};

	return differenceObj;
}

function getNegativeDifference(difference) {
	// Calculate the absolute values of years, months, days, hours, minutes, and seconds
	const absoluteYears = Math.floor(difference / (365 * 24 * 60 * 60 * 1000));
	const absoluteMonths = Math.floor(difference / (30 * 24 * 60 * 60 * 1000));
	const absoluteDays = Math.floor(difference / (24 * 60 * 60 * 1000));
	const absoluteHours = Math.floor((difference % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
	const absoluteMinutes = Math.floor((difference % (60 * 60 * 1000)) / (60 * 1000));
	const absoluteSeconds = Math.floor((difference % (60 * 1000)) / 1000);

	// Create an object to store the results with negative values
	const differenceObj = {
		years: -absoluteYears,
		months: -absoluteMonths,
		days: -absoluteDays,
		hours: -absoluteHours,
		minutes: -absoluteMinutes,
		seconds: -absoluteSeconds,
	};

	return differenceObj;
}

function getZeroDifference() {
	// For the current date, return an object with all values as 0
	return {
		years: 0,
		months: 0,
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
	};
}

// parseTimestamp
function parseTimestamp(timestampString) 
{
    const parts = timestampString.split(' ');
    const datePart = parts[0];
    const timePart = parts[1];

    const [year, month, day] = datePart.split('-').map(Number);
    const [hours, minutes, seconds] = timePart.split(':').map(Number);

    // Create a new Date object and get the timestamp in seconds
    const timestamp = Date.UTC(year, month - 1, day, hours, minutes, seconds) / 1000;

    return timestamp;
}
function formatTimeStamp(timestamp) 
{
    const months = [
        "Jan", "Feb", "Mar", "Apr",
        "May", "Jun", "Jul", "Aug",
        "Sep", "Oct", "Nov", "Dec"
    ];

    if (typeof timestamp === 'string') {
        timestamp = new Date(timestamp);
    } else if (typeof timestamp === 'number') {
        timestamp = new Date(timestamp * 1000); // Convert seconds to milliseconds
    }

    const month = months[timestamp.getMonth()];
    const day = timestamp.getDate();
    const hour = timestamp.getHours();
    const minute = timestamp.getMinutes();
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;

    const formattedDate = `${month} ${day} at ${formattedHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
    return formattedDate;
}
// isValidURL
function isValidURL(url) 
{
	// Regular expression for a valid URL
	var urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(:\d{1,5})?(\/[^\s]*)?$/;
	
	// Test the URL against the regex
	return urlRegex.test(url);
}
// isValidYouTubeURL
function isValidYouTubeURL(url) 
{
	// Regular expression for a valid YouTube URL (video, playlist, or embed)
	var youtubeRegex = /^(https?:\/\/)?(www\.)?youtube\.com\/(watch\?v=([a-zA-Z0-9_-]+)|playlist\?list=([a-zA-Z0-9_-]+)|embed\/([a-zA-Z0-9_-]+))(&|$|\?)/;

	// Test the URL against the regex
	return youtubeRegex.test(url);
}
// extractYouTubeVideoId
function extractYouTubeVideoId(url) 
{
	// Regular expressions to match different YouTube URL formats
	var youtubeVideoRegex = /[?&]v=([a-zA-Z0-9_-]+)/;
	var youtubePlaylistRegex = /[?&]list=([a-zA-Z0-9_-]+)/;
	var youtubeEmbedRegex = /embed\/([a-zA-Z0-9_-]+)/;

	// Check if the URL matches any of the patterns
	var videoMatch = url.match(youtubeVideoRegex);
	var playlistMatch = url.match(youtubePlaylistRegex);
	var embedMatch = url.match(youtubeEmbedRegex);

	// Extract video ID based on the pattern that matched
	if (videoMatch && videoMatch[1]) {
	// Video URL
	return videoMatch[1];
	} else if (playlistMatch && playlistMatch[1]) {
	// Playlist URL
	return playlistMatch[1];
	} else if (embedMatch && embedMatch[1]) {
	// Embed URL
	return embedMatch[1];
	} else {
	// No valid ID found in the URL
	return null;
	}
}
// create youtube video url
function createYoutubeVideoURLFromId(id)
{
	return `https://www.youtube.com/watch?v=${id}`
}
function splitObjectIntoSegments(obj, numSegments) 
{
	const keys = Object.keys(obj);
	const segmentSize = Math.ceil(keys.length / numSegments);
	const segments = [];

	for (let i = 0; i < numSegments; i++) 
	{
		const startIdx = i * segmentSize;
		const endIdx = (i + 1) * segmentSize;
		const segmentKeys = keys.slice(startIdx, endIdx);
		const segment = {};

		for (const key of segmentKeys) 
		{
			segment[key] = obj[key];
		}

		segments.push(segment);
	}

	return segments;
}
// getDataAttributesAsJSON
function getDataAttributesAsJSON(element) 
{
    if (element) {
        const dataAttributes = element.dataset;
        const jsonObject = {};

        for (const key in dataAttributes) {
            if (dataAttributes.hasOwnProperty(key)) {
                jsonObject[key] = dataAttributes[key];
            }
        }

        return jsonObject;
    } else {
        console.error(`Element with id "${elementId}" not found.`);
        return null;
    }
}
// deleteDashboardSwitcherUserConfig
function deleteDashboardSwitcherUserConfig()
{
	localStorage.removeItem('DASHBOARD_SWITCHER_USER_CONFIG')
}
// saveDashboardSwitcherUserConfig
function saveDashboardSwitcherUserConfig(data)
{
	localStorage.setItem('DASHBOARD_SWITCHER_USER_CONFIG', JSON.stringify(data))
}
// dashboardSwitcherUserConfig
function dashboardSwitcherUserConfig()
{
	const user = localStorage.getItem('DASHBOARD_SWITCHER_USER_CONFIG')

	if ( !user ) return false

	return checkJSON(user)
}
// checkJSON
function checkJSON(data)
{
	try 
	{
		JSON.parse(data)
		return JSON.parse(data)
	} catch 
	{
		return data
	}
}
// checkURL
function checkURL(url) {
	const pattern = /^(https?:\/\/)?([^\s:/?#]+\.?)+(\/[^\s]*)?$/;
	return pattern.test(url);
}
// isImageExtension
function isImageExtension(extension) 
{
    const extensions = [
        'jpg',
        'jpeg',
        'png',
        'gif',
        'bmp',
        'tiff',
        'webp'
    ];

    return extensions.includes(extension.toLowerCase());
}
// file type icon
function fileTypeIcon(options)
{
	const defaultOptions = {
		extension: 'file',
		name: '',
		width: 60,
		height: 60,
		class: "width-60px height-60px img-thumbnail",
		url: ''
	}

	options = {...defaultOptions, ...options}

    if (options.extension === 'file') {
        return `<img src="../assets/img/icons/files/file.png" class="${options.class}" width="${options.width}" height="${options.height}" alt="${options.name}" title="${options.name}">`;
    } 
	else if (options.extension === 'folder') {
		return `<img src="../assets/img/icons/files/folder.png" class="${options.class}" width="${options.width}" height="${options.height}" alt="${options.name}" title="${options.name}">`;	
	}
	else if (options.extension === 'exe' || options.extension === 'msi') {
        return `<img src="../assets/img/icons/files/exe.png" class="${options.class}" width="${options.width}" height="${options.height}" alt="${options.name}" title="${options.name}">`;
    } else if (options.extension === 'css') {
        return `<img src="../assets/img/icons/files/css.png" class="${options.class}" width="${options.width}" height="${options.height}" alt="${options.name}" title="${options.name}">`;
    } else if (options.extension === 'html') {
        return `<img src="../assets/img/icons/files/html.png" class="${options.class}" width="${options.width}" height="${options.height}" alt="${options.name}" title="${options.name}">`;
    } else if (options.extension === 'java') {
        return `<img src="../assets/img/icons/files/java.png" class="${options.class}" width="${options.width}" height="${options.height}" alt="${options.name}" title="${options.name}">`;
    } else if (options.extension === 'javascript') {
        return `<img src="../assets/img/icons/files/javascript.png" class="${options.class}" width="${options.width}" height="${options.height}" alt="${options.name}" title="${options.name}">`;
    } else if (options.extension === 'php') {
        return `<img src="../assets/img/icons/files/php.png" class="${options.class}" width="${options.width}" height="${options.height}" alt="${options.name}" title="${options.name}">`;
    } else if (options.extension === 'rar') {
        return `<img src="../assets/img/icons/files/rar.png" class="${options.class}" width="${options.width}" height="${options.height}" alt="${options.name}" title="${options.name}">`;
    } else if (options.extension === 'zip') {
        return `<img src="../assets/img/icons/files/zip.png" class="${options.class}" width="${options.width}" height="${options.height}" alt="${options.name}" title="${options.name}">`;
    } else if (options.extension === 'ppt') {
        return `<img src="../assets/img/icons/files/ppt.png" class="${options.class}" width="${options.width}" height="${options.height}" alt="${options.name}" title="${options.name}">`;
    } else if (options.extension === 'pptx') {
        return `<img src="../assets/img/icons/files/pptx.png" class="${options.class}" width="${options.width}" height="${options.height}" alt="${options.name}" title="${options.name}">`;
    } else if (options.extension === 'excel') {
        return `<img src="../assets/img/icons/files/excel.png" class="${options.class}" width="${options.width}" height="${options.height}" alt="${options.name}" title="${options.name}">`;
    } else if (options.extension === 'xlsx') {
        return `<img src="../assets/img/icons/files/xlsx.png" class="${options.class}" width="${options.width}" height="${options.height}" alt="${options.name}" title="${options.name}">`;
    } else if (options.extension === 'csv') {
        return `<img src="../assets/img/icons/files/csv.png" class="${options.class}" width="${options.width}" height="${options.height}" alt="${options.name}" title="${options.name}">`;
	} else if (options.extension === 'pdf') {
        return `<img src="../assets/img/icons/files/pdf.png" class="${options.class}" width="${options.width}" height="${options.height}" alt="${options.name}" title="${options.name}">`;
    } else if (options.extension === 'image' || isImageExtension(options.extension)) {
        return `<img src="${options.url}" class="${options.class}" width="${options.width}" height="${options.height}" alt="${options.name}" title="${options.name}">`;
    } else if (
				options.extension === 'video'
				|| options.extension === 'mp4'
				|| options.extension === 'mkv'
				|| options.extension === '3gp'
				|| options.extension === 'avi'
				|| options.extension === 'mov'
				|| options.extension === 'wmv'
				|| options.extension === 'flv'
				|| options.extension === 'webm'
				|| options.extension === 'mpg'
				|| options.extension === 'mpeg'
				|| options.extension === 'm4v'
				|| options.extension === 'ts'
				|| options.extension === 'divx'
				|| options.extension === 'ogv'
				|| options.extension === 'ogg'
				|| options.extension === 'mpg4'
			) 
	{
        return `<img src="/assets/img/icons/files/video.png" width="${options.width}" height="${options.height}" alt="${options.name}" title="${options.name}">`;
    } else if (options.extension === 'audio') {
        return `<img src="/assets/img/icons/files/audio.png" width="${options.width}" height="${options.height}" alt="${options.name}" title="${options.name}">`;
    } else if (options.extension === 'pdf') {
        return `<img src="/assets/img/icons/files/pdf.png" width="${options.width}" height="${options.height}" alt="${options.name}" title="${options.name}">`;
    } else {
        return ''; // Return empty string if extension doesn't match
    }
}
// formatBytes
function formatBytes(sizeInBytes) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];

    let i = 0;
    while (sizeInBytes >= 1024 && i < units.length - 1) {
        sizeInBytes /= 1024;
        i++;
    }

    return sizeInBytes.toFixed(2) + ' ' + units[i];
}
// formatDateTime
function formatDateTime(dateTime, options = {}) {
	const createdDate = new Date(dateTime);

	const defaultOptions = {}

	options = { ...defaultOptions, ...options }

	const formattedDate = createdDate.toLocaleDateString('en-US', options);

	return formattedDate
}
// copyToClipboard
function copyToClipboard(text) {
	navigator.clipboard.writeText(text)
		.then(() => {
			// console.log('Text copied to clipboard');
		})
		.catch((err) => {
			console.error('Unable to copy to clipboard', err);
		});
}
// summarizeText
function summarizeText(text, maxLength = 135) {
	if (!text) return ''
	if (text.length <= maxLength) {
		return text;
	} else {
		// Find the last space within the maxLength
		const truncatedText = text.substring(0, maxLength);
		const lastSpaceIndex = truncatedText.lastIndexOf(' ');

		// Return the truncated text with ellipsis if necessary
		return lastSpaceIndex !== -1 ? truncatedText.substring(0, lastSpaceIndex) + '...' : truncatedText + '...';
	}
}

function padNumber(number = 0)
{
	return (number < 10) ? `0${number}` : number;
}

$(async function()
{
//
// detectScrollEnd
detectScrollEnd = (element, callback) =>
{
	element.off('scroll').on('scroll', e =>
	{
		const contentHeight = element[0].scrollHeight;
		const currentScroll = element[0].scrollTop;
		const containerHeight = element[0].clientHeight;
		
		// Check if the user has reached the bottom of the container
		const isEndOfScroll = currentScroll + containerHeight >= contentHeight

		if (isEndOfScroll) 
		{
			if ( typeof callback == 'function' )
			{
				callback({
					isEndOfScroll: isEndOfScroll
				})
			}
		}
	})
}
// previewMedicalAnalysis
previewMedicalAnalysis = async (data) =>
{
	var print_button_html = `<a href="#" id="print_medical_analysis_button">${FUI_DISPLAY_LANG.views.pages.global.print_}</a>`

	var medical_analysis_print = createFakeElement('FAKE_CONTAINER', await (getPage('../views/prints/medical-analysis-page.ejs')) )
                                        .find('.medical-analysis-print')

	var analysis_list = medical_analysis_print.find('#analysis_list')
	var centerData = data.centerData

	medical_analysis_print.css('margin-left', 'auto').css('margin-right', 'auto')
	medical_analysis_print.find('#presc_date').text(CURRENT_DATE_SLASH_DD_MM_YYYY) 
	medical_analysis_print.find('#patient_first').text( data.patient.patientName ) 
	medical_analysis_print.find('#patient_age').text( data.patient.patientAge ) 
	medical_analysis_print.find('#patient_age').text( data.patient.patientAge ) 
	medical_analysis_print.find('#center_stamp').attr('src', centerData.clinicStamp)
	medical_analysis_print.prepend(print_button_html)
	// append analysis
	var html = ''
	for (let i = 0; i < data.analysis.length; i++) 
	{
		const category = data.analysis[i];
		
		if ( !category ) continue

		html += `<div class="col-md-4" id="category_${category.id}">
					<h6 class="medical-analysis-category-name">${category.name}</h6> `
		for (let j = 0; j < category.items.length; j++) 
		{
			const item = category.items[j];
			
			html += `<p id="item_${item.id}" class="medical-analysis-name">${item.name}</p>`
		}

		html += `</div>`
	}

	analysis_list.html(html)

	var dialog = new FullpageDialog({
		title: FUI_DISPLAY_LANG.views.pages.global.preview_document,
		html: medical_analysis_print[0].outerHTML
	})

	const print_medical_analysis_button = dialog.getElement().find('#print_medical_analysis_button')

	print_medical_analysis_button.off('click').on('click', e =>
	{
		e.preventDefault()
		// data['centerData'] = centerData
		printMedicalAnalysis(data)
	})
}
// printMedicalAnalysis
printMedicalAnalysis = async (data) =>
{
	var medical_analysis_print = createFakeElement('FAKE_CONTAINER', await (getPage('../views/prints/medical-analysis-page.ejs')) )
                                        .find('.medical-analysis-print')

	var analysis_list = medical_analysis_print.find('#analysis_list')
	var centerData = data.centerData

	medical_analysis_print.find('#presc_date').text(CURRENT_DATE_SLASH_DD_MM_YYYY) 
	medical_analysis_print.find('#patient_first').text( data.patient.patientName ) 
	medical_analysis_print.find('#patient_age').text( data.patient.patientAge ) 
	medical_analysis_print.find('#patient_age').text( data.patient.patientAge ) 
	medical_analysis_print.find('#center_stamp').attr('src', centerData.clinicStamp)
	// append analysis
	var html = ''
	for (let i = 0; i < data.analysis.length; i++) 
	{
		const category = data.analysis[i];
		
		if ( !category ) continue

		html += `<div class="col-md-4" id="category_${category.id}">
					<h6 class="medical-analysis-category-name">${category.name}</h6> `
		for (let j = 0; j < category.items.length; j++) 
		{
			const item = category.items[j];
			
			html += `<p id="item_${item.id}" class="medical-analysis-name">${item.name}</p>`
		}

		html += `</div>`
	}

	analysis_list.html(html)
	
	printHTMLToPdf( medical_analysis_print[0].outerHTML, {
		width: 0,
		height: 0,
		top: 10000,
		left: 10000,
		page: {
			size: 'A4 landscape',
			margin: '-1cm 0 -4cm -1cm'
		}
	} )
}

// printPrescription
printPrescription = async (data) => 
{
	if ( data.prescriptionDirection == ST_DIRECTION_OUTSIDE )
	{
		var presc_element = createFakeElement('FAKE_CONTAINER', await (getPage('../views/prints/prescription-outside-page.ejs')) ).find('.prescription-print')
	}
	else if ( data.prescriptionDirection == ST_DIRECTION_INSIDE )
	{
		var presc_element = createFakeElement('FAKE_CONTAINER', await (getPage('../views/prints/prescription-page.ejs')) ).find('.prescription-print')
	}

	// // check if contains arabic
	// if ( containsArabic(data.patientName) )
	// {
	// 	presc_element.find('.presc-body').addClass('has-direction-rtl').removeClass('has-direction-ltr')
	// }
	// else
	// {
	// 	presc_element.find('.presc-body').addClass('has-direction-ltr').removeClass('has-direction-rtl')
	// }

	presc_element.find('#presc_date').text(CURRENT_DATE_SLASH_DD_MM_YYYY)
	presc_element.find('#patient_first').text(data.patientName)
	presc_element.find('#patient_age').text(data.patient.patientAge)
	var centerData = data.centerData
	
	if ( data.prescriptionDirection == ST_DIRECTION_OUTSIDE ) presc_element.find('#center_stamp').addClass('d-none')
	presc_element.find('#center_stamp').attr('src', centerData.clinicStamp)

	var meds_html = ''

	// $.each(data.medicines, (k,v) =>
	// {
	// 	meds_html += `<li style="font-size:10px;">
	// 					<span class="d-inline-block" style="vertical-align: middle;">${v.medName}</span>
	// 					<span class="d-inline-block" style="vertical-align: middle;">${v.medDose}</span>
	// 					<span class="d-inline-block" style="vertical-align: middle;">${v.medDuration}</span>
	// 					<span class="d-inline-block" style="vertical-align: middle;">${v.medQuantity}</span>
	// 				</li>`
	// })

	$.each(data.medicines, (k,v) =>
	{
		meds_html += `<li class="mx-auto width-330px">
						<div class="mb-2 d-inline-flex justify-content-between width-300px">
							<div>${v.medName}</div>
							<div>
								QSP ${v.medQuantity}
							</div>
						</div>
						<div class="">
							<span class="d-inline-block" style="vertical-align: middle; margin-left: 2em;">${v.medDose}</span>
						</div>
					</li>`
	})

	presc_element.find('#medicines_list').addClass('has-direction-ltr has-text-left')
	presc_element.find('#medicines_list').html(meds_html)

	printHTMLToPdf( presc_element[0].outerHTML, {
		width: 0,
		height: 0,
		top: 10000,
		left: 10000,
		page: {
			size: 'A4 landscape',
			margin: '-1cm 0 -4cm -1cm'
		}
	} )
}
// previewPrescription
previewPrescription = async (data) =>
{
	var print_button_html = `<a href="#" id="print_prescription_button">${FUI_DISPLAY_LANG.views.pages.global.print_}</a>`

	if ( data.prescriptionDirection == ST_DIRECTION_OUTSIDE )
	{
		var presc_element = createFakeElement('FAKE_CONTAINER', await (getPage('../views/prints/prescription-outside-page.ejs')) ).find('.prescription-print')
	}
	else if ( data.prescriptionDirection == ST_DIRECTION_INSIDE )
	{
		var presc_element = createFakeElement('FAKE_CONTAINER', await (getPage('../views/prints/prescription-page.ejs')) ).find('.prescription-print')
	}

	var centerData = data.centerData

	presc_element.addClass('pb-5')
	presc_element.prepend(print_button_html)
	presc_element.css('margin-left', 'auto').css('margin-right', 'auto')
	presc_element.find('#presc_date').text(CURRENT_DATE_SLASH_DD_MM_YYYY)
	presc_element.find('#patient_first').text(data.patient.patientName)
	presc_element.find('#patient_age').text(data.patient.patientAge)

	if ( data.prescriptionDirection == ST_DIRECTION_OUTSIDE ) presc_element.find('#center_stamp').addClass('d-none')

	presc_element.find('#center_stamp').attr('src', centerData.clinicStamp)

	var meds_html = ''

	$.each(data.medicines, (k,v) =>
	{
		meds_html += `<li class="mx-auto width-330px">
						<div class="mb-2 d-inline-flex justify-content-between width-300px">
							<div>${v.medName}</div>
							<div>
								QSP ${v.medQuantity}
							</div>
						</div>
						<div class="">
							<span class="d-inline-block" style="vertical-align: middle; margin-left: 2em;">${v.medDose}</span>
						</div>
					</li>`
	})

	presc_element.find('#medicines_list').addClass('has-direction-ltr has-text-left')
	presc_element.find('#medicines_list').html(meds_html)
	
	var dialog = new FullpageDialog({
		title: FUI_DISPLAY_LANG.views.pages.global.preview_document,
		html: presc_element[0]
	})

	const print_prescription_button = dialog.getElement().find('#print_prescription_button')

	print_prescription_button.off('click').on('click', e =>
	{
		e.preventDefault()
		data['centerData'] = centerData
		printPrescription(data)
	})
}
// commerceMoney
commerceMoney = (value) =>
{
	return value+' '+FUI_DISPLAY_LANG.views.pages.global.currency
}
// Open folder
openFolder = (folder_path) =>
{
	const childProcess = require('child_process')
	
	result = childProcess.exec( 'start \"\" \"'+folder_path+'\"', (err, stdout, stderr) => {} );
	return result;
}
// Open file
openFile = (filepath) =>
{
	const childProcess = require('child_process')
	
	result = childProcess.exec( '\"'+filepath+'\"', (err, stdout, stderr) => {});
	return result;
}
// render view
renderView = async (path, args = {}) =>
{
	const ejs = require('ejs')

	return await ejs.renderFile(`${DEFAULT_INI_SETTINGS.UI_Settings.MAIN_DIR_NAME}/views${path}`, args)
}
// setCursorAtEnd
setCursorAtEnd = (element) => 
{
	// element[0].focus()

	// const end = element.html().length

	// element[0].setSelectionRange(end, end)
	// console.log(end)
	// element[0].focus()

	element[0].focus()
	let sel = window.getSelection();
    sel.selectAllChildren(element[0]);
    sel.collapseToEnd();
}
  
convertPptToImage = (file, callback) =>
{
	var CloudmersiveConvertApiClient = require('cloudmersive-convert-api-client');
	var defaultClient = CloudmersiveConvertApiClient.ApiClient.instance;

	// Configure API key authorization: Apikey
	var Apikey = defaultClient.authentications['Apikey'];
	Apikey.apiKey = '480d3bcb-2d38-4ae4-b8ce-405b21e381cc';



	var apiInstance = new CloudmersiveConvertApiClient.ConvertDocumentApi();

	var inputFile = Buffer.from(fs.readFileSync(file.path).buffer); // File | Input file to perform the operation on.

	apiInstance.convertDocumentPptxToPng(inputFile, (error, data, response) =>
	{
		callback(error, data, response)
	});

}
// objectValues
objectValues = (object, delim = ' ') => 
{
	var values = ''

	for (const key in object) 
	{
		values += object[key] + delim
	}

	return
}
// detectTypingEnd
detectTypingEnd = (inputElement, callback, delay = 1000) => 
{
	let typingTimer
	$(inputElement).off('keyup keydown input');

	$(inputElement).on('keyup', function() 
	{
		clearTimeout(typingTimer);
		typingTimer = setTimeout(function() 
		{
			callback($(inputElement).val());
		}, delay);
	});

	$(inputElement).on('keydown', function() 
	{
		clearTimeout(typingTimer);
	});

	$(inputElement).on('input', function() 
	{
		clearTimeout(typingTimer);
	});
}
// formatNumberToStr
//format Number To Str
formatNumberToStr = (num) =>
{
	if ( num == 1000000 )
	{
		num = (num / 1000000).toFixed(0)+'m';
	}
	else if ( num > 1000000 )
	{
		num = (num / 1000000).toFixed(1)+'m';
	}
	else if ( num == 1000 )
	{
		num = (num / 1000).toFixed(0)+'k';
	}
	else if ( num > 1000 )
	{
		num = (num / 1000).toFixed(1)+'k';
	}

	return num;
}
//
checkContentEditableEmpty = (element) =>
	{
		divHtml = element.html();
		checkEmpty = divHtml.replace(' ', '').replace('<br>', '');
		if(checkEmpty.length == 0){
			return true
		}
		else return false;
}

// convertCoordinates
convertCoordinates = (coords, type = 'string') =>
{
	let result
	if ( type == 'string' )
	{
		result = `${coords.lat},${coords.lng}`
	}
	else if ( type == 'object' )
	{
		const [lat, lng] = coords.split(',').map(parseFloat)
		result = {lat,lng}
	}

	return result
}
// money format
moneyFormat = (amount, options = {}) =>
{
	if ( isNull(amount) ) return '0'

	if ( typeof amount == 'string' )
		amount = parseFloat(amount)
		
	const defaultOptions = {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
		locale: 'en-US',
	}

	var allOptions = {...defaultOptions, ...options}
	return amount.toLocaleString(allOptions.locale, allOptions);
}
// print receipt print
// printInvoice = async (options = {}) =>
// {
// 	const defaultOptions = {
// 		class: 'RECEIPT_7_5_CM_PRINT',
// 	}

// 	const newOptions = {...defaultOptions, ...options}

// 	var data = newOptions.data
// 	var printable_invoice = createFakeElement('FAKE_CONTAINER', await(getPage('../views/prints/center-client-invoice-page.ejs')))
// 									.find('.printable_invoice')

// 	printable_invoice.addClass(newOptions.class)
// 	printable_invoice.find('#center_name').text( data.supplier_name )
// 	printable_invoice.find('#invoice_number').text( data.order_hash )
// 	printable_invoice.find('#invoice_date').text( data.order_date )
// 	printable_invoice.find('#client_name').text( data.order_receiver_name )

// 	if ( !data.order_items ) return

// 	var html = ''
// 	var order_items_total_quantity = 0
// 	$.each(data.order_items, (k,v) =>
// 	{
// 		order_items_total_quantity+= parseInt(v.order_item_quantity)
// 		html += `<tr style="border-bottom: 1px solid #90cac6;">
// 					<td class="has-text-right py-3">
// 						<div class="mb-2">${v.item_name}</div>
// 						<div class="has-direction-ltr">
// 							${v.order_item_quantity} x ${v.order_item_price}
// 						</div>
// 					</td>
// 					<td>${v.order_item_final_amount}</td>
// 				</tr>`
// 		//
// 		printable_invoice.find('#how_to_use_products_list').append(`
// 		<li class="py-2">
// 			<div class="fs-17 fw-500">${v.item_name}: </div>
// 			<div class="mr-5">${v.item_info.productDesc}</div>
// 		</li>
// 		`)
// 	})

// 	html += `<tr>
// 				<td colspan="3" class="pt-3">
// 					<span><b>المجموع:</b> </span>
// 					<span>${moneyFormat(data.order_total_amount)}</span>
// 				</td>
// 			</tr>`

// 	printable_invoice.find('#invoice_products_table tbody').html(html)
// 	printable_invoice.find('#invoice_total_items').text(data.order_items.length)
// 	printable_invoice.find('#invoice_total_items_quantity').text(order_items_total_quantity)

// 	printHTMLToPdf( printable_invoice[0].outerHTML , {
// 		width: 0,
// 		height: 0,
// 		top: 10000,
// 		left: 10000,
// 		page: {
// 			size: '0 7.5cm',
// 			margin: '0cm'
// 		}
// 	} )
// }
printInvoice = async (options = {}) =>
{
	const defaultOptions = {
		class: '',
	}

	const newOptions = {...defaultOptions, ...options}

	var data = newOptions.data
	var printable_invoice = createFakeElement('FAKE_CONTAINER', await(getPage('../views/prints/customer-invoice-page.ejs')))
									.find('.customer-invoice-print')

	//
	if ( data.order_direction == 'CENTER_TO_CUSTOMER_SELLING_INVOICE' )
	{
		var clientData = await CUSTOMER_MODEL.show({
			id: data.user_id,
		})
	}

	printable_invoice.addClass(newOptions.class)

	printable_invoice.find('#payment_method').text( data.payment_method )

	printable_invoice.find('#client_name').text( data.order_receiver_name )
	printable_invoice.find('#client_address').text( clientData.address )
	printable_invoice.find('#client_NIF').text( clientData.NIF )
	printable_invoice.find('#client_RC').text( clientData.RC )

	if ( !data.order_items ) return

	var html = ''
	var order_items_total_quantity = 0
	var index = 1
	var TOTAL_HT_BRUT = data.order_total_amount
	var TOTAL_HT_NET = data.total_net
	var TVA = data.TVA
	var TOTAL_TTC = 0
	var WORDS_TOTAL_TTC = ''
	$.each(data.order_items, (k,v) =>
	{
		order_items_total_quantity+= parseInt(v.order_item_quantity)
		const PUHT = parseFloat(v.order_item_price) * parseFloat(v.item_info.package) * parseFloat(v.order_item_quantity) * parseFloat(v.item_info.units_in_package)
		
		// TOTAL_HT_BRUT += PUHT
		// TOTAL_HT_NET += (PUHT * data.discount) / 100
		
		html += `
		<tr>
			<td>${ padNumber(index) }</td>
			<td>${ v.item_code }</td>
			<td>${ v.item_name }</td>
			<td>${ v.order_item_quantity }</td>
			<td>${ v.item_info.units_in_package } ${ v.item_info.unit }</td>
			<td>${ moneyFormat(v.order_item_price) }</td>
			<td>${ moneyFormat(PUHT) }</td>
			<td>BB</td>
		</tr>
		`

		index++
	})

	TOTAL_TTC = TOTAL_HT_NET + TVA

	printable_invoice.find('#TOTAL_HT_BRUT').html( TOTAL_HT_BRUT )
	printable_invoice.find('#remise').html( 0 )
	printable_invoice.find('#TOTAL_HT_NET').html( TOTAL_HT_NET )
	printable_invoice.find('#TVA').html( TVA )
	printable_invoice.find('#TOTAL_TTC').html( TOTAL_TTC )

	WORDS_TOTAL_TTC = $.spellingNumber(TOTAL_TTC, {
		lang: 'fr'
	})

	printable_invoice.find('#WORDS_TOTAL_TTC').html( WORDS_TOTAL_TTC )

	printable_invoice.find('#items_table tbody').html( html )

	printHTMLToPdf( printable_invoice[0].outerHTML , {
		width: 0,
		height: 0,
		top: 10000,
		left: 10000,
		page: {
			size: 'a4',
			margin: '0cm'
		}
	} )
}
// print receipt print
printPrivateAppointmentInvoice = async (options = {}) =>
{
	const defaultOptions = {
		class: 'RECEIPT_7_5_CM_PRINT',
	}

	const newOptions = {...defaultOptions, ...options}

	var data = newOptions.data
	var printable_invoice = createFakeElement('FAKE_CONTAINER', await(getPage('../views/prints/center-client-invoice-page.ejs')))
									.find('.printable_invoice')

	printable_invoice.addClass(newOptions.class)
	printable_invoice.find('#center_name').text( data.clinicName )
	printable_invoice.find('#invoice_number').text( data.aptHash )
	printable_invoice.find('#invoice_date').text( data.aptDate )
	printable_invoice.find('#client_name').text( data.patientName )

	var html = ''
	var order_items_total_quantity = 0

	data.order_total_amount = parseFloat(data.aptPrice) * 1

	var order_items = [
		{
			order_item_quantity: 1,
			item_name: data.className,
			order_item_price: data.aptPrice,
			order_item_final_amount: parseFloat(data.aptPrice) * 1,
			item_info: {
				productDesc: data.aptNote
			}
		}
	]

	$.each(order_items, (k,v) =>
	{
		order_items_total_quantity+= parseInt(v.order_item_quantity)
		html += `<tr style="border-bottom: 1px solid #90cac6;">
					<td class="has-text-right py-3">
						<div class="mb-2">${v.item_name}</div>
						<div class="has-direction-ltr">
							${v.order_item_quantity} x ${v.order_item_price}
						</div>
					</td>
					<td>${v.order_item_final_amount}</td>
				</tr>`
		//
		printable_invoice.find('#how_to_use_products_list').append(`
		<li class="py-2">
			<div class="fs-17 fw-500">${v.item_name}: </div>
			<div class="mr-5">${v.item_info.productDesc}</div>
		</li>
		`)
	})

	html += `<tr>
				<td colspan="3" class="pt-3">
					<span><b>المجموع:</b> </span>
					<span>${moneyFormat(data.order_total_amount)}</span>
				</td>
			</tr>`

	printable_invoice.find('#invoice_products_table tbody').html(html)
	printable_invoice.find('#invoice_total_items').text(order_items.length)
	printable_invoice.find('#invoice_total_items_quantity').text(order_items_total_quantity)

	// hide how to use products wrapper
	printable_invoice.find('#how_to_use_products_wrapper').addClass('d-none')

	printHTMLToPdf( printable_invoice[0].outerHTML , {
		width: 0,
		height: 0,
		top: 10000,
		left: 10000,
		page: {
			size: '0 7.5cm',
			margin: '0cm'
		}
	} )
}
// first array element
firstArrayElement = (array) => 
{
	return array[0]
}
// last array element
lastArrayElement = (array) => 
{
	return array[array.length-1]
}
// fill form
fillForm = (formElement, options) => 
{
	// Iterate over each form field
	$(formElement).find('input, textarea, select').each(function() 
	{
		const fieldName = $(this).attr('name');

		// Check if the field name exists in the options data object
		if (fieldName && options.hasOwnProperty(fieldName)) 
		{
			const fieldValue = options[fieldName];

			// Fill the form field based on its type
			const fieldType = $(this).attr('type');
			if (fieldType === 'checkbox' || fieldType === 'radio') 
			{
				// For checkboxes and radio buttons, check the value if it matches
				$(this).prop('checked', fieldValue === $(this).val());
			} 
			else if (fieldType === 'select-multiple') 
			{
				// For multi-select fields, select options based on an array of values
				const fieldValuesArray = Array.isArray(fieldValue) ? fieldValue : [fieldValue];
				$(this).find('option').each(function() {
					$(this).prop('selected', fieldValuesArray.includes($(this).val()));
				});
			} 
			else 
			{
				// For other field types (text, textarea, select), set the value directly
				$(this).val(fieldValue);
			}
		}
	});
};
batchShowInMap = (mapElement, points) => 
{
	// Create a new map instance
	const map = new google.maps.Map(mapElement, {
		center: points[0].coordinates,
		zoom: 6,
	});

	// Add markers for each point
	points.forEach((point) => 
	{
		const marker = new google.maps.Marker({
			position: point.coordinates,
			map: map,
		});

		// Add click event listener to zoom in when clicked
		marker.addListener("click", () => 
		{
			map.setCenter(point.coordinates);
			map.setZoom(10);
		});
	});
};
  
//showInMap
showInMap = (mapElement, options = {}) => 
{
	// Default coordinates and zoom values
	const defaultOptions = {
		coordinates: { lat: 28.0339, lng: 1.6596 },
		zoom: 10,
	}

	const mapOptions = {...defaultOptions, ...options}

	// Create a new map instance
	const map = new google.maps.Map(mapElement, {
		center: mapOptions.coordinates,
		zoom: mapOptions.zoom,
	});

	// Add a marker to the map
	new google.maps.Marker({
		position: mapOptions.coordinates,
		map: map,
	});
};
  
	  
// syncImagesThread
syncImagesThread = () =>
{
	if ( !DEFAULT_INI_SETTINGS ) return
	// check if enabled
	if ( DEFAULT_INI_SETTINGS.General_Settings )
	{
		if ( DEFAULT_INI_SETTINGS.General_Settings.PATIENT_IMAGES_SYNC )
		{
			// weight images
			if ( DEFAULT_INI_SETTINGS.General_Settings.PATIENT_IMAGES_PATH != '' )
			{
				var upload_weight_images_worker = new Worker('../assets/js/workers/UploadPatientImagesWorker.js')
				upload_weight_images_worker.postMessage({
					date_time: {
						CURRENT_DATE:CURRENT_DATE,
						CURRENT_TIME:CURRENT_TIME,
					},
					USER_CONFIG: USER_CONFIG,
					DEFAULT_INI_SETTINGS: DEFAULT_INI_SETTINGS,
				})
			}
			
		}
	}
	// 
}
// formatDateTimeToDate
formatDateTimeToDate = (datetime) => 
{
	const formattedDate = date_time.format(new Date(datetime), 'YYYY-MM-DD');
	return formattedDate;
}
// imgFallback
imgPlaceholder = (placeholder = '../assets/img/utils/placeholder.jpg') => 
{
	return placeholder;
} 
// imgFallback
imgFallback = (imageUrl, fallbackUrl) => 
{
	const defaultFallbackUrl = '../assets/img/utils/placeholder.jpg';
	
	if (!imageUrl || imageUrl.trim() === '') 
	{
		if (fallbackUrl && fallbackUrl.trim() !== '') 
		{
			return fallbackUrl;
		} 
		else {
			return defaultFallbackUrl;
		}
	}
	
	return imageUrl;
}  
// escapeJsonCharacters
escapeJsonCharacters = (data) => 
{
	return JSON.stringify(data, function (key, value) 
	{
		if (typeof value === "string") 
		{
			return value.replace(/'/g, "\\'")
		}
		return value
	});
}

// Unique id
uniqid = () =>
{
	return uuid.v4();
}
// Upload files
uploadFile = (url ,file, progress, beforeUpload) =>
{
	let UPLOAD_START_TIME;

	var request = $.ajax({
	    xhr: function() 
	    {
	        var xhr = new XMLHttpRequest();
	        var lastNow = new Date().getTime();
			var lastKBytes = 0;
	        xhr.upload.addEventListener("progress", (e) =>
	        {
	            if (e.lengthComputable) 
	            {
	                var percentComplete = (e.loaded / e.total) * 100;
	                // Time Remaining
	                var seconds_elapsed = ( new Date().getTime() - UPLOAD_START_TIME ) / 1000;
	                bytes_per_second = e.loaded / seconds_elapsed;
	                //var bytes_per_second = seconds_elapsed ? e.loaded / seconds_elapsed : 0 ;
	                var timeleft = (new Date).getTime() - UPLOAD_START_TIME;
	                timeleft = e.total - e.loaded;
	                timeleft = timeleft / bytes_per_second;
	                // Upload speed
	                var Kbytes_per_second = bytes_per_second / 1024 ;
	                var transferSpeed = Math.floor(Kbytes_per_second);

	                progress(e, timeleft.toFixed(0), transferSpeed, percentComplete);
	            }
	        }, false);
	        return xhr;
	    },
	    type: 'POST',
	    contentType: false,
	    processData: false,
	    url: url,
	    data: file,
	    beforeSend: function(e)
	    {
	    	// Set start time
			UPLOAD_START_TIME = new Date().getTime();
	    	beforeUpload(e);
	    }
	});
	// Add request
	addUploadRequest(request);
	return request;
}
escapeArabic = (text) => 
{
	var result = '';
	for (var i = 0; i < text.length; i++) {
		var charCode = text.charCodeAt(i);
		if (charCode >= 0x0600 && charCode <= 0x06FF) {
			result += '\\u' + ('000' + charCode.toString(16)).slice(-4);
		} else {
			result += text[i];
		}
	}
	return result;
}

getRandomColor = () => 
{
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}

	return color;
}
// urlToFile
urlToFile = async (url, options = {}) =>
{
	const blob = await urlToBlob(url)

	return blobToFile(blob, (options.file) ? options.file.name : '')
}
// urlToBlob
urlToBlob = async (url) =>
{
	var res = await fetch(url)
	
	return await res.blob()
}
// buffer to blob
bufferToBlob = (buffer, options) =>
{
	return new Blob([buffer], options);
}
// blob to file
blobToFile = (blob, filename) =>
{
	const file = new File([blob], filename, {
		type: blob.type,
		lastModified: new Date()
	});

	return file;
}
// xlsx to json
xlsxToJson = (file_object, callback) =>
{
	var XLSX = require("xlsx");
    var mime = require('mime-types')
	var Papa = require('papaparse')

    const csv_file = APP_TMP_DIR+'/docs/csv/'+uuid.v4()+'.csv'
    
    // make dir if not exists
    if ( !fs.existsSync( path.dirname(csv_file) ) )
		fs.mkdirSync( path.dirname(csv_file) , {recursive: true});

    var data = XLSX.readFileSync(file_object.path)
    // save as csv
    XLSX.writeFileSync(data, csv_file, { bookType: "csv" })
    
    // read file as buffer 
    var buffer = fs.readFileSync(csv_file)
    // convert to blob
    // var blob = bufferToBlob(buffer, {
    //     type: mime.lookup(csv_file)
    // })
    // convert to File object
    var file = blobToFile(buffer, path.basename(csv_file))
  
    Papa.parse(file, 
	{
		download: false,
		worker: true,
		encoding: "UTF-8",
		error: (err, file, inputElem, reason) =>
		{
			console.log(err);
		},
		complete: async (response) =>
		{
			var data = response.data;
			data = data.filter( (val) => val != '' )
            callback(arrayToJson(data))
		}
	})
}
// arrayToJson
arrayToJson = (array) => 
{
	if (!array || array.length === 0) {
	  return {
		cols: [],
		rows: [],
		json: []
	  };
	}
  
	const [cols, ...rows] = array;
  
	const json = rows.map((row) => {
	  return cols.reduce((acc, col, index) => {
		acc[col] = row[index];
		return acc;
	  }, {});
	});
  
	return { cols, rows, json };
}
  
// indexDirFiles
indexDirFiles = (dir, options = {}) =>
{
	var files = fs.readdirSync(dir, options)
	var results = {
		fullpaths: [],
		names: [],
		clean_names: [],
	}

	if ( files.length == 0 ) return results

	results.fullpaths = files.map( (val) => dir+'/'+val )
	results.names = files
	results.clean_names = files.map( (val) => path.parse(val).name )
	return results
}
// close Window
closeWindow = (name) =>
{
	ipcIndexRenderer.send('close-window', {
		name: name
	});
}
// create window
createWindow = (options = null, callback = null) =>
{
	ipcIndexRenderer.send('create-window', {
		options: options
	});
	
	ipcIndexRenderer.removeAllListeners('window-created');
	ipcIndexRenderer.on('window-created', args =>
	{
		if ( typeof callback == 'function' )
		{
			callback(args)
		}
	})
	
	
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
// saveUserConfigSync
saveUserConfigSync = (json) =>
{
	var dir = path.dirname(USER_CONFIG_FILE);
	if ( !fs.existsSync(dir) )
		fs.mkdirSync(dir, {recursive: true});

	data = JSON.stringify(json);
	fs.writeFileSync(USER_CONFIG_FILE, data);
	// reload User Config
	reloadUserConfig();
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
// deleteFileSync
deleteFileSync = (file) =>
{
	if (fs.existsSync(file)) 
	{
		fs.unlinkSync(file)
  	}
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
// Page Loader
PageLoader = (visible = true) =>
{
	var PAGE_LOADER = $('#PAGE_LOADER');

	if ( visible )
		PAGE_LOADER.fadeIn(200);
	else
		PAGE_LOADER.fadeOut(200);
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
// open dev tools
openDevTools = () =>
{
	// window key press
	var winkeys = {}
	$(window).off('keydown')
	.on('keydown', e =>
	{
		winkeys[e.code] = e.type == 'keydown'
	
		if ( winkeys.ControlLeft 
			&& winkeys.ShiftLeft 
			&& winkeys.KeyI
		)
		{
			ipcIndexRenderer.send('open-dev-console', '')
			winkeys = {}
		}
	})
}
// Load ini settings
loadIniSettings = (CALLBACK) =>
{
	var fini = new IniFile(APP_TMP_DIR+'/');
	fini.read(SETTINGS_FILE).then(data =>
	{
		CALLBACK(data);
	});
}
// Load ini settings sync
loadIniSettingsSync = () =>
{
	var fini = new IniFile(APP_TMP_DIR+'/');
	DEFAULT_INI_SETTINGS = fini.readSync(SETTINGS_FILE);
	return DEFAULT_INI_SETTINGS;
}
// reload user config
reloadUserConfig = () =>
{
	var data = getUserConfig()
	USER_CONFIG = (data) ?? {}
	// sessionStorage.setItem('USER_CONFIG', JSON.stringify(USER_CONFIG))
}

// dispatched events //
// dispatchEvent
dispatchCustomEvent = (name, data = {}, element) =>
{
	const event = new CustomEvent(name, {
		detail: data
	})

	if ( !element ) document.dispatchEvent(event)
	else element.dispatchEvent(event)
}
// dispatch_onRefreshGroupPosts
dispatch_onRefreshGroupPosts = (data = {}) => 
{
	var onRefreshGroupPosts = new CustomEvent('refresh-group-posts', { 
		detail: data 
	});
	document.dispatchEvent(onRefreshGroupPosts)
}
// dispatch_onNewAjaxContentLoaded
dispatch_onNewAjaxContentLoaded = (data = {}) =>
{
	var onNewAjaxContentLoaded = new CustomEvent('new-ajax-content-loaded', { 
		detail: data 
	});
	document.dispatchEvent(onNewAjaxContentLoaded)
}


// Call Globally
loadDisplayLanguage();
//
reloadUserConfig();
// load ini settings
loadIniSettingsSync();
API_END_POINT = DEFAULT_INI_SETTINGS.Server_Settings.API_END_POINT;
PROJECT_URL = DEFAULT_INI_SETTINGS.Server_Settings.PROJECT_URL;
// dev console
openDevTools()

// console.log( getDatetimeDifference('2023-10-03 08:00:00') )
// console.log( getDatetimeDifference('2023-10-03 14:55:00') )

})