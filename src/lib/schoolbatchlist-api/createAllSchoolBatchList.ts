import BASE_URL from "../../util/BaseUrl";

interface SchoolBatchList {
    schoolBatchId: number;
    batch: Batch;
    school: School;
    deliveryDate: number;
    numberOfPackage: number;
    status: string;
    keyStage: string;
    remarks: string;
    accountable: string;
    packages: Package[];
}

interface Batch {
    batchId: number;
    batchName: string;
    budgetYear: number;
    deliveryYear: number;
    price: number;
    supplier: string;
    numberOfPackage: number;
    remarks: string;
    schoolBatchList: SchoolBatchList[];
    configurations: Configuration[];
}

interface School {
    schoolRecordId: number;
    name: string;
    division: Division;
    district: District;
    classification?: string;
    schoolId?: string;
    address?: string;
    designation?: string;
    previousStation?: string;
}

interface District {
    districtId: number;
    name: string;
    division: Division;
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

interface Package {
    packageId: number;
    item: string;
    status?: string;
    component?: string;
    serialNumber?: string;
    assigned?: string;
    remarks?: string;
    schoolBatchList: SchoolBatchList;
    configuration: Configuration;
}

interface Configuration {
    configurationId: number;
    batch: Batch;
    item: string;
    type?: string;
    quantity?: number;
}

export const createAllSchoolBatchLists = async (
    schoolBatchLists: SchoolBatchList[]
) => {
    try {
        const response = await fetch(
            `${BASE_URL}/school_batch_list/create_all`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(schoolBatchLists),
            }
        );

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(
                `Failed to create school batch lists. Status: ${response.status}, Message: ${errorMessage}`
            );
        }

        const data = await response.json();
        console.log("School Batch Lists created successfully:", data);
        return data;
    } catch (error) {
        console.error("Error creating school batch lists:", error);
        throw error;
    }
};
