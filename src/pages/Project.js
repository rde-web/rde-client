import React, { memo } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-min-noconflict/mode-plain_text";
import "ace-builds/src-noconflict/ext-language_tools";
import EditorAppBar from '../components/editor/AppBar'
import Box from '@mui/material/Box';
import modelist from "ace-builds/src-min-noconflict/ext-modelist";

const api = "http://localhost:3003";

const default_mode = "plain_text"
class Project extends React.Component {
    constructor(){
        super();
        this.state = {
            mode: default_mode,
            theme: null,
            fileContent: null,
        }
        this.editor = React.createRef();
        this.importedLangs = {};
    }

    openFile = (filepath) => {
        fetch(api+"/cat?path="+filepath).then(resp => {
            resp.json().then(data => {
                this.setState((state) => ({
                    ...state,
                    fileContent: data.content
                }))
                this.setLang(this.langByFilename(filepath));
            }, console.error)
        }, console.error);
    }

    langByFilename = (filepath) => {
        try {
           return  modelist.getModeForPath(filepath).name
        } catch(_) {
            return default_mode;
        }
    }
    
    setLang = (lang) => {
        if (lang in this.importedLangs) {
            this.setState((state) => ({ ...state, mode:lang }));
            return;
        }
        import(`ace-builds/src-min-noconflict/mode-${lang}`).then(
            _=>{
                this.importedLangs[lang] = true;
                this.setState((state) => ({ ...state, mode:lang }));
            },
            console.error
        );
    }

    render() {
        return <Box sx={{ flexGrow: 1 }} height="100%" width="100%">
            <EditorAppBar openFile={this.openFile}/>
            <AceEditor
                mode={this.state.mode}
                theme={this.state.theme}
                height="100%"
                width="100%"
                ref={this.editor}
                placeholder="Code here"
                name={`editor-${this.state.mode}`}
                value={this.state.fileContent}
                readOnly={false}
                editorProps={{$blockScrolling: true}}
            />
        </Box>
    }
}

export default memo(Project);