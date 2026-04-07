import { Fragment } from 'react';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function NewUserModal() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const adminEmail="someone@gmail.com"


    return (
        <Fragment>

            <Button type="button" className="btn btn-secondary" onClick={handleShow}>
                משתמש חדש?
            </Button>
            <Modal

                show={show}
                onHide={handleClose}
                keyboard={false}
            >
                <Modal.Header>
                    <Modal.Title>איך מקבלים גישה למערכת?</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    

                    כדי לקבל גישה למערכת צריך לשלוח מיל לכתובת :
                    <br/>
                    {adminEmail}
                    <br/>
                    <br/>

                    צריך לציין במיל את הדברים הבאים:
                    <br/>
                    <br/>
                    <ol>
                        <li>שם פרטי</li>
                        <li>שם משפחה</li>
                        <li>דואר אלקטרוני</li>
                        <li>תפקיד</li>
                        <li>מחלקה</li>
                    </ol>
                </Modal.Body>
                <Modal.Footer dir='ltr'>
                    <Button variant="secondary" onClick={handleClose}>
                        סגור
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    );
}

export default NewUserModal;