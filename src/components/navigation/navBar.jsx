import { React, useState } from "react";
import { AppBar, Toolbar, Box, IconButton, Menu, MenuItem } from "@mui/material";
import AccountCircle from '@mui/icons-material/AccountCircle'

const NavBar = (props) => {

    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    return (
        <AppBar position="static">
            <Toolbar>
                <Box display='flex' flexGrow={1}>
                </Box>
                <div>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                    >
                        <AccountCircle />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem style={{ pointerEvents: 'none' }}>Name: </MenuItem>
                        <MenuItem style={{ pointerEvents: 'none' }}>Email: </MenuItem>
                        <MenuItem style={{ pointerEvents: 'none' }}>FN: </MenuItem>
                        <MenuItem onClick={handleClose}>Log out</MenuItem>
                    </Menu>
                </div>
            </Toolbar>
        </AppBar>
    )
}

export default NavBar;