import React, { useState, useEffect } from 'react';
import MaterialReactTable from 'material-react-table';
import { Fragment } from 'react';
import AddItem from '../ItemsFunc/AddItem';
import { Container, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useSelector } from 'react-redux'
import DeleteItem from '../ItemsFunc/DeleteItem';
import EditItem from '../ItemsFunc/EditItem';
import { adminAuthentication } from '../LoginComp/AuthenticationFn';
import { useNavigate } from 'react-router-dom'
import { render } from '@testing-library/react';

const Users = () => {

    const navigate = useNavigate()
    const userSlice = useSelector((state) => state.user)
    const ConfigSlice = useSelector((state) => state.config)
    const name = "worker"
    const hebrewName = "עובד"
    const [jobOptionsList, setJobOptionsList] = useState([])
    const [departmentsOptionsList,setDepartmentsOptionsList] = useState([])
    const [data, setData] = useState([])
    const [responseFlag, setResponseFlag] = useState(false)
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 20
    })




    useEffect(() => {

        if (adminAuthentication(userSlice, navigate)) {
            getData()
        }
        getJobsDepartments()
    }, [])

    const getData = async () => {
        await axios.post(`${ConfigSlice.baseUrl}/api/get_${name}`, { userSlice })
            .then(res => {
                setResponseFlag(true)
                console.log(res.data.data)
                setData(res.data.data)
            })
    }

    const getJobsDepartments = async () => {
        await axios.post(`${ConfigSlice.baseUrl}/api/get_jobs_departments`, { userSlice })
            .then(res => {
                setJobOptionsList(res.data.jobs)
                setDepartmentsOptionsList(res.data.departments)
            })
    }


    const emptyDict = {
        first_name: "",
        last_name: "",
        role: "",
        department: "",
        phone: "",
        address: "",
        first_phase:"לא",
        second_phase:"לא",
    }


    //should be memoized or stable
    const columns = [

        {
            accessorKey: 'first_name',
            header: 'שם פרטי',
            filterFn: (row, id, filterValue) => {
                setPagination({
                    pageIndex: 0,
                    pageSize: pagination.pageSize
                })
                return row.original[id].includes(filterValue)
            },
            muiTableHeadCellProps: {
                align: 'left',
            },
            muiTableBodyCellProps: {
                align: 'right',
            },
        },
        {
            accessorKey: 'last_name',
            header: 'שם משפחה',
            filterFn: (row, id, filterValue) => {
                setPagination({
                    pageIndex: 0,
                    pageSize: pagination.pageSize
                })
                return row.original[id].includes(filterValue)
            },
            muiTableHeadCellProps: {
                align: 'left',
            },
            muiTableBodyCellProps: {
                align: 'right',
            },
        },
        {
            accessorKey: 'role.value',
            header: 'תפקיד',
            filterFn: (row, id, filterValue) => {
                setPagination({
                    pageIndex: 0,
                    pageSize: pagination.pageSize
                })
                return row.original[id].includes(filterValue)
            },
            muiTableHeadCellProps: {
                align: 'left',
            },
            muiTableBodyCellProps: {
                align: 'right',
            },
        },
        {
            accessorKey: 'department.value',
            header: 'מחלקה',
            filterFn: (row, id, filterValue) => {
                setPagination({
                    pageIndex: 0,
                    pageSize: pagination.pageSize
                })
                return row.original[id].includes(filterValue)
            },
            muiTableHeadCellProps: {
                align: 'left',
            },
            muiTableBodyCellProps: {
                align: 'right',
            },
        },
        {
            accessorKey: 'phone',
            header: 'טלפון',
            filterFn: (row, id, filterValue) => {
                setPagination({
                    pageIndex: 0,
                    pageSize: pagination.pageSize
                })
                return row.original[id].includes(filterValue)
            },
            muiTableHeadCellProps: {
                align: 'left',
            },
            muiTableBodyCellProps: {
                align: 'right',
            },
        },
        {
            accessorKey: 'address',
            header: 'כתובת',
            filterFn: (row, id, filterValue) => {
                setPagination({
                    pageIndex: 0,
                    pageSize: pagination.pageSize
                })
                return row.original[id].includes(filterValue)
            },
            muiTableHeadCellProps: {
                align: 'left',
            },
            muiTableBodyCellProps: {
                align: 'right',
            },
        },
        {
            accessorKey: 'first_phase',
            header: 'צוות מצומצם' ,
            filterFn: (row, id, filterValue) => {
                setPagination({
                    pageIndex: 0,
                    pageSize: pagination.pageSize
                })
                return row.original[id].includes(filterValue)
            },
            muiTableHeadCellProps: {
                align: 'left',
            },
            muiTableBodyCellProps: {
                align: 'right',
            },
        },
        {
            accessorKey: 'second_phase',
            header: 'צוות מורחב',
            filterFn: (row, id, filterValue) => {
                setPagination({
                    pageIndex: 0,
                    pageSize: pagination.pageSize
                })
                return row.original[id].includes(filterValue)
            },
            muiTableHeadCellProps: {
                align: 'left',
            },
            muiTableBodyCellProps: {
                align: 'right',
            },
        }
    ]

    return (
        <div>
            <h2 className='my'>עובדים</h2>
            <br />
            {
                responseFlag ? (
                    <Fragment>
                        <p style={{ textAlign: "right", fontWeight: "bold" }}>בעזרת הטבלה הזאת אנו מנהלים את העובדים  </p>
                        <MaterialReactTable
                            columns={columns}
                            data={data}
                            initialState={{
                                initialState: { columnVisibility: { password: false } },
                                showColumnFilters: true,
                                density: 'compact',
                                pagination: { pageIndex: 0, pageSize: 50 },
                            }}
                            enableEditing
                            enableRowActions
                            enableStickyHeader
                            autoResetPageIndex={false}
                            enableDensityToggle={false}
                            enableGlobalFilter={false}
                            enableColumnDragging={false}
                            paginateExpandedRows={false}
                            enableFullScreenToggle={false}
                            enableColumnActions={false}
                            enableStickyFooter
                            muiTableHeadCellFilterTextFieldProps={({ column, rangeFilterIndex, table }) => {
                                return {
                                    placeholder: `חפש לפי ${column.columnDef.header}`,
                                }
                            }}
                            localization={{
                                toolbar: {
                                    searchPlaceholder: 'your string',
                                    placeholder: "sss"
                                }
                            }}
                            muiSearchTextFieldProps={{
                                placeholder: 'Search All Props',
                                sx: { minWidth: '18rem' },
                                variant: 'outlined',
                            }}
                            state={{ pagination }}
                            onPaginationChange={setPagination}
                            positionActionsColumn='last'

                            muiTablePaginationProps={{ labelRowsPerPage: `${hebrewName} בדף`, dir: "ltr" }}
                            renderRowActions={({ row }) => (
                                <div style={{ textAlign: "right" }}>
                                    <EditItem title={`עדכון ${hebrewName} קיים`} name={name} columns={columns} row={row.original} getData={getData} hebrewName={hebrewName} jobOptionsList={jobOptionsList} departmentsOptionsList={departmentsOptionsList} />
                                    <DeleteItem title={`מחיקת ${hebrewName}`} name={name} row={row.original} getData={getData} hebrewName={hebrewName} />
                                </div>
                            )}

                            renderTopToolbarCustomActions={({ table }) => {
                                return (
                                    <Fragment>
                                     <AddItem title={`הוספת ${hebrewName} חדש`} name={name} columns={columns} emptyDict={emptyDict} getData={getData} hebrewName={hebrewName} jobOptionsList={jobOptionsList} departmentsOptionsList={departmentsOptionsList} />
                                    </Fragment>
                                )
                            }}
                        />
                    </Fragment>

                ) : (<Fragment>
                    <div className='justify-content-center d-flex py-5'>
                        <h5 className='my-1'>טוען נתונים</h5>
                        <Spinner animation='border' variant='danger' className='mx-3' size='med' />
                    </div>
                </Fragment>)
            }

        </div>

    )
};

export default Users;
