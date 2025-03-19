import BASE_URL from "../../util/BaseUrl";

interface SchoolEnergy {
    schoolEnergyId?: number; // Optional, as it may be auto-generated
    school: { schoolRecordId: number };
    electricityProvider: string;
    monthlyConsumption: number; // kWh
    monthlyBill: number; // Amount in currency
    generatorAvailable: boolean;
    solarPanelsInstalled: boolean;
}

export const getAllSchoolEnergy = async (): Promise<SchoolEnergy[]> => {
    try {
        const response = await fetch(`${BASE_URL}/school_energy/get_all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch school energy records");
        }

        const responseData = await response.json();
        const data: SchoolEnergy[] = responseData.data;

        return data;
    } catch (error) {
        console.error("Error fetching school energy records:", error);
        throw error;
    }
};
