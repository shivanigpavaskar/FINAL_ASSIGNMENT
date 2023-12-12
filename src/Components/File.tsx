import React, { useState } from 'react'
import axios from "axios";


interface Progress {
  started: boolean;
  pc: number;
}

const File : React.FC<FileProps>= () => {

const [myFile,setMyFile] = useState<string | null>(null);
const [progress,setProgress] = useState<Progress>({started: false, pc:0  })
const [msg,setMsg] = useState<string | null>(null);



function handleUpload (){
    if (!myFile){
        setMsg('No file was uploaded');
        return;
    }

     const fd = new FormData();
     fd.append('file',myFile);


     setMsg("Uploading....");
     setProgress(prevState => {
        return{
            ...prevState,started:true
        }
     })
     axios.post('http://httpbin.org/post',fd,{
        onUploadProgress: (progressEvent) => {
             if (progressEvent.total !== undefined) 
              setProgress((prevState) => ({ ...prevState, pc: (progressEvent.loaded / progressEvent.total) * 100 }));
            }
          }, )
        
        
        headers:{
            "custom-headers":"value",
        }
 
     }
.then(res=>{
    setMsg("upload successful");
    console.log(res.data)
} )
.catch(err =>{
    setMsg("upload failed");

    console.error(err)

});
}
 
  return (
   <>
    <div>Create course</div>

<input onChange={handleFileChange} type="file" />
<button onClick={handleUpload}>upload</button>


{progress.started && <progress max= "100" value={progress.pc}></progress>}
{msg && <span>{msg}</span>}



</>
   
    

  )
};

export default File