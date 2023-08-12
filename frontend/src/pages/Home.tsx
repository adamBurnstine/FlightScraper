import React from 'react' 
import { Flex, Heading, Image, Text } from '@chakra-ui/react'
import logo from '../images/FlightScraperLogo.svg'

const Home: React.FC = (): JSX.Element => {
    return (
        <Flex align='center' justifyContent='center' h='200%' direction='column'>
        <Image src={logo} boxSize='50%' mt='4%'/>
        <Heading textAlign='center' mt='-3%' fontSize={['20px', '30px', '40px', '60px']}>
          Cheap Flight Finder
        </Heading>
        <Text textAlign='center' mb='2%' fontSize={['16px', '20px', '24px', '30px']}>
          Thanks for checking out my project!
        </Text>
        <Flex direction='row' align='center' justifyContent='center' w='80%' h='2px' bg='#C7C9D9' my='3%'/>
      </Flex>
    )
}

export default Home