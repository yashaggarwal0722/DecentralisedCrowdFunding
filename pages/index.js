import styled from "styled-components";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import PaidIcon from "@mui/icons-material/Paid";
import EventIcon from "@mui/icons-material/Event";
import Image from "next/image";
import { ethers } from "ethers";
import CampaignMaker from "../artifacts/contracts/crowdfund.sol/campaignMaker.json"
import { useState } from "react";
import Link from "next/link";

export default function Index({ AllData, EducationData, HealthData, AnimalWelfareData, OthersData }) {
  const [filter, setFilter] = useState(AllData);
  return (

    <HomeWrapper>
      {/*Filter Section*/}
      <Note>
          <ul>
            <p><b>POINTS TO BE NOTED BEFORE USING THE WEBSITE</b></p>
            <li><b>Metamask browser extenstion should be installed.</b></li>
            <li><b>Metamask Account should be created. </b></li>
            <li><b>Hit the connect wallet button on top right.</b></li>
            <li><b>Matic is a testnet currency. </b></li>
          </ul>
      </Note>
      <FilterWrapper>
        <FilterAltIcon style={{ fontSize: 40 }} />
        <Category onClick={() => setFilter(AllData)}>All</Category>
        <Category onClick={() => setFilter(HealthData)}>Health</Category>
        <Category onClick={() => setFilter(EducationData)}>Education</Category>
        <Category onClick={() => setFilter(AnimalWelfareData)}>Animal Welfare</Category>
        <Category onClick={() => setFilter(OthersData)}>Others</Category>
      </FilterWrapper>



      {/* Cards Containter*/}
      <CardsWrapper>

        {/*Card*/}
        {filter.map((e) => {
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
                View Details And Donate
              </Button></Link>
            </Card>
          )
        })}
        {/*Card*/}

      </CardsWrapper>
    </HomeWrapper>

  )
}


export async function getStaticProps() {

  const provider = new ethers.providers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_RPC_URL
  );

  const contract = new ethers.Contract(
    process.env.NEXT_PUBLIC_ADDRESS,
    CampaignMaker.abi,
    provider
  );

  const getAllCampaigns = contract.filters.campaignCreated();
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
  });

  const getEducationCampaigns = contract.filters.campaignCreated(null, null, null, null, "Education", null, null);
  const EducationCampaigns = await contract.queryFilter(getEducationCampaigns);
  const EducationData = EducationCampaigns.map((e) => {
    return {
      title: e.args.title,
      image: e.args.image,
      owner: e.args.campaignOwner,
      timestamp: parseInt(e.args.timestamp),
      amount: ethers.utils.formatEther(e.args.requiredAmount),
      address: e.args.passedcampaignAddress,
    }
  });



  const getHealthCampaigns = contract.filters.campaignCreated(null, null, null, null, "Health", null, null);
  const HealthCampaigns = await contract.queryFilter(getHealthCampaigns);
  const HealthData = HealthCampaigns.map((e) => {
    return {
      title: e.args.title,
      image: e.args.image,
      owner: e.args.campaignOwner,
      timestamp: parseInt(e.args.timestamp),
      amount: ethers.utils.formatEther(e.args.requiredAmount),
      address: e.args.passedcampaignAddress,
    }
  });

  const getAnimalWelfareCampaigns = contract.filters.campaignCreated(null, null, null, null, "Animal Welfare", null, null);
  const AnimalWelfareCampaigns = await contract.queryFilter(getAnimalWelfareCampaigns);
  const AnimalWelfareData = AnimalWelfareCampaigns.map((e) => {
    return {
      title: e.args.title,
      image: e.args.image,
      owner: e.args.campaignOwner,
      timestamp: parseInt(e.args.timestamp),
      amount: ethers.utils.formatEther(e.args.requiredAmount),
      address: e.args.passedcampaignAddress
    }
  });

  const getOthersCampaigns = contract.filters.campaignCreated(null, null, null, null, "Others", null, null);
  const OthersCampaigns = await contract.queryFilter(getOthersCampaigns);
  const OthersData = OthersCampaigns.map((e) => {
    return {
      title: e.args.title,
      image: e.args.image,
      owner: e.args.campaignOwner,
      timestamp: parseInt(e.args.timestamp),
      amount: ethers.utils.formatEther(e.args.requiredAmount),
      address: e.args.passedcampaignAddress
    }
  });

  return {
    props: {
      AllData,
      EducationData,
      HealthData,
      AnimalWelfareData,
      OthersData
    },
    revalidate: 1
  }
}

const Note = styled.div`
    display:flex;
    align-items:center;
    background-color:${(props) => props.theme.bgDiv};
    border-radius:10px;
    padding:15px ;
    color:red;
    width:30%;
    height:30%;
    margin:0;
    margin-top:10px;
    padding-top:5px;
    
    
  `

const HomeWrapper = styled.div`
    display:flex;
    flex-direction:column;
    align-items:center;
    width:100%;
    
  `

const FilterWrapper = styled.div`
    display:flex;
    align-items:center;
    width:80%;
    margin-top:15px;
    
  `

const Category = styled.div`
  padding:7px;
  background-color:${(props) => props.theme.bgDiv};
  margin:0px 15px;
  border-radius:10px;
  font-family:'DynaPuff';
  font-weight:normal;
  cursor:pointer;
  border:solid 5px ${(props) => props.theme.bgDiv};
  :hover{
    background-color:${(props) => props.theme.bgSubDiv};
  }
  `
const CardsWrapper = styled.div`
    display:flex;
    justify-content:space-between;
    flex-wrap:wrap;
    width:80%;
    margin-top:0px;
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
