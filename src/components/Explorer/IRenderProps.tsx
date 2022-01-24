import IFileSystem from "../TextEditor/interfaces/IFileSystem";
import IFolder from "../TextEditor/interfaces/IFolder";

export default interface IRenderProps{
    root: IFolder;
    nestLvl: number;
    ctxMenu : {
        lastMenu: Function;
        setlastMenu: Function;
    };
    fileSys : {
        fs : IFolder;
        changeFS: React.Dispatch<React.SetStateAction<IFolder>>;
    };
}