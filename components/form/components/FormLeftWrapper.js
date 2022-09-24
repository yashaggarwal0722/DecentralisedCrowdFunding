import styled from "styled-components";
import {FormState} from "../form";
import {useContext} from "react";

const FormLeftWrapper = () => {

    const Handler = useContext(FormState);

  return (
    <FormLeft>
      <Noter>
      <ul >
           <p><b>POINTS TO BE NOTED BEFORE USING THE WEBSITE</b></p>
            <li><b>Required fields should not be empty, else an error could occur.</b></li>
            <li><b>Metamask browser extenstion should be installed.</b></li>
            <li><b>Metamask Account should be created. </b></li>
            <li><b>Matic is a testnet currency. </b></li>
          </ul>
        </Noter>
        <FormInput>
            <label>Campaign Title*</label>
            <Input onChange={Handler.FormHandler} value={Handler.form.campaignTitle} placeholder="Campaign Title (required)" name="campaignTitle">
            </Input>
        </FormInput>
        <FormInput>
            <label>Story*</label>
            <TextArea onChange={Handler.FormHandler} value={Handler.form.story} name="story" placeholder="Describe Your Story (required)">
            </TextArea>
        </FormInput>
         
     
    </FormLeft>
    
  )
}
const Noter = styled.div`
    display:flex;
    align-items:space-between;
    background-color:${(props) => props.theme.bgDiv};
    border-radius:10px;
    padding:15px ;
    color:red;
    width:100%;
    height:30%;
    margin:0;
    margin-top:10px;
    padding-top:5px;
    
    
  `

const TextArea = styled.textarea`
    padding:15px;
    background-color: ${(props)=>props.theme.bgDiv};
    color:${(props)=>props.theme.color};
    margin-top:4px;
    border:none;
    border-radius:8px;
    outline:none;
    font-size:large;
    min-width:100%;
    max-width:100%;
    overflow-x:hidden;
    font-family:DynaPuff;
    height:160px;
`

const FormLeft = styled.div`
    width:48%;


`

const FormInput = styled.div`
    margin-top:15px;
    display:flex;
    flex-direction:column;
    font-family:DynaPuff;
    

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

export default FormLeftWrapper
