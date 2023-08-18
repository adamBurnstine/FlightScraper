import React, { useState } from 'react'
import { Flex, Image, Heading, Text, Button, Spinner, Accordion, AccordionItem, AccordionPanel, AccordionButton, Link, SimpleGrid } from '@chakra-ui/react'
import logo from '../images/FlightScraperLogo.svg'
import initialValuesCR from '../components/Forms/CheapestRoute/initialValuesCR'
import validationSchemaCR from '../components/Forms/CheapestRoute/validationSchemaCR'
import { Formik, useFormikContext } from 'formik'
import CRForm from '../components/Forms/CheapestRoute/CRForm'
import minus from '../images/minus.svg'
import plus from '../images/plus.svg'
import { Search } from 'react-router-dom'


interface RouteType {
    flights: FlightInfoType[],
    path: DestinationType[],
    price: number,
}

interface FlightInfoType { //Flights is an array of flight info type
    dptTime: string,
    arrTime: string,
    airline: string,
    duration: string,
    dptAirport: string,
    date: Date,
    arrAirport: string,
    layover: string,
    price: number,
    flightURL: string,
}

interface MetricsType {
    avgPrice: number,
    numFlights: number,
    numRoutes: number,
}

interface DestinationType { //Path is an array of destination type
    location: string, 
    numDays: number,
}

const CheapestRoute: React.FC = (): JSX.Element => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [showForm, setShowForm] = useState<boolean>(true)
    const [error, setError] = useState<boolean>(false)
    const [topRoutes, setTopRoutes] = useState<RouteType[] | null>()
    const [searchMetrics, setSearchMetrics] = useState<MetricsType>()

    // const { values } = useFormikContext()
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
            <Formik initialValues={initialValuesCR} validationSchema={validationSchemaCR} onSubmit={(values, { setSubmitting, resetForm }) => {
                setTimeout(async () => {
                    setShowForm(false)
                    setIsLoading(true)
                    //resetForm()              
                    console.log(values)
                    // fetch here
                    await fetch("/cheapest_route", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(values)
                    }).then(response=> response.json()).then(data => {
                        console.log(data)
                        const { avgPrice, numFlights, numRoutes, topRoutes } = data
                        // console.log("average price:" + avgPrice)
                        // console.log("Num flights: " + numFlights)
                        // console.log("Num routes: " + numRoutes) 
                        setTopRoutes(topRoutes)
                        const metrics: MetricsType = { avgPrice, numFlights, numRoutes }
                        setSearchMetrics(metrics)
                        setError(false)
                    }).catch(err => {
                        console.log(err)
                        setError(true)
                    })
                    setIsLoading(false)
                    setSubmitting(false)
                }, 100)
                }}>
                
                
                
                {showForm && (
                    <CRForm/>
                )}
            </Formik>
            {error && !showForm && !isLoading && (
                <Flex direction='column' mb='2%'>
                    <Text textAlign='center' fontSize={['20px', '20px', '24px', '32px']} fontWeight='400' textColor='red'>
                        An error occurred. Try modifying search or try again later
                    </Text>
                </Flex>
            )}

            {searchMetrics && (
                <Flex direction='column'>
                    <Text textAlign='center' mb='4%' fontSize={['16px', '16px', '16px', '20px']}>
                        {`Searched ${searchMetrics.numFlights} flights, and calculated ${searchMetrics.numRoutes} routes. On average, a cheap flight given the search would cost around $${Math.round(searchMetrics.avgPrice * 100) / 100}.`}
                    </Text>
                </Flex>
            )}

            {topRoutes && (
                <Flex direction='column' mx='10%'>
                    <Heading textAlign='left'>Search Results:</Heading>
                    <Accordion allowToggle w='stretch' style={{margin: '0 auto', marginTop: '40px', marginBottom: '40px',}}>
                        {topRoutes.map((route, index) => (
                            <>
                                <AccordionItem w='stretch'>
                                    {({ isExpanded }) => (
                                        <>
                                            <AccordionButton w='stretch'>
                                                <Flex direction='row' w='stretch' justifyContent='space-between'>
                                                    <Flex w='stretch' color='#1E1E1E' textAlign='left' fontWeight={['700', '700', '600', '600']} my='10px' fontSize={['16px', '16px', '20px', '20px']}>
                                                        <Text as='span' mr='1%' textAlign='right'>
                                                            {index+1 + '.'}
                                                        </Text>
                                                        {route.path.map((destination, i) => (
                                                            <>
                                                                <Text as='span'>
                                                                    {i === 0 && destination.location + ' -> '}
                                                                </Text>
                                                                <Text as='span' mr='1%'>
                                                                    {i !== 0 && destination.location + ' -> '}
                                                                </Text>
                                                            </>
                                                        ))}
                                                        <Text as='span'>
                                                            {route.path[0].location}
                                                        </Text>
                                                    </Flex>
                                                    <Flex color='#1E1E1E' textAlign='right' justifyContent='right' fontWeight={['700', '700', '600', '600']} my='10px' w='15%' fontSize={['16px', '16px', '20px', '20px']}>
                                                        <Text>
                                                            {`$${route.price}`}
                                                        </Text>      
                                                        {isExpanded ? (
                                                            <Image src={minus} ml='11px' h={['20px', '20px', '27px', '27px']} />
                                                            ) : (
                                                            <Image src={plus} ml='11px' h={['20px', '20px', '27px', '27px']} />
                                                        )}
                                                    </Flex>
                                                </Flex>
                                            </AccordionButton>
                                        <AccordionPanel w='100%' color='#3C3C43D9' fontWeight='400' fontSize={['10px', '10px', '12px', '12px']} pb={4}>
                                            <Flex direction='row' align='center' justifyContent='center' w='stretch' h='1px' bg='#dee3e3' mb='1%'/>
                                            <Flex direction='row' justifyContent='space-between'>
                                                <Heading color='black'>
                                                    Destinations:
                                                </Heading>
                                                <Text color='limegreen' fontSize='24px' fontWeight='600'>
                                                    {searchMetrics && `Saves: $${Math.round((searchMetrics.avgPrice - route.price))}`}
                                                </Text>
                                            </Flex>
                                            {route.path.map((destination, i) => (
                                                <Text fontSize='20px'>
                                                    {`${i + 1}. ${destination.location} (${destination.numDays} days)`}
                                                </Text>
                                            ))}
                                            <Heading color='black'>
                                                Flights:
                                            </Heading>
                                            {route.flights.map((flight, i) => (
                                                <>
                                                <Text color='black' fontSize='20px' mt='2%' mb='5px'>
                                                   {` Date: ${flight.date.toString().slice(0, -12)}`}
                                                </Text>
                                                <Flex w='100%' style={{ border: '2px solid #BEBEBE', borderRadius: '20px', padding: '8px', }} mt='%' direction='row' justifyContent='space-between'>
                                                        <SimpleGrid columns={4} spacingY='15%' mb='4%' mt='2%' spacingX='4%' w='100%' ml='2%'>
                                                            <Flex direction='column'>
                                                                <Text fontSize={['12px', '12px', '16px', '20px']} fontWeight='600' textColor='black'>
                                                                    Departure Time:
                                                                </Text>
                                                                <Text fontSize={['12px', '12px', '16px', '20px']} fontWeight='500' textColor='gray'>
                                                                    {flight?.dptTime}
                                                                </Text>
                                                            </Flex>
                                                            <Flex direction='column'>
                                                                <Text fontSize={['12px', '12px', '16px', '20px']} fontWeight='600' textColor='black'>
                                                                    Departure Airport:
                                                                </Text>
                                                                <Text fontSize={['12px', '12px', '16px', '20px']} fontWeight='500' textColor='gray'>
                                                                    {flight?.dptAirport}
                                                                </Text>
                                                            </Flex>
                                                            <Flex direction='column'>
                                                                <Text fontSize={['12px', '12px', '16px', '20px']} fontWeight='600' textColor='black'>
                                                                    Arrival Time:
                                                                </Text>
                                                                <Text fontSize={['12px', '12px', '16px', '20px']} fontWeight='500' textColor='gray'>
                                                                    {flight?.arrTime}
                                                                </Text>
                                                            </Flex>
                                                            <Flex direction='column'>
                                                                <Text fontSize={['12px', '12px', '16px', '20px']} fontWeight='600' textColor='black'>
                                                                    Arrival Airport:
                                                                </Text>
                                                                <Text fontSize={['12px', '12px', '16px', '20px']} fontWeight='500' textColor='gray'>
                                                                    {flight?.arrAirport}
                                                                </Text>
                                                            </Flex>
                                                            <Flex direction='column'>
                                                                <Text fontSize={['12px', '12px', '16px', '20px']} fontWeight='600' textColor='black'>
                                                                    Duration:
                                                                </Text>
                                                                <Text fontSize={['12px', '12px', '16px', '20px']} fontWeight='500' textColor='gray'>
                                                                    {flight?.duration}
                                                                </Text>
                                                            </Flex>
                                                            <Flex direction='column'>
                                                                <Text fontSize={['12px', '12px', '16px', '20px']} fontWeight='600' textColor='black'>
                                                                    Layover(s):
                                                                </Text>
                                                                <Text fontSize={['12px', '12px', '16px', '20px']} fontWeight='500' textColor='gray'>
                                                                    {flight?.layover}
                                                                </Text>
                                                            </Flex>
                                                            <Flex direction='column'>
                                                                <Text fontSize={['12px', '12px', '16px', '20px']} fontWeight='600' textColor='black'>
                                                                    Airline:
                                                                </Text>
                                                                <Text fontSize={['12px', '12px', '16px', '20px']} fontWeight='500' textColor='gray'>
                                                                    {flight?.airline}
                                                                </Text>
                                                            </Flex>
                                                            <Flex direction='column'>
                                                                <Text fontSize={['12px', '12px', '16px', '20px']} fontWeight='600' textColor='black'>
                                                                    Price:
                                                                </Text>
                                                                <Text fontSize={['12px', '12px', '16px', '20px']} fontWeight='500' textColor='gray'>
                                                                    {`$${flight?.price}`}
                                                                </Text>
                                                            </Flex>
                                                        </SimpleGrid>
                                                        <Flex direction='column' justifyContent='center' mr='2%'>
                                                            <Link isExternal href={flight.flightURL}>
                                                                <Button
                                                                    _hover={{ backgroundColor: '#4746CE' }}
                                                                    _active={{ backgroundColor: '#3635AA' }}
                                                                    backgroundColor='rgba(78, 103, 235, 1)'
                                                                    color='rgba(255, 255, 255, 1)'
                                                                    width='50px'
                                                                    alignSelf='center'
                                                                    textColor='white'
                                                                    borderRadius='10px'
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
                                                </>
                                            ))}
                                        </AccordionPanel>
                                        </>
                                    )}
                                </AccordionItem>
                            </>
                        ))}
                    </Accordion>
                </Flex>
            )}


            {!showForm && !isLoading && (
                <Button
                _hover={{ backgroundColor: 'limegreen' }}
                _active={{ backgroundColor: 'green' }}
                backgroundColor='limegreen'
                color='rgba(255, 255, 255, 1)'
                width='180px'
                borderRadius='35px'
                alignSelf='center'
                textColor='white'
                fontWeight={600}
                onClick={() => setShowForm(true)}
                fontSize='16px'>
                    New Search
                </Button>
            )}

            {isLoading && (
                <Flex direction='column' alignItems='center'>
                    <Spinner size='xl' emptyColor='gray.200' mt='2%'/>
                    <Text textAlign='center' mt='2%' fontSize={['16px', '20px', '24px', '24px']}>
                        This may take a couple moments
                    </Text>
                </Flex>
            )}
        </Flex>
    )
}

export default CheapestRoute