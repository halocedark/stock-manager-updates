$(function () {

    let GLOBAL_NOTIFICATIONS_PUSH_NOTIFICATIONS_SOCKET_MODEL_RECEIVER = new SocketModel()

    GLOBAL_NOTIFICATIONS_PUSH_NOTIFICATIONS_SOCKET_MODEL_RECEIVER
        .connect()
        .joinChannel(DEFAULT_INI_SETTINGS.Socket_Settings.GLOBAL_NOTIFICATIONS_PUSH_NOTIFICATIONS_CHANNEL)
        .mcast().onmessage(e => {
            const message = e.data

            // check permission
            if ( !checkPermission('receive_global_notifications') ) return
            //
            fetchNotifications()
        })

    // fetch messages
    async function fetchNotifications() {
        try {
            const res = await NOTIFICATION_MODEL.search({
                query: '',
                advanced: {
                    is_read: ST_NO,
                    receiver_id: USER_CONFIG.employee_id,
                    receiver_type_code: 'employees',
                    select: {
                        search: 'SELECT * FROM',
                        replace: 'SELECT COUNT(id) as total FROM',
                    }
                }
            })

            if (res.code == 404) return;

            // dispatch event
            var onNewNotificationsFound = new CustomEvent('new-notifications-found', {
                detail: {
                    data: res.data[0].total,
                    USER_CONFIG: USER_CONFIG,
                }
            });
            document.dispatchEvent(onNewNotificationsFound)

        } catch (error) {

        }
    }


})