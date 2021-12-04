import React, { useState } from "react";
import { Button, FloatingLabel, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function Register() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        email: "",
        password: "",
    });
    const onUserDataChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };
    const onSubmit = () => {
        console.log(process.env.REACT_APP_API_URL);
        if (userData.email !== "" && userData.password !== "") {
            const sendUserData = async () => {
                try {
                    const result = await axios.post(
                        `${process.env.REACT_APP_API_URL}/auth/register`,
                        userData
                    );
                    console.log(result);
                    if (result.status === 200) {
                        localStorage.setItem(
                            "excelAccessToken",
                            result.data.accessToken
                        );
                        localStorage.setItem(
                            "excelRefreshToken",
                            result.data.refreshToken
                        );
                        localStorage.setItem("excelEmail", result.data.email);
                        navigate("/dashboard");
                    }
                } catch (error) {
                    alert('Registration Error');
                }
            };
            sendUserData();
        }
    };

    return (
        <div
            style={{
                width: "70vw",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                margin: "auto",
            }}
        >
            <h1 style={{margin:'5px auto'}}>Register</h1>
            <div>
                <FloatingLabel
                    controlId="floatingInput"
                    label="Email address"
                    className="mb-3"
                >
                    <Form.Control
                        type="email"
                        value={userData.email}
                        name="email"
                        placeholder="name@example.com"
                        onChange={onUserDataChange}
                    />
                </FloatingLabel>
                <FloatingLabel controlId="floatingPassword" label="Password">
                    <Form.Control
                        type="password"
                        value={userData.password}
                        name="password"
                        placeholder="Password"
                        onChange={onUserDataChange}
                    />
                </FloatingLabel>
                <div style={{ margin:'10px 0px', display: 'flex', justifyContent: 'space-evenly' }}>
                    <Button variant="outline-primary" onClick={onSubmit}>Submit</Button>
                    <Button
                        variant="outline-secondary"
                        onClick={() => {
                            navigate("login");
                        }}
                    >
                        Go to Login
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Register;
