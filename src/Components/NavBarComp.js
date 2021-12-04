import React, { useState, useEffect } from "react";
import { Navbar, Container, NavDropdown } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function NavBarComp() {
    const navigate = useNavigate();
    const [userData, setUserEmail] = useState({
        excelAccessToken: "",
        excelRefreshToken: "",
        excelEmail: "",
    });
    useEffect(() => {
        const accessToken = localStorage.getItem("excelAccessToken");
        if (accessToken) {
            const refreshToken = localStorage.getItem("excelRefreshToken");
            const email = localStorage.getItem("excelEmail");
            setUserEmail({
                excelAccessToken: accessToken,
                excelRefreshToken: refreshToken,
                excelEmail: email,
            });
        } else {
            navigate("/");
        }
    }, [navigate]);

    const onLogout = () => {
        const logout = async () => {
            try {
                await axios
                    .delete(`${process.env.REACT_APP_API_URL}/auth/logout`, {
                        data:{
                            'refreshToken': userData.excelRefreshToken,
                        }
                    })
                    .then((res) => {
                        if (res.status === 204) {
                            localStorage.removeItem("excelAccessToken");
                            localStorage.removeItem("excelRefreshToken");
                            localStorage.removeItem("excelEmail");
                            navigate("/");
                        }
                    });
            } catch (error) {
                alert(error.message);
            }
        };
        logout();
    };

    return (
        <div>
            <Navbar style={{ background: '#D3D3D3'}}>
                <Container>
                    <Navbar.Brand>Auth Excel</Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end">
                        <NavDropdown
                            title={userData.excelEmail}
                            id="basic-nav-dropdown"
                        >
                            <NavDropdown.Item onClick={onLogout}>
                                Log Out
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
}

export default NavBarComp;
