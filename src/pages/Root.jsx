import React from 'react';
import NavBar from '../components/NavBar/NavBar';
import { Outlet } from 'react-router';
import Footer from '../components/Footer/Footer';


const Root = () => {
    return (
        <div className='bg-[#1F262E] min-h-screen'>
            <NavBar></NavBar>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    )
}

export default Root;