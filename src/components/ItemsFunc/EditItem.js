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
import EditIcon from '@mui/icons-material/Edit';
import MapContainer from '../Maps/MapContainer'
import Select from 'react-select';

const EditItem = ({ title, name, columns, row, getData, hebrewName, jobOptionsList, departmentsOptionsList }) => {

  const userSlice = useSelector((state) => state.user)
  const ConfigSlice = useSelector((state) => state.config)

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const [itemData, setItemData] = useState({ ...row })



  const [jobOptions, setJobOptions] = useState(() => {
    return jobOptionsList.map((item) => {
      return { value: item, label: item }
    })
  })

  const [departmentsOptions, setDepartmentsOptions] = useState(() => {
    return departmentsOptionsList.map((item) => {
      return { value: item, label: item }
    })
  })




  const checkInputDict = () => {
    for (var key in itemData) {
      if (itemData[key] === "") {
        notify("error", "יש למלא את כל השדות")
        return false
      }
    }
    return true
  }



  const handleAddItem = async () => {
    if (checkInputDict()) {
      await axios.post(`${ConfigSlice.baseUrl}/api/edit_${name}`, { userSlice, itemData, row, hebrewName })
        .then(res => {
          notify(res.data.result, res.data.comment)
          if (res.data.result == "success") {
            getData()
            handleClose()
          }
        })
    }
  }

  const updateValue = (key, value) => {
    itemData[key] = value
    setItemData({ ...itemData })
  }

  return (

    <Fragment>
      <IconButton onClick={handleShow}>
        <EditIcon />
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
            <Row>
              {
                columns.map((item) => (
                  <Fragment>
                    {
                      item.header === "תפקיד" ? (
                        <Fragment>
                          <Form.Group className='my-2'>
                            <Form.Label>{item.header}</Form.Label>
                            <Select
                              className="basic-single"
                              classNamePrefix="select"
                              isClearable={true}
                              isRtl={true}
                              isSearchable={true}
                              name="color"
                              placeholder=""
                              options={jobOptions}
                              value={itemData["role"]}
                              onChange={(value, e) => updateValue("role", value)}
                            />
                          </Form.Group>
                        </Fragment>
                      ) : null
                    }

                    {
                      item.header === "מחלקה" ? (
                        <Fragment>
                          <Form.Group className='my-2'>
                            <Form.Label>{item.header}</Form.Label>
                            <Select
                              className="basic-single"
                              classNamePrefix="select"
                              isClearable={true}
                              isRtl={true}
                              isSearchable={true}
                              name="color"
                              placeholder=""
                              options={departmentsOptions}
                              value={itemData["department"]}
                              onChange={(value, e) => updateValue("department", value)}
                            />
                          </Form.Group>
                        </Fragment>
                      ) : null
                    }


                    {
                      item.header === "כתובת" ? (
                        <Fragment>
                          <MapContainer itemData={itemData} item={item} updateValue={updateValue} />
                        </Fragment>
                      ) : null

                    }

                    {
                      item.header === "צוות מצומצם" ? (
                        <Fragment>
                          <Form.Label className='mt-4'>צוות מצומצם</Form.Label>
                          <Form.Select value={itemData[item.accessorKey]} aria-label="Default select example" onChange={(e) => { updateValue(item.accessorKey, e.target.value) }}>
                            <option value="לא">לא</option>
                            <option value="כן">כן</option>
                          </Form.Select>
                        </Fragment>

                      ) : null
                    }

                    {
                      item.header === "צוות מורחב" ? (
                        <Fragment>
                          <Form.Label className='mt-4'>צוות מורחב</Form.Label>
                          <Form.Select value={itemData[item.accessorKey]} aria-label="Default select example" onChange={(e) => { updateValue(item.accessorKey, e.target.value) }}>
                            <option value="לא">לא</option>
                            <option value="כן">כן</option>
                          </Form.Select>
                        </Fragment>

                      ) : null
                    }

                    {

                      ["שם פרטי", "שם משפחה"].indexOf(item.header) > -1 ? (
                        <Form.Group className='my-2'>
                          <Form.Label>{item.header}</Form.Label>
                          <Form.Control
                            type='text'
                            placeholder=''
                            value={itemData[item.accessorKey]}
                            onChange={(e) => updateValue(item.accessorKey, e.target.value)}
                          />
                        </Form.Group>
                      ) : null
                    }

                    {

                      ["טלפון"].indexOf(item.header) > -1 ? (
                        <Form.Group className='my-2'>
                          <Form.Label>{item.header}</Form.Label>
                          <Form.Control
                            type='text'
                            placeholder=''
                            disabled
                            value={itemData[item.accessorKey]}
                            onChange={(e) => updateValue(item.accessorKey, e.target.value)}
                          />
                        </Form.Group>
                      ) : null
                    }


                  </Fragment>
                ))
              }
            </Row>
          </div>

        </Modal.Body>
        <Modal.Footer dir='ltr'>
          <Button variant="outlined" color='error' onClick={handleClose}>
            ביטול
          </Button>
          <Button className='mx-2' variant="outlined" color='success' onClick={handleAddItem}>
            עדכן
          </Button>

        </Modal.Footer>

      </Modal>

    </Fragment>
  )
}

export default EditItem
