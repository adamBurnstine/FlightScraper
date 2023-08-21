import React, { useEffect, useState } from 'react'
import { Flex, Image, Heading, Text, Accordion, AccordionButton, AccordionItem, AccordionPanel, Button, Link, SimpleGrid,  } from '@chakra-ui/react'
import logo from '../images/FlightScraperLogo.svg'
import favorited from '../images/Favorite-Filled.svg'
import unfavorited from '../images/Favorite-Unfilled.svg'
import plus from '../images/minus.svg'
import minus from '../images/minus.svg'

interface RouteType {
    flights: FlightInfoType[],
    path: DestinationType[],
    price: number,
    favorited: boolean,
    id: number,
}

interface DestinationType { //Path is an array of destination type
    location: string, 
    numDays: number,
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

const SavedRoutes: React.FC = (): JSX.Element => {
    const [savedRoutes, setSavedRoutes] = useState<RouteType[]>()

    useEffect(() => {
        fetch("/saved_routes").then(response => response.json()).then(data => {
            const { savedRoutes } = data
            setSavedRoutes(savedRoutes)
        })
    }, [])

    const toggleFavorite = async (id: number) => {
        console.log(id)
        
        setTimeout(async () => (
            await fetch(`/saved_routes/toggle_favorite/${id}`, {
                method:"POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(id)
            }).then(response => response.json()).then(data => {
                console.log(data)
                const { savedRoutes } = data
                setSavedRoutes(savedRoutes)
            }).catch((err) => {
                console.log(err)
            })
        ),200)
    } 

    return (
        <>
        <Flex align='center' justifyContent='center' h='200%' direction='column'>
            <Image src={logo} boxSize='30%' mt='4%'/>
            <Heading textAlign='center' mt='-3%' fontSize={['20px', '30px', '40px', '60px']}>
                Saved Routes
            </Heading>
            <Text mt='1%' fontSize={['20px', '20px', '24px', '32px']} mx='15%' textAlign='center' fontWeight='400' textColor='darkslategray'>
                View all saved Routes
            </Text>
            <Flex direction='row' align='center' justifyContent='center' w='80%' h='2px' bg='#C7C9D9' my='3%'/>
        </Flex>
         <Flex direction='column' mx='10%'>
         <Heading textAlign='left'>Search Results:</Heading>
         {savedRoutes?.length === 0 && (
            <Heading textColor='red' fontWeight='400' textAlign='center' mb='20%' mt='5%'>
                No saved routes. Create searches and save routes,
            </Heading>
         )}
         <Accordion allowToggle w='stretch' style={{margin: '0 auto', marginTop: '40px', marginBottom: '40px',}}>
             {savedRoutes?.map((route, index) => (
                 <AccordionItem w='stretch'>
                     {({ isExpanded }) => (
                         <>
                         <h2>
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
                                     <Text mr='10%'>
                                         {`$${route.price}`}
                                     </Text>      
                                     {route.favorited ? (
                                         <Image src={favorited} h='25px' onClick={(e:any) =>{
                                            toggleFavorite(route.id)}
                                         }/>
                                     ) : (
                                         <Image src={unfavorited} h='25px' onClick={(e:any) => {
                                            toggleFavorite(route.id)}
                                         }/>
                                     )}
                                     {isExpanded ? (
                                         <Image src={minus} ml='11px' h={['20px', '20px', '27px', '27px']} />
                                         ) : (
                                         <Image src={plus} ml='11px' h={['20px', '20px', '27px', '27px']} />
                                     )}
                                 </Flex>
                             </Flex>
                         </AccordionButton>
                         </h2>
                         <AccordionPanel w='100%' color='#3C3C43D9' fontWeight='400' fontSize={['10px', '10px', '12px', '12px']} pb={4}>
                             <Flex direction='row' align='center' justifyContent='center' w='stretch' h='1px' bg='#dee3e3' mb='1%'/>
                             <Flex direction='row' justifyContent='space-between'>
                                 <Heading color='black'>
                                     Destinations:
                                 </Heading>
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
             ))}
         </Accordion>
     </Flex>
     </>
 )}

export default SavedRoutes