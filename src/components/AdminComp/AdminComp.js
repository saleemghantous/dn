import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Button, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { notify } from '../Notification/Notification';

const AdminComp = () => {
    const ConfigSlice = useSelector((state) => state.config);
    const navigate = useNavigate();
    const [playerList, setPlayerList] = useState([]);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        await axios.post(`${ConfigSlice.baseUrl}/api/get_players`, {})
            .then(res => {
                if (res.data.player_list) {
                    setPlayerList(res.data.player_list);
                } else {
                    notify("error", "משהו השתבש");
                }
            })
            .catch(() => {
                notify("error", "שגיאה בשרת");
            });
    };

    const handleCreateGame = () => {
        notify("success", "יצירת משחק חדש");
        // Add logic for creating a game
    };

    const handleUpdateGame = () => {
        notify("success", "עדכון משחק קיים");
        // Add logic for updating a game
    };

    return (
        <div style={{ direction: 'rtl', padding: '20px' }}>
            {playerList.length ? (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>שם</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>טלפון</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>נבחר</th>
                        </tr>
                    </thead>
                    <tbody>
                        {playerList.map((player, index) => {
                            return (
                                <tr key={index}>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{player[1]}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{player[0]}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                                        <input type="checkbox" />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            ) : (
                <p style={{ textAlign: 'center', color: '#888' }}>לא נמצאו שחקנים</p>
            )}
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <Button variant="primary" style={{ marginRight: '10px' }} onClick={handleCreateGame}>
                    יצירת משחק
                </Button>
                <Button variant="secondary" onClick={handleUpdateGame}>
                    עדכון משחק
                </Button>
            </div>
        </div>
    );
};

export default AdminComp;
