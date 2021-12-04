import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";

registerAllModules();

function View() {
    const [file, setFile] = useState(null);
    const onFileChange = (e) => {
        setFile(e.target.files[0]);
    };
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
    const onUpload = () => {
        // var name = file.name;
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
        
    };
    const onSave = () => {
        console.log(fileData);
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
        if(parseInt(rowDel)>0){
            newFileData.splice(parseInt(rowDel) - 1, 1);
        setFileData(newFileData);
        hotTableComponent.current.hotInstance.loadData(newFileData);
        }else{
            alert("Please select correct row value")
        }
        
    };

    const [clmDel, setClmDel] = useState("");
    const deleteClm = () => {
        var newFileData = fileData;

        var clm = clmDel[0].toUpperCase();
        // console.log(clm);
        let pos = clm.charCodeAt(0) - 65;
        // console.log(pos);
        if(pos>=0 && pos<=26){
            
            for (let i = 0; i < newFileData.length; i++) {
                newFileData[i].splice(pos, 1);
            }
            setFileData(newFileData);
            hotTableComponent.current.hotInstance.loadData(newFileData);
        }else{
            alert("Please select correct column value")
        }
    };

    const hotSettings = {
        // data: createSpreadsheetData(4, 4),
        colHeaders: true,
        height: "auto",
        licenseKey: "non-commercial-and-evaluation",
    };
    return (
        <div>
            <h3>Upload File</h3>
            <div>
                <input type="file" onChange={onFileChange} />
                <button onClick={onUpload}>Upload</button>
            </div>
            {/* {JSON.stringify(fileData)} */}

            <div>
                <button onClick={addColumn}>Add Column</button>
                <button onClick={addRow}>Add Row</button>
            </div>
            <div>
                <div>
                    <input
                        type="number"
                        placeholder="Delete Row"
                        value={rowDel}
                        onChange={(e) => {
                            setRowDel(e.target.value);
                        }}
                    />
                    <button onClick={deleteRow}>Delete Row</button>
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Delete Column"
                        value={clmDel}
                        onChange={(e) => {
                            setClmDel(e.target.value);
                        }}
                    />
                    <button onClick={deleteClm}>Delete Column</button>
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
            <button onClick={onSave}>Save</button>
        </div>
    );
}

export default View;
