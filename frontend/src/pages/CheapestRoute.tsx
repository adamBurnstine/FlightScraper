import React, { useState } from 'react'
import { Flex, Image, Heading, Text, Button, Spinner } from '@chakra-ui/react'
import logo from '../images/FlightScraperLogo.svg'
import initialValuesCR from '../components/Forms/CheapestRoute/initialValuesCR'
import validationSchemaCR from '../components/Forms/CheapestRoute/validationSchemaCR'
import { Formik, useFormikContext } from 'formik'
import CRForm from '../components/Forms/CheapestRoute/CRForm'

const CheapestRoute: React.FC = (): JSX.Element => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [showForm, setShowForm] = useState<boolean>(true)
    const [error, setError] = useState<boolean>(false)
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
                    //const searchInfo = {startLoc: values.startLoc, startDate: values.startDate, endDate: values.endDate, destinations: values.destinations}
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
                        setError(false)
                    }).catch(err => {
                        setError(true)
                    })
                    setIsLoading(false)
                    setSubmitting(false)
                }, 500)
                }}>
                
                
                
                {showForm && (
                    <>
                        <CRForm/>
                    </>
                )}
            </Formik>
            {error && !showForm && !isLoading && (
                <>
                    <Flex direction='column' mb='2%'>
                        <Text textAlign='center' fontSize={['20px', '20px', '24px', '32px']} fontWeight='400' textColor='red'>
                            An error occurred. Try modifying search or try again later
                        </Text>
                    </Flex>
                </>
            )}

            {!showForm && !isLoading && (
                <>
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
                </>
            )}

            {isLoading && (
                <>
                    <Flex direction='column' alignItems='center'>
                        <Flex direction='row' mx='10%' w='80%' h='2px' bg='#C7C9D9' my='3%'/>
                        <Spinner size='xl' emptyColor='gray.200'/>
                        <Text textAlign='center' mt='2%' fontSize={['16px', '20px', '24px', '24px']}>
                            This may take a couple moments
                        </Text>
                    </Flex>
                </>
            )}
            
        </Flex>

        


    )
}

export default CheapestRoute