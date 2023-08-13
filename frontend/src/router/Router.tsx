import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Header from '../components/Header'
import Home from '../pages/Home'
import SingleFlight from '../pages/SingleFlight'
import SingleFlightHistory from '../pages/SingleFlightHistory'

const Router: React.FC = (): JSX.Element => {
    const location = useLocation()

    return (
        <ChakraProvider>
            <Header currentRoute={location.pathname}/>
            <Routes location={location}>
                <Route path='/' element={<Home/>}/>
                <Route path='/single_flight' element={<SingleFlight/>}/>
                <Route path='/single_flight/history' element={<SingleFlightHistory/>}/>
            </Routes>
        </ChakraProvider>
    )
}

export default Router