import { useState } from "react"

export function unlockEMDBike(scanId: string | number) {
    const [lockState, setLockState] = useState<null | Boolean>();
    const [idVal, setIdVal] = useState<null | string>();

    const unLockEMD = async() => { 
        try {
            const response = await fetch(import.meta.env.VITE_LOCOUNLOCK_URL, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${import.meta.env.VITE_LOCK_AUTHORIZATION}`
                },
                method: 'POST',
                body: JSON.stringify({"scan_id": scanId})
            })
            console.log('unlockRespons: ', response)

            const responseData = await response.json()

            console.log('responseData: ', responseData)

            if (responseData.success) {
                setIdVal(responseData.ride_id)
                setLockState(true)
            } else {
                console.log('unlock fail')
            }
        } catch (error) {
            console.error("Error:", error)
        }
    }

    return {
        state: lockState,
        rideId: idVal,
        unlock: () => {
            unLockEMD()
        }
    }
}

export function lockEMDBike(scanId: string | number, rideId?: string | number) {

    const lockEMD = async( id: typeof rideId ) => {
        try {
            console.log('scanId:', scanId)
            console.log(import.meta.env.VITE_LOCOLOCK_URL)
            const response = await fetch(import.meta.env.VITE_LOCOLOCK_URL, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${import.meta.env.VITE_LOCK_AUTHORIZATION}`
                },
                method: 'POST',
                body: JSON.stringify({"scan_id": scanId, "ride_id": id}),
                mode: 'cors'
            })
            
            console.log('lockResponse', response)
            //console.log(lockResponse.json())
            //const responseData = await lockResponse.json()

        } catch (error) {
            console.error("Error:", error)
        }
    }

    return {
        lock: (id: typeof rideId) => {
            lockEMD(id)
        }
    }
}