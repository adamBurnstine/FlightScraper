import * as Yup from 'yup'
import formModelCR from './formModelCR'

const {
    formField: {startDate, endDate, startLoc, destinations } 
} = formModelCR

export default Yup.object().shape({
    [startDate.name]: Yup.string().required(),
    [endDate.name]: Yup.string().required(),
    [startLoc.name]: Yup.string().required(),
    [destinations.name]: Yup.array().of(
        Yup.object().shape({
            destination: Yup.string().required(),
            numDays: Yup.number().required()
        })
    )
})