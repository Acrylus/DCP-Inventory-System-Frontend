import BASE_URL from "../../util/BaseUrl";

interface Package {
    packageId: Package;
    item: string;
    status: string;
    component: string;
    serialNumber: string;
    assigned: string;
    remarks: string;
    configuration: Configuration;
}

interface Configuration {
    configurationId: number;
    item: string;
    type: string;
    quantity: number;
}

export const getPackageByConfigurationId = async (
    configurationId: number
): Promise<Package[]> => {
    try {
        const response = await fetch(
            `${BASE_URL}/package/configuration/${configurationId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(
                `Failed to fetch package by configuration ID. Status: ${response.status}, Message: ${errorMessage}`
            );
        }

        const responseData = await response.json();
        const data: Package[] = responseData;

        console.log("Fetched Package by Configuration ID:", data);
        return data;
    } catch (error) {
        console.error("Error fetching package by configuration ID:", error);
        throw error;
    }
};
