const {app, BrowserWindow, ipcMain, dialog } = require('electron');
const ejse = require('ejs-electron');
const path = require('path');
const isDev = require('electron-is-dev');
const IniFile = require(__dirname+'/assets/js/utils/IniFile.js');
const ROOTPATH = require('electron-root-path');
const fs = require('fs');
const {autoUpdater} = require('electron-updater');
const OS = require('os');
const uuid = require('uuid');

// disable http cache
app.commandLine.appendSwitch("disable-http-cache");

let loadingScreen;
let WINDOWS = [];
var UI_DISPLAY_LANG = {};
const DISPLAY_LANG_FILE = ROOTPATH.rootPath+'/locale/lang.json';
const SETTINGS_INI = OS.tmpdir()+'/'+app.getName()+'/settings.ini';

// Main Window
function CreateWindow(options = null)
{
	var width = 1400;
	var height = 800;
	var icon = 'assets/ico/main.png';
	var name = 'WIN_LOGIN';
	var webPreferences = {
		nodeIntegration: true, 
		contextIsolation: false,
		nodeIntegrationInWorker: true,
		preload: path.join(__dirname, 'preload.js')
	};
	var show = true;
	var page = 'index.ejs';
	var devtools = false;
	var maximized = true;
	if ( options )
	{
		width = (options.width) ? options.width : width;
		height = (options.height) ? options.height : height;
		icon = (options.icon) ? options.icon : icon;
		name = (options.name) ? options.name : name;
		webPreferences = (options.webPreferences) ? options.webPreferences : webPreferences;
		show = (options.show) ? options.show : show;
		page = (options.page) ? options.page : page;
		devtools = (options.devtools) ? options.devtools : devtools;
		maximized = (options.maximized) ? options.maximized : maximized;
	}
	// Create Browser Window
	var winOptions = 
	{
		width: width,
		height: height,
		icon: icon,
		name: name,
		webPreferences: webPreferences,
		show: show
	};
	win = new BrowserWindow(winOptions);
	win.name = name;
	// Load index.html
	win.loadFile(page);
	// Open dev tools
	if ( devtools )
	{
		devtools = new BrowserWindow();
		win.webContents.setDevToolsWebContents(devtools.webContents);
	    win.webContents.openDevTools({ mode: 'detach' });	
	}
	// Set Win to null
	win.on('closed', () =>
	{
		win = null;
	});
	// set maximized
	if ( maximized ) win.maximize();
	// Delete Default Context menu
	win.setMenu(null);
	// send translation object
	loadLang();
	// add window to array
	WINDOWS.push(win);

	return win;
}
// Loading Screen
function CreateLoadingScreen()
{
	// Create Browser Window
	var winOptions = 
	{
		width: 700,
		height: 500,
		icon: __dirname+'/assets/ico/main.png',
		webPreferences: { nodeIntegration: true, contextIsolation: false },
		show: true,
		resizable: false,
		frame: false
	};
	loadingScreen = new BrowserWindow(winOptions);
	// Load index.html
	loadingScreen.loadFile('loadingScreen.ejs');
	// Open dev tools
	//loadingScreen.webContents.openDevTools();
	// Set Win to null
	loadingScreen.on('closed', () =>
	{
		loadingScreen = null;
	});
	// Delete Default Context menu
	loadingScreen.setMenu(null);

	return loadingScreen;
}
// Setup auto updater
function setupAutoUpdater(win)
{
	var updatePromise = undefined;
	// Setup auto updater
	autoUpdater.on('checking-for-update', () =>
	{
		win.webContents.send('checking-for-update');
	});
	autoUpdater.on('update-available', (info) =>
	{
		win.webContents.send('update-available', info);
		win.webContents.send('update-about-to-download', updatePromise);
	});
	autoUpdater.on('update-not-available', (info) =>
	{
		win.webContents.send('update-not-available', info);
	});
	autoUpdater.on('update-downloaded', (info) =>
	{
		win.webContents.send('update-downloaded', info);
	});
	autoUpdater.on('download-progress', (progressInfo) =>
	{
		win.webContents.send('download-update-progress', progressInfo);
	});
	autoUpdater.on('error', (err) =>
	{
		win.webContents.send('update-error', err);
	});
}
// save Login Session
function saveLoginSession()
{
	var sessionId = uuid.v4();
	var loginSessionDir = OS.tmpdir()+'/CustomerProvider/login/';
	if ( !fs.existsSync(loginSessionDir) )
	{
		fs.mkdir(loginSessionDir, {recursive: true}, (err) =>
		{
			if ( err )
			{
				console.error(err);
				return;
			}

			var data = {
				session: sessionId
			};
			fs.writeFile(loginSessionDir+'session.json', JSON.stringify(data), (err) =>
			{
				if ( err )
				{
					console.error(err);
					return;
				}
			});
		});
	}
}
// Setup ini settings
function setupDefaultIniSettings()
{

	if ( !fs.existsSync( path.dirname(SETTINGS_INI) ) ) fs.mkdirSync(path.dirname(SETTINGS_INI), {recursive: true})

	var fini = new IniFile( path.dirname(SETTINGS_INI)+'/' );

	if ( fs.existsSync( SETTINGS_INI ) )
	{
		var defaultSettings = loadIniSettings()

		if ( !defaultSettings.Server_Settings.LOCAL_API_END_POINT )
		{
			// Server_Settings
			settings = defaultSettings.Server_Settings;
			settings['LOCAL_API_END_POINT'] = 'http://localhost/hsm.holoola-z.com/api/';
			settings['LOCAL_PROJECT_URL'] = 'http://localhost/hsm.holoola-z.com/';
			fini.writeSync('settings', settings, 'Server_Settings');	
		}

		if ( !defaultSettings.Server_Settings.DOCIT_API_END_POINT )
		{
			// Server_Settings
			settings = defaultSettings.Server_Settings;
			settings['DOCIT_API_END_POINT'] = 'https://docit.docteur-aoun.com/api/';
			fini.writeSync('settings', settings, 'Server_Settings');	
		}

		if ( !defaultSettings.DOCIT_USER )
		{
			// DOCIT_USER
			settings = {
				USER_ID: '',
				USER_NAME: "",
			}

			fini.writeSync('settings', settings, 'DOCIT_USER');	
		}

		if ( !defaultSettings.Server_Settings.DR_AOUN_API_END_POINT )
		{
			// Server_Settings
			settings = defaultSettings.Server_Settings;
			settings['DR_AOUN_API_END_POINT'] = 'https://docteur-aoun.com/api/';
			fini.writeSync('settings', settings, 'Server_Settings');	
		}

		if ( !defaultSettings.Server_Settings.SESSION_ID )
		{
			// Server_Settings
			settings = defaultSettings.Server_Settings;
			settings['SESSION_ID'] = uuid.v4();
			fini.writeSync('settings', settings, 'Server_Settings');	
		}

		if ( !defaultSettings.Socket_Settings )
		{
			// Socket_Settings
			settings = {
				HTTP_SERVER_URL: 'https://server-docteur-aoun.com',
				RINGING_BELL_PUSH_NOTIFICATIONS_CHANNEL: "hsm-ringing-bell-push-notifications-channel-1d8a16f60b0b204df2ae4f56040e3fd5",
				MESSAGES_PUSH_NOTIFICATIONS_CHANNEL: "hsm-messages-push-notifications-channel-2fd70323fd841328359ea37651980e2bff5cea37",
				GLOBAL_NOTIFICATIONS_PUSH_NOTIFICATIONS_CHANNEL: "hsm-global-notifications-push-notifications-channel-eab2da91cefb6313ab114851fbfd6b8505717840",
				EMPLOYEE_PRIVILEGES_PUSH_NOTIFICATIONS_CHANNEL: 'hsm-employee-privileges-push-notifications-channel-6d4e0c48fe90fdce8cdda8bc681850a8440464aa',
			}

			fini.writeSync('settings', settings, 'Socket_Settings');
		}

		if ( !defaultSettings.Socket_Settings.EMPLOYEE_PRIVILEGES_PUSH_NOTIFICATIONS_CHANNEL )
		{
			// Socket_Settings
			settings = defaultSettings.Socket_Settings;
			settings['EMPLOYEE_PRIVILEGES_PUSH_NOTIFICATIONS_CHANNEL'] = "hsm-global-notifications-push-notifications-channel-eab2da91cefb6313ab114851fbfd6b8505717840";
			fini.writeSync('settings', settings, 'Socket_Settings');	
		}

		return
	}
		
	// var fini = new IniFile( path.dirname(SETTINGS_INI)+'/' );
	// UI_Settings
	settings = {
		DISPLAY_LANG: 'ar',
		MAIN_DIR_NAME: __dirname+'/'
	};
	fini.writeSync('settings', settings, 'UI_Settings');
	// General_Settings
	settings = {
		APP_ROOT_PATH: ROOTPATH.rootPath,
	};
	fini.writeSync('settings', settings, 'General_Settings');
	// Server_Settings
	settings = {
		API_END_POINT: 'https://hsm.holoola-z.com/api/',
		PROJECT_URL: 'https://hsm.holoola-z.com/',
		LOCAL_API_END_POINT: 'http://localhost/hsm.holoola-z.com/api/',
		LOCAL_PROJECT_URL: 'http://localhost/hsm.holoola-z.com/',
		DOCIT_API_END_POINT: 'https://docit.docteur-aoun.com/api/',
		DR_AOUN_API_END_POINT: 'https://docteur-aoun.com/api/',
		SESSION_ID: uuid.v4(),
	};
	fini.writeSync('settings', settings, 'Server_Settings');
	// DOCIT_USER
	settings = {
		USER_ID: '',
		USER_NAME: "",
	}

	fini.writeSync('settings', settings, 'DOCIT_USER');	
	// Socket_Settings
	settings = {
		HTTP_SERVER_URL: 'https://server-docteur-aoun.com',
		RINGING_BELL_PUSH_NOTIFICATIONS_CHANNEL: "hsm-ringing-bell-push-notifications-channel-1d8a16f60b0b204df2ae4f56040e3fd5",
		MESSAGES_PUSH_NOTIFICATIONS_CHANNEL: "hsm-messages-push-notifications-channel-2fd70323fd841328359ea37651980e2bff5cea37",
		GLOBAL_NOTIFICATIONS_PUSH_NOTIFICATIONS_CHANNEL: "hsm-global-notifications-push-notifications-channel-eab2da91cefb6313ab114851fbfd6b8505717840",
	}

	fini.writeSync('settings', settings, 'Socket_Settings');	
}
// Read ini file
function loadIniSettings()
{
	var ini = new IniFile(path.dirname(SETTINGS_INI)+'/');
	return ini.readSync('settings');
}
// Load language
function loadLang()
{
	// Create default values in settings.ini
	setupDefaultIniSettings();
	//
	var settings = loadIniSettings();

	if ( settings )
	{
		if ( settings.UI_Settings == null )
			return;

		var lang = settings.UI_Settings.DISPLAY_LANG;
		var Translation = require(__dirname+'/assets/js/locale/'+lang);

		var trans = new Translation();
		UI_DISPLAY_LANG = trans.get();
		//UI_DISPLAY_LANG['lang'] = lang;
		// Set Lang variable object
		ejse.data('UI_DISPLAY_LANG', trans.get());
		ejse.data('SETTINGS', settings);
		// Save lang data in external file
		// Create dir if not exists
		var langDir = ROOTPATH.rootPath+'/locale/';
		if ( !fs.existsSync(langDir) )
			fs.mkdirSync(langDir, { recursive: true });

		// Create file
		if ( !fs.existsSync(langDir+'lang.json') )
			fs.writeFileSync(langDir+'lang.json', JSON.stringify(UI_DISPLAY_LANG));
		// send translation object
		//win.webContents.send('translation-file-created', UI_DISPLAY_LANG);
	}	
}
// Run CreateWindow func
app.whenReady().then(async () =>
{
	//CreateLoadingScreen().show();
	// Create ini file
	// save Login Session
	//saveLoginSession();
	//
	CreateWindow().webContents.on('did-finish-load', () => // Also 'ready-to-show'
	{
		
	})
});
// Quit when all windows closed
app.on('window-all-closed', () =>
{
	if ( process.platform !== 'darwin' )
	{
		app.quit();
	}
});
// auto updates events
ipcMain.on('quit-and-install-update', (e, arg) =>
{
	autoUpdater.quitAndInstall();
});
ipcMain.on('check-for-updates', (e, arg) =>
{
	// set auto download
	autoUpdater.autoDownload = true;
	// Check for updates
	if ( !isDev )
	{
		autoUpdater.checkForUpdates();
	}
});
ipcMain.on('check-for-updates-only', (e, arg) =>
{
	// set auto download
	autoUpdater.autoDownload = true;
	// Check for updates
	if ( !isDev )
	{
		autoUpdater.checkForUpdates();
	}
});
// Open dev tools
ipcMain.on('open-dev-console', (e, arg) =>
{
	// devtools = new BrowserWindow();
	// win.webContents.setDevToolsWebContents(devtools.webContents);
    // win.webContents.openDevTools({ mode: 'detach' });
	e.sender.openDevTools('detach')
});
// Create new window
ipcMain.on('create-window', (e, arg) =>
{
	// arg.options.devtools = true;
	let win = CreateWindow(arg.options);
	// auto updates
	setupAutoUpdater(win);
	e.sender.send('window-created', {});
});
// Close window
ipcMain.on('close-window', (e, arg) =>
{
	for (var i = 0; i < WINDOWS.length; i++) 
	{
		var win = WINDOWS[i];
		if ( win.name == arg.name )
		{
			win.destroy();
			WINDOWS.splice(i,1);
			break;
		}
	}
});
// change display language
ipcMain.on('set-locale', async (e, arg) =>
{
	var fini = new IniFile(path.dirname(SETTINGS_INI)+'/');
	// delete lang file
	if ( fs.existsSync(DISPLAY_LANG_FILE) )
		fs.unlinkSync(DISPLAY_LANG_FILE);
	// UI_Settings
	settings = {
		DISPLAY_LANG: arg,
		MAIN_DIR_NAME: __dirname+'/'
	};
	//console.log(arg);
	e.sender.send('locale-changed',  await fini.write('settings', settings, 'UI_Settings'));
})
// change general settings
ipcMain.on('set-general-settings', async (e, arg) =>
{
	var fini = new IniFile(path.dirname(SETTINGS_INI)+'/');
	// get settings
	var settings = loadIniSettings()
	// create nested dirs
	if ( !fs.existsSync(arg.PATIENT_WEIGHT_IMAGES_PATH) )	
		fs.mkdirSync(arg.PATIENT_WEIGHT_IMAGES_PATH)
	
	if ( !fs.existsSync(arg.PATIENT_MEDICAL_ANALYSIS_IMAGES_PATH) )	
		fs.mkdirSync(arg.PATIENT_MEDICAL_ANALYSIS_IMAGES_PATH)
	// General_Settings
	fini.writeSync('settings', arg, 'General_Settings')
	// refresh
	settings = loadIniSettings()
	e.sender.send('general-settings-changed', settings);
})
ipcMain.on('show-select-dir-dialog', (e, arg) =>
{
	var options = {
		properties: ['openDirectory']
	};
	dir = dialog.showOpenDialog(win, options);
	dir.then(path =>
	{
		e.sender.send('dialog-dir-selected', path);
	});
});
ipcMain.on('asynchronous-message', (e, args) =>
{
	if ( args.message == 'package.json' )
	{
		const package_json = require(__dirname+'/package.json')
		e.sender.send(args.message, package_json)
	}
});
app.on('certificate-error', (event, webContents, url, error, certificate, callback) => 
{
	// Check if the error is related to an invalid or expired certificate
	if (error === 'net::ERR_CERT_DATE_INVALID' || error === 'net::ERR_CERT_AUTHORITY_INVALID') 
	{
		// Ignore the certificate error and proceed
		event.preventDefault();
		callback(true);
	} 
	else 
	{
		// Handle other certificate errors as needed
		callback(false);
	}
});

// update settings
ipcMain.on('update-settings', async (e, arg) =>
{
	const ini = require('ini');
	var fini = new IniFile(path.dirname(SETTINGS_INI)+'/');
	// get settings
	const defaultSettings = loadIniSettings()
	
	var settings = {...defaultSettings, ...arg}

	// console.log(settings)

	fs.writeFileSync(SETTINGS_INI, ini.stringify(settings))
	// refresh
	settings = loadIniSettings()
	e.sender.send('settings-updated', settings);
})