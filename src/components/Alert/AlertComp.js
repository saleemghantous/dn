import React, { Fragment, useState, useEffect } from 'react'
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { useSelector, useDispatch } from 'react-redux'
import { notify } from '../Notification/Notification'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { adminAuthentication } from '../LoginComp/AuthenticationFn';


const AlertComp = () => {
  

  const [alertTarget, setAlertTarget] = useState("")
  const [alertType, setAlertType] = useState("")
  const [alertName, setAlertName] = useState("")
  const userSlice = useSelector((state) => state.user)
  const navigate = useNavigate()
  const [balance, setBalance] = useState("")

  const ConfigSlice = useSelector((state) => state.config)


  useEffect(() => {
    if (adminAuthentication(userSlice, navigate)) {
      getBalance()
    }
  }, [])

  useEffect(() => {
    setAlertType("")
  }, [alertTarget])

  const getBalance = async () => {
    await axios.post(`${ConfigSlice.baseUrl}/api/get_balance`, { userSlice })
      .then(res => {
        setBalance(res.data)
      })
  }

  const sendAlert = async () => {
    await axios.post(`${ConfigSlice.baseUrl}/api/send_alert`, { "alertTarget": alertTarget, "alertType": alertType, "alertName": alertName })
      .then(res => {
        console.log(res.data)
        notify(res.data.result, res.data.comment)
        if (res.data.result == "success") {
          notify(res.data.result, "אירוע נוצר בהצלחה")
          navigate("/reports")
        }
      })
  }

  // Function to validate Hebrew characters
  const isValidHebrew = (text) => {
    const hebrewPattern = /^[\u0590-\u05FF\s]*$/;
    return hebrewPattern.test(text);
  };

  // Wrapper function for setAlertName with validation
  const setAlertNameWithValidation = (value) => {
    if (isValidHebrew(value)) {
      setAlertName(value);
    }
  };

  return (
    <div>
      <br />
      <br />
      <Container>
        <b style={{ color: "blue" }}>
          נותר בחשבון:
          ({balance.currency}){balance.balance}
        </b>
        <br />
        <br />

        <Form.Label> <b>אנא בחר קהל היעד</b></Form.Label>
        <Form.Select aria-label="Default select example" onChange={(e) => (setAlertTarget(e.target.value))}>
          {alertTarget ? null : <option selected value="" disabled>אנא בחר סוג קריאה</option>}
          <option value="limited">קריאת בעלי תפקידים - צוות מצומצם</option>
          <option value="extended">קריאת בעלי תפקידים - צוות מורחב</option>
          {
            // <option value="staff">קריאת סגל</option>
          }
        </Form.Select>


        <Fragment>
          <Form.Label className='mt-4'> <b>אנא בחר סוג קריאה</b></Form.Label>
          <br />
          <Button variant={alertType === "exercise" ? "primary" : "secondary"} value={"exercise"} onClick={(e) => setAlertType(e.target.value)}>תרגיל</Button>{' '}
          {
            // <Button variant={alertType === "raise" ? "primary" : "secondary"} value={"raise"} onClick={(e) => setAlertType(e.target.value)}>העלאת כוננות</Button>{' '}
          }
          <Button variant={alertType === "real" ? "primary" : "secondary"} value={"real"} onClick={(e) => setAlertType(e.target.value)}>אירוע אמת</Button>{' '}
        </Fragment>


        {
          alertTarget === "staff" ? (
            <Fragment>
              <Form.Label className='mt-4'> <b>אנא בחר סוג קריאה</b></Form.Label>
              <br />
              <Button variant={alertType === "exercise" ? "primary" : "secondary"} value={"exercise"} onClick={(e) => setAlertType(e.target.value)}>תרגיל</Button>{' '}
              <Button variant={alertType === "real" ? "primary" : "secondary"} value={"real"} onClick={(e) => setAlertType(e.target.value)}>אירוע אמת</Button>{' '}
            </Fragment>
          ) : null
        }

        <br />
        <Form.Label className='mt-4'> <b>אנא כתוב שם לאירוע</b><b className='mx-2' style={{ color: "red" }}>(בעברית בלבד)</b></Form.Label>
        <Form.Control className='' size="sm" value={alertName} onChange={(e) => setAlertNameWithValidation(e.target.value)}
          type="text" placeholder="שם האירוע" />


        {
          alertTarget !== "" && alertType !== "" && alertName !== "" ? (
            <Fragment>
              <br />
              <Button variant="success" onClick={(e) => sendAlert()}>שגר קריאה</Button>
            </Fragment>
          ) : null
        }

      </Container>


    </div>
  )
}

export default AlertComp
