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
    division: Division;
    district: District;
    classification: string | null;
    schoolId: string;
    name: string;
    address: string;
    previousStation: string | null;
}

interface SchoolBatchList {
    schoolBatchId: number;
    school: School;
    deliveryDate: string | null;
    numberOfPackage: number;
    status: string | null;
    keyStage: string | null;
    remarks: string | null;
    accountable: string | null;
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
    item: string;
    status: string;
    component: string;
    serialNumber: string;
    assigned: string;
    remarks: string;
}

export const getPackages = async (): Promise<Package[]> => {
    try {
        const response = await fetch(`${BASE_URL}/package/get_all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch packages");
        }

        const responseData = await response.json();

        const data: Package[] = responseData;

        return data;
    } catch (error) {
        console.error("Error fetching packages:", error);
        throw error;
    }
};
