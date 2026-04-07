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
import SummarizeIcon from '@mui/icons-material/Summarize';
import { IconButton } from '@mui/material';

const ReportsTracker = () => {

    const navigate = useNavigate()
    const userSlice = useSelector((state) => state.user)
    const ConfigSlice = useSelector((state) => state.config)
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
    }, [])

    const getData = async () => {
        await axios.post(`${ConfigSlice.baseUrl}/api/get_reports`, { userSlice })
            .then(res => {
                setResponseFlag(true)
                setData(res.data.data)
            })
    }




    //should be memoized or stable
    const columns = [

        {
            accessorKey: 'alert_name',
            header: 'שם אירוע',
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
            accessorKey: 'alert_type',
            header: 'סוג אירוע',
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
            accessorKey: 'alert_target',
            header: 'צוות',
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
            accessorKey: 'alert_date',
            header: 'תאריך פתיחת אירוע',
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
            accessorKey: 'alert_id',
            header: 'מזהה',
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
            <h2 className='my'>דוחות</h2>
            <br />
            {
                responseFlag ? (
                    <Fragment>
                        <p style={{ textAlign: "right", fontWeight: "bold" }}>בעזרת הטבלה הזאת אנו עוקבים אחרי הדוחות של האירועים  </p>
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

                            muiTablePaginationProps={{ labelRowsPerPage: `דוחות בדף`, dir: "ltr" }}
                            renderRowActions={({ row }) => (
                                <div style={{ textAlign: "right" }}>

                                    <IconButton onClick={() => navigate(`/report/${row.original.alert_id}`)}>
                                        <SummarizeIcon />
                                    </IconButton>
                                    <DeleteItem title={"מחיקה דוח"} name={"report"} row={row} getData={getData} hebrewName={"דוח"} />
                                </div>
                            )}

                            renderTopToolbarCustomActions={({ table }) => {
                                return (
                                    <Fragment>
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

export default ReportsTracker;
