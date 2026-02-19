import React, { useState } from "react";
import Logo from "../../Assets/logo.svg";
import { BsCart2 } from "react-icons/bs";
import { HiOutlineBars3 } from "react-icons/hi2";
import { Box, Drawer, ListItem, ListItemButton, ListItemIcon, ListItemText, } from "@mui/material";
import List from "@mui/material/List";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import CommentRoundedIcon from "@mui/icons-material/CommentRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import WhoCooked from "../../Assets/output-seomagnifier.png";
import FastfoodIcon from '@mui/icons-material/Fastfood';
import { Fragment } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Container } from "react-bootstrap";
import LogoutIcon from '@mui/icons-material/Logout';
import { useSelector, useDispatch } from 'react-redux'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { setUserProp } from "../redux_slice/UserSlice";
import CampaignIcon from '@mui/icons-material/Campaign';
import SummarizeIcon from '@mui/icons-material/Summarize';
const Navbar = () => {

    const [openMenu, setOpenMenu] = useState(false);
    const navigate = useNavigate()
    const userSlice = useSelector((state) => state.user)
    const dispatch = useDispatch()

    console.log(userSlice)

    const menuOptions = [
        {
            id: 2,
            text: "עובדים",
            icon: <PeopleAltIcon />,
            ref: "/users",
            loginRequired: true,
            adminOnly: true,
        },
        {
            id: 2,
            text: "קריאות",
            icon: <CampaignIcon />,
            ref: "/alert",
            loginRequired: true,
            adminOnly: true,
        },
        {
            id: 2,
            text: "דוחות",
            icon: <SummarizeIcon />,
            ref: "/reports",
            loginRequired: true,
            adminOnly: true,
        },
        {
            id: 4,
            text: "יציאה",
            icon: <LogoutIcon />,
            ref: "/",
            loginRequired: true,
            adminOnly: false,
        }
    ];

    const handleNavigate = (event, ref) => {
        event.preventDefault();
        navigate(ref)
    }

    const hanldeLogout = (event, ref) => {
        event.preventDefault();
        navigate(ref)
        dispatch(setUserProp({ prop: "admin", value: false }))
        dispatch(setUserProp({ prop: "loginStatus", value: false }))
    }



    return (
        <Container>
            <nav>

                <div className="nav-logo-container">
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', margin: '19px 0' }}>צוות חירום</h2>

                   
                    {
                        // <img src={WhoCooked} alt="Website Logo" />
                        // <img onClick={() => navigate('/')} src={WhoCooked} alt="Website Logo" style={{ cursor: "pointer" }} />
                    }
                </div>

                <div className="navbar-links-container flex">
                    {
                        menuOptions.map((item) => (
                            <Fragment>
                                {
                                    item.loginRequired === true && userSlice.loginStatus === true && item.adminOnly === false ? (
                                        item.text === "יציאה" ? (
                                            <a href="#" key={`menu${item.id}`} onClick={(event) => hanldeLogout(event, item.ref)}> {item.text} <span className="mx-2">{item.icon}</span></a>

                                        ) : (
                                            <a href="#" key={`menu${item.id}`} onClick={(event) => handleNavigate(event, item.ref)}> {item.text} <span className="mx-2">{item.icon}</span></a>
                                        )
                                    ) : null
                                }
                                {
                                    item.loginRequired === false ? (
                                        <a href="#" key={`menu${item.id}`} onClick={(event) => handleNavigate(event, item.ref)}> {item.text} <span className="mx-2">{item.icon}</span></a>
                                    ) : null
                                }
                                {
                                    item.loginRequired === true && item.adminOnly === true && userSlice.loginStatus === true ? (
                                        <a href="#" key={`menu${item.id}`} onClick={(event) => handleNavigate(event, item.ref)}> {item.text} <span className="mx-2">{item.icon}</span></a>
                                    ) : null
                                }
                            </Fragment>
                        ))
                    }
                </div>


                {/* resposible to set the item list in small screen (mobile)  */}
                <div className="navbar-menu-container">
                    <HiOutlineBars3 onClick={() => setOpenMenu(true)} />
                </div>
                <Drawer open={openMenu} onClose={() => setOpenMenu(false)} anchor="right">
                <Box sx={{ width: "200px" }} role="presentation" onClick={() => setOpenMenu(false)} onKeyDown={() => setOpenMenu(false)}>
                    <List>
                        {menuOptions.map((item) => (
                            // Checking conditions for displaying menu items in the Drawer
                            (item.loginRequired && userSlice.loginStatus && !item.adminOnly) ||
                            (!item.loginRequired) ||
                            (item.loginRequired && item.adminOnly && userSlice.loginStatus) ? (
                                <ListItem key={item.id} disablePadding>
                                    <ListItemButton onClick={(event) => handleNavigate(event, item.ref)}>
                                        <ListItemText style={{ textAlign: "right" }} primary={item.text} />
                                        <ListItemIcon dir="ltr">{item.icon}</ListItemIcon>
                                    </ListItemButton>
                                </ListItem>
                            ) : null
                        ))}
                    </List>
                </Box>
            </Drawer>
            </nav>
        </Container>
    );
};

export default Navbar;