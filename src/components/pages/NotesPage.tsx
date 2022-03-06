import { type } from 'os';
import React, { useEffect, useState } from 'react';
import { text } from 'stream/consumers';
import Explorer from '../Explorer/Explorer';
import IFile from '../TextEditor/interfaces/IFile';
import IFolder from '../TextEditor/interfaces/IFolder';
import TextEditor from '../TextEditor/TextEditor';
import axios from 'axios';
import config from '../../config'
import useInterval from '../../hooks/useInterval'

interface NotesPageProps {
    
}



let empty : IFolder = {    
    name:'TEST FOLDER',
    systemUnitType: 'folder',
    uniqueId: Math.random().toString(16).slice(2),
    folders: [],
    files: [],
}

const NotesPage: React.FunctionComponent<NotesPageProps> = (props: NotesPageProps) => {
    
    const [currentFile, setcurrentFile] = useState<IFile>();
    const [fileSystem, setfileSystem] = useState<IFolder>();
    
    const [dataLoaded, setdataLoaded] = useState(false);
    const [firstLoad, setfirstLoad] = useState(true);

    async function saveFileSystemOnServer(fileSystem: IFolder) {
        try{
            let res = await axios.post(config.BACKEND_ADDRES+'filesystem', fileSystem);
            console.log("UPDATE^");
            return "ok";
        }catch (e){
            console.log('SAVE ERROR', e);
            setdataLoaded(false);
            setcurrentFile(undefined);
            return "server not responding";
        }
    }

    async function fetchFileSystemFromServer() {
        try{
            let responseRoot = await axios.get(config.BACKEND_ADDRES+'filesystem');
            setfileSystem(responseRoot.data);
            setdataLoaded(true);
            console.log('FETCH STATUS CODE', responseRoot.status);
            return "ok";
        } catch (e){
            console.log('FETCH ERROR', e);
            return "server not responding";
        }
    }

    useInterval( async () => {
        setfirstLoad(false)
        if (!dataLoaded){
            console.log("DATA LOADED STATUS", dataLoaded)
            let res = await fetchFileSystemFromServer();
            console.log("RESPONSE FETCH", res);
            if(res === "ok"){
                console.log("DATA LOADED STATUS", dataLoaded)
            }
        }
        if((dataLoaded) && (fileSystem)){
            console.log("DATA LOADED STATUS on saving", dataLoaded)
            await saveFileSystemOnServer(fileSystem);
        }
    }, (firstLoad)? 0 : 5000)

    useEffect(() => {
        
    })

    if(!dataLoaded || fileSystem === undefined){
        return <div className='loading-explorer'>Loading...</div>
    }else{
        return ( 
            <div className='notes-page'>
                {/* pass user`s files to explorer on left side and hook to change displayable file*/}
                    <Explorer currentDisplayableFile={{currentFile : currentFile, openFile : setcurrentFile}} fileSystem={{fs: fileSystem, changeFS: setfileSystem}}   />
                    <TextEditor file={currentFile}/>
            </div> );
    }    
}
 
export default NotesPage;

// console.log("MOUNTED");
//         console.log(`ConnectionStart: ${connectionStart} \nDataLoaded: ${dataLoaded}\nsyncStarted: ${syncStarted}`);
//         if(!connectionStart){
//             fetchFileSystemFromServer();
//             setconnectionStart(true);
//         }
//         if(dataLoaded && !syncStarted){
//             let interval = setInterval(async ()=>{
//                 console.log("INTERVAL")
//                 if(fileSystem){
//                     let res = await saveFileSystemOnServer(fileSystem);
//                     console.log('res', (res !== 200))
//                     if(res == 200) setsyncStarted(true);
//                     if(res != 200){
//                         console.log("PIZDEC");
//                         setdataLoaded(false);
//                         setsyncStarted(false);
//                         setconnectionStart(false);
//                     }
//                 }
//             },5000);

//         }        