import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux'
import Table from 'react-bootstrap/Table';
import { Container } from 'react-bootstrap';
import { adminAuthentication } from '../LoginComp/AuthenticationFn';
import { useNavigate } from 'react-router-dom'


const ReportComp = () => {


    const { reportId } = useParams();
    const [responseFlag, setResponseFlag] = useState(false)
    const ConfigSlice = useSelector((state) => state.config)
    const [data, setData] = useState([])
    const userSlice = useSelector((state) => state.user)
    const navigate = useNavigate()


    const getData = async () => {
        await axios.post(`${ConfigSlice.baseUrl}/api/get_report`, { reportId: reportId })
            .then(res => {
                console.log(res)
                setResponseFlag(true)
                setData(res.data.data)
                console.log(res.data.data)

            })
    }

    useEffect(() => {
        if (adminAuthentication(userSlice, navigate)) {
            getData()
        }
    }, [])


    return (
        <Container>
            <br />
            <h3>דוח</h3>
            <div>
                {
                    responseFlag ? (
                        <Table style={{ width: "50%" }} striped bordered hover >

                            <tbody>
                                <tr>
                                    <td><b>שם תרגיל</b></td>
                                    <td>{data["alert_name"]}</td>
                                </tr>
                                <tr>
                                    <td><b>סוג אירוע </b></td>
                                    <td>{data["alert_type"]}</td>
                                </tr>
                                <tr>
                                    <td><b> אירוע פעיל? </b></td>
                                    {
                                        data["attempts"] === "2" ? (
                                            <td>לא</td>
                                        ) : (
                                            <td>כן</td>
                                        )
                                    }
                                </tr>

                                <tr>
                                    <td><b>צוות</b></td>
                                    <td>{data["alert_target"]}</td>
                                </tr>
                                <tr>
                                    <td><b>תאריך פתיחת אירוע</b></td>
                                    <td>{data["alert_date"]}</td>
                                </tr>
                                <tr>
                                    <td><b> מזהה</b></td>
                                    <td>{data["alert_id"]}</td>
                                </tr>
                                <tr>
                                    <td><b> מספר עובדים מוזמנים</b></td>
                                    <td>{data.data["invited_list"].length}</td>
                                </tr>
                                <tr>
                                    <td><b> מספר עובדים שאישרו הגעה</b></td>
                                    <td>{data.data["coming_list"].length}</td>
                                </tr>
                                <tr>
                                    <td><b> מספר עובדים שנמצאים בבית החולים</b></td>
                                    <td>{data.data["working_list"].length}</td>
                                </tr>
                                <tr>
                                    <td><b> מספר עובדים שאישרו אי הגעה</b></td>
                                    <td>{data.data["declined_list"].length}</td>
                                </tr>
                                <tr>
                                    <td><b> מספר עובדים שלא ענו לטלפון</b></td>
                                    <td>{data.data["no_answer_list"].length}</td>
                                </tr>
                            </tbody>
                        </Table>

                    ) : null
                }
                <br />
                {
                    responseFlag ? (
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>שם פרטי</th>
                                    <th>שם משפחה</th>
                                    <th>תפקיד</th>
                                    <th>מחלקה</th>
                                    <th>טלפון</th>
                                    <th>כתובת</th>
                                    <th>צוות מצומצם</th>
                                    <th>צוות מורחב</th>
                                    <th>נסיונות</th>
                                    <th>תאריך</th>
                                    <th>מענה</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data.data["coming_list"].map((item) => (
                                        <tr>
                                            <td>{item["first_name"]}</td>
                                            <td>{item["last_name"]}</td>
                                            <td>{item["role"]["label"]}</td>
                                            <td>{item["department"]["label"]}</td>
                                            <td>{item["phone"]}</td>
                                            <td>{item["address"]}</td>
                                            <td>{item["first_phase"]}</td>
                                            <td>{item["second_phase"]}</td>
                                            <td>{item["attempts"]}</td>
                                            <td>{item["date"]}</td>
                                            <td style={{ color: "white", backgroundColor: "green" }}>אישר הגעה</td>

                                        </tr>
                                    ))
                                }
                                {
                                    data.data["working_list"].map((item) => (
                                        <tr>
                                            <td>{item["first_name"]}</td>
                                            <td>{item["last_name"]}</td>
                                            <td>{item["role"]["label"]}</td>
                                            <td>{item["department"]["label"]}</td>
                                            <td>{item["phone"]}</td>
                                            <td>{item["address"]}</td>
                                            <td>{item["first_phase"]}</td>
                                            <td>{item["second_phase"]}</td>
                                            <td>{item["attempts"]}</td>
                                            <td>{item["date"]}</td>
                                            <td style={{ color: "black", backgroundColor: "#4dffb8" }}>עובד בבית החולים</td>
                                        </tr>
                                    ))
                                }
                                {
                                    data.data["declined_list"].map((item) => (
                                        <tr>
                                            <td>{item["first_name"]}</td>
                                            <td>{item["last_name"]}</td>
                                            <td>{item["role"]["label"]}</td>
                                            <td>{item["department"]["label"]}</td>
                                            <td>{item["phone"]}</td>
                                            <td>{item["address"]}</td>
                                            <td>{item["first_phase"]}</td>
                                            <td>{item["second_phase"]}</td>
                                            <td>{item["attempts"]}</td>
                                            <td>{item["date"]}</td>
                                            <td style={{ color: "white", backgroundColor: "red" }}>אישר אי הגעה</td>

                                        </tr>
                                    ))
                                }
                                {
                                    data.data["no_answer_list"].map((item) => (
                                        <tr>
                                            <td>{item["first_name"]}</td>
                                            <td>{item["last_name"]}</td>
                                            <td>{item["role"]["label"]}</td>
                                            <td>{item["department"]["label"]}</td>
                                            <td>{item["phone"]}</td>
                                            <td>{item["address"]}</td>
                                            <td>{item["first_phase"]}</td>
                                            <td>{item["second_phase"]}</td>
                                            <td>{item["attempts"]}</td>
                                            <td>{item["date"]}</td>
                                            <td style={{ color: "black", backgroundColor: "yellow" }}>אין מענה</td>

                                        </tr>
                                    ))
                                }

                            </tbody>
                        </Table>
                    ) : null
                }


            </div>
        </Container>
    )
}

export default ReportComp
