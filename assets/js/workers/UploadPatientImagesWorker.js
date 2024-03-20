const fs = require('fs');
const axios = require('axios');
// const get_file_object_from_local_path = require('get-file-object-from-local-path')
var mime = require('mime-types')

// indexDirFiles
function indexDirFiles(dir, options = {})
{
	var files = fs.readdirSync(dir, options)
	var results = {
		fullpaths: [],
		names: [],
		clean_names: [],
	}

	if ( files.length == 0 ) return results

	results.fullpaths = files.map( (val) => dir+'/'+val )
	results.names = files
	results.clean_names = files.map( (val) => path.parse(val).name )
	return results
}
// buffer to blob
function bufferToBlob(buffer, options)
{
	return new Blob([buffer], options);
}
// blob to file
function blobToFile (blob, filename)
{
	const file = new File([blob], filename, {
		type: blob.type,
		lastModified: new Date()
	});

	return file;
}

onmessage = async (e) =>
{
    var message = e.data
    const USER_CONFIG = message.USER_CONFIG
    const API_END_POINT = message.DEFAULT_INI_SETTINGS.Server_Settings.API_END_POINT
    const DEFAULT_INI_SETTINGS = message.DEFAULT_INI_SETTINGS
    const CURRENT_DATE = message.date_time.CURRENT_DATE
    const CURRENT_TIME = message.date_time.CURRENT_TIME

    setInterval( async () =>
    {

       // list dir files
        const weight_images = indexDirFiles(DEFAULT_INI_SETTINGS.General_Settings.PATIENT_WEIGHT_IMAGES_PATH)
        const med_analysis_images = indexDirFiles(DEFAULT_INI_SETTINGS.General_Settings.PATIENT_MEDICAL_ANALYSIS_IMAGES_PATH)
       
        // upload weight images 1 by 1
        for (let i = 0; i < weight_images.fullpaths.length; i++) 
        {
            const fullpath = weight_images.fullpaths[i];
            const name = weight_images.names[i];
            const clean_name = weight_images.clean_names[i];
            
            const name_array = clean_name.split('-')

            const patientId = name_array[0]

            // upload 
            const CHANGED_SETTINGS_TARGET_URL = API_END_POINT+'Patients/addChangedSettings'
            const weight = name_array[1]

            var blob = bufferToBlob( fs.readFileSync(fullpath), {
                type: mime.lookup(fullpath)
            } )
            var patient_doc = blobToFile( blob, name )

            var form_data = new FormData
            form_data.append('lang', 'ar')
            form_data.append('PatientObject', JSON.stringify({
                patientCode: patientId,
                weight: weight,
                infoDate: CURRENT_DATE,
                infoTime: CURRENT_TIME,
            }) )
            form_data.append('patient_doc', patient_doc);

            try 
            {

                var res = await axios.post(CHANGED_SETTINGS_TARGET_URL, form_data)

                var data = res.data
                console.log(data)
                if ( data.code == 404 ) return

                // delete image
                fs.unlinkSync(fullpath)
                
            } catch (error) {
                console.error(error)
            }   

        }
        // upload medical analysis images 1 by 1
        for (let i = 0; i < med_analysis_images.fullpaths.length; i++) 
        {
            const fullpath = med_analysis_images.fullpaths[i];
            const name = med_analysis_images.names[i];
            const clean_name = med_analysis_images.clean_names[i];

            const patientId = clean_name

            // upload medical tests
            const MED_ANALISYS_TARGET_URL = API_END_POINT+'Patients/MedicalTests/store'
            var blob = bufferToBlob( fs.readFileSync(fullpath), {
                type: mime.lookup(fullpath)
            } )
            var image = blobToFile( blob, name )

            var form_data = new FormData
            form_data.append('lang', 'ar')
            form_data.append('PatientObject', JSON.stringify({
                patientCode: patientId,
                clinicId: USER_CONFIG.administration.clinicId,
                created_at_date: CURRENT_DATE,
                created_at_time: CURRENT_TIME,
            }) )
            form_data.append('images[]', image);

            try 
            {

                var res = await axios.post(MED_ANALISYS_TARGET_URL, form_data)

                var data = res.data
                console.log(data)
                if ( data.code == 404 ) return

                // delete image
                fs.unlinkSync(fullpath)
                
            } catch (error) {
                console.error(error)
            }   

        } 

    }, 10 * 1000 )

    
}