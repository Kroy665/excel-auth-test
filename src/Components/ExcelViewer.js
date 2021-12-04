import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import { Form, Button } from "react-bootstrap";
import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";

registerAllModules();

function ExcelViewer(props) {
    const [file, setFile] = useState(null);
    const [fileSaved, setFileSaved] = useState(false)
    const [savedFileData, setSavedFileData] = useState(null)

    const [fileData, setFileData] = useState([]);
    const hotTableComponent = useRef(null);
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

    useEffect(() => {
        const getFile = async () => {
            try {
                const url = `${process.env.REACT_APP_API_URL}/excel/get-file/${props.fileId}`;
                const response = await axios({
                    url: url,
                    method: "GET",
                    responseType: "blob",
                    headers: {
                        authorization: `Bearer ${props.excelAccessToken}`,
                    },
                });
                // console.log(response);
                setFile(response.data);
            } catch (error) {
                alert("Could not get new file");
            }
        };
        if (props.render === true) {
            getFile();
        }
    }, [props]);

    const [onOpen, setOnOpen] = useState(false);
    const onOpenFile = () => {
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
                // console.log(ws);
            };
            reader.readAsBinaryString(file);
            setOnOpen(true);
        }
    };

    const addColumn = () => {
        var newFileData = fileData;
        for (let i = 0; i < newFileData.length; i++) {
            newFileData[i].push("");
        }
        setFileData(newFileData);
        hotTableComponent.current.hotInstance.loadData(newFileData);
    };
    const addRow = () => {
        var newFileData = fileData;
        var numOfRow = newFileData[0].length;
        var newRow = [];
        for (let i = 0; i < numOfRow; i++) {
            newRow.push("");
        }
        newFileData.push(newRow);
        setFileData(newFileData);
        hotTableComponent.current.hotInstance.loadData(newFileData);
    };

    const [rowDel, setRowDel] = useState("");
    const deleteRow = () => {
        var newFileData = fileData;
        if (parseInt(rowDel) > 0) {
            newFileData.splice(parseInt(rowDel) - 1, 1);
            setFileData(newFileData);
            hotTableComponent.current.hotInstance.loadData(newFileData);
        } else {
            alert("Please select correct row value");
        }
    };

    const [clmDel, setClmDel] = useState("");
    const deleteClm = () => {
        var newFileData = fileData;

        var clm = clmDel[0].toUpperCase();
        // console.log(clm);
        let pos = clm.charCodeAt(0) - 65;
        // console.log(pos);
        if (pos >= 0 && pos <= 26) {
            for (let i = 0; i < newFileData.length; i++) {
                newFileData[i].splice(pos, 1);
            }
            setFileData(newFileData);
            hotTableComponent.current.hotInstance.loadData(newFileData);
        } else {
            alert("Please select correct column value");
        }
    };

    const onSave = () => {
        // console.log(fileData);
        try {
            var jsonData = [];
            var headers = fileData[0];
            for (let i = 1; i < fileData.length; i++) {
                const ele = fileData[i];
                var line = {};
                for (let j = 0; j < headers.length; j++) {
                    line[headers[j]] = ele[j];
                }
                jsonData.push(line);
            }

            const fileName = props.fileId.slice(0, -13);

            const fileType =
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            var wb = XLSX.utils.book_new();
            var ws = XLSX.utils.json_to_sheet(jsonData);

            XLSX.utils.book_append_sheet(wb, ws, "No Header");

            var excelBuffer = XLSX.write(wb, {
                bookType: "xlsx",
                type: "array",
            });
            const bolbFile = new Blob([excelBuffer], { type: fileType });

            setSavedFileData(bolbFile)
            setFileSaved(true)

            var xlsxFile = new File([bolbFile], fileName, {
                lastModified: new Date(),
                type: fileType,
            });

            // console.log(xlsxFile);
            // console.log(props.fileId)
            const updateFile = async () => {
                try {
                    const url = `${process.env.REACT_APP_API_URL}/excel/edit-file/${props.fileId}`;
                    const formData = new FormData();
                    formData.append("file", xlsxFile);
                    const config = {
                        headers: {
                            "content-type": "multipart/form-data",
                            authorization: `Bearer ${props.excelAccessToken}`,
                        },
                    };
                    const result = await axios.post(url, formData, config);
                    // console.log(result);
                    alert("Update successful");
                } catch (error) {
                    alert(error.message);
                }
            };
            updateFile();
        } catch (error) {
            // console.error(error.message);
            alert(error.message);
        }

        // console.log(jsonData);
    };
    const onDownload=()=>{
        if(fileSaved){
            FileSaver.saveAs(savedFileData, props.fileId + '.xlsx');
        }else{
            alert('Before download save the File')
        }
    }

    const hotSettings = {
        // data: createSpreadsheetData(4, 4),
        colHeaders: true,
        height: "auto",
        licenseKey: "non-commercial-and-evaluation",
    };

    const Editor = () => {
        if (onOpen) {
            return (
                <div>
                    <div>
                        <Button
                            size="sm"
                            variant="secondary"
                            style={{ margin: "5px 2px" }}
                            onClick={addRow}
                        >
                            Add Row
                        </Button>
                        <Button
                            size="sm"
                            variant="secondary"
                            style={{ margin: "5px 2px" }}
                            onClick={addColumn}
                        >
                            Add Column
                        </Button>
                    </div>
                    <div style={{ display: "flex" }}>
                        <div style={{ display: "flex", margin: "5px 2px" }}>
                            <Form.Control
                                size="sm"
                                style={{ maxWidth: "10vw" }}
                                type="number"
                                placeholder="Row No. (eg: '3')"
                                value={rowDel}
                                onChange={(e) => {
                                    setRowDel(e.target.value);
                                }}
                            />
                            <Button
                                size="sm"
                                variant="warning"
                                onClick={deleteRow}
                            >
                                Delete Row
                            </Button>
                        </div>
                        <div style={{ display: "flex", margin: "5px 2px" }}>
                            <Form.Control
                                size="sm"
                                style={{ maxWidth: "10vw" }}
                                type="text"
                                placeholder="Column No. (eg: 'C')"
                                value={clmDel}
                                onChange={(e) => {
                                    setClmDel(e.target.value);
                                }}
                            />
                            <Button
                                size="sm"
                                variant="warning"
                                onClick={deleteClm}
                            >
                                Delete Column
                            </Button>
                        </div>
                    </div>
                    <div>
                        <div id="hot-app">
                            <HotTable
                                ref={hotTableComponent}
                                settings={hotSettings}
                                data={fileData}
                                colHeaders={true}
                                rowHeaders={true}
                            />
                        </div>
                    </div>
                    <div>
                        <Button variant="success" style={{ margin: "5px 2px" }} onClick={onSave}>Save</Button>
                        <Button variant="primary" onClick={onDownload}>Download</Button>
                        <p>* Before download save the file</p>
                    </div>
                </div>
            );
        }
        return <h4>Click Open</h4>;
    };

    if (props.render === true) {
        return (
            <div>
                {/* File id: {props.fileId} */}
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Button
                        style={{ margin: "5px" }}
                        variant="success"
                        onClick={onOpenFile}
                    >
                        Open File
                    </Button>
                </div>
                <Editor />
            </div>
        );
    }
    return (
        <div>
            <h3>No File Selected</h3>
        </div>
    );
}

export default ExcelViewer;
