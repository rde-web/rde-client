import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AddCard  from '@mui/icons-material/AddCard';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Divider from '@mui/material/Divider';
import { Dialog, DialogActions,DialogContent, DialogTitle, Button, TextField } from '@mui/material';

const untitled_filename = "Untitled";
const api = "http://localhost:3003";
const default_props = {
    filename: untitled_filename,
    openFile: ()=>{},
    files: [],
};

class EditorAppBar extends React.Component {
    constructor(props=default_props){
        super();
        this.state = {
            showSideBar: false,
            showCreateFileDialog: false,
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
        console.log("opaaa")
        this.setState({ ...this.state, showSideBar: show });
    };

    toggleCreateFileDialog = (show) => {
        this.setState({ ...this.state, showCreateFileDialog: show });
    }

    createFile = () => {
        let filename = document.getElementById("newFileName").value;
        fetch(api+"/touch?path="+filename).then((resp) => {
            console.log(resp);
        }, console.error)
        this.toggleCreateFileDialog(false);
    }

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
                onOpen={this.toggleDrawer(true)}>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                    onClick={() => this.toggleCreateFileDialog(true)}>
                    <AddCard />
                </IconButton>
                <Divider/>
                {this.props.files.map(
                    (v) => <h1 
                        key={v}
                        onClick={() => this.openFile(v)}
                    >{v}</h1>)
                }
            </SwipeableDrawer>
            <Dialog
                open={this.state.showCreateFileDialog}
                onClose={() =>this.toggleCreateFileDialog(false)}>
                <DialogTitle>Create file</DialogTitle>
                <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="newFileName"
                    label="File name"
                    fullWidth
                    variant="standard"
                />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => this.toggleCreateFileDialog(false)}>Cancel</Button>
                    <Button onClick={this.createFile}>Create</Button>
                </DialogActions>
            </Dialog>
        </>
    }
}

export default EditorAppBar;