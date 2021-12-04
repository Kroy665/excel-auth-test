import React,{useEffect, useState} from 'react'
import axios from 'axios'
import * as XLSX from "xlsx";

function GetFile() {
    const [file, setFile] = useState(null)
    const [fileData, setFileData] = useState([])
    useEffect(() => {
        const getFile = async() =>{
            try {
                const response = await axios({
                    url: 'http://localhost:5000/excel/get-file/Upwork_test_excel.xlsx1638519013833',
                    method: 'GET',
                    responseType: 'blob',
                    headers: {
                        'authorization': "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2Mzg0NzUyMDYsImV4cCI6MTYzODU2MTYwNiwiYXVkIjoiNjFhOTE0MzY2YzJmYjEyYzFjYjNiODE3IiwiaXNzIjoiaHR0cDovL2tyb3ktcG9ydGZvbGlvLWZyb250ZW5kLmhlcm9rdWFwcC5jb20vIn0.GNUUbZzCaFToF-BZTHYkM523WoGNetR-x4U3h3EY79k"
                    },
                })
                // .then((response) => {
                //     const url = window.URL.createObjectURL(new Blob([response.data]));
                //     console.log(url);
                //     // const link = document.createElement('a');
                //     // console.log(link);
                //     // link.href = url;
                //     // link.setAttribute('download', 'file.pdf'); //or any other extension
                //     // document.body.appendChild(link);
                //     // link.click();
                // });
                // console.log(response)
                console.log(response.data)
                setFile(response.data)
            } catch (error) {
                alert(error.message)
            }
        }
        getFile()
    }, [])

    const convertToJson = (csv) => {
        var lines = csv.split("\n");
        var result = [];
        for (var i = 0; i < lines.length - 1; i++) {
            var line = [];
            var currentline = lines[i].split(",");
            for (var j = 0; j < currentline.length; j++) {
                line.push(currentline[j]);
            }
            result.push(line);
        }
        return result;
    };

    const seeData=()=>{
        if (file !== null) {
            const reader = new FileReader();
            reader.onload = (evt) => {
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: "binary" });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const csvData = XLSX.utils.sheet_to_csv(ws, { header: 1 });
                const data = convertToJson(csvData);
                setFileData(data);
                // console.log(data);
            };
            reader.readAsBinaryString(file);
        }else{

            alert("upload failed")
        }
    }

    return (
        <div>
            Get File
            <button onClick={seeData}>See Data</button>
            {fileData}
        </div>
    )
}

export default GetFile
