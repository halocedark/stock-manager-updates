const axios = require('axios');
const qs = require('qs');

onmessage = async (e) =>
{
    var message = e.data
    const USER_CONFIG = message.USER_CONFIG
    const DEFAULT_INI_SETTINGS = message.DEFAULT_INI_SETTINGS
    const API_END_POINT = DEFAULT_INI_SETTINGS.Server_Settings.DOCIT_API_END_POINT
    const EMP_TYPE_GENERAL_MANAGER = message.employee_types.EMP_TYPE_GENERAL_MANAGER
    const REQ_URL = `${API_END_POINT}users/create`

    // ignore if general manager
    // if ( USER_CONFIG.employee_type_code == EMP_TYPE_GENERAL_MANAGER ) {
    //     postMessage({
    //         id: DEFAULT_INI_SETTINGS.DOCIT_USER.USER_ID,
    //         name: DEFAULT_INI_SETTINGS.DOCIT_USER.USER_NAME,
    //     })
    //     return
    // }

    sendRequest()

    function sendRequest()
    {
        axios.post(REQ_URL, qs.stringify({
            email: `${USER_CONFIG.employee_hash}@gmail.com`,
            name: USER_CONFIG.employee_name,
            phone: USER_CONFIG.employee_phone,
            password: USER_CONFIG.employee_hash,
            email_verified_at: 'current_timestamp',
            related_project: 'STOCK_MANAGER',
        }), 
        {
            headers: { 
              "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
        })
        .then(res =>
        {
            console.log(res.data)
            postMessage(res.data.data)
        })
        .catch(error => {
            console.log(error)
        })
    }

}
