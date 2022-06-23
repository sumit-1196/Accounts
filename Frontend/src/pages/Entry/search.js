import { useCallback } from 'react'
import { debounce } from 'lodash'
import AsyncSelect from 'react-select/async'
import axios from 'axios'

const AsyncSearch = ({ placeholder, field, searchApi }) => {

    const loadOptions = (query, callback) => {
        axios.get(`${searchApi}${query}`).then(res => callback(res.data.map((user) => (
            { "name": user.name }
        ))))
    }

    const debouncedChangeHandler = useCallback(debounce(loadOptions, 200), []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <AsyncSelect
            cacheOptions
            required
            defaultOptions
            placeholder={placeholder}
            getOptionLabel={e => e.name}
            getOptionValue={e => e.name}
            loadOptions={debouncedChangeHandler}
            {...field}
        />
    )
}

export default AsyncSearch