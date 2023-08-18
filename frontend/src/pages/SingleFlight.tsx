import React, { useState } from 'react'
import { Flex, Heading, Text, Image, Spinner, ScaleFade, SimpleGrid, Button, Link } from '@chakra-ui/react'
import logo from '../images/FlightScraperLogo.svg'
import MainForm from '../components/Forms/SingleFlight/SingleFlight'
import initialValues from '../components/Forms/SingleFlight/intialValues'
import { Formik } from 'formik'
import validationSchema from '../components/Forms/SingleFlight/validationSchema'

interface InputType {
    start: string,
    end: string,
    date: Date,
}

interface FlightInfoType {
  dptTime: string,
  arrTime: string,
  airline: string,
  duration: string,
  dptAirport: string,
  arrAirport: string,
  layover: string,
  price: number,
  flight_URL: string,
}

const SimpleSearch: React.FC = (): JSX.Element => {
    
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [displayFlight, setDisplayFlight] = useState<boolean>(false)
  const [flightInfo, setFlightInfo] = useState<FlightInfoType>()
  const [input, setInput] = useState<InputType>()
  const [error, setError] = useState<boolean>()

  return (
    <Flex direction='column' mb='30%'>
      <Flex align='center' justifyContent='center' h='200%' direction='column'>
        <Image src={logo} boxSize='30%' mt='4%'/>
        <Heading textAlign='center' mt='-3%' fontSize={['20px', '30px', '40px', '60px']}>
          Single flight search
        </Heading>
        <Text mt='1%' fontSize={['20px', '20px', '24px', '32px']} mx='15%' textAlign='center' fontWeight='400' textColor='darkslategray'>
          Enter a start and end destination and the date you wish to travel. This application will then scrape google flights and return the best option for you with a link to get more details or purchase the flight.
        </Text>
        <Flex direction='row' align='center' justifyContent='center' w='80%' h='2px' bg='#C7C9D9' my='3%'/>
      </Flex>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={(values, { setSubmitting, resetForm }) => {
        setTimeout(async () => {
          setIsLoading(true)
          setDisplayFlight(false)
          resetForm()
          const searchInfo = {start: values.start, end: values.end, date: new Date(values.date)}
          setInput(searchInfo)
          
          await fetch("/simple_search", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(values)
          }).then(response => response.json()).then(data => {
            const flight = {airline: data.airline, arrAirport: data.arrAirport, arrTime: data.arrTime, 
                               dptAirport: data.dptAirport, dptTime: data.dptTime, duration: data.duration, 
                               price: data.price, layover: data.layover, flight_URL: data.flight_URL}
            setFlightInfo(flight)
            setDisplayFlight(true)
            setError(false)
            console.log(flightInfo)
          }).catch(err => {
            setDisplayFlight(false)
            setError(true)
          })
          setIsLoading(false)
          setSubmitting(false)
        }, 500)
      }}>
        <>
          <MainForm/>
          {isLoading ? (
            <Flex direction='column' alignItems='center'>
              <Flex direction='row' mx='10%' w='80%' h='2px' bg='#C7C9D9' my='3%'/>
              <Spinner size='xl' emptyColor='gray.200'/>
              <Text textAlign='center' mt='2%' fontSize={['16px', '20px', '24px', '24px']}>
                This may take a couple moments
              </Text>
            </Flex>
          ) : (
            <>
              {error ? (
                <>
                  <Flex direction='row' mx='10%' w='90%' h='2px' bg='#C7C9D9' mt='3%'/>
                  <Text textAlign='center' mt='2%' fontSize={['16px', '20px', '24px', '24px']} color='red'>
                    An error occurred: Modify the search or try again later.
                  </Text>
                </>
                ) : (
                  <ScaleFade initialScale={.8} in={displayFlight} unmountOnExit>
                    <Flex direction='row' mx='10%' w='90%' h='2px' bg='#C7C9D9' my='3%'/>
                    <Flex direction='column' alignItems='center' mx='15%'>
                      <Text textAlign='left' fontSize={['16px', '16px', '24px', '32px']} fontWeight='600'>
                        {input ? (`Search from ${input.start} to ${input.end} on ${input.date.toLocaleDateString()}`) : (`No search yet`)}
                      </Text>
                      <Flex w='100%' style={{border: '2px solid #BEBEBE', borderRadius: '50px', padding: '8px',}} mt='3%'  direction='row' justifyContent='space-between'>
                        <SimpleGrid columns={4} spacingY='15%' mb='4%' mt='2%' spacingX='4%' w='100%' ml='2%'>
                          <Flex direction='column'>
                            <Text fontSize={['12px', '12px', '16px', '20px']} fontWeight='600' textColor='black'>
                              Departure Time:
                            </Text>
                            <Text fontSize={['12px', '12px', '16px', '20px']} fontWeight='500' textColor='gray'>
                              {flightInfo?.dptTime}
                            </Text>
                          </Flex>
                          <Flex direction='column'>
                            <Text fontSize={['12px', '12px', '16px', '20px']} fontWeight='600' textColor='black'>
                              Departure Airport:
                            </Text>
                            <Text fontSize={['12px', '12px', '16px', '20px']} fontWeight='500' textColor='gray'>
                              {flightInfo?.dptAirport}
                            </Text>
                          </Flex>
                          <Flex direction='column'>
                            <Text fontSize={['12px', '12px', '16px', '20px']} fontWeight='600' textColor='black'>
                              Arrival Time:
                            </Text>
                            <Text fontSize={['12px', '12px', '16px', '20px']} fontWeight='500' textColor='gray'>
                              {flightInfo?.arrTime}
                            </Text>
                          </Flex>
                          <Flex direction='column'>
                            <Text fontSize={['12px', '12px', '16px', '20px']} fontWeight='600' textColor='black'>
                              Arrival Airport:
                            </Text>
                            <Text fontSize={['12px', '12px', '16px', '20px']} fontWeight='500' textColor='gray'>
                              {flightInfo?.arrAirport}
                            </Text>
                          </Flex>
                          <Flex direction='column'>
                            <Text fontSize={['12px', '12px', '16px', '20px']} fontWeight='600' textColor='black'>
                              Duration:
                            </Text>
                            <Text fontSize={['12px', '12px', '16px', '20px']} fontWeight='500' textColor='gray'>
                              {flightInfo?.duration}
                            </Text>
                          </Flex>
                          <Flex direction='column'>
                            <Text fontSize={['12px', '12px', '16px', '20px']} fontWeight='600' textColor='black'>
                              Layover(s):
                            </Text>
                            <Text fontSize={['12px', '12px', '16px', '20px']} fontWeight='500' textColor='gray'>
                              {flightInfo?.layover}
                            </Text>
                          </Flex>
                          <Flex direction='column'>
                            <Text fontSize={['12px', '12px', '16px', '20px']} fontWeight='600' textColor='black'>
                              Airline:
                            </Text>
                            <Text fontSize={['12px', '12px', '16px', '20px']} fontWeight='500' textColor='gray'>
                              {flightInfo?.airline}
                            </Text>
                          </Flex>
                          <Flex direction='column'>
                            <Text fontSize={['12px', '12px', '16px', '20px']} fontWeight='600' textColor='black'>
                              Price:
                            </Text>
                            <Text fontSize={['12px', '12px', '16px', '20px']} fontWeight='500' textColor='gray'>
                              {`$${flightInfo?.price}`}
                            </Text>
                          </Flex>
                        </SimpleGrid>
                        <Flex direction='column' justifyContent='center' mr='2%'>
                          <Link isExternal href={flightInfo?.flight_URL}>
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
                    </Flex>
                  </ScaleFade>
              )}
            </>
          )}
        </>
      </Formik>
    </Flex>
  )
}

export default SimpleSearch
