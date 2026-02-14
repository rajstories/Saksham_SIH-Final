import { useEffect, useState } from 'react'
import type { LocationPoint } from '../types'

interface GeoState {
  location: LocationPoint | null
  loading: boolean
  error?: string
}

export function useGeolocation() {
  const [state, setState] = useState<GeoState>({
    location: null,
    loading: true,
  })

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setState({ location: null, loading: false, error: 'Not supported' })
      return
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords
        setState({
          location: { latitude, longitude, accuracy },
          loading: false,
        })
      },
      (err) => setState({ location: null, loading: false, error: err.message }),
      { enableHighAccuracy: true, maximumAge: 5000 },
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [])

  return state
}
