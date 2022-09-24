//SPDX-License-Identifier: Unlicensed
pragma solidity >0.7.0 <=0.9.0;

contract campaignMaker{
    address[] public campaignAddress;
    event campaignCreated(string title, uint requiredAmount, address passedcampaignAddress, string image, string indexed category, uint indexed timestamp,address indexed campaignOwner);

    function makeCampaign(string memory _title, uint _requiredAmount, string memory _story, string memory _image, string memory _category) public{

        campaign newCampaign = new campaign(_title,_requiredAmount,_story,_image,msg.sender);
        campaignAddress.push(address(newCampaign));
        emit campaignCreated(_title, _requiredAmount, address(newCampaign), _image, _category, block.timestamp, msg.sender);

    }
}

contract campaign{
    address payable public campaignOwner;
    string public story;
    string public image;
    uint public requiredAmount;
    uint public receivedAmount;
    string public title;


    constructor(string memory _title, uint _requiredAmount, string memory _story, string memory _image,address CampaignOwner){
        title=_title;
        story=_story;
        requiredAmount=_requiredAmount;
        image=_image;
        campaignOwner=payable(CampaignOwner);
    }

    event donated(address indexed donar,uint indexed amountSent ,uint indexed timestamp );

    function donate() public payable{
        require(receivedAmount<requiredAmount,"Required amount exceeded");
        campaignOwner.transfer(msg.value);
        receivedAmount+=msg.value;
        emit donated (msg.sender,msg.value,block.timestamp);
    }
}