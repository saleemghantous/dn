import React, { useState, Fragment, useEffect } from "react";
import { Container, Table } from "react-bootstrap";
import './HomeComp.css'; // Import your CSS file
import UpdateLoad from "../Modals/UpdateLoad";

const HomeComp = () => {
    const [playerList, setPlayerList] = useState(["אשרף", "גרייס", "יוסף", "אנדו", "יוסרי", "סלים", "גאודת", "אליאס", "אכרם", "אדהם"]);
    const [loanDict, setLoanList] = useState({});

    useEffect(() => {
        const copyNewLoan = {};
        for (let i = 0; i < playerList.length; i++) {
            for (let j = 0; j < playerList.length; j++) {
                if (i !== j) {
                    copyNewLoan[`${playerList[i]}_${playerList[j]}`] = 0;
                }
            }
        }
        setLoanList(copyNewLoan);
    }, [playerList]);


    const getMyLoan = (user) => {
        let myLoan = 0;
        for (const key in loanDict) {
            if (key.indexOf(`_${user}`) > -1) {
                if (loanDict[key] > 0) {
                    myLoan = myLoan + loanDict[key]
                }
            }
        }
        return myLoan
    }

    const getLoanToMe = (user) => {
        let myLoan = 0;
        for (const key in loanDict) {
            if (key.indexOf(`${user}_`) > -1) {
                if (loanDict[key] > 0) {
                    myLoan = myLoan + loanDict[key]
                }
            }
        }
        return myLoan
    }



    return (
        <Container>
            <Table bordered className="table">
                <thead>
                    <tr>
                        <th style={{backgroundColor:"pink"}}></th>
                        {playerList.map((colitem, colindex) => (
                            <th key={colindex} className="rotated-text" style={{ color: "red" }}>
                                {colitem}
                            </th>
                        ))}
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {playerList.map((rowitem, rowindex) => (
                        <tr key={rowindex}>
                            <td className="header-col1" style={{ backgroundColor: "green", color: "white" ,width:"60px"}}>{rowitem}</td>
                            {playerList.map((colitem, colindex) => (
                                <td key={colindex} className="content-col" style={colindex === rowindex ? { backgroundColor: "pink", width: "60px" } : { textAlign: "center" }}>
                                    {colindex !== rowindex && (
                                        <div className="update-load-container">
                                            <UpdateLoad loanValue={loanDict[`${rowitem}_${colitem}`]} firstPlayer={rowitem} secondPlayer={colitem} setLoanList={setLoanList} />
                                        </div>
                                    )}
                                </td>
                            ))}
                                {
                                    getLoanToMe(rowitem) > 0 ? (
                                        <td style={{ fontSize: "12px", textAlign: "center", background: "green", color: "white" }}>{getLoanToMe(rowitem)}</td>
                                    ) : (
                                        <td style={{ fontSize: "12px", textAlign: "center" }}>{getLoanToMe(rowitem)}</td>
                                    )
                                }
                            
                        </tr>
                    ))}
                    <tr>
                        <td></td>
                        {playerList.map((rowitem, rowindex) => (

                            <Fragment>
                                {
                                    getMyLoan(rowitem) > 0 ? (
                                        <td style={{ fontSize: "12px", textAlign: "center", background: "orange", color: "black" }}>{getMyLoan(rowitem)}</td>
                                    ) : (
                                        <td style={{ fontSize: "12px", textAlign: "center" }}>{getMyLoan(rowitem)}</td>
                                    )
                                }
                            </Fragment>

                        ))}
                        <td style={{ backgroundColor: "pink", width: "60px" }}></td>
                    </tr>
                </tbody>
            </Table>
        </Container>
    );
}

export default HomeComp;
