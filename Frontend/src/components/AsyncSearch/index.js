import axios from 'axios'
import React, { useCallback } from 'react'
import { debounce } from 'lodash'
import AsyncSelect from 'react-select/async'

const AsyncSearch = ({ placeholder, field, searchApi, edit }) => {
    const { onChange, value } = { ...field }

    const loadOptions = (query, callback) => {
        axios.get(`${searchApi}${query}`).then(res => callback(res.data))
    }

    const debouncedChangeHandler = useCallback(debounce(loadOptions, 200), [])

    console.log(edit)
    return (
        <AsyncSelect
            cacheOptions
            defaultOptions
            placeholder={placeholder}
            getOptionLabel={e => e.name}
            getOptionValue={e => e.id}
            loadOptions={debouncedChangeHandler}
            value={edit ? { "name": value } : value.name}   // We Need to Pass name as Object In case of Edit for being selected
            onChange={e => onChange(e.name)}
        />
    )
}

export default AsyncSearch