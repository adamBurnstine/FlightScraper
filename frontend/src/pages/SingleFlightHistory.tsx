import React, { useEffect, useState } from 'react'
import { Flex, Heading, Text, Image, SimpleGrid, Button, Link } from '@chakra-ui/react'
import logo from '../images/FlightScraperLogo.svg'

interface SearchInfoType {
    dtSearched: string,
    searchDPT: string,
    searchARR: string,
    searchDate: string, 
    airline: string,
    dptTime: string,
    dptAirport: string,
    arrTime: string,
    arrAirport: string,
    duration: string,
    price: number,
    layover: string,
    flight_URL: string,
}

const SimpleSearchHistory: React.FC = (): JSX.Element => {
    const [numToLoad, setNumToLoad] = useState<number>(5)
    const [ready, setReady] = useState<boolean>(false)
    const [prevSearches] = useState<SearchInfoType[]>([])
    let i: number = 0
    
    useEffect(() => {
        if (i === 0) {
            fetch("/simple_search/history").then(response => response.json()).then(data => {
                data.map((search: SearchInfoType, i: number) => (
                    prevSearches.push(search)
                ))
                setReady(true)
            })
            i++
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) 

    const handleLoadMore = () => {
        setNumToLoad(numToLoad + 5)
    }

    return (
        <Flex direction='column'>
            <Flex align='center' justifyContent='center' h='200%' direction='column'>
                <Image src={logo} boxSize='30%' mt='4%'/>
                <Heading textAlign='center' mt='-3%' fontSize={['20px', '30px', '40px', '60px']}>
                    Single flight search history
                </Heading>
                <Text mt='1%' fontSize={['20px', '20px', '24px', '32px']} mx='15%' textAlign='center' fontWeight='400' textColor='darkslategray'>
                    View past single flight searches that have been made. Only the most recent 50 searches will be available
                </Text>
                <Flex direction='row' align='center' justifyContent='center' w='80%' h='2px' bg='#C7C9D9' my='3%'/>
            </Flex>
            <div/>
            {ready && prevSearches.map((search: SearchInfoType, i: number) => (
                <>
                    {i < numToLoad && (
                        <Flex direction='column' alignItems='center' mx='10%'>
                            <Text textAlign='left' fontSize={['12px', '12px', '16px', '20px']} fontWeight='600' w='stretch'>
                                {`Search on ${search.dtSearched.replace(" GMT", '')}. Flights from ${search.searchDPT} to ${search.searchARR} on ${search.searchDate}`}
                            </Text>
                            <Flex w='100%' style={{border: '1px solid #BEBEBE', borderRadius: '8px', padding: '8px',}} mb='5%' mt='1%' direction='row' justifyContent='space-between'>
                                <SimpleGrid columns={4} spacingY='15%' mb='4%' mt='2%' spacingX='4%' w='100%' ml='2%'>
                                <Flex direction='column'>
                                    <Text fontSize={['12px', '12px', '16px', '20px']} fontWeight='600' textColor='black'>
                                        Departure Time:
                                    </Text>
                                    <Text fontSize={['12px', '12px', '16px', '20px']} fontWeight='500' textColor='gray'>
                                        {search?.dptTime} 
                                    </Text>
                                </Flex>
                                <Flex direction='column'>
                                    <Text fontSize={['12px', '12px', '16px', '20px']} fontWeight='600' textColor='black'>
                                        Departure Airport:
                                    </Text>
                                    <Text fontSize={['12px', '12px', '16px', '20px']} fontWeight='500' textColor='gray'>
                                        {search?.dptAirport}
                                    </Text>
                                </Flex>
                                <Flex direction='column'>
                                    <Text fontSize={['12px', '12px', '16px', '20px']} fontWeight='600' textColor='black'> 
                                        Arrival Time:
                                    </Text>
                                    <Text fontSize={['12px', '12px', '16px', '20px']} fontWeight='500' textColor='gray'>
                                        {search?.arrTime}
                                    </Text>
                                </Flex>
                                <Flex direction='column'>
                                    <Text fontSize={['12px', '12px', '16px', '20px']} fontWeight='600' textColor='black'>
                                        Arrival Airport:
                                    </Text>
                                    <Text fontSize={['12px', '12px', '16px', '20px']} fontWeight='500' textColor='gray'>
                                        {search?.arrAirport}
                                    </Text>
                                </Flex>
                                <Flex direction='column'>
                                    <Text fontSize={['12px', '12px', '16px', '20px']} fontWeight='600' textColor='black'>
                                        Duration:
                                    </Text>
                                    <Text fontSize={['12px', '12px', '16px', '20px']} fontWeight='500' textColor='gray'>
                                        {search?.duration}
                                    </Text>
                                </Flex>
                                <Flex direction='column'>
                                    <Text fontSize={['12px', '12px', '16px', '20px']} fontWeight='600' textColor='black'>
                                        Layover(s):
                                    </Text>
                                    <Text fontSize={['12px', '12px', '16px', '20px']} fontWeight='500' textColor='gray'>
                                        {search?.layover}
                                    </Text>
                                </Flex>
                                <Flex direction='column'>
                                    <Text fontSize={['12px', '12px', '16px', '20px']} fontWeight='600' textColor='black'>
                                        Airline:
                                    </Text>
                                    <Text fontSize={['12px', '12px', '16px', '20px']} fontWeight='500' textColor='gray'>
                                        {search?.airline}
                                    </Text>
                                </Flex>
                                <Flex direction='column'>
                                    <Text fontSize={['12px', '12px', '16px', '20px']} fontWeight='600' textColor='black'>
                                        Price:
                                    </Text>
                                    <Text fontSize={['12px', '12px', '16px', '20px']} fontWeight='500' textColor='gray'>
                                        {`$${search?.price}`}
                                    </Text>
                                </Flex>
                                </SimpleGrid>
                                <Flex direction='column' justifyContent='center' mr='2%'>
                                <Link isExternal href={search?.flight_URL}>
                                    <Button
                                    _hover={{ backgroundColor: '#4746CE' }}
                                    _active={{ backgroundColor: '#3635AA' }}
                                    backgroundColor='rgba(78, 103, 235, 1)'
                                    color='rgba(255, 255, 255, 1)'
                                    width='50px'
                                    alignSelf='center'
                                    textColor='white'
                                    w='150px'
                                    h='50px'
                                    fontWeight={600}
                                    mr='2%'
                                    fontSize='20px'>
                                    More details
                                    </Button>
                                </Link>
                                </Flex>
                            </Flex>
                        </Flex>
                    )}
                </>
            ))}
            <Button
                _hover={{ backgroundColor: '#4746CE' }}
                _active={{ backgroundColor: '#3635AA' }}
                backgroundColor='rgba(78, 103, 235, 1)'
                borderRadius='30px'
                color='#c5e8fa'
                isDisabled={numToLoad >= prevSearches.length}
                width='50px'
                alignSelf='center'
                textColor='white'
                w='200px'
                h='60px'
                mb={'5%'}
                fontWeight={600}
                fontSize='30px'
                onClick={handleLoadMore}>
                Load More
            </Button>
        </Flex>
    )
}

export default SimpleSearchHistory
