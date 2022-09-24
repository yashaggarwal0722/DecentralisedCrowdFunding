import styled from "styled-components";
import { FormState } from "../form";
import { useState,useContext } from "react";
import { toast } from "react-toastify";
import {TailSpin} from "react-loader-spinner";
import {create as IPFSHTTPClient} from "ipfs-http-client";

const projectId = "2DyogIGEiZzQwL7TMbb6aElqVb4";
const projectSecret = "902d5c6950bc0887905afca2c4756aac";
const auth = "Basic "+Buffer.from(projectId+":"+projectSecret).toString("base64")

const client = IPFSHTTPClient({
  host:"ipfs.infura.io",
  port:5001,
  protocol:"https",
  headers:{
    authorization:auth
  }
})

const FormRightWrapper = () => {
  const Handler = useContext(FormState);
  
  const [uploadLoading,setUploadLoading] = useState(false);
  const [uploaded,setUploaded] = useState(false);

  const uploadFiles = async (e)=>{
    e.preventDefault();
    setUploadLoading(true);

    if(Handler.form.story!==""){
      try{
        const added = await client.add(Handler.form.story);
        Handler.setStoryUrl(added.path)
      }
      catch(error){
        toast.warn(`Error Uploading Story`);
      }
      }
    

    if(Handler.image!==null){
      try{
        const added = await client.add(Handler.image);
        Handler.setImageUrl(added.path)
      }
      catch(error){
        toast.warn(`Error Uploading Image`);
      }
    }

    setUploadLoading(false);
    setUploaded(true);
    Handler.setUploaded(true);
    toast.success("Files Uploaded Successfully")
  }
  return (
    <FormRight>
      <FormInput>
        <FormRow>
        <RowInput>
              <label>Required Amount*</label>
              <Input type={"number"} placeholder="Amount (required)" onChange={Handler.FormHandler} value={Handler.form.requiredAmount} name="requiredAmount"></Input>
        </RowInput>
            <RowInput>
              <label>Choose Category</label>
              <Select onChange={Handler.FormHandler} value={Handler.form.category} name="category">
                <option>--Select--</option>
                <option>Education</option>
                <option>Health</option>
                <option>Animal Welfare</option>
                <option>Others</option>
              </Select>
            </RowInput>
        </FormRow>
      </FormInput>
      <FormInput>
        {/* image */}
      </FormInput>
      <FormInput>
        <label>Select Image*</label>
        <Image type={"file"} accept="image/*" alt="" onChange={Handler.ImageHandler} >
        </Image>
      </FormInput>
      {uploadLoading==true?<Button><TailSpin color="#3FA796" height={20}/></Button>:
       uploaded == false?
       <Button onClick={uploadFiles}>
        Click Here To Upload Image
      </Button>:<Button style={{cursor:"no-drop"}}>
        Files Uploaded Successfully
      </Button>
      }
      <Button onClick={Handler.startCampaign}>
        Start Campaign
      </Button>
    </FormRight>
  )
}

const Button = styled.button`
  display:flex;
  justify-content:center;
  background-color:${(props)=>props.theme.bgDiv};
  color:${(props)=>props.theme.color};
  margin-top:4px;
  border:none;
  border-radius:10px;
  outline:none;
  font-size:large;
  width:100%;
  padding:15px;
  cursor:pointer;
  font-family:DynaPuff;
  border:solid 2px white;
  
`

const Image = styled.input`
  background-color:${(props)=>props.theme.bgDiv};
  color:${(props)=>props.theme.color};
  margin-top:4px;
  border:none;
  border-radius:10px;
  outline:none;
  font-size:large;
  width:100%;
  font-family:DynaPuff;


  &::-webkit-file-upload-button{
    padding:15px;
    background-color:${(props)=>props.theme.bgSubDiv};
    color:${(props)=>props.theme.color};
    outline:none;
    border:solid 2px white;
    border-radius:10px;
    font-weight:bold;
    margin-right:5px;
    cursor:pointer;
    font-family:DynaPuff;

  }


`

const FormRight = styled.div`
   width:45%;
`
const FormRow = styled.div`
  display:flex;
  justify-content:space-between;
  width:100%;
`

const Input = styled.input`
    padding:15px;
    background-color:${(props)=>props.theme.bgDiv};
    margin-top:4px;
    border:none;
    border-radius:8px;
    outline:none;
    font-size:large;
    width:100%;
    font-family:DynaPuff;
    color:${(props)=>props.theme.color};

`
const RowInput = styled.div`
  display:flex;
  flex-direction:column;
  width:45%;

`
const Select = styled.select`
    padding:15px;
    color:${(props)=>props.theme.color};
    background-color:${(props)=>props.theme.bgDiv};
    margin-top:4px;
    border:none;
    border-radius:8px;
    outline:none;
    font-size:large;
    width:100%;
    font-family:DynaPuff;
`

const FormInput = styled.div`
    margin-top:15px;
    display:flex;
    flex-direction:column;
    font-family:DynaPuff;
`

export default FormRightWrapper
