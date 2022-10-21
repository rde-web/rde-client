import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';

const untitled_filename = "Untitled"

const default_props = {
    filename: untitled_filename,
    openFile: ()=>{},
    files: [],
}

class EditorAppBar extends React.Component {
    constructor(props=default_props){
        super();
        this.state = {
            showSideBar: false,
        }
        this.openFile = props.openFile;
    }
    toggleDrawer = (show) => (event) => {
        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }
        this.setState({ ...this.state, showSideBar: show });
    };

    render() {
        return <>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={this.toggleDrawer(true)}>
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                        key={this.props.fileName}>
                        {this.props.fileName ?
                        this.props.fileName : untitled_filename}
                    </Typography>
                </Toolbar>
            </AppBar>
            <SwipeableDrawer
                open={this.state.showSideBar}
                onClose={this.toggleDrawer(false)}
                onOpen={this.toggleDrawer(true)}
                onClick={this.toggleDrawer(false)}>
                {this.props.files.map(
                    (v) => <h1 
                        key={v}
                        onClick={() => this.openFile(v)}
                    >{v}</h1>)
                }
            </SwipeableDrawer>
        </>
    }
}

export default EditorAppBar;