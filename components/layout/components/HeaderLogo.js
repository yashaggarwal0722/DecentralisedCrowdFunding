import styled from "styled-components";

const HeaderLogo = () => {
  return (
    <LogoWrapper>
      <LogoWrapper2>
      <Logo>
          Decentralised Crowd Funding
      </Logo> 
      </LogoWrapper2>
    </LogoWrapper>
  )
}
const LogoWrapper2 = styled.div`
    background-color:${(props)=>props.theme.bgSubDiv};
    height:100%;
    display:flex;
    align-items:center;
    justify-content:center;
    border-radius:10px;
    padding:0px 5px;
`
const LogoWrapper = styled.div`
    display:flex;
    align-items:center;
    justify-content:center;
    background-color:${(props)=>props.theme.bgDiv};
    padding:6px;
    height:50%;
    margin-top:15px;
    border-radius:10px;
    margin-left:15px;
    cursor:pointer;
    text-transform:uppercase;
  
`

const Logo = styled.h1`
    font-weight:bold;
    font-size:small;
    font-family:"DynaPuff";
`

export default HeaderLogo
