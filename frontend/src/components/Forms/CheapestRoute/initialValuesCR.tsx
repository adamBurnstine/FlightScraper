import formModelCR from './formModelCR'

const {
    formField: {
        startDate,
        endDate,
        startLoc,
        destinations,
    }
} = formModelCR

const initialValuesCR = { 
    [startDate.name]: '',
    [endDate.name]: '',
    [startLoc.name]: '',
    [destinations.name]: [],
}

export default initialValuesCR