import styled from "styled-components";
import FormLeftWrapper from "./components/FormLeftWrapper";
import FormRightWrapper from "./components/FormRightWrapper";
import { createContext, useState} from "react";
import {TailSpin} from "react-loader-spinner";
import {ethers} from "ethers";
import {toast} from "react-toastify";
import campaignMaker from "../../artifacts/contracts/crowdfund.sol/campaignMaker.json"
import Link from "next/link";
const FormState = createContext();

const Form = () => {

  const[form,setForm] = useState({
    campaignTitle:"",
    story:"",
    requiredAmount:"0",
    category:"--Select--",
  });

  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [uploaded, setUploaded] = useState(false);

  const [storyUrl, setStoryUrl] = useState();
  const [imageUrl, setImageUrl] = useState();
  
  
  const FormHandler = (e)=>{
    setForm({
      ...form,
      [e.target.name]:e.target.value
    })
  }
  
  const [image,setImage]=useState(null);
  
  const ImageHandler= (e)=>{
    setImage(e.target.files[0]);
  }

  const startCampaign = async (e)=>{

    e.preventDefault();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []); // <- this promps user to connect metamask
    const signer = provider.getSigner();

    if(form.campaignTitle==""){
      toast.warn("Title cannot be empty");
    }
    else if(form.story==""){
      toast.warn("Story cannot be empty");
    }
    else if(form.requiredAmount==""||form.requiredAmount<0){
      toast.warn("Required Amount cannot be empty");
    }
    else if(uploaded==false){
      toast.warn("Files not uploaded");
    }
    else{
      setLoading(true); 
    }
      
        const contract = new ethers.Contract(
          process.env.NEXT_PUBLIC_ADDRESS,
          campaignMaker.abi,
          signer
        );
        const CampaignAmount = ethers.utils.parseEther(form.requiredAmount);
        const campaignData = await contract.makeCampaign(
          form.campaignTitle,
          CampaignAmount,
          storyUrl,
          imageUrl,
          form.category
        );

        await campaignData.wait();
        setAddress(campaignData.to);

  }

  return (
  <FormState.Provider value={{form,setForm,image,setImage,ImageHandler,FormHandler,setImageUrl,setStoryUrl,startCampaign, setUploaded}}>
    <FormWrapper>
      <FormContent>
        {
          loading == true?
          address ==""?
          <Spinner>
            <TailSpin height={60}/>
          </Spinner>
          :
          <Address>
              <Header>Your Campaign Is Successfully Created.</Header>
              <Header>Address: {address}</Header>
              {/* <Link passHref href={'/' + address}><Button> */}
                {/* {e.address} */}
                {/* View Details */}
              {/* </Button></Link> */}
              <Header>Go to dashboard section to view details.</Header>
          </Address>
          :
          <FormInputsWrapper>
              <FormLeftWrapper/>
              <FormRightWrapper/>
          </FormInputsWrapper>
        }
      </FormContent>
    </FormWrapper>
  </FormState.Provider>  
  )
}

const Header = styled.h2`
  font-family:DynaPuff;
`

const Spinner = styled.div`
  width:100%;
  height:80vh;
  display:flex;
  justify-content:center;
  align-items:center;
`

const FormWrapper=styled.div`
  width:100%;
  display:flex;
  justify-content:center;
`

const FormContent = styled.div`
  width:80%;
`

const FormInputsWrapper = styled.div`
  display:flex;
  justify-content:space-between;
  margin-top:45px;
  

`
const Address = styled.div`
  background-color:${(props)=>props.theme.bgDiv};
  width:100%;
  height:80vh;
  display:flex;
  flex-direction:column;
  border-radius:10px;
  align-items:center;

  
`

const Button = styled.button`
  display:flex;
  justify-content:center;
  background-color:${(props)=>props.theme.bgSubDiv};
  color:${(props)=>props.theme.color};
  margin-top:4px;
  border:none;
  border-radius:10px;
  outline:none;
  font-size:large;
  width:30%;
  padding:15px;
  cursor:pointer;
  font-family:DynaPuff;
  border:solid 2px white;
`

export default Form
export {FormState};