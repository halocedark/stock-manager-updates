function fileToDataURL(File)
{
	return new Promise((resolve, reject) =>
	{
		var reader = new FileReader();

		reader.onload = () =>
		{
			resolve( reader.result );
		};

		if ( File == null )
		{
			reject('Image File is not specified');
			return;
		}

		reader.readAsDataURL(File);
	});
}

onmessage = async (e) =>
{
    var message = e.data
    const FILES = message.files
    
    var DATA_URLS = []

    for (let i = 0; i < FILES.length; i++) 
    {
        const file = FILES[i]
        
        DATA_URLS.push({
			name: file.name,
			url: await fileToDataURL(file),
		})
    }

    postMessage(DATA_URLS)

}