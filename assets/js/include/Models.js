let RINGING_BELL_PUSH_NOTIFICATIONS_SOCKET_MODEL_SENDER
let MESSAGES_PUSH_NOTIFICATIONS_SOCKET_MODEL_SENDER
let GLOBAL_NOTIFICATIONS_PUSH_NOTIFICATIONS_SOCKET_MODEL_SENDER
let FUNDBOX_PUSH_NOTIFICATIONS_SOCKET_MODEL_SENDER

$(function()
{
//

// 
SocketModel = function()
{
    let SOCKET
    let CHANNEL

    const options = {
        mcast: {
            isOnMessageListenerSet: false,
        }
    }

    const { io } = require('socket.io-client')

    this.connect = (options = {}) =>
    {
        doConnect(options)

        return this
    }

    this.joinChannel = (channel = 'general') =>
    {
        doJoinChannel(channel)

        return this
    }

    this.leaveChannel = (channel = 'general') => 
    {
        doLeaveChannel(channel)

        return this
    }

    this.mcast = () =>
    {
        return {
            send: (message) => doMcastSend(message),
            onmessage: (callback) => doMcastOnMessage(callback)
        }
    }

    function doConnect(options)
    {
        const defaultOptions = {
            uri: DEFAULT_INI_SETTINGS.Socket_Settings.HTTP_SERVER_URL,
        }

        options = {...defaultOptions, ...options}

        SOCKET = io(options.uri)

        SOCKET.connect()
    }

    function doSetChannel(channel)
    {
        CHANNEL = channel
    }

    function doGetChannel()
    {
        return CHANNEL
    }

    function doJoinChannel(channel)
    {
        doSetChannel(channel)

        SOCKET.emit('join-channel', CHANNEL)
    }

    function doLeaveChannel(channel)
    {
        SOCKET.emit('leave-channel', CHANNEL)

        doSetChannel(null)
    }

    function doMcastSend(message)
    {
        SOCKET.emit('mcast:message', {
            channel: doGetChannel(),
            sender: {
                id: SOCKET.id,
            },
            data: message
        })

    }

    function doMcastOnMessage(callback)
    {
        if ( !options.mcast.isOnMessageListenerSet )
        {
            SOCKET.on('mcast:message', e => {
                callback(e)
            })

            options.mcast.isOnMessageListenerSet = true
        }
    }
}
//
GLOBAL_NOTIFICATIONS_PUSH_NOTIFICATIONS_SOCKET_MODEL_SENDER = new SocketModel()
GLOBAL_NOTIFICATIONS_PUSH_NOTIFICATIONS_SOCKET_MODEL_SENDER.connect()
.joinChannel(DEFAULT_INI_SETTINGS.Socket_Settings.GLOBAL_NOTIFICATIONS_PUSH_NOTIFICATIONS_CHANNEL)

MESSAGES_PUSH_NOTIFICATIONS_SOCKET_MODEL_SENDER = new SocketModel()
MESSAGES_PUSH_NOTIFICATIONS_SOCKET_MODEL_SENDER.connect()
.joinChannel(DEFAULT_INI_SETTINGS.Socket_Settings.MESSAGES_PUSH_NOTIFICATIONS_CHANNEL)

RINGING_BELL_PUSH_NOTIFICATIONS_SOCKET_MODEL_SENDER = new SocketModel()
RINGING_BELL_PUSH_NOTIFICATIONS_SOCKET_MODEL_SENDER.connect()
.joinChannel(DEFAULT_INI_SETTINGS.Socket_Settings.RINGING_BELL_PUSH_NOTIFICATIONS_CHANNEL)

FUNDBOX_PUSH_NOTIFICATIONS_SOCKET_MODEL_SENDER = new SocketModel()
FUNDBOX_PUSH_NOTIFICATIONS_SOCKET_MODEL_SENDER.connect()
.joinChannel(DEFAULT_INI_SETTINGS.Socket_Settings.FUNDBOX_PUSH_NOTIFICATIONS_CHANNEL)
//
CacheModel = function()
{

    this.put = (key, value, seconds = 0) => {
        doPut(key, value, seconds)
    }

    this.get = (key) => {
        return doGet(key)
    }

    this.remove = (key) => {
        doRemove(key)
    }

    this.exists = (key) =>
    {
        if ( !doGet(key) ) return false;
        
        return true
    }

    this.query = ($queryString, options = {}) =>
    {
        return doQuery($queryString, options)
    }

    function doPut(key, value, seconds = 0)
    {
        const expirationTime = new Date().getTime() + seconds * 1000;

        // Create an object to store the value along with the expiration time
        const data = {
            value: value,
            expirationTime: expirationTime,
        };

        localStorage.setItem(key, JSON.stringify(data))
    }

    function doGet(key)
    {
        // Retrieve the JSON string from localStorage
        const jsonString = localStorage.getItem(key);

        // Parse the JSON string
        const data = jsonString ? JSON.parse(jsonString) : null;
        
        if ( data && data.expirationTime == 0 ) return data.value
        
        // Check if data is not null and has not expired
        if (data && new Date().getTime() < data.expirationTime) {

            return data.value;
        } else {
            // Remove the expired data from localStorage
            doRemove(key)
            return null;
        }
    }

    function doRemove(key)
    {
        localStorage.removeItem(key)
    }

    function doQuery($queryString, options = {})
    {
        var jsonQuery = require('json-query')

        jsonQuery($queryString, options).value

        return results
    }

}

StateModel = function()
{
    this.index = () =>
    {
        return get('States/list');
    }

    this.search = (params) =>
    {
        return post('States/search', params);
    }

    this.baladia_search = (params) =>
    {
        return post('States/Baladia/search', params);
    }
}

SettingsModel = function()
{
    this.setLocale = (locale = 'ar') =>
    {
        ipcIndexRenderer.send('set-locale', locale);

        return new Promise((resolve, reject) =>
        {
            ipcIndexRenderer.removeAllListeners('locale-changed');
            ipcIndexRenderer.on('locale-changed', (e,args) =>
            {
                if( args )
                    resolve(args);
                else
                    reject(args);
            });		
        });
    }

    this.setGeneral = (options) =>
    {
        ipcIndexRenderer.send('set-general-settings', options);

        return new Promise((resolve, reject) =>
        {
            ipcIndexRenderer.removeAllListeners('general-settings-changed');
            ipcIndexRenderer.on('general-settings-changed', (e,args) =>
            {
                if( args )
                    resolve(args);
                else
                    reject(args);
            });		
        });
    }

    this.update = (params) =>
    {
        ipcIndexRenderer.send('update-settings', params);

        return new Promise((resolve, reject) =>
        {
            ipcIndexRenderer.removeAllListeners('settings-updated');
            ipcIndexRenderer.on('settings-updated', (e,args) =>
            {
                if( args )
                    resolve(args);
                else
                    reject(args);
            });		
        });
    }
}

MedicalAnalysisModel = function()
{ 
    this.show = (params) =>
    {
        return post('MedicalAnalysis/show', params);
    }
    
    this.search = (params) =>
    {
        return post('MedicalAnalysis/search', params);
    }

    this.store = (params) =>
    {
        return post('MedicalAnalysis/store', params);
    }

    this.update = (params) =>
    {
        return post('MedicalAnalysis/update', params);
    }

    this.batchDelete = (params) =>
    {
        return post('MedicalAnalysis/batchDelete', params);
    }
}

MedicalAnalysisCategoryModel = function()
{ 
    this.show = (params) =>
    {
        return post('MedicalAnalysis/Categories/show', params);
    }
    
    this.index = () =>
    {
        return get('MedicalAnalysis/Categories/index');
    }

    this.store = (params) =>
    {
        return post('MedicalAnalysis/Categories/store', params);
    }

    this.update = (params) =>
    {
        return post('MedicalAnalysis/Categories/update', params);
    }
}

TreasuryModel = function()
{
    this.store = (params) =>
    {
        var fd = new FormData();
        fd.append('TreasuryObject', JSON.stringify(params));
        if ( params.expense_file )
            fd.append('expense_file', params.expense_file);
        return postForm('Treasury/add', fd);
    }

    this.take = (params) =>
    {
        var fd = new FormData();
        fd.append('TreasuryObject', JSON.stringify(params));
        if ( params.expense_file )
            fd.append('expense_file', params.expense_file);
        return postForm('Treasury/take', fd);
    }

    this.expenses_batchDelete = (params) =>
    {
        return post('Treasury/Expenses/deleteList', {
            list: params
        });
    }

    this.expenses_filterBetweenDates = (params) =>
    {
        return post('Treasury/Expenses/filterBetweenDates', {
            TreasuryObject: params
        });
    }

    this.expenses_filterByDate = (params) =>
    {
        return post('Treasury/Expenses/filterByDate', {
            TreasuryObject: params
        });
    }
}

ClinicModel = function()
{
    this.search = (query) =>
    {
        return post('Clinics/search', {
            query: query
        });
    }

    this.advancedSearch = (params) =>
    {
        return post('Clinics/advancedSearch', params);
    }

    this.transferPatients = (params) =>
    {
        return post('Clinics/transferPatients', params);
    }

    this.show = (id) =>
    {
        var params = {
            clinicId: id
        }
        return post('Clinics/info', params);
    }

    this.store = (params) =>
    {
        params = {
            ClinicObject: params
        }
        return post('Clinics/add', params);
    }

    this.update = (params) =>
    {
        params = {
            ClinicObject: params
        }
        return post('Clinics/update', params);
    }

    this.batchDelete = (list) =>
    {
        var params = {
            list: list
        }
        return post('Clinics/deleteList', params);
    }

    this.dept_action_search = (params) => 
    {
        return post('Clinics/Depts/Actions/search', params)
    }

    this.dept_action_batchDelete = (params) => 
    {
        return post('Clinics/Depts/Actions/batchDelete', params)
    }

    this.dept_pay = (params) => 
    {
        return post('Clinics/Depts/pay', params)
    }

    // External (Dr.Aoun)
    this.external_dr_aoun_show = (params) =>
    {
        return post('Clinics/External/DR_AOUN/show', params);
    }

    this.external_dr_aoun__search = (query) =>
    {
        return post('Clinics/search', {
            query
        }, {
            API_END_POINT: DEFAULT_INI_SETTINGS.Server_Settings.DR_AOUN_API_END_POINT
        });
    }

    this.external_dr_aoun_dept_pay = (params) =>
    {
        return post('Clinics/External/DR_AOUN/Depts/pay', params);
    }

    this.external_dr_aoun_depts_action_search = (params) =>
    {
        return post('Clinics/External/DR_AOUN/Depts/Actions/search', params);
    }

    this.external_dr_aoun_depts_action_batchDelete = (params) =>
    {
        return post('Clinics/External/DR_AOUN/Depts/Actions/batchDelete', params);
    }

    //
    this.inventory_confirmation_employees_batchStore = (params) =>
    {
        return post('Clinics/Inventory/Confirmations/Employees/batchStore', params);
    }

    this.inventory_confirmation_employees_batchDelete = (params) =>
    {
        return post('Clinics/Inventory/Confirmations/Employees/batchDelete', params);
    }

    this.inventory_confirmation_employees_search = (params) =>
    {
        return post('Clinics/Inventory/Confirmations/Employees/search', params);
    }
}

EmployeeModel = function()
{
    this.logout = async () => {

        try {
            await post('Employees/Types/Permissions/clearCache', {})
        } catch (error) {
            console.log(error)
        }
        
        deleteFileSync(APP_TMP_DIR + '/' + SETTINGS_FILE + '.ini')
        
        deleteFileSync(USER_CONFIG_FILE);	

        createWindow('WIN_LOGIN', {
            page: 'index.ejs',
            name: 'WIN_LOGIN'
        });
        // close current window
        closeWindow('WIN_'+USER_CONFIG.LOGIN_TYPE);
        
    }

    this.advancedSearch = (params) =>
    {
        return post('Employees/advancedSearch', params);
    }

    this.types_index = (query = '') =>
    {
        return post('Employees/Types/index', {
            employee_type_target_center: query
        });
    }

    this.type_local_search = (params) =>
    {
        return post('Employees/Types/local_search', params);
    }

    this.type_permission_setBatch = (params) =>
    {
        return post('Employees/Types/Permissions/setBatch', params);
    }

    this.type_permission_index = (params) =>
    {
        return post('Employees/Types/Permissions/index', params);
    }

    this.type_permission_clearCache = (params = {}) =>
    {
        return post('Employees/Types/Permissions/clearCache', params);
    }

    this.type_permission_self = () =>
    {
        var params = {
            administration_id: USER_CONFIG.administration_id,
            employee_type_id: USER_CONFIG.employee_type_id
        }
        return post('Employees/Types/Permissions/index', params);
    }

    this.type_store = (params) =>
    {
        return post('Employees/Types/store', params);
    }

    this.type_update = (params) =>
    {
        return post('Employees/Types/update', params);
    }

    this.type_search = (params) =>
    {
        return post('Employees/Types/search', params);
    }

    this.type_advancedSearch = (params) =>
    {
        return post('Employees/Types/advancedSearch', params);
    }

    this.type_batchDelete = (params) =>
    {
        return post('Employees/Types/batchDelete', params);
    }

    this.type_show = (params) =>
    {
        return post('Employees/Types/show', params);
    }

    this.searchLocal = (params) =>
    {
        return post('Employees/searchLocal', {
            SearchObject: params
        });
    }

    this.local_search = (params) =>
    {
        return post('Employees/local_search', params);
    }

    this.search = (params) =>
    {
        return post('Employees/search', params);
    }

    this.local_filterByType = (params) =>
    {
        return post('Employees/local_filterByType', params);
    }

    this.administration_attendance_search = (params) =>
    {
        params = {
            SearchObject: params
        }

        return post('Employees/Attendance/Administration/search', params);
    }

    this.show = (employee_id, employee_phone = '') =>
    {
        var params = {
            employee_id: employee_id,
            employee_phone: employee_phone
        }
        return post('Employees/info', params);
    }

    this.attendance_set = (params) =>
    {
        params = {
            EmployeeObject: params
        }

        return post('Employees/Attendance/set', params);
    }

    this.batchDelete = (list) =>
    {
        var params = {
            list: list
        }

        return post('Employees/deleteList', params);
    }

    this.update = (params) =>
    {
        params = {
            EmployeeObject: params
        }

        return post('Employees/update', params);
    }

    this.store = (params) =>
    {
        params = {
            EmployeeObject: params
        }

        return post('Employees/add', params);
    }

    this.distributor_dept_action_search = (params) => 
    {
        return post('Employees/Distributor/Depts/Actions/search', params)
    }

    this.distributor_dept_action_batchDelete = (params) => 
    {
        return post('Employees/Distributor/Depts/Actions/batchDelete', params)
    }

    this.distributor_dept_pay = (params) => 
    {
        return post('Employees/Distributor/Depts/pay', params)
    }

    this.distributor_client_show = (params) =>
    {
        return post('Employees/Distributor/Clients/show', params);
    }

    this.distributor_client_local_search = (params) =>
    {
        return post('Employees/Distributor/Clients/local_search', params);
    }

    this.distributor_client_search = (params) =>
    {
        return post('Employees/Distributor/Clients/search', params);
    }

    this.distributor_client_filter = (params) =>
    {
        return post('Employees/Distributor/Clients/filter', params);
    }

    this.distributor_client_batchDelete = (params) =>
    {
        return post('Employees/Distributor/Clients/batchDelete', params);
    }

    this.distributor_client_store = (params) =>
    {
        return post('Employees/Distributor/Clients/store', params);
    }

    this.distributor_client_update = (params) =>
    {
        return post('Employees/Distributor/Clients/update', params);
    }

    this.distributor_client_dept_action_local_search = (params) =>
    {
        return post('Employees/Distributor/Clients/Depts/Actions/local_search', params);
    }

    this.distributor_client_dept_action_batchDelete = (params) =>
    {
        return post('Employees/Distributor/Clients/Depts/Actions/batchDelete', params);
    }

    this.distributor_client_dept_pay = (params) => 
    {
        return post('Employees/Distributor/Clients/Depts/pay', params)
    }

    this.employee_group_for_messaging_batchStore = (params) => 
    {
        return post('Employees/GroupForMessaging/batchStore', params)
    }

    this.employee_group_for_messaging_update = (params) => 
    {
        return post('Employees/GroupForMessaging/update', params)
    }

    this.employee_group_for_messaging_show = (params) => 
    {
        return post('Employees/GroupForMessaging/show', params)
    }

    this.employee_group_for_messaging_showByEmployeeId = (params) => 
    {
        return post('Employees/GroupForMessaging/showByEmployeeId', params)
    }

    this.employee_group_for_messaging_search = (params) => 
    {
        return post('Employees/GroupForMessaging/search', params)
    }

}

EmployeeActionModel = function()
{

    this.search = (params) =>
    {
        return post('EmployeeActions/search', params);
    }

    this.filterLocal = (params) =>
    {
        return post('EmployeeActions/filterLocal', params);
    }

    this.batchDelete = (params) =>
    {
        return post('EmployeeActions/batchDelete', params);
    }

}

RingingBellModel = function()
{

    this.store = (params) =>
    {
        return post('RingingBells/store', params);
    }

    this.last_today = (params) =>
    {
        return post('RingingBells/last_today', params);
    }

    this.notify = (params) =>
    {
        // const url = DEFAULT_INI_SETTINGS.Socket_Settings.RINGING_BELL_PUSH_NOTIFICATIONS_URL

        // fetch(url, { method: 'POST', body: JSON.stringify(params) })
        RINGING_BELL_PUSH_NOTIFICATIONS_SOCKET_MODEL_SENDER.mcast().send(params)
    }

}

PrescriptionModel = function()
{

    this.patient_local_search = (params) =>
    {
        return post('Prescriptions/Patients/local_search', params)
    }

    this.center_local_search = (params) =>
    {
        return post('Prescriptions/Centers/local_search', params)
    }

    this.center_not_in_orders_local_search = (params) =>
    {
        return post('Prescriptions/Centers/NotInOrders/local_search', params)
    }

    this.center_in_orders_local_search = (params) =>
    {
        return post('Prescriptions/Centers/InOrders/local_search', params)
    }

    this.show = (params) =>
    {
        return post('Prescriptions/info', {
            prescriptionId: params
        });
    }

    this.update = (params) =>
    {
        return post('Prescriptions/update', {
            PrescObject: params
        });
    }

    this.store = (params) =>
    {
        return post('Prescriptions/add', {
            PrescObject: params
        });
    }

    this.batchDelete = (params) =>
    {
        return post('Prescriptions/deleteList', {
            PrescObject: params
        });
    }

    this.product_store = (params) =>
    {
        return post('Prescriptions/Products/store', params);
    }

    this.product_update = (params) =>
    {
        return post('Prescriptions/Products/update', params);
    }

    this.product_batchDelete = (params) =>
    {
        return post('Prescriptions/Products/batchDelete', params);
    }

    this.product_search = (params) =>
    {
        return post('Prescriptions/Products/search', params);
    }

    this.product_show = (params) =>
    {
        return post('Prescriptions/Products/show', params);
    }

}

PatientModel = function()
{
    this.batchStore = (params) =>
    {
        return post('Patients/batchStore', params);
    }

    this.store = (params) =>
    {
        return post('Patients/add', {
            PatientObject:params
        });
    }

    this.update = (params) =>
    {
        return post('Patients/update', {
            PatientObject:params
        });
    }

    this.batchUpdateWilayaBaladia = (params) =>
    {
        return post('Patients/batchUpdateWilayaBaladia', params);
    }

    this.show = (params) =>
    {
        return post('Patients/info', {
            patientId:params
        });
    }

    this.search = (query) =>
    {
        return post('Patients/search', {
            query:query
        });
    }

    this.advancedSearch = (params) =>
    {
        return post('Patients/advancedSearch', params);
    }

    this.searchLocal = (params) =>
    {
        return post('Patients/searchLocal', {
            SearchObject:params
        });
    }

    this.local_filter = (params) =>
    {
        return post('Patients/local_filter', params);
    }

    this.hasChronicDisease_local_search = (params) =>
    {
        return post('Patients/hasChronicDisease_local_search', {
            SearchObject:params
        });
    }

    this.hasApt_local_search = (params) =>
    {
        return post('Patients/hasApt_local_search', {
            SearchObject:params
        });
    }

    this.batchDelete = (params) =>
    {
        return post('Patients/deleteList', {
            list:params
        });
    }

    this.setStatus = (params) =>
    {
        return post('Patients/setStatus', params);
    }

    this.changedSettings = (params) =>
    {
        var advancedSearch = {
            advanced: {
                orderBy: 'id',
                order: 'desc'
            }
        }

        params = {...advancedSearch, ...params}

        return post('Patients/listChangedSettings', {
            SearchObject:params
        });
    }

    this.deleteChangedSetting = (params) =>
    {
        return post('Patients/deleteChangedSetting', {
            PatientObject:params
        });
    }

    this.storeChangedSetting = (params, callback) =>
    {
        var fd = new FormData();

        fd.append('PatientObject', JSON.stringify(params));
        if ( params.patient_doc )
            fd.append('patient_doc', params.patient_doc);

        return postFormWithProgress('Patients/addChangedSettings', fd, callback);
    }

    this.medicalTest_store = (params, images, callback) =>
    {
        var fd = new FormData;

        fd.append('PatientObject', JSON.stringify(params));
        //console.log(images);
        for (let i = 0; i < images.length; i++)
        {
            var image = images[i];
            fd.append('images[]', image);
        }

        return postFormWithProgress('Patients/MedicalTests/store', fd, callback);
    }

    this.medicalTest_index = (id) =>
    {
        var params = {
            patientId: id
        }

        return post('Patients/MedicalTests/index', params);
    }

    this.medicalTest_delete = (id) =>
    {
        var params = {
            id: id
        }

        return post('Patients/MedicalTests/delete', params);
    }

    this.album_index = (id) =>
    {
        var params = {
            patientId: id
        }

        return post('Patients/Albums/index', params);
    }

    this.album_store = (params, images, callback) =>
    {
        var fd = new FormData;

        fd.append('PatientObject', JSON.stringify(params));
        //console.log(images);
        for (let i = 0; i < images.length; i++)
        {
            var image = images[i];
            fd.append('images[]', image);
        }

        return postFormWithProgress('Patients/Albums/store', fd, callback);
    }

    this.album_delete = (id) =>
    {
        var params = {
            id: id
        }

        return post('Patients/Albums/delete', params);
    }

    this.dept_set = (params) =>
    {
        params = {
            PatientObject: params
        }

        return post('Patients/Depts/set', params);
    }

    this.dept_action_local_search = (params) => 
    {
        return post('Patients/Depts/Actions/search', params)
    }

    this.dept_action_batchDelete = (params) => 
    {
        return post('Patients/Depts/Actions/batchDelete', params)
    }

    this.dept_pay = (params) => 
    {
        return post('Patients/Depts/pay', params)
    }

    this.partial_body_analysis_store = (params, callback) =>
    {
        return postFormWithProgress('Patients/PartialBodyAnalysis/store', params, callback);
    }

    this.partial_body_analysis_search = (params) =>
    {
        return post('Patients/PartialBodyAnalysis/search', params);
    }

    this.partial_body_analysis_batchDelete = (params) =>
    {
        return post('Patients/PartialBodyAnalysis/batchDelete', params);
    }

    this.partial_body_analysis_show = (params) =>
    {
        return post('Patients/PartialBodyAnalysis/show', params);
    }

    this.report_store = (params) =>
    {
        return postForm('Patients/Reports/store', params);
    }

    this.report_update = (params) =>
    {
        return postForm('Patients/Reports/update', params);
    }

    this.report_search = (params) =>
    {
        return post('Patients/Reports/search', params);
    }

    this.report_batchDelete = (params) =>
    {
        return post('Patients/Reports/batchDelete', params);
    }
   
    this.report_show = (params) =>
    {
        return post('Patients/Reports/show', params);
    }

    this.pelvic_circumference_store = (params, callback) =>
    {
        return postFormWithProgress('Patients/PelvicCircumferences/store', params, callback);
    }

    this.pelvic_circumference_search = (params) =>
    {
        return post('Patients/PelvicCircumferences/search', params);
    }

    this.pelvic_circumference_batchDelete = (params) =>
    {
        return post('Patients/PelvicCircumferences/batchDelete', params);
    }

    this.pelvic_circumference_show = (params) =>
    {
        return post('Patients/PelvicCircumferences/show', params);
    }

    this.arm_circumference_store = (params, callback) =>
    {
        return postFormWithProgress('Patients/ArmCircumferences/store', params, callback);
    }

    this.arm_circumference_search = (params) =>
    {
        return post('Patients/ArmCircumferences/search', params);
    }

    this.arm_circumference_batchDelete = (params) =>
    {
        return post('Patients/ArmCircumferences/batchDelete', params);
    }

    this.arm_circumference_show = (params) =>
    {
        return post('Patients/ArmCircumferences/show', params);
    }

    this.blood_pressure_store = (params, callback) =>
    {
        return postFormWithProgress('Patients/BloodPressures/store', params, callback);
    }

    this.blood_pressure_search = (params) =>
    {
        return post('Patients/BloodPressures/search', params);
    }

    this.blood_pressure_batchDelete = (params) =>
    {
        return post('Patients/BloodPressures/batchDelete', params);
    }

    this.blood_pressure_show = (params) =>
    {
        return post('Patients/BloodPressures/show', params);
    }

    this.chest_circumference_store = (params, callback) =>
    {
        return postFormWithProgress('Patients/ChestCircumferences/store', params, callback);
    }

    this.chest_circumference_search = (params) =>
    {
        return post('Patients/ChestCircumferences/search', params);
    }

    this.chest_circumference_batchDelete = (params) =>
    {
        return post('Patients/ChestCircumferences/batchDelete', params);
    }

    this.chest_circumference_show = (params) =>
    {
        return post('Patients/ChestCircumferences/show', params);
    }

    this.crp_store = (params, callback) =>
    {
        return postFormWithProgress('Patients/CRP/store', params, callback);
    }

    this.crp_search = (params) =>
    {
        return post('Patients/CRP/search', params);
    }

    this.crp_batchDelete = (params) =>
    {
        return post('Patients/CRP/batchDelete', params);
    }

    this.crp_show = (params) =>
    {
        return post('Patients/CRP/show', params);
    }

    this.diabete_store = (params, callback) =>
    {
        return postFormWithProgress('Patients/Diabetes/store', params, callback);
    }

    this.diabete_search = (params) =>
    {
        return post('Patients/Diabetes/search', params);
    }

    this.diabete_batchDelete = (params) =>
    {
        return post('Patients/Diabetes/batchDelete', params);
    }

    this.diabete_show = (params) =>
    {
        return post('Patients/Diabetes/show', params);
    }

    this.followup_image_result_store = (params, callback) =>
    {
        return postFormWithProgress('Patients/FollowupImageResults/store', params, callback);
    }

    this.followup_image_result_search = (params) =>
    {
        return post('Patients/FollowupImageResults/search', params);
    }

    this.followup_image_result_batchDelete = (params) =>
    {
        return post('Patients/FollowupImageResults/batchDelete', params);
    }

    this.followup_image_result_show = (params) =>
    {
        return post('Patients/FollowupImageResults/show', params);
    }

    this.hba1c_store = (params, callback) =>
    {
        return postFormWithProgress('Patients/HBA1C/store', params, callback);
    }

    this.hba1c_search = (params) =>
    {
        return post('Patients/HBA1C/search', params);
    }

    this.hba1c_batchDelete = (params) =>
    {
        return post('Patients/HBA1C/batchDelete', params);
    }

    this.hba1c_show = (params) =>
    {
        return post('Patients/HBA1C/show', params);
    }

    this.insulin_store = (params, callback) =>
    {
        return postFormWithProgress('Patients/Insulins/store', params, callback);
    }

    this.insulin_search = (params) =>
    {
        return post('Patients/Insulins/search', params);
    }

    this.insulin_batchDelete = (params) =>
    {
        return post('Patients/Insulins/batchDelete', params);
    }

    this.insulin_show = (params) =>
    {
        return post('Patients/Insulins/show', params);
    }

    this.medical_analysis_result_store = (params, callback) =>
    {
        return postFormWithProgress('Patients/MedicalAnalysisResults/store', params, callback);
    }

    this.medical_analysis_result_search = (params) =>
    {
        return post('Patients/MedicalAnalysisResults/search', params);
    }

    this.medical_analysis_result_batchDelete = (params) =>
    {
        return post('Patients/MedicalAnalysisResults/batchDelete', params);
    }

    this.medical_analysis_result_show = (params) =>
    {
        return post('Patients/MedicalAnalysisResults/show', params);
    }

    this.tsh_store = (params, callback) =>
    {
        return postFormWithProgress('Patients/TSH/store', params, callback);
    }

    this.tsh_search = (params) =>
    {
        return post('Patients/TSH/search', params);
    }

    this.tsh_batchDelete = (params) =>
    {
        return post('Patients/TSH/batchDelete', params);
    }

    this.tsh_show = (params) =>
    {
        return post('Patients/TSH/show', params);
    }

    this.vs_store = (params, callback) =>
    {
        return postFormWithProgress('Patients/VS/store', params, callback);
    }

    this.vs_search = (params) =>
    {
        return post('Patients/VS/search', params);
    }

    this.vs_batchDelete = (params) =>
    {
        return post('Patients/VS/batchDelete', params);
    }

    this.vs_show = (params) =>
    {
        return post('Patients/VS/show', params);
    }

    this.weight_store = (params, callback) =>
    {
        return postFormWithProgress('Patients/Weights/store', params, callback);
    }

    this.weight_search = (params) =>
    {
        return post('Patients/Weights/search', params);
    }

    this.weight_show = (params) =>
    {
        return post('Patients/Weights/show', params);
    }

    this.weight_batchDelete = (params) =>
    {
        return post('Patients/Weights/batchDelete', params);
    }

    this.point_action_store = (params) =>
    {
        return post('Patients/Points/Actions/store', params);
    }

    this.point_action_search = (params) =>
    {
        return post('Patients/Points/Actions/search', params);
    }

    this.point_action_show = (params) =>
    {
        return post('Patients/Points/Actions/show', params);
    }

    this.point_action_batchDelete = (params) =>
    {
        return post('Patients/Points/Actions/batchDelete', params);
    }

    this.point_setting_store = (params) =>
    {
        return post('Patients/Points/Settings/store', params);
    }

    this.point_setting_show = (params) =>
    {
        return post('Patients/Points/Settings/show', params);
    }

    this.appointment_pack_action_store = (params) =>
    {
        return post('Patients/AppointmentPacks/Actions/store', params);
    }

    this.appointment_pack_action_search = (params) =>
    {
        return post('Patients/AppointmentPacks/Actions/search', params);
    }

    this.appointment_pack_action_batchDelete = (params) =>
    {
        return post('Patients/AppointmentPacks/Actions/batchDelete', params);
    }

    this.appointment_pack_action_show = (params) =>
    {
        return post('Patients/AppointmentPacks/Actions/show', params);
    }

    this.appointment_pack_store = (params) =>
    {
        return post('Patients/AppointmentPacks/store', params);
    }

    this.appointment_pack_show = (params) =>
    {
        return post('Patients/AppointmentPacks/show', params);
    }
}

PatientStatModel = function()
{

    this.index_chart = (params) =>
    {
        return post('Patients/Stats/index_chart', params);
    }

    this.byCenter_chart = (params) =>
    {
        return post('Patients/Stats/byCenter_chart', params);
    }

    this.byState_chart = (params) =>
    {
        return post('Patients/Stats/byState_chart', params);
    }

}

PatientMedicalAnalysisModel = function()
{
    this.store = (params) =>
    {
        return post('PatientMedicalAnalysis/store', params);
    }

    this.update = (params) =>
    {
        return post('PatientMedicalAnalysis/update', params);
    }

    this.show = (params) =>
    {
        return post('PatientMedicalAnalysis/show', params);
    }

    this.batchDelete = (params) =>
    {
        return post('PatientMedicalAnalysis/batchDelete', params);
    }

    this.searchLocal = (params) =>
    {
        return post('PatientMedicalAnalysis/searchLocal', params);
    }

    this.search = (params) =>
    {
        return post('PatientMedicalAnalysis/search', params);
    }
   
}

CertificateModel = function()
{

    this.searchLocal = (params) =>
    {
        return post('Certificates/searchLocal', params)
    }

    this.show = (params) =>
    {
        return post('Certificates/show', params);
    }

    this.update = (params) =>
    {
        return post('Certificates/update', params);
    }

    this.store = (params) =>
    {
        return post('Certificates/store', params);
    }

    this.batchDelete = (params) =>
    {
        return post('Certificates/batchDelete', params);
    }

}

HealthyKitchenPostModel = function()
{ 
    this.show = (params) =>
    {
        return post('LandingPage/HealthyKitchenPosts/show', params);
    }
    
    this.search = (params) =>
    {
        return post('LandingPage/HealthyKitchenPosts/search', params);
    }

    this.store = (params, progress) =>
    {
        return postFormWithProgress('LandingPage/HealthyKitchenPosts/store', params, progress);
    }

    this.update = (params, progress) =>
    {
        return postFormWithProgress('LandingPage/HealthyKitchenPosts/update', params, progress);
    }

    this.batchDelete = (params) =>
    {
        return post('LandingPage/HealthyKitchenPosts/batchDelete', params);
    }
}

TreatmentClassModel = function()
{ 
    this.local_index = (params) =>
    {
        return post('TreatmentClasses/listLocal', params);
    }

    this.index = () =>
    {
        return post('TreatmentClasses/listAll', {});
    }

    this.show = (id) =>
    {
        var params = {
            classId: id
        }
        return post('TreatmentClasses/info', params);
    }
    
    this.search = (params) =>
    {
        return post('TreatmentClasses/search', params);
    }

    this.searchLocal = (params) =>
    {
        return post('TreatmentClasses/searchLocal', params);
    }

    this.store = (params) =>
    {
        params = {
            ClassObject: params
        }
        return post('TreatmentClasses/add', params);
    }

    this.update = (params) =>
    {
        params = {
            ClassObject: params
        }
        return post('TreatmentClasses/update', params);
    }

    this.batchDelete = (list) =>
    {
        var params = {
            list: list
        }
        return post('TreatmentClasses/batchDelete', params);
    }

    this.setBatchForCenter = (params) =>
    {
        params = {
            ClassObject: params
        }
        return post('TreatmentClasses/setBatchForCenter', params);
    }
}

AppointmentModel = function()
{ 
    this.online_followup_store = (params) =>
    {
        return post('Appointements/OnlineFollowups/store', params);
    }

    this.online_followup_setPaid = (params) =>
    {
        return post('Appointements/OnlineFollowups/setPaid', params);
    }

    this.online_followup_setAccepted = (params) =>
    {
        return post('Appointements/OnlineFollowups/setAccepted', params);
    }

    this.online_followup_setAttendance = (params) =>
    {
        return post('Appointements/OnlineFollowups/setAttendance', params);
    }

    this.online_followup_setZoomLink = (params) =>
    {
        return post('Appointements/OnlineFollowups/setZoomLink', params);
    }

    this.setZoomLink = (params) =>
    {
        return post('Appointements/setZoomLink', params);
    }

    this.specialCase_args_index = () =>
    {
        return post('Appointements/SpecialCases/Args/index', {});
    }

    this.specialCase_args_search = (params) =>
    {
        return post('Appointements/SpecialCases/Args/search', params);
    }

    this.specialCase_search = (params) =>
    {
        return post('Appointements/SpecialCases/search', params);
    }

    this.specialCase_filter = (params) =>
    {
        return post('Appointements/SpecialCases/filter', params);
    }

    this.specialCase_batchDelete = (params) =>
    {
        return post('Appointements/SpecialCases/batchDelete', params);
    }

    this.specialCase_store = (params) =>
    {
        params['employee_id'] = USER_CONFIG.employee_id;
        
        return post('Appointements/SpecialCases/store', params);
    }

    this.specialCase_batchStore = (params) =>
    {
        params['employee_id'] = USER_CONFIG.employee_id;
        
        return post('Appointements/SpecialCases/batchStore', params);
    }

    this.show = (params) =>
    {
        return post('Appointements/info', params);
    }
    
    this.search = (params) =>
    {
        return post('Appointements/search', params);
    }

    this.private_batchReStore = (params) =>
    {
        return post('Appointements/Private/batchReStore', params);
    }

    this.batchStore = (params) =>
    {
        return post('Appointements/Private/batchStore', params);
    }

    this.store = (params) =>
    {
        params['employee_id'] = USER_CONFIG.employee_id;
        var data = {
            AppointementObject: params
        }

        return post('Appointements/add', data);
    }

    this.update = (params) =>
    {
        params['employee_id'] = USER_CONFIG.employee_id;
        var data = {
            AppointementObject: params
        }

        return post('Appointements/update', data);
    }

    this.batchDelete = (list) =>
    {
        var params = {
            employee_id: USER_CONFIG.employee_id,
            list: list
        }
        return post('Appointements/deleteList', params);
    }

    this.private_setPaid = (params) =>
    {
        params = {
            AppointementObject: params
        }

        return post('Appointements/Private/setPaid', params);
    }

    this.private_setAttendance = (params) =>
    {
        params = {
            AppointementObject: params
        }

        return post('Appointements/Private/setAttendance', params);
    }

    this.private_setTreated = (params) =>
    {
        params = {
            AppointementObject: params
        }

        return post('Appointements/Private/setTreated', params);
    }

    this.private_setAccepted = (params) =>
    {
        params = {
            AppointementObject: params
        }

        return post('Appointements/Private/setAccepted', params);
    }

    this.private_local_filterByDate = (params) =>
    {
        params = {
            SearchObject: params
        }

        return post('Appointements/Private/local_filterByDate', params);
    }

    this.private_local_filterByClass = (params) =>
    {
        return post('Appointements/Private/local_filterByClass', params);
    }

    this.private_local_search = (params) =>
    {
        params = {
            SearchObject: params
        }

        return post('Appointements/Private/local_search', params);
    }

    this.private_searchLocal = (params) =>
    {
        params = {
            SearchObject: params
        }

        return post('Appointements/Private/searchLocal', params);
    }

    this.private_patient_search = (params) =>
    {
        return post('Appointements/Private/Patients/search', params);
    }

    this.private_archive_search = (params) =>
    {
        return post('Appointements/Private/Archives/search', params);
    }

    this.private_blacklist_search = (params) =>
    {
        return post('Appointements/Private/BlackLists/search', params);
    }

    this.followup_local_search = (params) =>
    {
        return post('Appointements/FollowUps/local_search', params);
    }

    this.followup_setPatientAttendance = (params) =>
    {
        params = {
            SearchObject: params
        }

        return post('Appointements/FollowUps/setPatientAttendance', params);
    }

    this.followup_sessions_index = (aptId) =>
    {
        var params = {
            aptId: aptId
        }

        return post('Appointements/FollowUps/Sessions/index', params);
    }

    this.followup_sessions_patients = (session_id) =>
    {
        var params = {
            session_id: session_id
        }

        return post('Appointements/FollowUps/Sessions/Patients/index', params);
    }

    this.followup_update = (params) =>
    {
        params['employee_id'] = USER_CONFIG.employee_id;
        params['AppointementObject'] = params;

        return post('Appointements/FollowUps/update', params);
    }

    this.followup_store = (params) =>
    {
        return post('Appointements/FollowUps/store', {
            AppointementObject: params
        });
    }

    this.followup_session_patient_batchStore = (params) =>
    {
        return post('Appointements/FollowUps/Sessions/Patients/batchStore', {
            AppointementObject: params
        });
    }

    this.advancedSearch = (params) =>
    {
        return post('Appointements/advancedSearch', params);
    }

}

OnlineAppointmentModel = function()
{ 
    this.show = (id) =>
    {
        var params = {
            apt_id: id
        }
        return post('OnlineAppointements/info', params);
    }
    
    this.search = (params) =>
    {
        params = {
            SearchObject: params
        }
        return post('OnlineAppointements/search', params);
    }

    this.store = (params) =>
    {
        params = {
            ClassObject: params
        }
        return post('OnlineAppointements/add', params);
    }

    this.update = (params) =>
    {
        params = {
            ClassObject: params
        }
        return post('OnlineAppointements/update', params);
    }

    this.batchDelete = (list) =>
    {
        var params = {
            list: list
        }
        return post('OnlineAppointements/deleteList', params);
    }

    this.setAccepted = (params) =>
    {
        params = {
            AppointementObject: params
        }
        return post('OnlineAppointements/setAccepted', params);
    }
}

MessageModel = function()
{

    this.batchSetRead = (params) =>
    {
        return post('Messages/setReadList', params)
    }

    this.batchDelete = (list) =>
    {
        var params = {
            list: list
        }
        return post('Messages/removeList', params);
    }

    this.reply = (params) =>
    {
        params = {
            MessageObject:params
        }
        const req = post('Messages/reply', params);

        req.then(() =>
        {
            // notify
            doNotify({
                to: {
                    employee_hash: params.MessageObject.userHash,
                },
                notification: {
                    title: USER_CONFIG.employee_name,
                    body: params.MessageObject.replyText,
                }
            })
        })

        return req
    }

    this.search = (params) =>
    {
        params = {
            SearchObject:params
        }
        return post('Messages/search', params);
    }

    this.inbox = (params) =>
    {
        params = {
            MessageObject:params
        }
        return post('Messages/inbox', params);
    }

    this.replies = (params) =>
    {
        params = {
            MessageObject:params
        }
        return post('Messages/replies', params);
    }

    this.open = (params) =>
    {
        params = {
            MessageObject: params
        }
        return post('Messages/open', params);
    }

    this.send = (params) =>
    {
        var fd = new FormData();
        fd.append('MessageObject', JSON.stringify(params));

        if ( params.attachments )
        {
            for (var i = 0; i < params.attachments.length; i++) 
            {
                fd.append('attachments[]', params.attachments[i]);
            }	
        }

        const req =  postForm('Messages/send', fd);

        req.then(() =>
        {
            // notify
            doNotify({
                to: {
                    employee_hash: params.receiver,
                },
                notification: {
                    title: params.subject,
                    body: params.body,
                }
            })
        })

        return req
    }

    this.notify = (params) =>
    {
        doNotify(params)
    }

    function doNotify(params)
    {
        // const url = DEFAULT_INI_SETTINGS.Socket_Settings.MESSAGES_PUSH_NOTIFICATIONS_URL

        // fetch(url, { method: 'POST', body: JSON.stringify(params) })

        MESSAGES_PUSH_NOTIFICATIONS_SOCKET_MODEL_SENDER.mcast().send(params)
    }

}

ProductModel = function()
{ 
    this.show = (id) =>
    {
        var params = {
            productId: id
        }
        return post('Products/info', params);
    }

    this.center_local_search = (params) =>
    {
        return post('Products/Centers/local_search', params);
    }

    this.center_advancedSearch = (params) =>
    {
        return post('Products/Centers/advancedSearch', params);
    }

    this.center_show = (params) =>
    {
        return post('Products/Centers/show', params);
    }

    this.distributor_local_search = (params) =>
    {
        return post('Products/Distributors/local_search', params);
    }

    this.search = (params) =>
    {
        params = {
            SearchObject: params
        }
        return post('Products/search', params);
    }

    this.center_administration_import = (params) =>
    {
        return post('Products/CentralAdministration/import', params);
    }

    this.central_administration_batchStore = (params) =>
    {
        return post('Products/CentralAdministration/batchStore', params);
    }

    this.central_administration_low_stock_threshold_notify = (params = {}) =>
    {
        return post('Products/CentralAdministration/lowStockThresholdNotify', params);
    }

    this.central_administration_average_low_stock_threshold_notify = (params = {}) =>
    {
        return post('Products/CentralAdministration/averageLowStockThresholdNotify', params);
    }

    this.contractor_to_central_administration_batchStore = (params) =>
    {
        return post('Products/CentralAdministration/ContractorToCentralAdministration/batchStore', params);
    }

    this.update = (params, progress) =>
    {
        return postFormWithProgress('Products/update', params, progress);
    }

    this.batchDelete = (list) =>
    {
        var params = {
            list: list
        }
        return post('Products/deleteList', params);
    }

    this.contractor_to_center_batchStore = (params) =>
    {
        return post('Products/Centers/ContractorToCenter/batchStore', params);
    }

    this.center_batchDelete = (params) =>
    {
        return post('Products/Centers/batchDelete', params);
    }

    this.center_batchStore = (params) =>
    {
        return post('Products/Centers/batchStore', params);
    }

    this.center_low_stock_threshold_notify = (params) =>
    {
        return post('Products/Centers/lowStockThresholdNotify', params);
    }

    this.center_average_low_stock_threshold_notify = (params) =>
    {
        return post('Products/Centers/averageLowStockThresholdNotify', params);
    }

    this.center_to_distributor_batchStore = (params) =>
    {
        return post('Products/Distributors/CenterToDistributor/batchStore', params);
    }

    this.center_store = (params, progress) =>
    {
        return postFormWithProgress('Products/Centers/store', params, progress);
    }

    this.center_update = (params, progress) =>
    {
        return postFormWithProgress('Products/Centers/update', params, progress);
    }

    this.distributor_batchStore = (params) =>
    {
        return post('Products/Distributors/batchStore', params);
    }

    this.distributor_low_stock_threshold_notify = (params) =>
    {
        return post('Products/Distributors/lowStockThresholdNotify', params);
    }

    this.distributor_batchDelete = (params) =>
    {
        return post('Products/Distributors/batchDelete', params);
    }

    this.transfer_center_to_center_batchTransfer = (params) =>
    {
        return post('Products/Transfers/CenterToCenter/batchTransfer', params);
    }

    this.central_administration_store = (params, progress) =>
    {
        return postFormWithProgress('Products/CentralAdministration/store', params, progress);
    }

    this.central_administration_update = (params, progress) =>
    {
        return postFormWithProgress('Products/CentralAdministration/update', params, progress);
    }

    this.central_administration_batchDelete = (params) =>
    {
        return post('Products/CentralAdministration/batchDelete', params);
    }

    this.center_produced_actions_search = (params) =>
    {
        return post('Products/Produced/Actions/search', params);
    }

    this.center_produced_actions_batchDelete = (params) =>
    {
        return post('Products/Produced/Actions/batchDelete', params);
    }

    this.center_consumed_actions_search = (params) =>
    {
        return post('Products/Consumed/Actions/search', params);
    }

    this.center_consumed_actions_batchDelete = (params) =>
    {
        return post('Products/Consumed/Actions/batchDelete', params);
    }

    // components
    this.component_batchDelete = (params) =>
    {
        return post('Products/Components/batchDelete', params);
    }

    this.component_batchStore = (params) =>
    {
        return post('Products/Components/batchStore', params);
    }

    this.component_batchUpdate = (params) =>
    {
        return post('Products/Components/batchUpdate', params);
    }

    this.component_batchUpdateByProduct = (params) =>
    {
        return post('Products/Components/batchUpdateByProduct', params);
    }

    this.component_search = (params) =>
    {
        return post('Products/Components/search', params);
    }
    
    this.component_show = (params) =>
    {
        return post('Products/Components/show', params);
    }
}

SupplierModel = function()
{

    this.show = (params) =>
    {
        return post('Suppliers/info', params);
    }

    this.search = (params) =>
    {
        params = {
            SearchObject:params
        }
        return post('Suppliers/search', params);
    }

    this.store = (params) => 
    {
        var fd = new FormData()
        fd.append('SupplierObject', JSON.stringify(params))
        if ( params.image )
            fd.append('image', params.image)

        return postForm('Suppliers/store', fd)
    }

    this.update = (params) => 
    {
        var fd = new FormData()
        fd.append('SupplierObject', JSON.stringify(params))
        if ( params.image )
            fd.append('image', params.image)

        return postForm('Suppliers/update', fd)
    }

    this.batchDelete = (params) => 
    {
        return post('Suppliers/deleteList', params)
    }

    this.dues_action_search = (params) => 
    {
        return post('Suppliers/Dues/Actions/search', params)
    }

    this.dues_action_batchDelete = (params) => 
    {
        return post('Suppliers/Dues/Actions/batchDelete', params)
    }

    this.dues_pay = (params) => 
    {
        return post('Suppliers/Dues/pay', params)
    }

    // 
    this.category_show = (params) =>
    {
        return post('Suppliers/Categories/show', params);
    }

    this.category_search = (params) =>
    {
        return post('Suppliers/Categories/search', params);
    }

    this.category_store = (params) => 
    {
        return post('Suppliers/Categories/store', params)
    }

    this.category_update = (params) => 
    {
        return post('Suppliers/Categories/update', params)
    }

    this.category_batchDelete = (params) => 
    {
        return post('Suppliers/Categories/batchDelete', params)
    }
}

OrderModel = function()
{
    this.advancedSearch = (params) =>
    {
        return post('Orders/advancedSearch', params)
    }

    this.show = (params) =>
    {
        return post('Orders/info', params)
    }

    this.batchDelete = (list) =>
    {
        var params = {
            list:list
        }
        return post('Orders/deleteList', params);
    }

    this.center_shipping_search = (params) =>
    {
        params = {
            SearchObject:params
        }
        return post('Orders/Centers/Shipping/search', params);
    }

    this.center_search = (params) =>
    {
        params = {
            SearchObject:params
        }
        return post('Orders/Centers/search', params);
    }

    this.direction_supplier_to_central_administration_selling_search = (params) =>
    {
        return post('Orders/Direction/SupplierToCentralAdministrationSellingInvoice/search', params);
    }

    this.direction_supplier_to_central_administration_selling_local_search = (params) =>
    {
        return post('Orders/Direction/SupplierToCentralAdministrationSellingInvoice/local_search', params);
    }

    this.direction_supplier_to_central_administration_consommables_selling_search = (params) =>
    {
        return post('Orders/Direction/SupplierToCentralAdministrationConsommablesSellingInvoice/search', params);
    }

    this.direction_supplier_to_central_administration_consommables_selling_local_search = (params) =>
    {
        return post('Orders/Direction/SupplierToCentralAdministrationConsommablesSellingInvoice/local_search', params);
    }

    this.direction_central_administration_to_center_selling_local_search = (params) =>
    {
        return post('Orders/Direction/CentralAdministrationToCenterSellingInvoice/local_search', params);
    }

    this.direction_central_administration_to_center_selling_filter = (params) =>
    {
        return post('Orders/Direction/CentralAdministrationToCenterSellingInvoice/filter', params);
    }

    this.direction_central_administration_to_center_consommables_selling_local_search = (params) =>
    {
        return post('Orders/Direction/CentralAdministrationToCenterConsommablesSellingInvoice/local_search', params);
    }

    this.direction_central_administration_to_center_consommables_selling_filter = (params) =>
    {
        return post('Orders/Direction/CentralAdministrationToCenterConsommablesSellingInvoice/filter', params);
    }

    this.direction_central_administration_to_distributor_selling_local_search = (params) =>
    {
        return post('Orders/Direction/CentralAdministrationToDistributorSellingInvoice/local_search', params);
    }

    this.direction_central_administration_to_distributor_selling_advancedSearch = (params) =>
    {
        return post('Orders/Direction/CentralAdministrationToDistributorSellingInvoice/advancedSearch', params);
    }

    this.direction_central_administration_to_distributor_selling_filter = (params) =>
    {
        return post('Orders/Direction/CentralAdministrationToDistributorSellingInvoice/filter', params);
    }

    this.direction_center_to_client_selling_store = (params) =>
    {
        return post('Orders/Direction/CenterToClientSellingInvoice/store', params);
    }

    this.direction_center_to_client_selling__client__center_local_search = (params) =>
    {
        return post('Orders/Direction/CenterToClientSellingInvoice/Clients/client__center_local_search', params);
    }

    this.direction_center_to_client_selling__client_local_search = (params) =>
    {
        return post('Orders/Direction/CenterToClientSellingInvoice/Clients/local_search', params);
    }

    this.direction_center_to_client_selling_search = (params) =>
    {
        return post('Orders/Direction/CenterToClientSellingInvoice/search', params);
    }

    this.direction_center_to_client_selling_local_search = (params) =>
    {
        return post('Orders/Direction/CenterToClientSellingInvoice/local_search', params);
    }

    this.direction_center_to_external_client_selling_store = (params) =>
    {
        return post('Orders/Direction/CenterToClientSellingInvoice/External/store', params);
    }

    this.direction_center_to_external_client_selling_local_search = (params) =>
    {
        return post('Orders/Direction/CenterToClientSellingInvoice/External/local_search', params);
    }

    this.direction_distributor_to_client_selling_store = (params) =>
    {
        return post('Orders/Direction/DistributorToClientSellingInvoice/store', params);
    }

    this.direction_distributor_to_client_selling_store_from_formalOrder = (params) =>
    {
        return post('Orders/Direction/DistributorToClientSellingInvoice/store_from_formalOrder', params);
    }

    this.direction_distributor_to_client_selling_search = (params) =>
    {
        return post('Orders/Direction/DistributorToClientSellingInvoice/search', params);
    }

    this.direction_distributor_to_client_selling_local_search = (params) =>
    {
        return post('Orders/Direction/DistributorToClientSellingInvoice/local_search', params);
    }

    this.direction_distributor_to_client_selling__client_local_search = (params) =>
    {
        return post('Orders/Direction/DistributorToClientSellingInvoice/Clients/local_search', params);
    }

    this.direction_distributor_to_client_selling__client__distributor_local_search = (params) =>
    {
        return post('Orders/Direction/DistributorToClientSellingInvoice/Clients/client__distributor_local_search', params);
    }

    this.direction_supplier_to_center_selling_search = (params) =>
    {
        return post('Orders/Direction/SupplierToCenterSellingInvoice/search', params);
    }

    this.direction_contractor_to_central_administration_selling_search = (params) =>
    {
        return post('Orders/Direction/ContractorToCentralAdministrationSellingInvoice/search', params);
    }

    this.direction_central_administration_to_contractor_selling_store = (params) =>
    {
        return post('Orders/Direction/CentralAdministrationToContractorSellingInvoice/store', params);
    }

    this.direction_central_administration_to_contractor_selling_search = (params) =>
    {
        return post('Orders/Direction/CentralAdministrationToContractorSellingInvoice/search', params);
    }

    this.direction_contractor_to_center_selling_search = (params) =>
    {
        return post('Orders/Direction/ContractorToCenterSellingInvoice/search', params);
    }

    this.direction_center_to_contractor_selling_store = (params) =>
    {
        return post('Orders/Direction/CenterToContractorSellingInvoice/store', params);
    }

    this.direction_center_to_contractor_selling_search = (params) =>
    {
        return post('Orders/Direction/CenterToContractorSellingInvoice/search', params);
    }

    this.direction_center_to_distributor_selling_search = (params) =>
    {
        return post('Orders/Direction/CenterToDistributorSellingInvoice/search', params);
    }

    this.direction_center_to_customer_selling_store = (params) =>
    {
        return post('Orders/Direction/CenterToCustomerSellingInvoice/store', params);
    }

    this.direction_center_to_customer_selling_search = (params) =>
    {
        return post('Orders/Direction/CenterToCustomerSellingInvoice/search', params);
    }
    
    this.direction_center_to_contractor_unconfirmed_selling_search = (params) =>
    {
        return post('Orders/Direction/CenterToContractorUnconfirmedSellingInvoice/search', params);
    }

    this.direction_center_to_contractor_unconfirmed_selling_store = (params) =>
    {
        return post('Orders/Direction/CenterToContractorUnconfirmedSellingInvoice/store', params);
    }

    this.direction_center_to_contractor_unconfirmed_selling_confirm = (params) =>
    {
        return post('Orders/Direction/CenterToContractorUnconfirmedSellingInvoice/confirm', params);
    }

    this.direction_center_to_distributor_unconfirmed_selling_search = (params) =>
    {
        return post('Orders/Direction/CenterToDistributorUnconfirmedSellingInvoice/search', params);
    }

    this.direction_center_to_distributor_unconfirmed_selling_store = (params) =>
    {
        return post('Orders/Direction/CenterToDistributorUnconfirmedSellingInvoice/store', params);
    }

    this.direction_center_to_distributor_unconfirmed_selling_confirm = (params) =>
    {
        return post('Orders/Direction/CenterToDistributorUnconfirmedSellingInvoice/confirm', params);
    }

    this.direction_center_to_customer_unconfirmed_selling_search = (params) =>
    {
        return post('Orders/Direction/CenterToCustomerUnconfirmedSellingInvoice/search', params);
    }

    this.direction_center_to_customer_unconfirmed_selling_store = (params) =>
    {
        return post('Orders/Direction/CenterToCustomerUnconfirmedSellingInvoice/store', params);
    }

    this.direction_center_to_customer_unconfirmed_selling_confirm = (params) =>
    {
        return post('Orders/Direction/CenterToCustomerUnconfirmedSellingInvoice/confirm', params);
    }

    this.direction_central_administration_to_contractor_unconfirmed_selling_store = (params) =>
    {
        return post('Orders/Direction/CentralAdministrationToContractorUnconfirmedSellingInvoice/store', params);
    }

    this.direction_central_administration_to_contractor_unconfirmed_selling_search = (params) =>
    {
        return post('Orders/Direction/CentralAdministrationToContractorUnconfirmedSellingInvoice/search', params);
    }

    this.direction_central_administration_to_contractor_unconfirmed_selling_confirm = (params) =>
    {
        return post('Orders/Direction/CentralAdministrationToContractorUnconfirmedSellingInvoice/confirm', params);
    }

    this.direction_central_administration_to_distributor_unconfirmed_selling_store = (params) =>
    {
        return post('Orders/Direction/CentralAdministrationToDistributorUnconfirmedSellingInvoice/store', params);
    }

    this.direction_central_administration_to_distributor_unconfirmed_selling_search = (params) =>
    {
        return post('Orders/Direction/CentralAdministrationToDistributorUnconfirmedSellingInvoice/search', params);
    }

    this.direction_central_administration_to_distributor_unconfirmed_selling_confirm = (params) =>
    {
        return post('Orders/Direction/CentralAdministrationToDistributorUnconfirmedSellingInvoice/confirm', params);
    }

    this.direction_central_administration_to_customer_unconfirmed_selling_store = (params) =>
    {
        return post('Orders/Direction/CentralAdministrationToCustomerUnconfirmedSellingInvoice/store', params);
    }

    this.direction_central_administration_to_customer_unconfirmed_selling_search = (params) =>
    {
        return post('Orders/Direction/CentralAdministrationToCustomerUnconfirmedSellingInvoice/search', params);
    }

    this.direction_central_administration_to_customer_unconfirmed_selling_confirm = (params) =>
    {
        return post('Orders/Direction/CentralAdministrationToCustomerUnconfirmedSellingInvoice/confirm', params);
    }

    this.direction_supplier_to_center_unconfirmed_selling_store = (params) =>
    {
        return post('Orders/Direction/SupplierToCenterUnconfirmedSellingInvoice/store', params);
    }

    this.direction_supplier_to_center_unconfirmed_selling_confirm = (params) =>
    {
        return post('Orders/Direction/SupplierToCenterUnconfirmedSellingInvoice/confirm', params);
    }

    this.direction_supplier_to_center_unconfirmed_selling_search = (params) =>
    {
        return post('Orders/Direction/SupplierToCenterUnconfirmedSellingInvoice/search', params);
    }

    this.direction_supplier_to_central_administration_unconfirmed_selling_store = (params) =>
    {
        return post('Orders/Direction/SupplierToCentralAdministrationUnconfirmedSellingInvoice/store', params);
    }

    this.direction_supplier_to_central_administration_unconfirmed_selling_confirm = (params) =>
    {
        return post('Orders/Direction/SupplierToCentralAdministrationUnconfirmedSellingInvoice/confirm', params);
    }

    this.direction_supplier_to_central_administration_unconfirmed_selling_search = (params) =>
    {
        return post('Orders/Direction/SupplierToCentralAdministrationUnconfirmedSellingInvoice/search', params);
    }


    this.direction_center_to_center_unconfirmed_selling_store = (params) =>
    {
        return post('Orders/Direction/CenterToCenterUnconfirmedSellingInvoice/store', params);
    }

    this.direction_center_to_center_unconfirmed_selling_confirm = (params) =>
    {
        return post('Orders/Direction/CenterToCenterUnconfirmedSellingInvoice/confirm', params);
    }

    this.direction_center_to_center_unconfirmed_selling_search = (params) =>
    {
        return post('Orders/Direction/CenterToCenterUnconfirmedSellingInvoice/search', params);
    }

    this.direction_center_to_center_selling_search = (params) =>
    {
        return post('Orders/Direction/CenterToCenterSellingInvoice/search', params);
    }

    // return invoices
    this.direction_client_to_center_return_store = (params) =>
    {
        return post('Orders/Direction/ClientToCenterReturnInvoice/store', params);
    }

    this.direction_client_to_center_return_search = (params) =>
    {
        return post('Orders/Direction/ClientToCenterReturnInvoice/search', params);
    }

    this.direction_central_administration_to_supplier_return_store = (params) =>
    {
        return post('Orders/Direction/CentralAdministrationToSupplierReturnInvoice/store', params);
    }

    this.direction_central_administration_to_supplier_return_search = (params) =>
    {
        return post('Orders/Direction/CentralAdministrationToSupplierReturnInvoice/search', params);
    }

    this.direction_client_to_distributor_return_store = (params) =>
    {
        return post('Orders/Direction/ClientToDistributorReturnInvoice/store', params);
    }

    this.direction_client_to_distributor_return_search = (params) =>
    {
        return post('Orders/Direction/ClientToDistributorReturnInvoice/search', params);
    }

    this.direction_central_administration_to_customer_selling_store = (params) =>
    {
        return post('Orders/Direction/CentralAdministrationToCustomerSellingInvoice/store', params);
    }

    this.direction_central_administration_to_customer_selling_search = (params) =>
    {
        return post('Orders/Direction/CentralAdministrationToCustomerSellingInvoice/search', params);
    }

    this.accept = (id) =>
    {
        var params = {
            order_id:id
        }
        return post('Orders/accept', params);
    }

    this.setStatus = (params) =>
    {
        return post('Orders/setStatus', params);
    }

    // Online invoices
    this.direction_online_client_to_central_administration_store = (params) =>
    {
        return post('Orders/Direction/Online/ClientToCentralAdministration/store', params);
    }

    this.direction_online_client_to_central_administration_search = (params) =>
    {
        return post('Orders/Direction/Online/ClientToCentralAdministration/search', params);
    }

    this.direction_online_client_to_central_administration_setAccepted = (params) =>
    {
        return post('Orders/Direction/Online/ClientToCentralAdministration/setAccepted', params);
    }

    this.direction_online_external_client_to_central_administration_store = (params) =>
    {
        return post('Orders/Direction/Online/ExternalClientToCentralAdministration/store', params);
    }

    this.direction_online_external_client_to_central_administration_search = (params) =>
    {
        return post('Orders/Direction/Online/ExternalClientToCentralAdministration/search', params);
    }
    // Unconfirmed transfer invoices
    this.direction_central_administration_to_center_unconfirmed_transfer_confirm = (params) =>
    {
        return post('Orders/Direction/CentralAdministrationToCenterUnconfirmedTransferInvoice/confirm', params);
    }

    this.direction_central_administration_to_center_unconfirmed_transfer_store = (params) =>
    {
        return post('Orders/Direction/CentralAdministrationToCenterUnconfirmedTransferInvoice/store', params);
    }

    this.direction_central_administration_to_center_unconfirmed_transfer_search = (params) =>
    {
        return post('Orders/Direction/CentralAdministrationToCenterUnconfirmedTransferInvoice/search', params);
    }

    this.direction_center_to_center_unconfirmed_transfer_store = (params) =>
    {
        return post('Orders/Direction/CenterToCenterUnconfirmedTransferInvoice/store', params);
    }

    this.direction_center_to_center_unconfirmed_transfer_search = (params) =>
    {
        return post('Orders/Direction/CenterToCenterUnconfirmedTransferInvoice/search', params);
    }

    this.direction_center_to_center_unconfirmed_transfer_confirm = (params) =>
    {
        return post('Orders/Direction/CenterToCenterUnconfirmedTransferInvoice/confirm', params);
    }

    this.direction_center_to_central_administration_unconfirmed_transfer_store = (params) =>
    {
        return post('Orders/Direction/CenterToCentralAdministrationUnconfirmedTransferInvoice/store', params);
    }

    this.direction_center_to_central_administration_unconfirmed_transfer_search = (params) =>
    {
        return post('Orders/Direction/CenterToCentralAdministrationUnconfirmedTransferInvoice/search', params);
    }

    this.direction_center_to_central_administration_unconfirmed_transfer_confirm = (params) =>
    {
        return post('Orders/Direction/CenterToCentralAdministrationUnconfirmedTransferInvoice/confirm', params);
    }

    this.direction_center_to_inventory_unconfirmed_transfer_store = (params) =>
    {
        return post('Orders/Direction/CenterToInventoryUnconfirmedTransferInvoice/store', params);
    }

    this.direction_center_to_inventory_unconfirmed_transfer_confirm = (params) =>
    {
        return post('Orders/Direction/CenterToInventoryUnconfirmedTransferInvoice/confirm', params);
    }

    this.direction_center_to_inventory_unconfirmed_transfer_search = (params) =>
    {
        return post('Orders/Direction/CenterToInventoryUnconfirmedTransferInvoice/search', params);
    }

    this.direction_center_to_inventory_transfer_search = (params) =>
    {
        return post('Orders/Direction/CenterToInventoryTransferInvoice/search', params);
    }
    // Confirmed transfer invoices
    this.direction_central_administration_to_center_transfer_search = (params) =>
    {
        return post('Orders/Direction/CentralAdministrationToCenterTransferInvoice/search', params);
    }

    this.direction_center_to_center_transfer_search = (params) =>
    {
        return post('Orders/Direction/CenterToCenterTransferInvoice/search', params);
    }

    this.direction_center_to_central_administration_transfer_search = (params) =>
    {
        return post('Orders/Direction/CenterToCentralAdministrationTransferInvoice/search', params);
    }
    // Produced products invoices
    this.direction_center_product_produced_store = (params) =>
    {
        return post('Orders/Direction/CenterProductProducedInvoice/store', params);
    }

    this.direction_center_product_produced_search = (params) =>
    {
        return post('Orders/Direction/CenterProductProducedInvoice/search', params);
    }
    // Consumed products invoices
    this.direction_center_product_consumed_store = (params) =>
    {
        return post('Orders/Direction/CenterProductConsumedInvoice/store', params);
    }

    this.direction_center_product_consumed_search = (params) =>
    {
        return post('Orders/Direction/CenterProductConsumedInvoice/search', params);
    }
    //
    this.direction_online_external_client_to_central_administration_setAccepted = (params) =>
    {
        return post('Orders/Direction/Online/ExternalClientToCentralAdministration/setAccepted', params);
    }

    this.status_search = (params) =>
    {
        return post('Orders/Statuses/search', params);
    }


    // External api (Dr.Aoun) 
    this.external_dr_aoun__direction_central_administration_to_center_unconfirmed_selling_store = (params) =>
    {
        return post('Orders/External/DR_AOUN/Direction/EXTERNAL_DR_AOUN__CENTRAL_ADMINISTRATION_TO_CENTER_UNCONFIRMED_SELLING_INVOICE/store', params);
    }

    this.external_dr_aoun__direction_central_administration_to_center_unconfirmed_selling_search = (params) =>
    {
        return post('Orders/External/DR_AOUN/Direction/EXTERNAL_DR_AOUN__CENTRAL_ADMINISTRATION_TO_CENTER_UNCONFIRMED_SELLING_INVOICE/search', params);
    }

    this.external_dr_aoun__direction_central_administration_to_center_selling_search = (params) =>
    {
        return post('Orders/External/DR_AOUN/Direction/EXTERNAL_DR_AOUN__CENTRAL_ADMINISTRATION_TO_CENTER_SELLING_INVOICE/search', params);
    }

    this.external_dr_aoun__direction_center_to_center_unconfirmed_selling_store = (params) =>
    {
        return post('Orders/External/DR_AOUN/Direction/EXTERNAL_DR_AOUN__CENTER_TO_CENTER_UNCONFIRMED_SELLING_INVOICE/store', params);
    }

    this.external_dr_aoun__direction_center_to_center_unconfirmed_selling_search = (params) =>
    {
        return post('Orders/External/DR_AOUN/Direction/EXTERNAL_DR_AOUN__CENTER_TO_CENTER_UNCONFIRMED_SELLING_INVOICE/search', params);
    }

    this.external_dr_aoun__direction_center_to_center_selling_search = (params) =>
    {
        return post('Orders/External/DR_AOUN/Direction/EXTERNAL_DR_AOUN__CENTER_TO_CENTER_UNCONFIRMED_SELLING_INVOICE/search', params);
    }

    //
    this.global_settings_set = (params) =>
    {
        return post('Orders/GlobalSettings/set', params);
    }

    this.global_settings_first = (params = {}) =>
    {
        return post('Orders/GlobalSettings/first', params);
    }

}

FormalOrderModel = function()
{
    this.show = (params) =>
    {
        return post('FormalOrders/info', params)
    }

    this.batchDelete = (params) =>
    {
        return post('FormalOrders/batchDelete', params);
    }

    this.direction_supplier_to_central_administration_selling_search = (params) =>
    {
        return post('FormalOrders/Direction/SupplierToCentralAdministrationSellingInvoice/search', params);
    }

    this.direction_supplier_to_central_administration_selling_local_search = (params) =>
    {
        return post('FormalOrders/Direction/SupplierToCentralAdministrationSellingInvoice/local_search', params);
    }

    this.direction_supplier_to_central_administration_consommables_selling_search = (params) =>
    {
        return post('FormalOrders/Direction/SupplierToCentralAdministrationConsommablesSellingInvoice/search', params);
    }

    this.direction_supplier_to_central_administration_consommables_selling_local_search = (params) =>
    {
        return post('FormalOrders/Direction/SupplierToCentralAdministrationConsommablesSellingInvoice/local_search', params);
    }

    this.direction_central_administration_to_center_selling_local_search = (params) =>
    {
        return post('FormalOrders/Direction/CentralAdministrationToCenterSellingInvoice/local_search', params);
    }

    this.direction_central_administration_to_center_selling_filter = (params) =>
    {
        return post('FormalOrders/Direction/CentralAdministrationToCenterSellingInvoice/filter', params);
    }

    this.direction_central_administration_to_center_consommables_selling_local_search = (params) =>
    {
        return post('FormalOrders/Direction/CentralAdministrationToCenterConsommablesSellingInvoice/local_search', params);
    }

    this.direction_central_administration_to_center_consommables_selling_filter = (params) =>
    {
        return post('FormalOrders/Direction/CentralAdministrationToCenterConsommablesSellingInvoice/filter', params);
    }

    this.direction_central_administration_to_distributor_selling_local_search = (params) =>
    {
        return post('FormalOrders/Direction/CentralAdministrationToDistributorSellingInvoice/local_search', params);
    }

    this.direction_central_administration_to_distributor_selling_filter = (params) =>
    {
        return post('FormalOrders/Direction/CentralAdministrationToDistributorSellingInvoice/filter', params);
    }

    this.direction_center_to_client_selling_store = (params) =>
    {
        return post('FormalOrders/Direction/CenterToClientSellingInvoice/store', params);
    }

    this.direction_center_to_client_selling__client__center_local_search = (params) =>
    {
        return post('FormalOrders/Direction/CenterToClientSellingInvoice/Clients/client__center_local_search', params);
    }

    this.direction_center_to_client_selling__client_local_search = (params) =>
    {
        return post('FormalOrders/Direction/CenterToClientSellingInvoice/Clients/local_search', params);
    }

    this.direction_center_to_client_selling_search = (params) =>
    {
        return post('FormalOrders/Direction/CenterToClientSellingInvoice/search', params);
    }

    this.direction_center_to_client_selling_local_search = (params) =>
    {
        return post('FormalOrders/Direction/CenterToClientSellingInvoice/local_search', params);
    }

    this.direction_center_to_external_client_selling_store = (params) =>
    {
        return post('FormalOrders/Direction/CenterToClientSellingInvoice/External/store', params);
    }

    this.direction_center_to_external_client_selling_local_search = (params) =>
    {
        return post('FormalOrders/Direction/CenterToClientSellingInvoice/External/local_search', params);
    }

    this.direction_distributor_to_client_selling_store = (params) =>
    {
        return post('FormalOrders/Direction/DistributorToClientSellingInvoice/store', params);
    }

    this.direction_distributor_to_client_selling_search = (params) =>
    {
        return post('FormalOrders/Direction/DistributorToClientSellingInvoice/search', params);
    }

    this.direction_distributor_to_client_selling_local_search = (params) =>
    {
        return post('FormalOrders/Direction/DistributorToClientSellingInvoice/local_search', params);
    }

    this.direction_distributor_to_client_selling__client_local_search = (params) =>
    {
        return post('FormalOrders/Direction/DistributorToClientSellingInvoice/Clients/local_search', params);
    }

    this.direction_distributor_to_client_selling__client__distributor_local_search = (params) =>
    {
        return post('FormalOrders/Direction/DistributorToClientSellingInvoice/Clients/client__distributor_local_search', params);
    }

    this.direction_center_to_center_selling_store = (params) =>
    {
        return post('FormalOrders/Direction/CenterToCenterSellingInvoice/store', params);
    }

    this.direction_center_to_center_selling_search = (params) =>
    {
        return post('FormalOrders/Direction/CenterToCenterSellingInvoice/search', params);
    }


    this.direction_center_to_contractor_selling_store = (params) =>
    {
        return post('FormalOrders/Direction/CenterToContractorSellingInvoice/store', params);
    }

    this.direction_center_to_contractor_selling_search = (params) =>
    {
        return post('FormalOrders/Direction/CenterToContractorSellingInvoice/search', params);
    }

    this.direction_center_to_distributor_selling_store = (params) =>
    {
        return post('FormalOrders/Direction/CenterToDistributorSellingInvoice/store', params);
    }

    this.direction_center_to_distributor_selling_search = (params) =>
    {
        return post('FormalOrders/Direction/CenterToDistributorSellingInvoice/search', params);
    }

    this.direction_center_to_customer_selling_search = (params) =>
    {
        return post('FormalOrders/Direction/CenterToCustomerSellingInvoice/search', params);
    }

    this.direction_supplier_to_center_selling_store = (params) =>
    {
        return post('FormalOrders/Direction/SupplierToCenterSellingInvoice/store', params);
    }

    this.direction_supplier_to_center_selling_search = (params) =>
    {
        return post('FormalOrders/Direction/SupplierToCenterSellingInvoice/search', params);
    }
}

ConsommableModel = function()
{

    this.batchDelete = (list) =>
    {
        var params = {
            list:list
        }
        return post('Consommables/batchDelete', params);
    }

    this.show = (id) =>
    {
        var params = {
            id:id
        }
        return post('Consommables/info', params);
    }

    this.search = (params) =>
    {
        params = {
            SearchObject:params
        }
        return post('Consommables/search', params);
    }

    this.central_administration_batchStore = (params) =>
    {
        return post('Consommables/CentralAdministration/batchStore', params);
    }

    this.update = (params) =>
    {
        return postForm('Consommables/update', params);
    }

    this.center_local_search = (params) =>
    {
        return post('Consommables/Centers/local_search', params);
    }

    this.center_batchDelete = (params) =>
    {
        return post('Consommables/Centers/batchDelete', params);
    }

    this.center_batchStore = (params) =>
    {
        return post('Consommables/Centers/batchStore', params);
    }

    this.patient_batchStore = (params) =>
    {
        return post('Consommables/Patients/batchStore', params);
    }

    this.patient_local_search = (params) =>
    {
        return post('Consommables/Patients/local_search', params);
    }

}

CashoutRecordModel = function()
{

    this.store = (params) =>
    {
        params = {
            CashoutRecordObject:params
        }
        return post('CashoutRecords/add', params);
    }

    this.batchDelete = (list) =>
    {
        var params = {
            list:list
        }
        return post('CashoutRecords/deleteList', params);
    }

    this.administration_search = (params) =>
    {
        params = {
            SearchObject:params
        }
        return post('CashoutRecords/Administration/search', params);
    }

}

DailyReportModel = function()
{

    this.store = (params) =>
    {
        return post('DailyReports/store', params);
    }

    this.update = (params) =>
    {
        return post('DailyReports/update', params);
    }

    this.show = (params) =>
    {
        return post('DailyReports/show', params);
    }

    this.employee_search = (params) =>
    {
        return post('DailyReports/Employees/search', params);
    }

    this.batchDelete = (params) =>
    {
        return post('DailyReports/batchDelete', params);
    }

    this.staff_search = (params) =>
    {
        return post('DailyReports/Staff/search', params);
    }

    this.staff_filter = (params) =>
    {
        return post('DailyReports/Staff/filter', params);
    }

    this.global_search = (params) =>
    {
        return post('DailyReports/Global/search', params);
    }

    this.global_filter = (params) =>
    {
        return post('DailyReports/Global/filter', params);
    }

}

MemberModel = function()
{
    this.setSeenByAdmin = (params) =>
    {
        return post('Members/setSeenByAdmin', params);
    }

    this.search = (params) =>
    {
        params = {
            SearchObject: params
        }
        return post('Members/search', params);
    }

    this.show = (id) =>
    {
        var params = {
            member_id: id
        }
        return post('Members/info', params);
    }

    this.store = (params) =>
    {
        params = {
            ClinicObject: params
        }
        return post('Members/add', params);
    }

    this.update = (params) =>
    {
        params = {
            ClinicObject: params
        }
        return post('Members/update', params);
    }

    this.batchDelete = (list) =>
    {
        var params = {
            list: list
        }
        return post('Members/deleteList', params);
    }
}

TestimonialModel = function()
{
    this.search = (params) =>
    {
        params = {
            SearchObject: params
        }
        return post('Testimonials/search', params);
    }

    this.show = (id) =>
    {
        var params = {
            test_id: id
        }
        return post('Testimonials/info', params);
    }

    this.batchDelete = (list) =>
    {
        var params = {
            list: list
        }
        return post('Testimonials/deleteList', params);
    }
}

AdvertisementModel = function()
{
    this.search = (params) =>
    {
        params = {
            SearchObject: params
        }
        return post('Advertisements/search', params);
    }

    this.show = (id) =>
    {
        var params = {
            ad_id: id
        }
        return post('Advertisements/info', params);
    }

    this.batchDelete = (list) =>
    {
        var params = {
            list: list
        }
        return post('Advertisements/deleteList', params);
    }

    this.update = (params) =>
    {
        var fd = new FormData();
        fd.append('AdvertisementObject', JSON.stringify(params));
        if ( params.ad_image )
            fd.append('ad_image', params.ad_image);

        return postForm('Advertisements/update', fd);
    }

    this.store = (params) =>
    {
        var fd = new FormData();
        fd.append('AdvertisementObject', JSON.stringify(params));
        if ( params.ad_image )
            fd.append('ad_image', params.ad_image);

        return postForm('Advertisements/store', fd);
    }

    this.types_list = () =>
    {
        var params = {
            
        }
        return post('Advertisements/Types/index', params);
    }

    this.clients_batchDelete = (list) =>
    {
        var params = {
            list: list
        }
        return post('Advertisements/Clients/deleteList', params);
    }

    this.clients_search = (list) =>
    {
        var params = {
            list: list
        }
        return post('Advertisements/Clients/search', params);
    }
}

VideoModel = function()
{
    this.search = (params) =>
    {
        params = {
            SearchObject: params
        }
        return post('Videos/search', params);
    }

    this.show = (id) =>
    {
        var params = {
            video_id: id
        }
        return post('Videos/info', params);
    }

    this.batchDelete = (list) =>
    {
        var params = {
            list: list
        }
        return post('Videos/deleteList', params);
    }

    this.update = (params) =>
    {
        params = {
            VideoObject: params
        }

        return post('Videos/update', params);
    }

    this.store = (params) =>
    {
        params = {
            VideoObject: params
        }

        return post('Videos/add', params);
    }

}

FileModel = function()
{
    this.index = (params) =>
    {
        return get('Files/index?directory='+params.directory);
    }

    this.upload = (params, progress) =>
    {
        return postFormWithProgress('Files/upload', params, progress);
    }

    this.convert_ppt_to_jpg = (params, progress = null) =>
    {
        return postFormWithProgress('Files/Converts/PPT_TO_JPG/convert', params, progress);
    }
}

WaitingListModel = function()
{

    this.store = (params) =>
    {
        return post('WaitingLists/store', params)
    }

    this.local_search = (params) =>
    {
        return post('WaitingLists/local_search', params)
    }

    this.batchDelete = (params) =>
    {
        return post('WaitingLists/batchDelete', params)
    }

    this.delete = (params) =>
    {
        return post('WaitingLists/delete', params)
    }

}

SMSTemplateModel = function()
{

    this.store = (params) =>
    {
        return post('SMSMessage/store', params)
    }

    this.update = (params) =>
    {
        return post('SMSMessage/update', params)
    }

    this.show = (params) =>
    {
        return post('SMSMessage/show', params)
    }

    this.local_search = (params) =>
    {
        return post('SMSMessage/Centers/search', params)
    }

    this.delete = (params) =>
    {
        return post('SMSMessage/delete', params)
    }

}

FundBoxModel = function()
{

    this.show = (params) =>
    {
        return post('FundBoxes/show', params);
    }

    this.search = (params) =>
    {
        return post('FundBoxes/search', params);
    }

    this.filter = (params) =>
    {
        return post('FundBoxes/filter', params);
    }

    this.store = (params) => 
    {
        return post('FundBoxes/store', params)
    }

    this.update = (params) => 
    {
        return post('FundBoxes/update', params)
    }

    this.batchDelete = (params) => 
    {
        return post('FundBoxes/batchDelete', params)
    }

    this.actions_store = (params) =>
    {
        return postForm('FundBoxes/Actions/store', params);
    }

    this.actions_batchDelete = (params) =>
    {
        return post('FundBoxes/Actions/batchDelete', params);
    }

    this.actions_funds_transfer = (params) =>
    {
        const req = postForm('FundBoxes/Actions/Funds/transfer', params);

        req.then(() => {

            GLOBAL_NOTIFICATIONS_PUSH_NOTIFICATIONS_SOCKET_MODEL_SENDER.mcast().send({})
            FUNDBOX_PUSH_NOTIFICATIONS_SOCKET_MODEL_SENDER.mcast().send({
                to: {
                    employee_id: params.get('receiver_id'),
                    employee_name: params.get('receiver_name'),
                },  
                notification: {
                    title: params.get('sender_name'),
                    body: FUI_DISPLAY_LANG.views.pages.global.text106.replace(':amount', moneyFormat(params.get('amount') ) ),
                }
            })

        })

        return req
    }

    this.actions_funds_store = (params) =>
    {
        return postForm('FundBoxes/Actions/Funds/store', params);
    }

    this.actions_search = (params) =>
    {
        return post('FundBoxes/Actions/search', params);
    }

    this.actions_owner_search = (params) =>
    {
        return post('FundBoxes/Actions/Owners/search', params);
    }

    this.actions_owner_filterBySource = (params) =>
    {
        return post('FundBoxes/Actions/Owners/filterBySource', params);
    }

    this.actions_owner_show = (params) =>
    {
        return post('FundBoxes/Actions/Owners/show', params);
    }

    this.actions_funds_transfer_batchConfirm = (params) =>
    {
        return post('FundBoxes/UnconfirmedActions/Funds/transfer_batchConfirm', params);
    }

    this.unconfirmed_actions_batchDelete = (params) =>
    {
        return post('FundBoxes/UnconfirmedActions/batchDelete', params);
    }

    this.unconfirmed_actions_search = (params) =>
    {
        return post('FundBoxes/UnconfirmedActions/search', params);
    }

    this.unconfirmed_actions_owner_search = (params) =>
    {
        return post('FundBoxes/UnconfirmedActions/Owners/search', params);
    }

    this.unconfirmed_actions_owner_filterBySource = (params) =>
    {
        return post('FundBoxes/UnconfirmedActions/Owners/filterBySource', params);
    }

    this.unconfirmed_actions_source_search = (params) =>
    {
        return post('FundBoxes/UnconfirmedActions/Sources/search', params);
    }

    this.unconfirmed_actions_source_filterBySource = (params) =>
    {
        return post('FundBoxes/UnconfirmedActions/Sources/filterByOwner', params);
    }

    this.selected_for_transfers_store = (params) => 
    {
        return post('FundBoxes/SelectedForTransfers/store', params)
    }

    this.selected_for_transfers_batchDelete = (params) => 
    {
        return post('FundBoxes/SelectedForTransfers/batchDelete', params)
    }

    this.selected_for_transfers_search = (params) => 
    {
        return post('FundBoxes/SelectedForTransfers/search', params)
    }

}

ContentTemplateModel = function()
{

    this.store = (params) =>
    {
        return post('ContentTemplates/store', params)
    }

    this.update = (params) =>
    {
        return post('ContentTemplates/update', params)
    }

    this.show = (params) =>
    {
        return post('ContentTemplates/show', params)
    }

    this.local_search = (params) =>
    {
        return post('ContentTemplates/Centers/search', params)
    }

    this.delete = (params) =>
    {
        return post('ContentTemplates/delete', params)
    }

}

CategoryModel = function()
{
    this.search = (params) =>
    {
        return post('Categories/search', params);
    }

    this.show = (params) =>
    {
        return post('Categories/show', params);
    }

    this.delete = (params) =>
    {
        return post('Categories/delete', params);
    }

    this.update = (params) =>
    {
        return post('Categories/update', params);
    }

    this.store = (params) =>
    {
        return post('Categories/store', params);
    }

}

FamilyModel = function()
{
    this.search = (params) =>
    {
        return post('Families/search', params);
    }

    this.show = (params) =>
    {
        return post('Families/show', params);
    }

    this.delete = (params) =>
    {
        return post('Families/delete', params);
    }

    this.update = (params) =>
    {
        return post('Families/update', params);
    }

    this.store = (params) =>
    {
        return post('Families/store', params);
    }

}

NotificationModel = function()
{

    this.setIsRead = (params) =>
    {
        return post('Notifications/setIsRead', params);
    }

    this.search = (params) =>
    {
        return post('Notifications/search', params);
    }

    this.receiver_isRead_count = (params) =>
    {
        return post('Notifications/Receivers/IsRead/count', params);
    }

}

DriverJobModel = function()
{
    this.search = (params) =>
    {
        return post('DriverJobs/search', params);
    }

    this.filterByDriver = (params) =>
    {
        return post('DriverJobs/filterByDriver', params);
    }

    this.filterByStatus = (params) =>
    {
        return post('DriverJobs/filterByStatus', params);
    }

    this.show = (params) =>
    {
        return post('DriverJobs/show', params);
    }

    this.batchDelete = (params) =>
    {
        return post('DriverJobs/batchDelete', params);
    }

    this.update = (params) =>
    {
        return post('DriverJobs/update', params);
    }

    this.setDriver = (params) =>
    {
        return post('DriverJobs/setDriver', params);
    }

    this.store = (params) =>
    {
        return post('DriverJobs/store', params);
    }

    this.employee_job_search = (params) =>
    {
        return post('DriverJobs/Employees/Jobs/search', params);
    }

    this.employee_job_filterByDriver = (params) =>
    {
        return post('DriverJobs/Employees/Jobs/filterByDriver', params);
    }

    this.employee_job_filterByStatus = (params) =>
    {
        return post('DriverJobs/Employees/Jobs/filterByStatus', params);
    }

    this.driver_job_cancel = (params) =>
    {
        return post('DriverJobs/Drivers/Jobs/cancel', params);
    }

    this.driver_job_search = (params) =>
    {
        return post('DriverJobs/Drivers/Jobs/search', params);
    }

    this.driver_job_tracking_store = (params) =>
    {
        return post('DriverJobs/Drivers/Jobs/Trackings/store', params);
    }

    this.driver_job_tracking_search = (params) =>
    {
        return post('DriverJobs/Drivers/Jobs/Trackings/search', params);
    }

    this.driver_job_tracking__job_search = (params) =>
    {
        return post('DriverJobs/Drivers/Jobs/Trackings/job_search', params);
    }

    this.driver_job_canceled_search = (params) =>
    {
        return post('DriverJobs/Drivers/Jobs/Canceled/search', params);
    }

    this.driver_job_canceled_filterByDriver = (params) =>
    {
        return post('DriverJobs/Drivers/Jobs/Canceled/filterByDriver', params);
    }

}

ChronicDiseaseModel = function()
{
    this.search = (params) =>
    {
        return post('ChronicDiseases/search', params);
    }

    this.show = (params) =>
    {
        return post('ChronicDiseases/show', params);
    }

    this.store = (params) =>
    {
        return post('ChronicDiseases/store', params);
    }
}

ChatModel = function()
{
    this.group_store = (params) =>
    {
        return post('Chats/Groups/store', params);
    }

    this.group_update = (params) =>
    {
        return post('Chats/Groups/update', params);
    }

    this.group_show = (params) =>
    {
        return post('Chats/Groups/show', params);
    }

    this.group_search = (params) =>
    {
        return post('Chats/Groups/search', params);
    }

    this.group_patient_batchStore = (params) =>
    {
        return post('Chats/Groups/Patients/batchStore', params);
    }

    this.group_patient_batchDelete = (params) =>
    {
        return post('Chats/Groups/Patients/batchDelete', params);
    }

    this.group_patient_search = (params) =>
    {
        return post('Chats/Groups/Patients/search', params);
    }

    this.group_patient_show = (params) =>
    {
        return post('Chats/Groups/Patients/show', params);
    }

    this.group_employee_show = (params) =>
    {
        return post('Chats/Groups/Employees/show', params);
    }

    this.group_post_store = (params, progress) =>
    {
        return postFormWithProgress('Chats/Groups/Posts/store', params, progress);
    }

    this.group_post_update = (params, progress) =>
    {
        return postFormWithProgress('Chats/Groups/Posts/update', params, progress);
    }

    this.group_post_show = (params) =>
    {
        return post('Chats/Groups/Posts/show', params);
    }

    this.group_post_search = (params) =>
    {
        return post('Chats/Groups/Posts/search', params);
    }

    this.group_post_delete = (params) =>
    {
        return post('Chats/Groups/Posts/delete', params);
    }

    this.group_post_batchDelete = (params) =>
    {
        return post('Chats/Groups/Posts/batchDelete', params);
    }

    this.group_post_reaction_store = (params) =>
    {
        return post('Chats/Groups/Posts/Reactions/store', params);
    }

    this.group_post_reaction_delete = (params) =>
    {
        return post('Chats/Groups/Posts/Reactions/delete', params);
    }

    this.group_post_reaction_deleteByPostAndEmployee = (params) =>
    {
        return post('Chats/Groups/Posts/Reactions/deleteByPostAndEmployee', params);
    }

    this.group_post_reaction_search = (params) =>
    {
        return post('Chats/Groups/Posts/Reactions/search', params);
    }

    this.group_post_comment_store = (params) =>
    {
        return post('Chats/Groups/Posts/Comments/store', params);
    }

    this.group_post_comment_update = (params) =>
    {
        return post('Chats/Groups/Posts/Comments/update', params);
    }

    this.group_post_comment_batchDelete = (params) =>
    {
        return post('Chats/Groups/Posts/Comments/batchDelete', params);
    }

    this.group_post_comment_search = (params) =>
    {
        return post('Chats/Groups/Posts/Comments/search', params);
    }

    this.group_post_comment_show = (params) =>
    {
        return post('Chats/Groups/Posts/Comments/show', params);
    }

    this.conversation_private_store = (params) =>
    {
        return post('Chats/Conversations/Private/store', params);
    }

    this.conversation_private_show = (params) =>
    {
        return post('Chats/Conversations/Private/show', params);
    }

    this.conversation_private_search = (params) =>
    {
        return post('Chats/Conversations/Private/search', params);
    }

    this.conversation_private_delete = (params) =>
    {
        return post('Chats/Conversations/Private/delete', params);
    }

    this.conversation_private_setRead = (params) =>
    {
        return post('Chats/Conversations/Private/setRead', params);
    }

    this.conversation_group_store = (params) =>
    {
        return post('Chats/Conversations/Group/store', params);
    }

    this.conversation_group_show = (params) =>
    {
        return post('Chats/Conversations/Group/show', params);
    }

    this.conversation_group_search = (params) =>
    {
        return post('Chats/Conversations/Group/search', params);
    }

    this.conversation_group_delete = (params) =>
    {
        return post('Chats/Conversations/Group/delete', params);
    }

    this.conversation_group_setRead = (params) =>
    {
        return post('Chats/Conversations/Group/setRead', params);
    }

}

EmojyModel = function()
{
    this.search = (params) =>
    {
        return post('Emojies/search', params);
    }

    this.store = (params) =>
    {
        return post('Emojies/batchStore', params);
    }
}

MediaModel = function()
{
    var options = {
        API_END_POINT: DEFAULT_INI_SETTINGS.Server_Settings.DOCIT_API_END_POINT
    }

    this.create = (params, progress) =>
    {
        return postFormWithProgress('medias/create', params, progress, options);
    }

    this.search = (params) =>
    {
        return post('medias/search', params, options);
    }

    this.advancedSearch = (params) =>
    {
        return post('medias/advancedSearch', params, options);
    }

    this.delete = (id) =>
    {
        return _delete('medias/delete/'+id, options);
    }

    this.file_explorer = (params) =>
    {
        return post('file-explorer', params, options);
    }

    this.file_explorer_folders = (user_id) =>
    {
        return get(`file-explorer/folders/${user_id}`, options);
    }
}

FolderModel = function()
{
    var options = {
        API_END_POINT: DEFAULT_INI_SETTINGS.Server_Settings.DOCIT_API_END_POINT
    }

    this.create = (params) =>
    {
        return post('folders/create', params, options);
    }

    this.delete = (id) =>
    {
        return _delete('folders/delete/'+id, options);
    }

    this.update = (id, params) =>
    {
        return patch('folders/update/'+id, params, options);
    }

    this.show = (id) =>
    {
        return get(`folders/${id}`, options);
    }
}

DocitGroupModel = function()
{
    var options = {
        API_END_POINT: DEFAULT_INI_SETTINGS.Server_Settings.DOCIT_API_END_POINT
    }

    this.create = (params) =>
    {
        return post('groups/create', params, options);
    }

    this.search = (params) =>
    {
        return post('groups/search', params, options);
    }

    this.delete = (id) =>
    {
        return _delete('groups/delete/'+id, options);
    }

    this.update = (id, params) =>
    {
        return patch('groups/update/'+id, params, options);
    }

    this.show = (id) =>
    {
        return get(`groups/${id}`, options);
    }

    this.users_batchStore = (params) =>
    {
        return post('groups/users/batchStore', params, options);
    }

    this.users_delete = (params) =>
    {
        return post('groups/users/delete', params, options);
    }

    this.users_search = (params) =>
    {
        return post('groups/users/search', params, options);
    }

    this.media_store = (params) =>
    {
        return post('groups/media/create', params, options);
    }

    this.media_delete = (params) =>
    {
        return post('groups/media/delete', params, options);
    }

    this.media_shared_search = (params) =>
    {
        return post('groups/media/shared/search', params, options);
    }

    this.folders_store = (params) =>
    {
        return post('groups/folders/create', params, options);
    }

    this.folders_shared_search = (params) =>
    {
        return post('groups/folders/shared/search', params, options);
    }

    this.folders_shared_delete = (params) =>
    {
        return post('groups/folders/shared/delete', params, options);
    }
}

DocitUserModel = function()
{
    var options = {
        API_END_POINT: DEFAULT_INI_SETTINGS.Server_Settings.DOCIT_API_END_POINT
    }

    this.create = (params) =>
    {
        return post('users/create', params, options);
    }

    this.search = (params) =>
    {
        return post('users/search', params, options);
    }

    this.media_batchShare = (params) =>
    {
        return post('users/media/batchShare', params, options);
    }

    this.media_shared_delete = (params) =>
    {
        return post('users/media/shared/delete', params, options);
    }

    this.media_shared_batchDelete = (params) =>
    {
        return post('users/media/shared/batchDelete', params, options);
    }

    this.media_shared_search = (params) =>
    {
        return post('users/media/shared/search', params, options);
    }

    this.media_sharedWithMe_search = (params) =>
    {
        return post('users/media/shared-with-me/search', params, options);
    }

    this.media_shared_withUsers_search = (params) =>
    {
        return post('users/media/shared/withUsers/search', params, options);
    }

    this.media_shared_withGroups_search = (params) =>
    {
        return post('users/media/shared/withGroups/search', params, options);
    }

    this.folders_shared_withGroups_search = (params) =>
    {
        return post('users/folders/shared/withGroups/search', params, options);
    }

    this.folders_shared_withUsers_search = (params) =>
    {
        return post('users/folders/shared/withUsers/search', params, options);
    }

    this.folders_sharedWithMe_search = (params) =>
    {
        return post('users/folders/shared-with-me/search', params, options);
    }

    this.folders_batchShare = (params) =>
    {
        return post('users/folders/batchShare', params, options);
    }

    this.folders_shared_delete = (params) =>
    {
        return post('users/folders/shared/delete', params, options);
    }

    this.groups_search = (params) =>
    {
        return post('users/groups/search', params, options);
    }
}

DocitSharePermissionModel = function()
{
    var options = {
        API_END_POINT: DEFAULT_INI_SETTINGS.Server_Settings.DOCIT_API_END_POINT
    }

    this.index = () =>
    {
        return get('share-permissions', options);
    }
}

StatisticsModel = function()
{

    this.fundbox_appointment_search = (params) =>
    {
        return post('Statistics/Fundboxes/Appointements/search', params);
    }

    this.appointment_search = (params) =>
    {
        return post('Statistics/Appointements/search', params);
    }

    this.prescription_search = (params) =>
    {
        return post('Statistics/Prescriptions/search', params);
    }

    this.order_search = (params) =>
    {
        return post('Statistics/Orders/search', params);
    }

    this.patient_search = (params) =>
    {
        return post('Statistics/Patients/search', params);
    }

    this.patient_dept_action_search = (params) =>
    {
        return post('Statistics/Patients/Depts/Actions/search', params);
    }

    this.patient_additionalData_search = (params) =>
    {
        return post('Statistics/Patients/AdditionalData/search', params);
    }

    this.product_center_search = (params) =>
    {
        return post('Statistics/Products/Centers/search', params);
    }

    this.consummable_center_search = (params) =>
    {
        return post('Statistics/Consummables/Centers/search', params);
    }

}

WalletModel = function()
{

    this.show = (params) =>
    {
        return post('Wallets/show', params);
    }

    this.search = (params) =>
    {
        return post('Wallets/search', params);
    }

    this.store = (params) => 
    {
        return post('Wallets/store', params)
    }

    this.update = (params) => 
    {
        return post('Wallets/update', params)
    }

    this.batchDelete = (params) => 
    {
        return post('Wallets/batchDelete', params)
    }

    this.actions_store = (params) =>
    {
        return postForm('Wallets/Actions/store', params);
    }

    this.actions_batchDelete = (params) =>
    {
        return post('Wallets/Actions/batchDelete', params);
    }

    this.actions_funds_transfer = (params) =>
    {
        return postForm('Wallets/Actions/Funds/transfer', params);
    }

    this.actions_funds_store = (params) =>
    {
        return postForm('Wallets/Actions/Funds/store', params);
    }

    this.actions_search = (params) =>
    {
        return post('Wallets/Actions/search', params);
    }

    this.actions_owner_show = (params) =>
    {
        return post('Wallets/Actions/Owners/show', params);
    }

    this.actions_funds_transfer_batchConfirm = (params) =>
    {
        return post('Wallets/UnconfirmedActions/Funds/transfer_batchConfirm', params);
    }

    this.unconfirmed_actions_batchDelete = (params) =>
    {
        return post('Wallets/UnconfirmedActions/batchDelete', params);
    }

    this.unconfirmed_actions_search = (params) =>
    {
        return post('Wallets/UnconfirmedActions/search', params);
    }

}

VisitorModel = function()
{
    this.store = (params) =>
    {
        return post('Visitors/store', params);
    }

    this.search = (params) =>
    {
        return post('Visitors/search', params);
    }

    this.batchDelete = (params) =>
    {
        return post('Visitors/batchDelete', params);
    }
}

CustomerModel = function()
{
    this.store = (params) =>
    {
        return post('Customers/store', params);
    }

    this.update = (params) =>
    {
        return post('Customers/update', params);
    }

    this.search = (params) =>
    {
        return post('Customers/search', params);
    }

    this.batchDelete = (params) =>
    {
        return post('Customers/batchDelete', params);
    }

    this.show = (params) =>
    {
        return post('Customers/show', params);
    }

    this.dept_action_search = (params) => 
    {
        return post('Customers/Depts/Actions/search', params)
    }

    this.dept_action_batchDelete = (params) => 
    {
        return post('Customers/Depts/Actions/batchDelete', params)
    }

    this.dept_pay = (params) => 
    {
        return post('Customers/Depts/pay', params)
    }
}

ContractorModel = function()
{

    this.show = (params) =>
    {
        return post('Contractors/show', params);
    }

    this.search = (params) =>
    {
        return post('Contractors/search', params);
    }

    this.store = (params, progress) => 
    {
        return postFormWithProgress('Contractors/store', params, progress)
    }

    this.update = (params, progress) => 
    {
        return postFormWithProgress('Contractors/update', params, progress)
    }

    this.batchDelete = (params) => 
    {
        return post('Contractors/batchDelete', params)
    }

    // Dues
    this.dues_action_search = (params) => 
    {
        return post('Contractors/Dues/Actions/search', params)
    }

    this.dues_action_batchDelete = (params) => 
    {
        return post('Contractors/Dues/Actions/batchDelete', params)
    }

    this.dues_pay = (params) => 
    {
        return post('Contractors/Dues/pay', params)
    }

    // Depts
    this.depts_action_search = (params) => 
    {
        return post('Contractors/Depts/Actions/search', params)
    }

    this.depts_action_batchDelete = (params) => 
    {
        return post('Contractors/Depts/Actions/batchDelete', params)
    }

    this.dept_pay = (params) => 
    {
        return post('Contractors/Depts/pay', params)
    }

}
    
})


