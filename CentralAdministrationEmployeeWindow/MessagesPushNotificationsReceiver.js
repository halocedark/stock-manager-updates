$(function () {

    let MESSAGES_PUSH_NOTIFICATIONS_SOCKET_MODEL_RECEIVER = new SocketModel()

    MESSAGES_PUSH_NOTIFICATIONS_SOCKET_MODEL_RECEIVER
    .connect()
    .joinChannel(DEFAULT_INI_SETTINGS.Socket_Settings.MESSAGES_PUSH_NOTIFICATIONS_CHANNEL)
    .mcast().onmessage(async e =>
    {
        const message = e.data

        if ( message.to )
        {
            if ( message.to.employee_hash == USER_CONFIG.employee_hash )
            {
                // check permission
                if ( !checkPermission('receive_message_notifications') ) return
                //
                CreateToast('PS', strSnippet(message.notification.body, 50), strSnippet(message.notification.title, 20), 60*34000)

                // create notification
                try {
                    await NOTIFICATION_MODEL.store({
                        receiver_id: USER_CONFIG.employee_id,
                        receiver_name: USER_CONFIG.employee_name,
                        receiver_type_code: 'employees',
                        message: message.notification.body,
                    })

                    GLOBAL_NOTIFICATIONS_PUSH_NOTIFICATIONS_SENDER.mcast().send({})
                } catch (error) {
                    console.error(error)
                }
            }    
        }
        
        setTimeout(() => {
            fetchMesssages()
        }, 5 * 1000);
    
        setTimeout(() => {
            fetchReplies()
        }, 8 * 1000);
    })

    setTimeout(() => {
        fetchMesssages()
    }, 5 * 1000);

    setTimeout(() => {
        fetchReplies()
    }, 8 * 1000);

    // fetch messages
    async function fetchMesssages() {
        try {
            const res = await MESSAGE_MODEL.inbox({
                userHash: USER_CONFIG.employee_hash,
                isRead: 0
            })

            if (res.code == 404) return;

            // dispatch event
            var onNewMessagesFound = new CustomEvent('new-messages-found', {
                detail: {
                    data: res.data,
                    USER_CONFIG: USER_CONFIG,
                }
            });
            document.dispatchEvent(onNewMessagesFound)
        } catch (error) {

        }
    }
    // fetch replies
    async function fetchReplies() {
        try {
            const res = await MESSAGE_MODEL.replies({
                userHash: USER_CONFIG.employee_hash,
                folder: 'inbox',
                isNotified: ST_NO
            })

            if (res.code == 404) return;

            // dispatch event
            var onNewRepliesFound = new CustomEvent('new-message-replies-found', {
                detail: {
                    data: res.data,
                    USER_CONFIG: USER_CONFIG,
                }
            });
            document.dispatchEvent(onNewRepliesFound)
        } catch (error) {

        }
    }

})