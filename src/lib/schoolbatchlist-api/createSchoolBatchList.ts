import BASE_URL from "../../util/BaseUrl";

interface Batch {
    batchId: number;
    batchName: string;
    budgetYear: number;
    deliveryYear: number;
    price: number;
    supplier: string;
    numberOfPackage: number;
    remarks: string;
    configurations: Configuration[];
}

interface SchoolBatchList {
    batch: Batch;
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
    email: string;
    name: string;
    address: string;
    previousStation: string;
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

interface District {
    districtId: number;
    name: string;
    division: Division;
}

interface Configuration {
    id: ConfigurationId;
    item: string;
    type: string;
    quantity: number;
}

interface ConfigurationId {
    configurationId: number;
    batchId: number;
}

export const createSchoolBatchList = async (
    schoolBatchList: SchoolBatchList
) => {
    try {
        const response = await fetch(`${BASE_URL}/school_batch_list/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(schoolBatchList),
        });

        const responseText = await response.text(); // Read raw response first
        console.log("Raw response:", responseText);

        if (!response.ok) {
            throw new Error(
                `Failed to create school batch list. Status: ${response.status}, Message: ${responseText}`
            );
        }

        console.log(responseText); // Should log: "School Batch List added successfully"
        return responseText; // Return the success message if needed
    } catch (error) {
        console.error("Error creating school batch list:", error);
    }
};
