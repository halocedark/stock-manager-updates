const axios = require('axios');
const qs = require('qs');

onmessage = async (e) =>
{
    var message = e.data
    const USER_CONFIG = message.USER_CONFIG
    const DEFAULT_INI_SETTINGS = message.DEFAULT_INI_SETTINGS
    const API_END_POINT = DEFAULT_INI_SETTINGS.Server_Settings.API_END_POINT
    const REQ_URL = `${API_END_POINT}Employees/Types/Permissions/indexSelf`

    sendRequest()

    // setInterval(() => {
       
    //     sendRequest()

    // }, 60*1000); // 1 min

    function sendRequest()
    {
        axios.post(REQ_URL, qs.stringify({
            administration_id: USER_CONFIG.administration_id,
            employee_type_id: USER_CONFIG.employee_type_id,
            session_id: DEFAULT_INI_SETTINGS.Server_Settings.SESSION_ID,
        }), 
        {
            headers: { 
              "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
        })
        .then(res =>
        {
            console.log(res.data)
            postMessage(res.data)
        })
    }

}
