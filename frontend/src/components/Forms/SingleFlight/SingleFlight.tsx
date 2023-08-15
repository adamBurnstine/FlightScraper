import React, { useEffect, useState } from 'react'
import { Form, useFormikContext, Field, ErrorMessage } from 'formik'
import { Flex, Text, Input, FormLabel, Button } from '@chakra-ui/react'
import formModel from './formModel'

const SimpleSearch: React.FC = () => {
    const { start, end, date } = formModel.formField

    const today = new Date()
    const minDateString = today.toISOString().split('T')[0]

    const { submitForm } = useFormikContext()

    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
   
   useEffect(() => {
      const handleResize = () => {
         setWindowWidth(window.innerWidth)
      }

      window.addEventListener('resize', handleResize)

      return () => {
         window.removeEventListener('resize', handleResize)
      }
   }, [])

   const handleSubmit = () => {
    submitForm()
   }


   return (
    <>
      <Form onSubmit={handleSubmit}>
         <Flex direction='column' mx='20%'>
            <Text textAlign='center' fontSize={['30px', '30px', '40px', '40px']} fontWeight='600' mb='5%'>
               Enter some details about the flight
            </Text>
            <Flex direction={windowWidth > 850 ? 'row' : 'column'} justifyContent='space-between' gap={windowWidth > 850 ? '1%' : '10%'}>
               <Flex direction='column' w='stretch'>
                  <FormLabel>From: (airport code) </FormLabel>
                  <Field as={Input} id={start.name} style={{border: '1px solid black', borderRadius: '8px', padding: '8px',}} name={start.name} placeholder={"Country, City, or Airport"} type='input'/>
                  <Flex color='red.500' fontSize='xs'>
                     <ErrorMessage name={start.name} />
                  </Flex>
               </Flex>
               <Flex direction='column'  w='stretch'>
                  <FormLabel>To: (Country,)</FormLabel>
                  <Field style={{border: '1px solid black', borderRadius: '8px', padding: '8px',}} as={Input} id={end.name} name={end.name} placeholder={"Country, City or Airport"} type='input'/>
                  <Flex color='red.500' fontSize='xs'>
                     <ErrorMessage name={end.name} />
                  </Flex>
               </Flex>
               <Flex direction='column' w='stretch'>
                  <FormLabel>Date:</FormLabel>
                  <Field as={Input} type='date' style={{border: '1px solid black', borderRadius: '8px', padding: '8px',}} id={date.name} name={date.name} min={minDateString}/>
                  <Flex color='red.500' fontSize='xs'>
                     <ErrorMessage name={date.name} />
                  </Flex>
               </Flex>
            </Flex>
            <Button
               _hover={{ backgroundColor: '#4746CE' }}
               _active={{ backgroundColor: '#3635AA' }}
               backgroundColor='rgba(78, 103, 235, 1)'
               color='rgba(255, 255, 255, 1)'
               width='50px'
               alignSelf='center'
               textColor='white'
               w={windowWidth > 550 ? '70px' : '60px'}
               fontWeight={600}
               onClick={handleSubmit}
               fontSize='16px'
               mt='3%'>
               Submit
            </Button>
         </Flex>
      </Form>
    </>
   )
}

export default SimpleSearch

