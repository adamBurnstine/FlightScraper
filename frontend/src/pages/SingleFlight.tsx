import React, { useState } from 'react'
import { Flex, Heading, Text, Image } from '@chakra-ui/react'
import logo from '../images/FlightScraperLogo.svg'
import MainForm from '../components/Forms/SingleFlight/SingleFlight'
import initialValues from '../components/Forms/SingleFlight/intialValues'
import { Formik } from 'formik'
import validationSchema from '../components/Forms/SingleFlight/validationSchema'


interface InputType {
    start: string,
    end: string,
    date: string,
}


const SimpleSearch: React.FC = (): JSX.Element => {
   const [input, setInput] = useState<InputType>()

    return (
        <Flex direction='column' mb='30%'>
          <Flex align='center' justifyContent='center' h='200%' direction='column'>
            <Image src={logo} boxSize='30%' mt='4%'/>
            <Heading textAlign='center' mt='-3%' fontSize={['20px', '30px', '40px', '60px']}>
              Single flight search
            </Heading>
            <Flex direction='row' align='center' justifyContent='center' w='80%' h='2px' bg='#C7C9D9' my='3%'/>
          </Flex>
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={(values, { setSubmitting, resetForm }) => {
            setTimeout(async () => {
              console.log(values)
              const response = await fetch("/simple_search", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(values)
              }).then(response => response.json()
              ).then(data => {
                setInput(data) //Hear is where I can change variables based on the data
                console.log(data)
              })
              resetForm()
              setSubmitting(false)
            }, 1000)
          }}>
            <MainForm/>
          </Formik>
          {input ? (
            <>
              <Flex direction='row' align='center' mx='10%' justifyContent='center' w='80%' h='2px' bg='#C7C9D9' my='3%' />
              <Text textAlign='center' fontSize={['30px', '30px', '40px', '40px']} fontWeight='600' mb='5%'>
                {`Searching flights from ${input.start.toUpperCase()} to ${input.end.toUpperCase()} on ${input.date}`}
              </Text>
            </>
          ) : (
            <>
              <Flex direction='row' align='center' mx='10%' justifyContent='center' w='80%' h='2px' bg='#C7C9D9' my='3%' />
              <Text textAlign='center' fontSize={['30px', '30px', '40px', '40px']} fontWeight='600' mb='5%'>
                No search requested yet
              </Text>
            </>
          )}
        </Flex>
    )
}

export default SimpleSearch
