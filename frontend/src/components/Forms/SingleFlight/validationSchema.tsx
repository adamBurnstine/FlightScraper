import * as Yup from 'yup'
import formModel from './formModel'

const {
    formField: { start, end, date },
} = formModel

export default Yup.object().shape({
    [start.name]: Yup.string().required(),
    [end.name]: Yup.string().required(),
    [date.name]: Yup.string().required(),
})