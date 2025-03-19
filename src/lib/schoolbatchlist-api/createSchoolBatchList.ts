import BASE_URL from "../../util/BaseUrl";

interface SchoolBatchList {
    school: School;
    deliveryDate?: number | null;
    numberOfPackage: number;
    status?: string | null;
    keyStage?: string | null;
    remarks?: string | null;
    accountable?: string | null;
    packages: Package[];
}

interface School {
    schoolRecordId: number;
    schoolId: string;
    name: string;
    address: string;
    division: Division;
    district: District;
    classification?: string | null;
    previousStation?: string | null;
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

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(
                `Failed to create school batch list. Status: ${response.status}, Message: ${errorMessage}`
            );
        }

        const data = await response.json();
        console.log("School Batch List created successfully:", data);
        return data;
    } catch (error) {
        console.error("Error creating school batch list:", error);
        throw error;
    }
};
