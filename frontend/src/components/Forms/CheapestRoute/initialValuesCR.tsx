import formModelCR from './formModelCR'

const {
    formField: {
        startDate,
        endDate,
        startLoc,
        destinations,
        tripLength,
    }
} = formModelCR

const initialValuesCR = { 
    [startDate.name]: '',
    [endDate.name]: '',
    [startLoc.name]: 'temp',
    [destinations.name]: [{destination: 'temp', numDays: ''}, {destination: 'temp', numDays: ''}],
    [tripLength.name]: 0, 
}

export default initialValuesCR