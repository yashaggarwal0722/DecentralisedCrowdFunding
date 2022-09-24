import styled from "styled-components";
import { ethers } from "ethers";
import { useState } from "react";
const networks = {
    polygon: {
        chainId: `0x${Number(80001).toString(16)}`,
        chainName: "Polygon Testnet",
        nativeCurrency: {
            name: "MATIC",
            symbol: "MATIC",
            decimals: 18
        },
        rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
        blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
    },
};


const Wallet = () => {
    const [address, setAddress] = useState();
    const [balance, setBalance] = useState('');
    const ConnectWallet = async () => {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        if (provider.network !== "matic") {
            await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [{
                    ...networks["polygon"]
                }
                ]
            })
            const account = provider.getSigner();
            const Address = await account.getAddress();
            setAddress(Address);
            const Balance = ethers.utils.formatEther(await account.getBalance());
            setBalance(Balance);
        }

    }
    return (
       
        <ConnectWalletWrapper onClick={ConnectWallet}>
        {balance==""?null:<Balance>Balance - {balance.slice(0,5)} Matic</Balance>}
        {address == null ?<Address>Connect Wallet</Address>:<Address>Account - {address.slice(0,6)}...{address.slice(38)}</Address>}
        </ConnectWalletWrapper>
    )
}

const ConnectWalletWrapper = styled.div`
    display:flex;
    align-items:center;
    justify-content:space-between;
    background-color:${(props)=>props.theme.bgDiv};
    padding:5px 9px;
    height:75%;
    border-radius:10px;
    margin-right:15px;
    color:${(props)=>props.theme.color};
    font-family:DynaPuff;
    font-weight:bold;
    font-size:small;
    cursor:pointer;
`
const Address = styled.p`
    background-color:${(props)=>props.theme.bgSubDiv};
    height:100%;
    display:flex;
    align-items:center;
    justify-content:center;
    border-radius:10px;
    padding:0px 5px;
`
const Balance = styled.p`
    background-color:${(props)=>props.theme.bgSubDiv};
    height:100%;
    display:flex;
    align-items:center;
    justify-content:center;
    margin-right:5px;
    border-radius:10px;
    padding:0px 5px;

`
export default Wallet
