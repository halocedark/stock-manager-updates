const AJAX_TIMEOUT_RETRY = 0

let patch
let _delete;
let post;
let postForm;
let postFormWithProgress
let get;

$(function()
{

// get
get = (url, options = {}) =>
{
    var defaultOptions = {
        API_END_POINT: API_END_POINT
    }

    options = {...defaultOptions, ...options}
    
    console.log(url);

    return $.ajax({
        url: options.API_END_POINT+url,
        timeout: AJAX_TIMEOUT_RETRY,
        headers : {
            'Accept': 'application/json',
        },
        type: 'GET',
        success: function(res)
        {
            console.log(res)
        },
        error: function(xhr, textStatus, errorThrown)
        {
            console.error(xhr)
            console.error(textStatus)
            console.error(errorThrown)

            if ( textStatus == 'timeout' )
            {
                CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error_server_connection, '')
                TopLoader('', false)
                ClearSectionLoaders()
                
                setTimeout( () =>
                {
                    deleteFile(USER_CONFIG_FILE, () =>
                    {
                        createWindow({
                            page: 'index.ejs',
                            name: 'WIN_LOGIN'
                        })
                        closeWindow('WIN_'+USER_CONFIG.LOGIN_TYPE);
                    })
                }, 3*1000 )

                return
            }

            // CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error, '')
            TopLoader('', false)
            ClearSectionLoaders()
        }
    });
}
// postForm
postForm = (url, params, options = {}) =>
{
    params.append('lang', FUI_DISPLAY_LANG.lang);
    params.append('current_administration_id', USER_CONFIG.administration_id);
	params.append('current_employee_id', USER_CONFIG.employee_id);
    params.append('current_employee_name', USER_CONFIG.employee_name);
    params.append('current_employee_type_id', USER_CONFIG.employee_type_id);
    params.append('current_employee_type_code', USER_CONFIG.employee_type_code);

    params.append('session_id', DEFAULT_INI_SETTINGS.Server_Settings.SESSION_ID)

    var defaultOptions = {
        API_END_POINT: API_END_POINT
    }

    options = {...defaultOptions, ...options}

    console.log(url);

    return $.ajax({
        url: options.API_END_POINT+url,
        timeout: AJAX_TIMEOUT_RETRY,
        headers : {
            'Accept': 'application/json',
        },
        type: 'POST',
        contentType:false,
        processData: false,
        data: params,
        success: function(res)
        {
            console.log(res)
        },
        error: function(xhr, textStatus, errorThrown)
        {
            console.error(xhr)
            console.error(textStatus)
            console.error(errorThrown)

            if ( textStatus == 'timeout' )
            {
                CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error_server_connection, '')
                TopLoader('', false)
                ClearSectionLoaders()
                
                // setTimeout( () =>
                // {
                //     deleteFile(USER_CONFIG_FILE, () =>
                //     {
                //         createWindow({
                //             page: 'index.ejs',
                //             name: 'WIN_LOGIN'
                //         })
                //         closeWindow('WIN_'+USER_CONFIG.LOGIN_TYPE);
                //     })
                // }, 3*1000 )

                return
            }

            // CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error, '')
            TopLoader('', false)
            ClearSectionLoaders()
        }
    });
}
// postFormWithProgress
postFormWithProgress = (url, params, progress, options = {}) =>
{ 
    let UPLOAD_START_TIME;

    params.append('lang', FUI_DISPLAY_LANG.lang);

    params.append('current_administration_id', USER_CONFIG.administration_id);
	params.append('current_employee_id', USER_CONFIG.employee_id);
    params.append('current_employee_name', USER_CONFIG.employee_name);
    params.append('current_employee_type_id', USER_CONFIG.employee_type_id);
    params.append('current_employee_type_code', USER_CONFIG.employee_type_code);

    params.append('session_id', DEFAULT_INI_SETTINGS.Server_Settings.SESSION_ID)

    var defaultOptions = {
        API_END_POINT: API_END_POINT
    }

    options = {...defaultOptions, ...options}

    console.log(url);

    return $.ajax({
        xhr: function() 
	    {
	        var xhr = new XMLHttpRequest();
	        // var lastNow = new Date().getTime();
			// var lastKBytes = 0;
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

	                progress({
                        e, 
                        timeleft: timeleft.toFixed(0), 
                        transferSpeed, 
                        percentComplete
                    });
	            }
	        }, false);
	        return xhr;
	    },
        url: options.API_END_POINT+url,
        timeout: AJAX_TIMEOUT_RETRY,
        headers : {
            'Accept': 'application/json',
        },
        type: 'POST',
        contentType:false,
        processData: false,
        data: params,
        success: function(res)
        {
            console.log(res)
        },
        error: function(xhr, textStatus, errorThrown)
        {
            console.error(xhr)
            console.error(textStatus)
            console.error(errorThrown)

            if ( textStatus == 'timeout' )
            {
                CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error_server_connection, '')
                TopLoader('', false)
                ClearSectionLoaders()
                
                // setTimeout( () =>
                // {
                //     deleteFile(USER_CONFIG_FILE, () =>
                //     {
                //         createWindow({
                //             page: 'index.ejs',
                //             name: 'WIN_LOGIN'
                //         })
                //         closeWindow('WIN_'+USER_CONFIG.LOGIN_TYPE);
                //     })
                // }, 3*1000 )

                return
            }

            // CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error, '')
            TopLoader('', false)
            ClearSectionLoaders()
        },
        beforeSend: function(e)
	    {
	    	// Set start time
			UPLOAD_START_TIME = new Date().getTime()
	    }
    });
}

// post
post = (url, params, options = {}) =>
{ 
    params['lang'] = FUI_DISPLAY_LANG.lang;

    params['current_administration_id'] = USER_CONFIG.administration_id
	params['current_employee_id'] = USER_CONFIG.employee_id
    params['current_employee_name'] = USER_CONFIG.employee_name
    params['current_employee_type_id'] = USER_CONFIG.employee_type_id
    params['current_employee_type_code'] = USER_CONFIG.employee_type_code

    params['session_id'] = DEFAULT_INI_SETTINGS.Server_Settings.SESSION_ID

    var defaultOptions = {
        API_END_POINT: API_END_POINT
    }
    
    options = {...defaultOptions, ...options}

    console.log(options.API_END_POINT+url);

    return $.ajax({
        url: options.API_END_POINT+url,
        timeout: AJAX_TIMEOUT_RETRY,
        headers : {
            'Accept': 'application/json',
        },
        type: 'POST',
        data: params,
        success: function(res)
        {
            console.log(res)
        },
        error: function(xhr, textStatus, errorThrown)
        {
            console.error(xhr)
            console.error(textStatus)
            console.error(errorThrown)

            if ( textStatus == 'timeout' )
            {
                CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error_server_connection, '')
                TopLoader('', false)
                ClearSectionLoaders()
                
                // setTimeout( () =>
                // {
                //     deleteFile(USER_CONFIG_FILE, () =>
                //     {
                //         createWindow({
                //             page: 'index.ejs',
                //             name: 'WIN_LOGIN'
                //         })
                //         closeWindow('WIN_'+USER_CONFIG.LOGIN_TYPE);
                //     })
                // }, 3*1000 )

                return
            }

            // CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error, '')
            TopLoader('', false)
            ClearSectionLoaders()
        }
    });
}
// delete
_delete = (url, options = {}) =>
{
    var defaultOptions = {
        API_END_POINT: API_END_POINT
    }

    options = {...defaultOptions, ...options}
    
    console.log(url);

    return $.ajax({
        url: options.API_END_POINT+url,
        timeout: AJAX_TIMEOUT_RETRY,
        headers : {
            'Accept': 'application/json',
        },
        type: 'DELETE',
        success: function(res)
        {
            console.log(res)
        },
        error: function(xhr, textStatus, errorThrown)
        {
            console.error(xhr)
            console.error(textStatus)
            console.error(errorThrown)

            if ( textStatus == 'timeout' )
            {
                CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error_server_connection, '')
                TopLoader('', false)
                ClearSectionLoaders()
                
                // setTimeout( () =>
                // {
                //     deleteFile(USER_CONFIG_FILE, () =>
                //     {
                //         createWindow({
                //             page: 'index.ejs',
                //             name: 'WIN_LOGIN'
                //         })
                //         closeWindow('WIN_'+USER_CONFIG.LOGIN_TYPE);
                //     })
                // }, 3*1000 )

                return
            }

            // CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error, '')
            TopLoader('', false)
            ClearSectionLoaders()
        }
    });
}

// patch
patch = (url, params, options = {}) =>
{ 
    params['lang'] = FUI_DISPLAY_LANG.lang;

    params['current_administration_id'] = USER_CONFIG.administration_id
	params['current_employee_id'] = USER_CONFIG.employee_id
    params['current_employee_name'] = USER_CONFIG.employee_name
    params['current_employee_type_id'] = USER_CONFIG.employee_type_id
    params['current_employee_type_code'] = USER_CONFIG.employee_type_code

    params['session_id'] = DEFAULT_INI_SETTINGS.Server_Settings.SESSION_ID

    var defaultOptions = {
        API_END_POINT: API_END_POINT
    }
    
    options = {...defaultOptions, ...options}

    console.log(options.API_END_POINT+url);

    return $.ajax({
        url: options.API_END_POINT+url,
        timeout: AJAX_TIMEOUT_RETRY,
        headers : {
            'Accept': 'application/json',
        },
        type: 'PATCH',
        data: params,
        success: function(res)
        {
            console.log(res)
        },
        error: function(xhr, textStatus, errorThrown)
        {
            console.error(xhr)
            console.error(textStatus)
            console.error(errorThrown)

            if ( textStatus == 'timeout' )
            {
                CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error_server_connection, '')
                TopLoader('', false)
                ClearSectionLoaders()
                
                // setTimeout( () =>
                // {
                //     deleteFile(USER_CONFIG_FILE, () =>
                //     {
                //         createWindow({
                //             page: 'index.ejs',
                //             name: 'WIN_LOGIN'
                //         })
                //         closeWindow('WIN_'+USER_CONFIG.LOGIN_TYPE);
                //     })
                // }, 3*1000 )

                return
            }

            // CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error, '')
            TopLoader('', false)
            ClearSectionLoaders()
        }
    });
}

})