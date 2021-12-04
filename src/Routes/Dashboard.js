import React from "react";
import NavBarComp from "../Components/NavBarComp.js";
import ExcelFiles from '../Components/ExcelFiles'

function Dashboard() {
    return (
        <div>
            <NavBarComp />
            <div style={{width: '70vw',margin: "auto",}}>
                <ExcelFiles />
            </div>
        </div>
    );
}

export default Dashboard;
