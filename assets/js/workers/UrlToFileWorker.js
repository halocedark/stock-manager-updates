async function urlToBlob(url)
{
	var res = await fetch(url)
	
	return await res.blob()
}

// blob to file
function blobToFile(blob, filename)
{
	const file = new File([blob], filename, {
		type: blob.type,
		lastModified: new Date()
	});

	return file;
}

async function urlToFile(url, options = {})
{
	const blob = await urlToBlob(url)

	return blobToFile(blob, (options.file) ? options.file.name : '')
}

onmessage = async (e) =>
{
    var message = e.data
    const DATA_FILES = message.data
    
    var FILES = []

    for (let i = 0; i < DATA_FILES.length; i++) 
    {
        const data = DATA_FILES[i]
        
        FILES.push( await urlToFile(data.url, {
			file: {
				name: data.name,
			}
		}) )
    }

    postMessage(FILES)

}