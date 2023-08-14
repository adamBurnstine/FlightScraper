import { Flex, Image, Link as ChakraLink } from '@chakra-ui/react'
import React from 'react'
import logo from '../images/FlightScraperLogo.svg'
import { useLocation, useNavigate, NavLink } from 'react-router-dom'

interface IProps {
    currentRoute: string
}

const Header: React.FC<IProps> = ({ currentRoute }): JSX.Element | null => {
    const location = useLocation()
    const navigate = useNavigate()
    
    const navBarRoutes = [
        {
            title: 'Home',
            path: '/',
        },
        {
            title: 'Single Flight Search',
            path: '/single_flight',
        },
        {
            title: 'Single Flight Search History',
            path: '/single_flight/history'
        },
        {
            title: 'Cheapest Route Search',
            path: '/cheapest_route',
        }
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
        <Flex
         position='fixed'
         boxShadow='0px 4px 9px rgba(0, 0, 0, 0.1)'
         align='center'
         h={['40px', '40px', '52px', '70px']}
         paddingX={['16px', '16px', '24px', '24px']}
         w='100%'
         backdropFilter='blur(15px)'
         bg='rgba(255, 255, 255, .75)'
         zIndex='9299'>
            <Flex>
                <Image src={logo} alt='logo' onClick={handleLogoClick} cursor='pointer' h={['22px', '22px', '35px', '50px']} />
            </Flex>
            <Flex alignItems='center'>
                {navBarRoutes.map((el) => (
                    <ChakraLink key={el.title} as={NavLink} to={el.path} fontSize={['16px', '16px', '16px', '20px']} textColor='black' marginLeft={['16px', '16px', '16px', '32px']} onClick={handleLinkClick}>
                     {el.title}
                  </ChakraLink>
                ))}
            </Flex>
        </Flex>
    )
}

export default Header