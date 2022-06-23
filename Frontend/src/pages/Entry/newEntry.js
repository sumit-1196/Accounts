import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone'
import AsyncSearch from './search'
import * as yup from 'yup'
import { useForm, Controller, useFieldArray } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect } from "react"
import { TextField, Grid, Typography, Box, Button, InputAdornment } from '@mui/material'
import { calculateExpression } from '../../utils/avail'
import { toast } from "react-toastify"


const defaultValues = {
    quantity: "",
    details: "",
    vendor: "",
    price: "",
    total: "",
    sales: [{
        quantity: "",
        details: "",
        customer: "",
        price: "",
        total: ""
    }]
}

const NewEntry = ({ createRecord, updateRecord, dispatch, state, edit, setEdit, expanded, setExpanded }) => {

    const salesSchema = {
        quantity: yup.number().required(),
        details: yup.string().required(),
        customer: yup.object().required(),
        price: yup.number().required(),
        total: yup.number().required()
    }

    const purchaseSchema = {
        quantity: yup.number().required(),
        details: yup.string().required(),
        vendor: yup.object().required(),
        price: yup.number().required(),
        total: yup.number().required(),
        sales: yup.array().of(yup.object().shape(salesSchema))
    }

    const validateSchema = yup.object().shape(purchaseSchema)

    const isPending = state?.loading === 'pending'

    const {
        control,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues,
        resolver: yupResolver(validateSchema)
    })


    const { fields, append, remove } = useFieldArray({
        control,
        name: "sales"
    })


    const onSubmit = async (data, e) => {
        e?.preventDefault?.()
        if ((data?.sales?.reduce((prev, curr) => prev + curr.quantity, 0)) !== (data?.quantity)) {
            toast.error("Item Count Doesn't Match !")
            return
        }
        for (let i = 0; i < data?.sales?.length; i++) {
            if (data.sales[i].price < data.price) {
                toast.error(`Please Correct [${i + 1}]  Sales Price `)
                return
            }
        }
        try {
            const fn = data?.id ? updateRecord : createRecord
            const { payload } = await dispatch(fn(data))
            if (payload?.data?.status) {
                setEdit(null)
                reset({ ...defaultValues })
            }
        } catch (e) { }
    }

    useEffect(() => {
        if (edit) {
            if (!expanded) {
                setExpanded(!expanded)
            }
            reset({ ...defaultValues, ...edit })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [edit])

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate={false}>
            <Typography variant="h6" gutterBottom component="div" marginLeft={1} sx={{ fontWeight: 'light' }}>
                Purchase
            </Typography>
            <Grid container spacing={1} marginBottom={2}>
                <Grid item xs={12} md={3}>
                    <Controller
                        render={({ field }) => (
                            <AsyncSearch
                                field={field}
                                edit={edit}
                                searchApi={'/api/vendor/?name='}
                                placeholder="from"
                            />
                        )}
                        name="vendor"
                        control={control}
                    />
                </Grid>
                <Grid item xs={6} md={1}>
                    <Controller
                        render={({ field: { onChange, value } }) => (
                            <TextField
                                error={errors.quantity ? true : false}
                                fullWidth
                                type="number"
                                placeholder='qty'
                                size="small"
                                value={value}
                                onChange={e => {
                                    onChange(e)
                                    setValue("total", (getValues("quantity") * getValues("price")).toFixed(0))
                                }}
                            />
                        )}
                        name='quantity'
                        control={control}
                    />
                </Grid>
                <Grid item xs={6} md={3}>
                    <Controller
                        render={({ field: { onChange, value } }) => (
                            <TextField
                                error={errors.details ? true : false}
                                fullWidth
                                size="small"
                                placeholder='details'
                                value={value}
                                onChange={e => {
                                    onChange(e)
                                    getValues('sales').map((item, index) => setValue(`sales.${index}.details`, e.target.value))
                                }}
                            />
                        )}
                        name='details'
                        control={control}
                    />
                </Grid>
                <Grid item xs={6} md={1}>
                    <Controller
                        render={({ field: { onChange, value } }) => (
                            <TextField
                                error={errors.price ? true : false}
                                fullWidth
                                size="small"
                                type="number"
                                placeholder='price'
                                value={value}
                                onChange={e => {
                                    onChange(e)
                                    setValue("total", (getValues("quantity") * getValues("price")).toFixed(0))
                                }}
                            />
                        )}
                        name="price"
                        control={control}
                    />
                </Grid>
                <Grid item xs={6} md={2}>
                    <Controller
                        render={({ field: { value, onChange } }) => (
                            <TextField
                                error={errors.total ? true : false}
                                fullWidth
                                size="small"
                                type="text"
                                placeholder='total'
                                value={value}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Button
                                                sx={{
                                                    padding: 0,
                                                    height: '20px',
                                                    width: '30px',
                                                    minWidth: '0px',
                                                    border: '1px solid',
                                                    borderRadius: 0.5
                                                }}
                                                onClick={() => {
                                                    try {
                                                        return onChange(calculateExpression(value))
                                                    } catch (e) { }
                                                    return onChange(value)
                                                }}
                                            >
                                                =
                                            </Button>
                                        </InputAdornment>
                                    )
                                }}
                                onChange={onChange}
                            />
                        )}
                        name="total"
                        control={control}
                    />
                </Grid>
            </Grid>
            <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 'light', marginLeft: 1 }}>
                Sales
            </Typography>
            <Box>
                {fields.map((item, index) => (
                    <Grid container spacing={1} key={item.id} marginBottom={2}>
                        <Grid item xs={0} md={1}></Grid>
                        <Grid item xs={12} md={3}>
                            <Controller
                                render={({ field }) => (
                                    <AsyncSearch
                                        field={field}
                                        edit={edit}
                                        searchApi={'/api/customer/?name='}
                                        placeholder="to"
                                    />
                                )}
                                name={`sales.${index}.customer`}
                                control={control}
                            />
                        </Grid>
                        <Grid item xs={6} md={1}>
                            <Controller
                                render={({ field: { onChange, value } }) => (
                                    <TextField
                                        error={errors?.sales?.[index]?.quantity ? true : false}
                                        fullWidth
                                        type="number"
                                        size="small"
                                        placeholder='qty'
                                        value={value}
                                        onChange={e => {
                                            onChange(e)
                                            setValue(`sales.${index}.total`, (getValues(`sales.${index}.quantity`) * getValues(`sales.${index}.price`)).toFixed(0))
                                        }}
                                    />
                                )}
                                name={`sales.${index}.quantity`}
                                control={control}
                            />
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Controller
                                render={({ field }) => (
                                    <TextField
                                        error={errors?.sales?.[index]?.details ? true : false}
                                        fullWidth
                                        disabled
                                        size="small"
                                        placeholder='details'
                                        {...field}
                                    />
                                )}
                                name={`sales.${index}.details`}
                                control={control}
                            />
                        </Grid>
                        <Grid item xs={5} md={1}>
                            <Controller
                                render={({ field: { onChange, value } }) => (
                                    <TextField
                                        error={errors?.sales?.[index]?.price ? true : false}
                                        fullWidth
                                        size="small"
                                        placeholder='price'
                                        type="number"
                                        value={value}
                                        onChange={e => {
                                            onChange(e)
                                            setValue(`sales.${index}.total`, (getValues(`sales.${index}.quantity`) * getValues(`sales.${index}.price`)).toFixed(0))
                                        }}
                                    />
                                )}
                                name={`sales.${index}.price`}
                                control={control}
                            />
                        </Grid>
                        <Grid item xs={5} md={2}>
                            <Controller
                                render={({ field: { onChange, value } }) => (
                                    <TextField
                                        error={errors?.sales?.[index]?.total ? true : false}
                                        fullWidth
                                        size="small"
                                        type="text"
                                        placeholder='total'
                                        value={value}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <Button
                                                        sx={{
                                                            padding: 0,
                                                            height: '20px',
                                                            width: '30px',
                                                            minWidth: '0px',
                                                            border: '1px solid',
                                                            borderRadius: 0.5
                                                        }}
                                                        onClick={() => {
                                                            try {
                                                                return onChange(calculateExpression(value))
                                                            } catch (e) { }
                                                            return onChange(value)
                                                        }}
                                                    >
                                                        =
                                                    </Button>
                                                </InputAdornment>
                                            )
                                        }}
                                        onChange={onChange}
                                    />
                                )}
                                name={`sales.${index}.total`}
                                control={control}
                            />
                        </Grid>
                        <Grid item xs={2} md={1}
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                            {!edit ? (
                                <DeleteForeverTwoToneIcon
                                    onClick={() => getValues('sales').length > 1 ? remove(index) : null}
                                    htmlColor="red"
                                    cursor="pointer"
                                />
                            ) : null}
                        </Grid>
                    </Grid>
                ))}
            </Box>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingRight: { md: 3 }
            }}>
                <Button
                    variant="contained"
                    size="small"
                    type='submit'
                    disabled={isPending}
                    color="primary"
                >
                    {edit ? "Update Entry" : "Post Entry"}
                </Button>
                {edit ? (
                    <Button
                        variant="contained"
                        size='small'
                        color="primary"
                        onClick={() => {
                            reset({ ...defaultValues })
                            setEdit(null)
                        }}
                    >
                        Clear
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        size='small'
                        color="primary"
                        disabled={edit ? true : false}
                        onClick={() => append({
                            quantity: "",
                            details: getValues("details"),
                            customer: "",
                            price: "",
                            total: ""
                        })}
                    >
                        Sales +
                    </Button>
                )}
            </Box>
        </form>
    )
}

export default NewEntry