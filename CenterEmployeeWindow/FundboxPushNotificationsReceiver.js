$(function () {

    let FUNDBOX_PUSH_NOTIFICATIONS_SOCKET_MODEL_RECEIVER = new SocketModel()
    
    FUNDBOX_PUSH_NOTIFICATIONS_SOCKET_MODEL_RECEIVER.connect()
    .joinChannel(DEFAULT_INI_SETTINGS.Socket_Settings.FUNDBOX_PUSH_NOTIFICATIONS_CHANNEL)
    .mcast().onmessage(e =>
    {
        const message = e.data
        
        if ( message.to.employee_id != USER_CONFIG.employee_id ) return

        // check permission
        if ( !checkPermission('receive_fundbox_notifications') ) return
        
        CreateToast('PS', message.notification.body, strSnippet(message.notification.title, 20), 60*34000)
    })

})