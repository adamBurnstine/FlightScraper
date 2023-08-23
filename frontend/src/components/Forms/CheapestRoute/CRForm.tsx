import React, { useState } from 'react'
import { Form, useFormikContext, Field, FieldArray, ErrorMessage, ArrayHelpers } from 'formik'
import { Flex, Text, Input, FormLabel,  Button, Image } from '@chakra-ui/react'
import formModelCR from './formModelCR'
import DeleteIcon from '../../../images/delete-181.svg'

const CRForm: React.FC = () => {
    const { startDate, endDate, startLoc, tripLength } = formModelCR.formField
    const today = new Date()
    const minDateString = today.toISOString().split('T')[0]
    const [minEndDate, setMinEndDate] = useState<string>(minDateString)
    const { values, setFieldValue } = useFormikContext<any>()
    const { destinations } = values
    const { submitForm } = useFormikContext() 

    const handleNewStart = () => {
        setMinEndDate(values.startDate)
        setFieldValue('endDate', '')
    }

    const dateDiff = () => {
        const start = new Date(values.startDate)
        const end = new Date(values.endDate)
        const tripLength = Math.round((end.getTime() - start.getTime())/(1000* 60 * 60 * 24))
        setFieldValue('tripLength', tripLength)
    }
    
    const handleSubmit = () => {
        submitForm()
    }
    
    return (
        <Form onSubmit={handleSubmit}>
            <Flex direction='column' mx='20%'>
                <Text textAlign='center' fontSize={['30px', '30px', '40px', '40px']} fontWeight='600' mb='5%'>
                    Enter some details about your trip.
                </Text>
                <Flex direction='row' justifyContent='space-betwen' gap='1%' mb='3%'>
                    <Flex direction='column' w='stretch'>
                        <FormLabel>Starting Location:</FormLabel>
                        <Field as={Input} type='input' placeholder='Enter a city or airport' style={{border: '1px solid black', borderRadius: '8px', padding: '8px',}} id={startLoc.name} name={startLoc.name}/>
                        <Flex color='red.500' fontSize='xs'>
                            <ErrorMessage name={startLoc.name} />
                        </Flex>
                    </Flex>
                    <Flex direction='column' w='30%'>
                        <FormLabel>Trip Start Date:</FormLabel>
                        <Field  onBlur={handleNewStart}  as={Input} style={{border: '1px solid black', borderRadius: '8px', padding: '8px',}} type='date' id={startDate.name} name={startDate.name} min={minDateString}/>
                        <Flex color='red.500' fontSize='xs'>
                            <ErrorMessage name={startDate.name} />
                        </Flex>
                    </Flex>
                    <Flex direction='column' w='30%'>
                        <FormLabel>Trip End Date:</FormLabel>
                        <Field onBlur={dateDiff} as={Input} type='date' id={endDate.name} style={{border: '1px solid black', borderRadius: '8px', padding: '8px',}} name={endDate.name} min={minEndDate}/>
                        <Flex color='red.500' fontSize='xs'>
                            <ErrorMessage name={endDate.name} />
                        </Flex>
                    </Flex>
                </Flex>
                <Flex color='red' justifyContent='center'>
                    <ErrorMessage  name={tripLength.name} /> 
                </Flex>
                <Text fontSize={['16px', '16px', '20px', '36px']} fontWeight='600' mb='2%'>
                    Destinations:
                </Text>
                <FieldArray name='destinations' render={ (arrayHelpers: ArrayHelpers) => (
                    <Flex direction='column'>
                        {destinations.map((destination: { destination: string, numDays: number }, index: number) => (
                            <Flex direction='column'>
                                <Flex direction='row' alignItems='center' justifyContent='space-between' bg="#fafafa" style={{border: '2px solid black', borderRadius: '8px', padding: '8px',}} mb='4%' gap='1%'>
                                    <Flex direction='column'  w='stretch'>
                                        <FormLabel>Destination:</FormLabel>
                                        <Field bg='white' as={Input}  type='input' name={`destinations.${index}.destination`} style={{border: '1px solid black', borderRadius: '8px', padding: '8px',}}  placeholder={'Enter a city or airport'}/>
                                        <Flex color='red.500' fontSize='xs'>
                                            <ErrorMessage name={`destinations.${index}.destination`} />
                                        </Flex>
                                    </Flex>
                                    <Flex direction='column'  w='25%'>
                                        <FormLabel># of Days:</FormLabel>
                                        <Field as={Input} bg='white' type='input' name={`destinations.${index}.numDays`} style={{border: '1px solid black', borderRadius: '8px', padding: '8px',}} placeholder={'Min # of days'}/>
                                        <Flex color='red.500' fontSize='xs'>
                                            <ErrorMessage name={`destinations.${index}.numDays`} />
                                        </Flex>
                                    </Flex>
                                    <Image src={DeleteIcon} boxSize='8%'  onClick={() => {
                                        arrayHelpers.remove(index)
                                    }}/> 
                                </Flex>
                            </Flex>
                        ))}
                        <Flex direction='row' gap='2%' justifyContent='right'>
                            <Button
                            _hover={{ backgroundColor: '#4746CE' }}
                            _active={{ backgroundColor: '#3635AA' }}
                            backgroundColor='rgba(78, 103, 235, 1)'
                            color='rgba(255, 255, 255, 1)'
                            borderRadius='35px'
                            width='180px'
                            alignSelf='center'
                            textColor='white'
                            fontWeight={600}
                            onClick={() => arrayHelpers.push({ destination: '', numDays: ''})}
                            fontSize='16px'>
                                Add new destination
                            </Button>
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
                            onClick={handleSubmit}
                            fontSize='16px'>
                                Find Routes
                            </Button>
                        </Flex>
                    </Flex>
                )}/>
            </Flex>
        </Form>
    )
}

export default CRForm