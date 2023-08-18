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
    [startLoc.name]: '',
    [destinations.name]: [{destination: '', numDays: ''}, {destination: '', numDays: ''}],
    [tripLength.name]: 0, 
}

export default initialValuesCR