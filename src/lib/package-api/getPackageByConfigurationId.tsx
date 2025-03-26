import BASE_URL from "../../util/BaseUrl";

interface Package {
    id: Id;
    schoolBatchList: SchoolBatchList;
    configuration: Configuration;
    status: string;
    component: string;
    serialNumber: string;
    assigned: string;
    remarks: string;
}

interface Id {
    packageId: number;
    SchoolBatchListId: number;
}

interface District {
    districtId: number;
    division: Division;
    name: string;
}

interface Division {
    divisionId: number;
    division: string;
    title: string;
    sdsName: string;
    sdsPosition: string;
    itoName: string;
    itoEmail: string;
}

interface SchoolBatchList {
    schoolBatchId: number;
    school: School;
    deliveryDate: string;
    numberOfPackage: number;
    status: string;
    keyStage: string;
    remarks: string;
    accountable: string;
}

interface School {
    schoolRecordId: number;
    district: District;
    classification: string;
    schoolId: string;
    name: string;
    address: string;
    previousStation: string;
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
