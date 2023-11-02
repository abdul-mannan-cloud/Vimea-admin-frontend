import React, { useRef, useState } from 'react';
import AWS from 'aws-sdk';

const spacesEndpoint = new AWS.Endpoint('nyc3.digitaloceanspaces.com');
const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: 'DO00B86B2J6M8JRAFFMR',
    secretAccessKey: 'XxvAhR8M2aF8ZYDliQ5kuvDvKEMwIr1BKUKJi7g7Bv4'
});

const bucketName = 'vimea';  

const FileUpload = ({ imageType }) => { 
    const fileInput = useRef();
    const [uploadedFile, setUploadedFile] = useState(null);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const timestamp = Date.now(); // Get the current time
            const uniqueFileName = `${imageType}-${file.name}-${timestamp}`; // Create a unique file name

            console.log(`Uploading ${uniqueFileName}`); // Print the unique file name

            const params = {
                Body: file,
                Bucket: bucketName,
                Key: uniqueFileName, // Use the unique file name as the key
                ACL: 'public-read'  
            };

            s3.putObject(params)
                .on('build', request => {
                    request.httpRequest.headers.Host = `${bucketName}.${spacesEndpoint.hostname}`;
                    request.httpRequest.headers['Content-Length'] = file.size;
                    request.httpRequest.headers['Content-Type'] = file.type;
                    request.httpRequest.headers['x-amz-acl'] = 'public-read';
                })
                .send((err) => {
                    if (err) console.log(err);
                    else {
                        console.log('Upload Success');
                        setUploadedFile(uniqueFileName); // Save the unique file name
                    }
                });
        }
    };

    const checkFileExists = () => {
        if (!uploadedFile) return;

        const params = {
            Bucket: bucketName,
            Key: uploadedFile
        };

        s3.headObject(params, function(err, data) {
            if (err) console.log('File not found');
            else console.log('File found');
        });
    };

    return (
        <div>
            <input type="file" ref={fileInput} onChange={handleImageChange} />
            <button onClick={checkFileExists}>Check if File Exists</button>
        </div>
    );
};

export default FileUpload;
