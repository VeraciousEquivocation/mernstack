import {useState} from 'react'

export default function useForceUpdate() {
    const setVal = useState({})[1]
    const forceUpdate = () => {
        setVal({})
    }
    return forceUpdate;
}