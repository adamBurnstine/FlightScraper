import React from 'react' 
import { Flex, Heading, Image, Text } from '@chakra-ui/react'
import logo from '../images/FlightScraperLogo.svg'

const Home: React.FC = (): JSX.Element => {
    return (
        <Flex align='center' justifyContent='center' h='200%' direction='column'>
        <Image src={logo} boxSize='40%' mt='4%'/>
        <Heading textAlign='center' mt='-3%' fontSize={['20px', '30px', '40px', '65px']}>
          FlightScraper
        </Heading>
        <Text textAlign='center' mb='2%' px='20%' fontSize={['16px', '20px', '24px', '35px']}>
          The web app designed to help travelers with flexible itineraries save money
        </Text>
        <Flex direction='row' align='center' justifyContent='center' w='80%' h='2px' bg='#C7C9D9' my='3%'/>
      </Flex>
    )
}

export default Home