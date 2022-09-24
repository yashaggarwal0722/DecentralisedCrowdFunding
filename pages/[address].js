import styled from "styled-components";
import Image from "next/image";
import {ethers} from "ethers";
import campaignMaker from "../artifacts/contracts/crowdfund.sol/campaignMaker.json";
import campaign from "../artifacts/contracts/crowdfund.sol/campaign.json";
import {useEffect,useState} from "react";

export default function Detail({Data,DonationsData}){

    const [mydonations,setMydonations]=useState([]);
    const [story,setStory] = useState('');
    const [amount,setAmount] = useState();
    const [change,setChange] = useState(false);

    useEffect(()=>{
        const Request = async ()=>{
            let storyData;

            await window.ethereum.request({method:'eth_requestAccounts'});
            const Web3Provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = Web3Provider.getSigner();
            const Address = await signer.getAddress();

            const provider = new ethers.providers.JsonRpcProvider(
                process.env.NEXT_PUBLIC_RPC_URL
            );

            const contract = new ethers.Contract(
                Data.address,
                campaign.abi,
                provider
            );

            fetch("https://decentralisedcrowdfunding.infura-ipfs.io/ipfs/"+Data.story).then(res=>res.text()).then(data=>storyData=data);
            const MyDonations = contract.filters.donated(Address);
            const MyAllDonations = await contract.queryFilter(MyDonations);
            
            setMydonations(MyAllDonations.map((e)=>{
                return{
                    donar:e.args.donar,
                    amount:ethers.utils.formatEther(e.args.amountSent),
                    timestamp:parseInt(e.args.timestamp)
                }
            }));
            setStory(storyData);

        }  
        Request();
    },[change])

    const DonateFunds = async ()=>{
        try{
        await window.ethereum.request({method:"eth_requestAccounts"});
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(Data.address,campaign.abi,signer);
        const transaction = await contract.donate({value:ethers.utils.parseEther(amount)});
        await transaction.wait();
        
        setChange(true);
        setAmount('');
    }catch(error){
        console.log(error);
    
    }
    }

    return (
      
        <DetailWrapper>
        
          <LeftContainer>
            <ImageSection>
              <Image
                alt="crowdfunding dapp"
                layout="fill"
                src={
                  "https://decentralisedcrowdfunding.infura-ipfs.io/ipfs/" + Data.image
                }
              />
            </ImageSection>
            <Text>
              <u><b>Description:</b></u>
                <br></br>
              {story}
            </Text>
          </LeftContainer>
          <RightContainer>
          <Note>
          <ul>
          <p><b>POINTS TO BE NOTED BEFORE USING THE WEBSITE:-</b></p>
            <li><b>Metamask browser extenstion should be installed.</b></li>
            <li><b>Metamask Account should be created. </b></li>
            <li><b>Matic is a testnet currency. </b></li>
          </ul>
          </Note>

            <Title>{Data.title}</Title>
            <DonateSection>
              <Input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" placeholder="Enter Amount To Donate" />
              <Donate onClick={DonateFunds}>Donate</Donate>
            </DonateSection>
            <FundsData>
              <Funds>
                <FundText>Required Amount</FundText>
                <FundText>{Data.requiredAmount} Matic</FundText>
              </Funds>
              <Funds>
                <FundText>Received Amount</FundText>
                <FundText>{Data.receivedAmount} Matic</FundText>
              </Funds>
            </FundsData>
            <Donated>
              <LiveDonation>
                <DonationTitle>Recent Donations</DonationTitle>
                {DonationsData.map((e) => {
                  return (
                    <Donation key={e.timestamp}>
                    <DonationData>{e.donar.slice(0,6)}...{e.donar.slice(39)}</DonationData>
                    <DonationData>{e.amount} Matic</DonationData>
                    <DonationData>{new Date(e.timestamp * 1000).toLocaleString()}</DonationData>
                  </Donation>
                  )
                })
                }
              </LiveDonation>
              <MyDonation>
                <DonationTitle>My Past Donations</DonationTitle>
                {mydonations.map((e) => {
                  return (
                    <Donation key={e.timestamp}>
                    <DonationData>{e.donar.slice(0,6)}...{e.donar.slice(39)}</DonationData>
                    <DonationData>{e.amount} Matic</DonationData>
                    <DonationData>{new Date(e.timestamp * 1000).toLocaleString()}</DonationData>
                  </Donation>
                  )
                })
                }
              </MyDonation>
            </Donated>
          </RightContainer>
        </DetailWrapper>
      );
}


export async function getStaticPaths(){
    const provider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_RPC_URL
    );

    const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_ADDRESS,
        campaignMaker.abi,
        provider
    );


    const getAllCampaigns = contract.filters.campaignCreated();
    const AllCampaigns = await contract.queryFilter(getAllCampaigns);

    return{
        paths:AllCampaigns.map((e)=>({
            params:{
                address:e.args.passedcampaignAddress.toString(),
            }
        })),
        fallback:"blocking"
    }
}

export async function getStaticProps(context){
    const provider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_RPC_URL
    );

    const contract = new ethers.Contract(
        context.params.address,
        campaign.abi,
        provider
    );

    const title = await contract.title();
    const requiredAmount = await contract.requiredAmount();
    const story = await contract.story();
    const image = await contract.image();
    const owner = await contract.campaignOwner();
    const receivedAmount = await contract.receivedAmount();

    const Donations = contract.filters.donated();
    const AllDonations = await contract.queryFilter(Donations);

    const Data = {
        address:context.params.address,
        title,
        requiredAmount:ethers.utils.formatEther(requiredAmount),
        story,
        receivedAmount:ethers.utils.formatEther(receivedAmount),
        image,
        owner,      
        
    }

    const DonationsData = AllDonations.map((e)=>{
        return{
            donar:e.args.donar,
            amount:ethers.utils.formatEther(e.args.amountSent),
            timestamp:parseInt(e.args.timestamp)
        }
    });

    return{
        props:{
            Data,
            DonationsData
        },
        revalidate: 10
    }


}

const DetailWrapper = styled.div`
display:flex;
justify-content:space-between;
padding:20px;
width:985;

`
const Note = styled.p`
    display:flex;
    align-items:space-between;
    background-color:${(props) => props.theme.bgDiv};
    border-radius:10px;
    padding:15px ;
    color:red;
    width:95%;
    height:20%;
    margin:0;
    margin-top:10px;
    padding-top:5px;
    margin-bottom:10px;
    
    
  `

const LeftContainer = styled.div`
width:45%;
`
const RightContainer = styled.div`
width:50%;
`
const ImageSection = styled.div `
width:100%;
position:relative;
height:300px;

`
const Text = styled.p`
font-family:"DynaPuff";
font-size:large;
color:${(props)=>props.theme.color};
text-align:justify;
border:solid 2px white;
background-color:white;
border-radius:8px;
padding:7px;
line-height:1.5;
background:${(props)=>props.theme.bgDiv};
`
const Title = styled.h1`
padding:0;
margin:0;
font-family:"DynaPuff";
font-size:x-large;
color:${(props)=>props.theme.color};

`

const DonateSection = styled.div`
display:flex;
width:100%;
justify-content:space-between;
align-items:center;
margin-top:10px;

`

const Input = styled.input`
    padding:8px 15px;
    background-color:${(props)=>props.theme.bgDiv};
    color:${(props)=>props.theme.color};
    border:none;
    border-radius:8px;
    outline:none;
    font-size:large;
    width:43%;
    height:38px;
`

const Donate = styled.button`
  display:flex;
  justify-content:center;
  background-color:${(props)=>props.theme.bgDiv};
  color:${(props)=>props.theme.color};
  margin-top:4px;
  border:none;
  border-radius:10px;
  outline:none;
  font-size:large;
  width:48%;
  padding:15px;
  cursor:pointer;
  font-family:DynaPuff;
  border:solid 2px white;
`

const FundsData = styled.div`
width:100%;
display:flex;
justify-content:space-between;
margin-top:10px;

`
const Funds = styled.div`
width:45%;
background-color:${(props)=>props.theme.bgDiv};
padding:8px;
border-radius:8px;
text-align:center;

`
const FundText = styled.p`
margin:2px;
padding:0;
font-family:"DynaPuff";
font-size:normal;

`
const Donated = styled.div`
height:280px;
margin-top:15px;
background-color:${(props)=>props.theme.bgDiv};

`
const LiveDonation = styled.div`
height:65%;
overflow-y:auto;

`
const MyDonation = styled.div`
height:35%;
overflow-y:auto;


`
const DonationTitle = styled.div`
font-family:"DynaPuff";
font-size:small;
font-weight:bold;
text-transform:uppercase;
padding:4px;
text-align:center;
background-color:${(props)=>props.theme.bgDiv};
border-top:solid 5px ${(props)=>props.theme.bgSubDiv};


`

const Donation = styled.div`
display:flex;
justify-content:space-between;
margin-top:4px;
background-color:${(props)=>props.theme.bgSubDiv};
padding:4px 8px;

`
const DonationData = styled.p`
color:${(props)=>props.theme.color};
font-family:"DynaPuff";
font-size:large;
margin:0;
padding:0;
`
