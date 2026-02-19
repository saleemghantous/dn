import React, { useState } from 'react';
import "./LoginComp.css"
import { Container, Form } from 'react-bootstrap';
import NewUserModal from './NewUserModal';
import axios from 'axios';
import { UseSelector, useDispatch, useSelector } from 'react-redux';
import { ConfigSlice } from './../redux_slice/ConfigSlice';
import { setUserProp } from '../redux_slice/UserSlice';
import { useNavigate } from 'react-router-dom';
import { notify } from '../Notification/Notification';

const LoginComp = () => {

    const dispatch = useDispatch()
    const userSlice = useSelector((state) => state.user)
    const ConfigSlice = useSelector((state) => state.config)
    const navigate=useNavigate()

    const handleLogin = async() => {
        await axios.post(`${ConfigSlice.baseUrl}/api/login_request`,{userSlice})
        .then(res=>{
            if(res.data.loginStatus===true && res.data.admin==true){
                navigate("/roles")
            }
            else if(res.data.loginStatus===true && res.data.admin==false){
                navigate("/myTutorials")
                dispatch(setUserProp({prop:"userId",value:res.data.userId}))
            }
            else{
                notify("error","שם המשתמש או הסיסמה לא נכונים")
            }
            dispatch(setUserProp({prop:"admin",value:res.data.admin}))
            dispatch(setUserProp({prop:"firstName",value:res.data.firstName}))
            dispatch(setUserProp({prop:"loginStatus",value:res.data.loginStatus}))
        })
    };
    
    return (
        <div className="login-container">
            <div className="login-form">
                <div className="jumbotron bg-light">
                    <h1 className="display-4">מערכת למידה</h1>
                    <p className="lead">בית חולים המשפחה הקדושה - נצרת</p>
                </div>
                <Container style={{ width: "60vh" }}>
                    <form>
                        <Form.Label style={{ float: "right", fontSize: "20px" }}><b>מספר ת"ז:</b></Form.Label>
                        <Form.Control onChange={(e)=>{dispatch(setUserProp({prop:"userId",value:e.target.value}))}} value={userSlice["userId"]} type="text" lang='en' dir='ltr' />
                        <br />
                        <Form.Label style={{ float: "right", fontSize: "20px" }}><b>סיסמה:</b></Form.Label>
                        <Form.Control onChange={(e)=>{dispatch(setUserProp({prop:"password",value:e.target.value}))}} value={userSlice["password"]} type="password" lang='en' dir='ltr' />
                        <br />
                        <button type="button" className="btn btn-primary mx-2" onClick={handleLogin}>
                        http://localhost:3000/
                        </button>

                    </form>
                </Container>
            </div>
        </div>
    );
};

export default LoginComp;
