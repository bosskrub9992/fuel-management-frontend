export type getUserUnpaidFuelUsagesResponse = {
    userFuelUsages: userFuelUsage[];
};

export type userFuelUsage = {
    car: {
        id: number;
        name: string;
    };
    fuelUsages: {
        id: number;
        fuelUsageUserId: number;
        fuelUseTime: string;
        payEach: string;
    };
};