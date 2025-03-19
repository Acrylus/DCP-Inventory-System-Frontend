import BASE_URL from "../../util/BaseUrl";

interface SchoolBatchList {
    schoolBatchId: number;
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

export const getSchoolBatchListById = async (
    id: number
): Promise<SchoolBatchList> => {
    try {
        const response = await fetch(
            `${BASE_URL}/school_batch_list/get/${id}`,
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
                `Failed to fetch school batch list. Status: ${response.status}, Message: ${errorMessage}`
            );
        }

        const responseData = await response.json();
        const data: SchoolBatchList = responseData.data;

        console.log("Fetched School Batch List:", data);
        return data;
    } catch (error) {
        console.error("Error fetching school batch list:", error);
        throw error;
    }
};
