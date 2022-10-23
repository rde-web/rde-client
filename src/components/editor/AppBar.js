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
    openFile: ()=>{},
};

class EditorAppBar extends React.Component {
    constructor(props=default_props){
        super();
        this.state = {
            showSideBar: false,
            showCreateFileDialog: false,
            files: {},
            currnetFile: untitled_filename
        }
        this.openFileDelegate = props.openFile;
    }
    componentDidMount = () => {
        this.listFiles();
    }
    toggleDrawer = (show) => (event) => {
        this.setState((state) => ({ ...state, showSideBar: show, test:1 }));
    };

    toggleCreateFileDialog = (show) => {
        this.setState((state) => ({ ...state, showCreateFileDialog: show }));
    }

    openFile = (path) => {
        this.toggleDrawer(false)();
        this.openFileDelegate(path);
        let pathComponents = path.split("/") 
        this.setState((state) => ({...state, currnetFile: pathComponents[pathComponents.length - 1]}))
    }
    createFile = () => {
        let filename = document.getElementById("newFileName").value;
        fetch(api+"/touch?path="+filename).then(_ => {
            this.toggleCreateFileDialog(false);
            this.listFiles();
        }, console.error);
    }
    listFiles = () => {
        fetch(api+"/ls").then((resp => {
            resp.json().then(data => {
                this.setState((state)=>({...state, files:data.files}));
            })
        }), console.error);
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
                        key={this.state.currnetFile}>
                        {this.state.currnetFile}
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
                {
                    (() => {
                        let items = [];
                        for (let path in this.state.files) {
                            items.push(<h1
                            key={path}
                            onClick={() => this.openFile(path)}>{path}</h1>)
                        }
                        return <>{items}</>;
                    })()
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