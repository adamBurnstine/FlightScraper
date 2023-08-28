import { Form, useFormikContext, Field, ErrorMessage } from 'formik'
import { Flex, Text, Input, FormLabel, Button } from '@chakra-ui/react'
import formModel from './formModel'

const SimpleSearch: React.FC = () => {
    const { start, end, date } = formModel.formField
    const { submitForm } = useFormikContext()
    const today = new Date()
    const minDateString = today.toISOString().split('T')[0]

   const handleSubmit = () => {
    submitForm()
   }

   return (
    <>
      <Form onSubmit={handleSubmit}>
         <Flex direction='column' mx='20%'>
            <Text textAlign='center' fontSize={['30px', '30px', '40px', '40px']} fontWeight='600' mb='5%'>
               Enter some details about your flight
            </Text>
            <Flex direction='row' justifyContent='space-between' gap='1%'>
               <Flex direction='column' w='stretch'>
                  <FormLabel>From:</FormLabel>
                  <Field as={Input} id={start.name} border='1px solid black' borderRadius='8px' padding='8px' name={start.name} placeholder="Enter a city or aiport" type='input'/>
                  <Flex color='red.500' fontSize='xs'>
                     <ErrorMessage name={start.name} />
                  </Flex>
               </Flex>
               <Flex direction='column'  w='stretch'>
                  <FormLabel>To:</FormLabel>
                  <Field border='1px solid black' borderRadius='8px' padding='8px' as={Input} id={end.name} name={end.name} placeholder="Enter a city or airport" type='input'/>
                  <Flex color='red.500' fontSize='xs'>
                     <ErrorMessage name={end.name} />
                  </Flex>
               </Flex>
               <Flex direction='column' w='stretch'>
                  <FormLabel>Date:</FormLabel>
                  <Field as={Input} type='date' border='1px solid black' borderRadius='8px' padding='8px' id={date.name} name={date.name} min={minDateString}/>
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
               width='90px'
               alignSelf='center'
               textColor='white'
               borderRadius='6px'
               fontWeight={600}
               onClick={handleSubmit}
               fontSize='18px'
               mt='3%'>
               Submit
            </Button>
         </Flex>
      </Form>
    </>
   )
}

export default SimpleSearch

