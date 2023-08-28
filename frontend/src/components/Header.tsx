import { Flex, Image, Link as ChakraLink } from '@chakra-ui/react'
import React from 'react'
import logo from '../images/FlightScraperLogo.svg'
import { useLocation, useNavigate, NavLink } from 'react-router-dom'

const Header: React.FC = (): JSX.Element | null => {
    const location = useLocation()
    const navigate = useNavigate()
    
    const navBarRoutes = [
        {title: 'Home', path: '/'},
        {title: 'Cheapest Route Search', path: '/cheapest_route'},
        {title: 'Saved Routes', path: '/saved_routes'},
        {title: 'Single Flight Search', path: '/single_flight'},
        {title: 'Single Flight Search History', path: '/single_flight/history'}
    ]

    const handleLogoClick= () => {
        if (location.pathname === '/') {
            window.scrollTo(0, 0)
        } else {
            navigate('/')
        }
    }

    const handleLinkClick = () => {
        const { pathname } = location
        if (window.location.pathname === pathname && window.scrollY > 0) {
            window.scrollTo({
                top: 0, 
                behavior: 'smooth',
            })
        }
    }

    return (
        <Flex position='fixed' boxShadow='0px 4px 9px rgba(0, 0, 0, 0.1)' align='center' h='8%' paddingX='2%' w='100%' bg='white'>
            <Flex>
                <Image src={logo} alt='logo' onClick={handleLogoClick} cursor='pointer' h='50px' />
            </Flex>
            <Flex alignItems='center'>
                {navBarRoutes.map((el) => (
                    <ChakraLink key={el.title} as={NavLink} to={el.path} fontSize={['12px', '12px', '16px', '19px']} textColor='black' marginLeft={['16px', '16px', '16px', '32px']} onClick={handleLinkClick}>
                     {el.title}
                  </ChakraLink>
                ))}
            </Flex>
        </Flex>
    )
}

export default Header