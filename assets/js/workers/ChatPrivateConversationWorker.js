const axios = require('axios');
const qs = require('qs');

onmessage = async (e) =>
{
    var message = e.data
    const OPERATION = message.operation
    const USER_CONFIG = message.USER_CONFIG
    const DEFAULT_INI_SETTINGS = message.DEFAULT_INI_SETTINGS
    const API_END_POINT = DEFAULT_INI_SETTINGS.Server_Settings.API_END_POINT
    const CHAT = message.chat

    if ( OPERATION == 'send' )
    {
        // send message
        const sendURL = `${API_END_POINT}Chats/Conversations/Private/store`

        const ChatObject = {
            lang: DEFAULT_INI_SETTINGS.UI_Settings.DISPLAY_LANG,
            current_employee_id: USER_CONFIG.employee_id,
            current_employee_type_id: USER_CONFIG.employee_type_id,
            sender_id: USER_CONFIG.employee_id,
            sender_name: USER_CONFIG.employee_name,
            sender_phone: USER_CONFIG.employee_phone,
            sender_type: 'employees',
            receiver_id: CHAT.receiver.patientId,
            receiver_name: CHAT.receiver.patientName,
            receiver_phone: CHAT.receiver.patientPhone,
            receiver_type: 'patients',
            body: CHAT.body,
            media: CHAT.media,
        }

        axios.post(sendURL, qs.stringify(ChatObject) , {
            headers: { 
              "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
        })
        .then(res =>
        {
            search()
        })  
    }

    // retrieve messages
    search()
    setInterval(() => {
        search()
    }, 5*1000);

    function search()
    {
        const searchURL = `${API_END_POINT}Chats/Conversations/Private/search`
        const SearchObject = {
            query: '',
            advanced: {
                sender_id: USER_CONFIG.employee_id,
                sender_type: 'employees',
                receiver_id: CHAT.receiver.patientId,
                receiver_type: 'patients',
            }
        }

        axios.post(searchURL, qs.stringify(SearchObject) , {
            headers: { 
              "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
        })
        .then(res =>
        {
            // console.log(res)
            if ( res.data.code == 404 ) return
            postMessage(res.data)
        })
    }

}