import React, { Fragment, useEffect, useState } from 'react'
import { Button } from '@mui/material'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { ModalBody } from 'react-bootstrap'
import { notify } from '../Notification/Notification'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import DeleteIcon from '@mui/icons-material/Delete';

const DeleteItem = ({ title, name, row, getData, hebrewName }) => {

    const userSlice = useSelector((state) => state.user)
    const ConfigSlice = useSelector((state) => state.config)

    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)


    const handleDeleteItem = async () => {
        await axios.post(`${ConfigSlice.baseUrl}/api/delete_${name}`, { userSlice, row ,hebrewName})
            .then(res => {
                notify(res.data.result, res.data.comment)
                if (res.data.result == "success") {
                    getData()
                    handleClose()
                }
            })
    }



    return (
        <Fragment>
            <IconButton onClick={handleShow}>
                <DeleteIcon color='error' />
            </IconButton>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                size='lg'
            >
                <Modal.Header className='d-flex justify-content-between'>
                    <Modal.Title>
                        {title}
                    </Modal.Title>
                    <Tooltip title="">
                        <IconButton>
                            <CloseIcon onClick={handleClose} />
                        </IconButton>
                    </Tooltip>
                </Modal.Header>
                <Modal.Body style={{ overflowY: "auto" }}>

                    <div>
                        האם אתה בטוח שאתה רוצה למחוק {hebrewName} זה?
                    </div>

                </Modal.Body>
                <Modal.Footer dir='ltr'>
                    <Button variant="outlined" color='info' onClick={handleClose}>
                        ביטול
                    </Button>
                    <Button className='mx-2' variant="outlined" color='error' onClick={handleDeleteItem}>
                        מחק
                    </Button>

                </Modal.Footer>

            </Modal>

        </Fragment>
    )
}

export default DeleteItem
