import React, { memo } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-min-noconflict/mode-plain_text";
import "ace-builds/src-noconflict/ext-language_tools";
import EditorAppBar from '../components/editor/AppBar'
import Box from '@mui/material/Box';
import modelist from "ace-builds/src-min-noconflict/ext-modelist"
const tmp = `
package main

import (
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"crypto/sha256"
	"fmt"
)

func main() {
	privateKey, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	if err != nil {
		panic(err)
	}

	msg := "hello, world"
	hash := sha256.Sum256([]byte(msg))

	sig, err := ecdsa.SignASN1(rand.Reader, privateKey, hash[:])
	if err != nil {
		panic(err)
	}
	fmt.Printf("signature: %x\\n", sig)

	valid := ecdsa.VerifyASN1(&privateKey.PublicKey, hash[:], sig)
	fmt.Println("signature verified:", valid)
}
`
const tmp_name = "main.go"

const default_mode = "plain_text"
class Project extends React.Component {
    constructor(){
        super();
        this.state = {
            mode: default_mode,
            theme: null,
            fileName: null,
            filePath: null,
            fileContent: null,
        }
        this.editor = React.createRef();
        this.importedLangs = {};
    }

    openFile = (filepath) => {
        // @todo
        this.setState({
            ...this.state,
            fileName: tmp_name,
            filePath: tmp_name,
            fileContent: tmp
        })
        this.setLang(this.langByFilename(tmp_name));
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
            this.setState({ ...this.state, mode:lang });
            return;
        }
        import(`ace-builds/src-min-noconflict/mode-${lang}`).then(
            _=>{
                this.importedLangs[lang] = true;
                this.setState({ ...this.state, mode:lang });
            },
            _ => {}//@todo handle error
        );
    }

    render() {
        return <Box sx={{ flexGrow: 1 }} height="100%" width="100%">
            <EditorAppBar
                fileName={this.state.fileName}
                files={[tmp_name]}
                openFile={this.openFile}
            />
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