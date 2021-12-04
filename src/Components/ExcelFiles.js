import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
// import { useNavigate } from "react-router-dom";
import ExcelViewer from "./ExcelViewer";

function ExcelFiles() {
    const [file, setFile] = useState(null);
    const [excelAccessToken, setExcelAccessToken] = useState("");
    const [allFiles, setAllFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [reload, setReload] = useState(1);

    const onFileChange = (e) => {
        setFile(e.target.files[0]);
        // console.log(e.target.files[0]);
    };
    useEffect(() => {
        const accessToken = localStorage.getItem("excelAccessToken");
        setExcelAccessToken(accessToken);
        const getFilesData = async () => {
            try {
                const url = `${process.env.REACT_APP_API_URL}/excel/get-files`;
                const config = {
                    headers: {
                        authorization: `Bearer ${accessToken}`,
                    },
                };
                const files = await axios.get(url, config);
                setAllFiles(files.data);
                setSelectedFile(files.data[0]);
                // console.log(files);
            } catch (error) {
                alert("No File Found");
            }
        };
        getFilesData();
    }, [reload]);
    const onUpload = () => {
        const upload = async () => {
            try {
                const url = `${process.env.REACT_APP_API_URL}/excel/upload-file`;
                const formData = new FormData();
                formData.append("file", file);
                const config = {
                    headers: {
                        "content-type": "multipart/form-data",
                        authorization: `Bearer ${excelAccessToken}`,
                    },
                };
                const result = await axios.post(url, formData, config);
                // console.log(result);
                alert("Upload successful");
                setReload(reload + 1);
                // setFile(null)
            } catch (error) {
                alert("Could not upload");
            }
        };
        upload();
    };
    const [render, setRender] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.value !== "none") {
            var fileId = e.target.value.slice(8, -5);
            setSelectedFile(fileId);
            // console.log(e.target.value);
            setRender(true);
        } else {
            setRender(false);
        }
    };
    return (
        <div>
            <div>
                <div style={{ width: "40%", margin: "auto" }}>
                    <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>Upload .xlsx File</Form.Label>
                        <Form.Control
                            type="file"
                            name="file"
                            onChange={onFileChange}
                        />
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <Button
                                variant="outline-success"
                                style={{ margin: "5px" }}
                                onClick={onUpload}
                            >
                                Upload
                            </Button>
                        </div>
                    </Form.Group>
                </div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                    }}
                >
                    <h3>All Files</h3>
                    <Form.Select onChange={handleFileChange}>
                        <option value="none">Select File</option>
                        {allFiles.map((file, index) => {
                            var trimFile = file.slice(8, -18);
                            return (
                                <option key={index} value={file}>
                                    {trimFile}
                                </option>
                            );
                        })}
                    </Form.Select>
                </div>
            </div>
            <div>
                <ExcelViewer
                    fileId={selectedFile}
                    excelAccessToken={excelAccessToken}
                    render={render}
                />
            </div>
        </div>
    );
}

export default ExcelFiles;
