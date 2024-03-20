$(function () {

    let RINGING_BELL_PUSH_NOTIFICATIONS_SOCKET_MODEL_RECEIVER = new SocketModel()
    
    RINGING_BELL_PUSH_NOTIFICATIONS_SOCKET_MODEL_RECEIVER.connect()
    .joinChannel(DEFAULT_INI_SETTINGS.Socket_Settings.RINGING_BELL_PUSH_NOTIFICATIONS_CHANNEL)
    .mcast().onmessage(e =>
    {
        const message = e.data
        console.log(message)
        if ( message.to.employee_type_id != USER_CONFIG.employee_type_id ) return

        // check permission
        if ( !checkPermission('receive_ringing_bell_notifications') ) return
        // check notificationBack
        if ( message.notificationBack )
        {
            
            CreateToast('PS', message.notificationBack.body, message.notificationBack.title)
            return
        }
        // dispatch bell ringing message
        var onRingingBellFound = new CustomEvent('ringing-bell-found', { 
            detail: { 
                data: message,
                USER_CONFIG: USER_CONFIG,
            } 
        });
        document.dispatchEvent(onRingingBellFound)
    })

})