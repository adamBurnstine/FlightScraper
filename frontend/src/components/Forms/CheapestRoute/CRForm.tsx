import React, { useEffect, useState } from 'react'
import { Form, useFormikContext, Field, FieldArray, ErrorMessage, ArrayHelpers } from 'formik'
import { Flex, Text, Input, FormLabel,  Button, Image } from '@chakra-ui/react'
import formModelCR from './formModelCR'
import DeleteIcon from '../../../images/DeleteIcon.svg'

const CRForm: React.FC = () => {
    const { startDate, endDate, startLoc } = formModelCR.formField
    const today = new Date()
    const minDateString = today.toISOString().split('T')[0]

    const { values } = useFormikContext<any>()
    const { destinations } = values
    
    const { submitForm } = useFormikContext()
    const handleSubmit = () => {
        submitForm()
    }
    

    return (
        <>
            <Form onSubmit={handleSubmit}>
                <Flex direction='column' mx='20%'>
                    <Text textAlign='center' fontSize={['30px', '30px', '40px', '40px']} fontWeight='600' mb='5%'>
                        Enter some details about the trip.
                    </Text>
                    <Flex direction='row' justifyContent='space-betwen' gap='1%' mb='3%'>
                        <Flex direction='column' w='stretch'>
                            <FormLabel>Starting Location:</FormLabel>
                            <Field as={Input} type='input' id={startLoc.name} name={startLoc.name}/>
                            <Flex color='red.500' fontSize='xs'>
                                <ErrorMessage name={startLoc.name} />
                            </Flex>
                        </Flex>
                        <Flex direction='column' w='30%'>
                            <FormLabel>Trip Start Date:</FormLabel>
                            <Field as={Input} type='date' id={startDate.name} name={startDate.name} min={minDateString}/>
                            <Flex color='red.500' fontSize='xs'>
                                <ErrorMessage name={startDate.name} />
                            </Flex>
                        </Flex>
                        <Flex direction='column' w='30%'>
                            <FormLabel>Trip End Date:</FormLabel>
                            <Field as={Input} type='date' id={endDate.name} name={endDate.name} min={minDateString}/>
                            <Flex color='red.500' fontSize='xs'>
                                <ErrorMessage name={endDate.name} />
                            </Flex>
                        </Flex>
                    </Flex>
                    <Text fontSize={['16px', '16px', '20px', '36px']} fontWeight='600'>
                        Destinations:
                    </Text>
                    <FieldArray name='destinations' render={ (arrayHelpers: ArrayHelpers) => (
                        <Flex direction='column'>
                            {destinations.map((destination: { destination: string, numDays: number }, index: number) => (
                                <div key={index}>
                                    <Flex direction='column'>
                                        <FormLabel fontSize={['16px', '16px', '20px', '24px']}>{`Destination ${index + 1}:`}</FormLabel>
                                        <Flex direction='row' justifyContent='space-between' bg="#f2f2f2" style={{border: '3px solid black', borderRadius: '8px', padding: '8px',}} mb='4%' gap='1%'>
                                            <Flex direction='column'  w='stretch'>
                                                <FormLabel>Destination:</FormLabel>
                                                <Field bg='white' as={Input}  type='input' name={`destinations.${index}.destination`} style={{border: '2px solid black', borderRadius: '8px', padding: '8px',}}  placeHolder={'Enter a city or airport'}/>
                                            </Flex>
                                            <Flex direction='column'  w='20%'>
                                                <FormLabel># of Days:</FormLabel>
                                                <Field as={Input} bg='white' type='input' name={`destinations.${index}.numDays`} style={{border: '2px solid black', borderRadius: '8px', padding: '8px',}} placeHolder={'Enter a city or airport'}/>
                                            </Flex>
                                            <Image  src={DeleteIcon} boxSize='10%' mt='3.5%' onClick={() => {
                                                arrayHelpers.remove(index)
                                            }}/> 
                                        </Flex>
                                    </Flex>

                                    
                                </div>

                            ))}
                            <Button
                            _hover={{ backgroundColor: '#4746CE' }}
                            _active={{ backgroundColor: '#3635AA' }}
                            backgroundColor='rgba(78, 103, 235, 1)'
                            color='rgba(255, 255, 255, 1)'
                            width='200px'
                            alignSelf='center'
                            textColor='white'
                            fontWeight={600}
                            onClick={() => arrayHelpers.push({ destination: '', numDays: 0})}
                            fontSize='16px'
                            mt='3%'>
                                Add new destination
                            </Button>
                        </Flex>
                    )}/>
                </Flex>
            </Form>
        </>
    )
}

export default CRForm