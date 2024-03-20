$(function () {

    let EMPLOYEE_PRIVILEGES_PUSH_NOTIFICATIONS_SOCKET_MODEL_RECEIVER = new SocketModel()
    
    EMPLOYEE_PRIVILEGES_PUSH_NOTIFICATIONS_SOCKET_MODEL_RECEIVER.connect()
    .joinChannel(DEFAULT_INI_SETTINGS.Socket_Settings.EMPLOYEE_PRIVILEGES_PUSH_NOTIFICATIONS_CHANNEL)
    .mcast().onmessage(e =>
    {
        const message = e.data

        console.log(message)

        //
        EmployeePrivilegesWorker.postMessage({
            USER_CONFIG: USER_CONFIG,
            DEFAULT_INI_SETTINGS: DEFAULT_INI_SETTINGS,
        })

    })


})