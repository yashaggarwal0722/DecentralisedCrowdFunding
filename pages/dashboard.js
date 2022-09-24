import styled from "styled-components";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import PaidIcon from "@mui/icons-material/Paid";
import EventIcon from "@mui/icons-material/Event";
import Image from "next/image";
import { ethers } from "ethers";
import CampaignMaker from "../artifacts/contracts/crowdfund.sol/campaignMaker.json"
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Dashboard() {

  const [campaignsData, setCampaignsData] = useState([]);

  useEffect(() => {
    const Request = async () => {

      
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const Web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = Web3Provider.getSigner();
      const Address = await signer.getAddress();

      const provider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_RPC_URL
      );

      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_ADDRESS,
        CampaignMaker.abi,
        provider
      );

      const getAllCampaigns = contract.filters.campaignCreated(null,null,null,null,null,null,Address);
      const AllCampaigns = await contract.queryFilter(getAllCampaigns);
      const AllData = AllCampaigns.map((e) => {
        return {
          title: e.args.title,
          image: e.args.image,
          owner: e.args.campaignOwner,
          timestamp: parseInt(e.args.timestamp),
          amount: ethers.utils.formatEther(e.args.requiredAmount),
          address: e.args.passedcampaignAddress
        }
      })
      setCampaignsData(AllData);
    }
    Request();
    }, [])

  return (

    <HomeWrapper>
     <Note>
        <ul>
          <p><b>POINTS TO BE NOTED BEFORE USING THE WEBSITE</b></p>
          <li><b>Metamask browser extenstion should be installed.</b></li>
          <li><b>Metamask Account should be created.</b> </li>
          <li><b>Matic is a testnet currency.</b> </li>
        </ul>
      </Note>

      <Header>My Started Campaigns: </Header>
      {/* Cards Containter*/}
      <CardsWrapper>

        {/*Card*/}
        {campaignsData.map((e) => {
          return (
            <Card key={e.title}>
              <CardImg>
                <Image
                  alt="Crowdfunding dapp"
                  layout='fill'
                  src={"https://decentralisedcrowdfunding.infura-ipfs.io/ipfs/" + e.image}
                />
              </CardImg>
              <Title>
                {e.title}
              </Title>
              <CardData>
                <Text>Owner<AccountBoxIcon /></Text>
                <Text>{e.owner.slice(0, 6)}...{e.owner.slice(39)}</Text>
              </CardData>
              <CardData>
                <Text>Amount<PaidIcon /></Text>
                <Text>{e.amount} Matic</Text>
              </CardData>
              {/* <CardData> */}
              {/* <Text>Date <EventIcon /></Text> */}
              {/* <Text>{new Date(e.timestamp*1000).toLocaleString([], {year: 'numeric', month: 'numeric', day: 'numeric'})}</Text> */}
              {/* </CardData> */}
              <Link passHref href={'/' + e.address}><Button>
                {/* {e.address} */}
                View Details
              </Button></Link>
            </Card>
          )
        })}
        {/*Card*/}

      </CardsWrapper>
    </HomeWrapper>

  )
}



const Note = styled.div`
    display:flex;
    align-items:center;
    background-color:${(props) => props.theme.bgDiv};
    border-radius:10px;
    padding:15px ;
    color:red;
    width:35%;
    height:30%;
    margin:0;
    margin-top:10px;
    
    
  `

const Header = styled.div`
 font-family:"DynaPuff";
  font-size:25px;
  margin:25px 0px;
  padding:5px;
  cursor:pointer;
  font-weight:bold;
  margin-top:10px;
`

const HomeWrapper = styled.div`
    display:flex;
    flex-direction:column;
    align-items:center;
    width:100%;
    
  `


const CardsWrapper = styled.div`
    display:flex;
    justify-content:space-between;
    flex-wrap:wrap;
    width:80%;
    margin-top:5px;
    border-radius:10px;
    

  `
const Card = styled.div`
    width:30%;
    margin-top:20px;
    background-color:${(props) => props.theme.bgDiv};
    border-radius:10px;
    border:4px solid white;
    &:hover{
      transform:translateY(-10px);
      transform:transform 0.5s;
    }

    &:not(:hover){
      transition:transform 0.5s;
    }
  `

const CardImg = styled.div`
    position: relative;
    height:150px;
    width:100%;
    border-radius:10px;

  `
const Title = styled.h2`
  font-family:"DynaPuff";
  font-size:18px;
  margin:2px 0px;
  background-color:${(props) => props.theme.bgSubDiv};
  padding:5px;
  cursor:pointer;
  font-weight:normal;
  border-radius:5px;

  `

const CardData = styled.div`
    display:flex;
    justify-content:space-between;
    margin:2px 0px;
    background-color:${(props) => props.theme.bgSubDiv};
    padding:5px;
    cursor:pointer;
    border-radius:5px;

  `

const Text = styled.p`
    display:flex;
    align-items:center;
    margin:0;
    padding:0;
    font-family:"DynaPuff";
    font-size:18px;
    

  `
const Button = styled.button`
  display:flex;
  justify-content:center;
  background-color:${(props) => props.theme.bgSubDiv};
  color:${(props) => props.theme.color};
  margin-top:4px;
  border:none;
  border-radius:10px;
  outline:none;
  font-size:large;
  width:100%;
  padding:15px;
  cursor:pointer;
  font-family:DynaPuff;
  border-top:solid 2px white;
  `