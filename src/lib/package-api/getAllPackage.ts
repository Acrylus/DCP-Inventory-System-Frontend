import BASE_URL from "../../util/BaseUrl";

interface Division {
    divisionId: number;
    division: string;
    title: string;
    sdsName: string;
    sdsPosition: string;
    itoName: string;
    itoEmail: string;
}

interface District {
    districtId: number;
    division: Division;
    name: string;
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

interface Configuration {
    configurationId: number;
    item: string;
    type: string;
    quantity: number;
}

interface Package {
    packageId: number;
    schoolBatchList: SchoolBatchList;
    configuration: Configuration;
    status: string;
    component: string;
    serialNumber: string;
    assigned: string;
    remarks: string;
}

export const getAllPackage = async (): Promise<Package[]> => {
    try {
        const response = await fetch(`${BASE_URL}/package/get_all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(
                `Failed to fetch packages. Status: ${response.status}, Message: ${errorMessage}`
            );
        }

        const responseData = await response.json();

        const data: Package[] = responseData.data;

        console.log("Fetched Packages:", data);
        return data;
    } catch (error) {
        console.error("Error fetching packages:", error);
        throw error;
    }
};
