import React from 'react'
import { Flex, Image, Heading, Text } from '@chakra-ui/react'
import logo from '../images/FlightScraperLogo.svg'

const CheapestRoute: React.FC = (): JSX.Element => {

    return (
        <Flex direction='column' mb='30%'>
            <Flex align='center' justifyContent='center' h='200%' direction='column'>
                <Image src={logo} boxSize='30%' mt='4%'/>
                <Heading textAlign='center' mt='-3%' fontSize={['20px', '30px', '40px', '60px']}>
                    Cheapest Route Search
                </Heading>
                <Text mt='1%' fontSize={['20px', '20px', '24px', '32px']} mx='15%' textAlign='center' fontWeight='400' textColor='darkslategray'>
                    Enter the start and end date of the trip, and the minimum length of time you want to spend at each destination. The cheapest routes will then be displayed and links for more information or to purchase the will appear.
                </Text>
                <Flex direction='row' align='center' justifyContent='center' w='80%' h='2px' bg='#C7C9D9' my='3%'/>
            </Flex>
        </Flex>
    )
}

export default CheapestRoute