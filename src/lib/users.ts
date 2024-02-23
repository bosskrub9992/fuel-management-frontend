export type getUserUnpaidFuelUsagesResponse = {
    userFuelUsages: userFuelUsage[]
}

export type userFuelUsage = {
    car: {
        id: number
        name: string
    }
    fuelUsages: {
        fuelUsageId: number
        fuelUsageUserId: number
        fuelUseTime: string
        payEach: string
        description: string
        fuelUsers: string
    }[]
}