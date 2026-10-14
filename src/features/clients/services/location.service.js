import { locationService as sharedService } from '../../locations/services/location.service'

export const locationService = {
    ...sharedService,
    getClientLocations: sharedService.getLocationsByClient,
}