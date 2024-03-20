class ChunkFileUploader {
    constructor(options) 
    {
        if ( options.file == null )
        {
            throw new Error('File is required!')
        }
        
        this.endpoint = options.endpoint;
        this.file = options.file;
        this.name = this.uniqueId(20) + '_' + this.uniqueId(10)
        this.extension = this.file.name.split('.').pop()
        this.params = options.params || {}
        this.headers = options.headers || {};
        this.chunkSize = options.chunkSize || 500000; // 500 kb
        this.maxFileSize = options.maxFileSize;
        this.attempts = options.attempts || 5;
        this.delayBeforeAttempt = options.delayBeforeAttempt || 1;
        this.method = options.method || 'POST';
        this.dynamicChunkSize = options.dynamicChunkSize || false;
        this.maxChunkSize = options.maxChunkSize || 512000;
        this.minChunkSize = options.minChunkSize || 256;
        this.currentChunk = 0;
        // this.totalChunks = Math.ceil(this.file.size / this.chunkSize);
        this.totalChunks = Math.ceil(this.file.size / this.chunkSize);
        this.retryCounts = Array(this.totalChunks).fill(this.attempts);
        this.paused = false;
        this.uploading = false;
        this.events = {};
        this.startTime = 0;
        this.previousTime = 0;
        this.uploadedBytes = 0;
    }
    
    on(eventName, callback) 
    {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    }

    off(eventName, callback) 
    {
        if (this.events[eventName]) {
            const index = this.events[eventName].indexOf(callback);
            if (index !== -1) {
            this.events[eventName].splice(index, 1);
            }
        }
    }

    triggerEvent(eventName, detail) 
    {
        if (this.events[eventName]) 
        {
            for (const callback of this.events[eventName]) 
            {
                const event = new CustomEvent(eventName, { detail });
                callback(event);
            }
        }
    }

    async uploadChunk(chunk) 
    {
        
        const formData = new FormData();

        formData.append('chunk', chunk);
        formData.append('extension', this.extension);
        formData.append('name', this.name);
        formData.append('params', JSON.stringify(this.params) );
        formData.append('chunk_number', this.currentChunk);
        formData.append('total_chunks', this.totalChunks);

        try 
        {
            const now = Date.now();
            const elapsedTime = (now - this.startTime) / 1000; // in seconds

            const response = await fetch(this.getUploadUrl(), 
            {
                method: this.method,
                headers: this.getHeaders(),
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            this.triggerEvent('chunkSuccess', {
                chunk: this.currentChunk,
                attempts: this.attempts - this.retryCounts[this.currentChunk],
                response,
            });

            this.currentChunk++;
            
            this.uploadedBytes += chunk.size;

            // Calculate progress percentage
            const progress = (this.uploadedBytes / this.file.size) * 100;
            // Calculate transfer speed in KB/s
            const transferSpeed = (this.uploadedBytes / 1024) / elapsedTime;

            // Calculate time left in seconds
            const bytesRemaining = this.file.size - this.uploadedBytes;
            const timeLeft = (bytesRemaining / transferSpeed) || 0;

            // Trigger the 'progress' event with the updated data
            this.triggerEvent('progress', {
                progress,
                timeLeft,
                transferSpeed,
            });
            
            if (this.currentChunk < this.totalChunks && !this.paused) 
            {
                setTimeout(() => this.uploadNextChunk(), this.delayBeforeAttempt * 1000);
            } 
            else if (this.currentChunk === this.totalChunks) {
                
                this.triggerEvent('success', {
                    response: {
                        json: await response.json(),
                    }
                });
                this.uploading = false;
            }
        } 
        catch (error) 
        {
            if (this.retryCounts[this.currentChunk] > 0) 
            {
                setTimeout(() => this.uploadChunk(chunk), this.delayBeforeAttempt * 1000);
                this.retryCounts[this.currentChunk]--;
            } 
            else 
            {
                this.triggerEvent('error', 
                {
                    message: 'Max retries reached for chunk',
                    chunkNumber: this.currentChunk,
                    attempts: this.attempts - this.retryCounts[this.currentChunk],
                });
                this.uploading = false;
            }
        }
    }

    uploadNextChunk() 
    {
        if (!this.uploading || this.paused) {
            return;
        }

        const start = this.currentChunk * this.chunkSize;
        const end = Math.min(start + this.chunkSize, this.file.size);
        
        const chunk = this.file.slice(start, end);
        this.uploadChunk(chunk);
    }

    getUploadUrl() 
    {
        if (typeof this.endpoint === 'function') {
            return this.endpoint(this.file);
        }
        return this.endpoint;
    }

    getHeaders() 
    {
        if (typeof this.headers === 'function') {
            return this.headers(this.file);
        }
        return this.headers;
    }

    uniqueId(length = 10) 
    {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    pause() 
    {
        this.paused = true;
        this.triggerEvent('pause');
    }

    resume() 
    {
        this.paused = false;
        this.triggerEvent('resume');
        if (!this.uploading) {
            this.uploading = true;
            this.uploadNextChunk();
        }
    }

    abort() 
    {
        this.paused = true;
        this.triggerEvent('abort');
    }
}
