import React, { useState } from "react";
import axios from "axios";
function Upload() {
    const [file, setFile] = useState(null);
    const onFileChange = (e) => {
        setFile(e.target.files[0]);
    };
    const onUpload = () => {
        const url = "http://localhost:5000/excel/upload-file/";
        const formData = new FormData();
        formData.append("file", file);
        const config = {
            headers: {
                "content-type": "multipart/form-data",
                'authorization': "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2Mzg0NzUyMDYsImV4cCI6MTYzODU2MTYwNiwiYXVkIjoiNjFhOTE0MzY2YzJmYjEyYzFjYjNiODE3IiwiaXNzIjoiaHR0cDovL2tyb3ktcG9ydGZvbGlvLWZyb250ZW5kLmhlcm9rdWFwcC5jb20vIn0.GNUUbZzCaFToF-BZTHYkM523WoGNetR-x4U3h3EY79k"
            },
        };
        const result = axios.post(url, formData, config);
        console.log(result);
    };
    return (
        <div>
            <h3>Upload File</h3>
            <div>
                <input type="file" name='file' onChange={onFileChange} />
                <button onClick={onUpload}>Upload</button>
            </div>
        </div>
    );
}

export default Upload;
