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
    landline?: string;
    schoolHead?: string;
    schoolHeadNumber?: string;
    schoolHeadEmail?: string;
    propertyCustodian?: string;
    propertyCustodianNumber?: string;
    propertyCustodianEmail?: string;
    energized?: boolean;
    energizedRemarks?: string;
    localGridSupply?: boolean;
    connectivity?: boolean;
    smart?: boolean;
    globe?: boolean;
    digitalNetwork?: boolean;
    am?: boolean;
    fm?: boolean;
    tv?: boolean;
    cable?: boolean;
    ntcRemark?: string;
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

export const updateSchoolBatchListById = async (
    updatedSchoolBatchList: SchoolBatchList
): Promise<SchoolBatchList> => {
    try {
        const response = await fetch(
            `${BASE_URL}/school_batch_list/update/${updatedSchoolBatchList.schoolBatchId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedSchoolBatchList),
            }
        );

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(
                `Failed to update school batch list. Status: ${response.status}, Message: ${errorMessage}`
            );
        }

        const responseData = await response.json();
        const data: SchoolBatchList = responseData.data;

        console.log("School Batch List updated successfully:", data);
        return data;
    } catch (error) {
        console.error("Error updating school batch list:", error);
        throw error;
    }
};
