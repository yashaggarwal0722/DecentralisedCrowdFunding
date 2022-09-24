const hre = require("hardhat");

async function main(){
    const CampaignMaker = await hre.ethers.getContractFactory("campaignMaker");
    const campaignMaker = await CampaignMaker.deploy();

    await campaignMaker.deployed();

    console.log("Contract Deployed to : ",campaignMaker.address);
}

main()
    .then(()=>process.exit(0))
    .catch((error)=>{
        console.log(error);
        process.exit(1);
    })