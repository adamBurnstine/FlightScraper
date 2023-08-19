import formModel from './formModel'

const { formField: { start,  end, date }} = formModel

const initialValues = {
    [start.name]: '',
    [end.name]: '',
    [date.name]: '',
}

export default initialValues