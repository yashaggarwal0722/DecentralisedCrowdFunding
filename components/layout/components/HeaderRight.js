import styled from 'styled-components';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import {App} from "../Layout";
import { useContext } from 'react';
import Wallet from "./wallet";

const HeaderRight = () => {
    const ThemeToggler = useContext(App);
    return (
    <HeaderRightWrapper>

        <Wallet/>
        <ThemeToggle onClick = {ThemeToggler.changeTheme}>
        {ThemeToggler.theme==="light" ? <DarkModeIcon onClick = {ThemeToggler.changeTheme}/>: <LightModeIcon onClick={ThemeToggler.changeTheme}/>}
        <Text> Dark/Light Mode</Text>
        </ThemeToggle>
    </HeaderRightWrapper>
  )
}
const Text = styled.h1`
    font-size:10px;
    font-family:DynaPuff;
`
const HeaderRightWrapper = styled.div`
    margin-top:15px;
    display:flex;
    justify-content:center;
    align-items:center;
    margin-right:15px;
    height:71%;
`

const ThemeToggle = styled.div`

    display:flex;
    justify-content:center;
    align-items:center;
    border-radius:10px;
    background-color:${(props)=>props.theme.bgDiv};
    height:75%;
    padding:5px;
    width:80px;
    cursor:pointer;

`

export default HeaderRight
