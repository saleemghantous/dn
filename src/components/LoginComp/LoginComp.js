import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux'
import './LoginComp.css'; // Import the CSS file
import { Button, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { notify } from '../Notification/Notification';

const LoginComp = () => {

    const ConfigSlice = useSelector((state) => state.config)
    const [phone, setPhone] = useState("")
    const navigate = useNavigate()

    const getData = async () => {
        await axios.post(`${ConfigSlice.baseUrl}/api/login`, { phone: phone })
            .then(res => {
                if(res.data.result == "success"){
                    navigate("/dashboard")
                }
                else{
                    notify("error","מספר טלפון לא קיים")
                }
                console.log(res.data)
            })
    }


    return (
        <Container>
            <div className="login-container">
                <form className="login-form">
                    <label htmlFor="phone">מספר טלפון:</label>
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="הכנס מספר טלפון"
                    />
                    <Button className='my-3' onClick={getData}>התחבר</Button>
                </form>
            </div>
        </Container>
    );


    
};

export default LoginComp;
