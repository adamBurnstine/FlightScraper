import * as Yup from 'yup'
import formModelCR from './formModelCR'

const { formField: {startDate, endDate, startLoc, destinations, tripLength }} = formModelCR

export default Yup.object().shape({
    [startDate.name]: Yup.string().required('Start Date is required'),
    [endDate.name]: Yup.string().required('End Date is required'),
    [startLoc.name]: Yup.string().required('Starting location is requried'),
    [destinations.name]: Yup.array().of(
        Yup.object().shape({
            destination: Yup.string().required('Destination is required'),
            numDays: Yup.number().required('# of days is requried').min(2, "Min # of days is 2")
        })
    ),
    [tripLength.name]: Yup.number().required().min(3, "Trip length must be at least 3 days"),
})