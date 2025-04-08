import BASE_URL from "../../util/BaseUrl";

interface Coordinator {
    name: string;
    designation: string;
    email: string;
    number: string;
    remarks: string;
    school: School[];
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

export const getCoordinatorBySchoolId = async (
    schoolRecordId: number
): Promise<Coordinator[]> => {
    try {
        const response = await fetch(
            `${BASE_URL}/coordinator/school/${schoolRecordId}`,
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
                `Failed to fetch coordinator by school ID. Status: ${response.status}, Message: ${errorMessage}`
            );
        }

        const responseData = await response.json();
        const data: Coordinator[] = responseData;

        console.log("Fetched Coordinator by School ID:", data);
        return data;
    } catch (error) {
        console.error("Error fetching coordinator by school ID:", error);
        throw error;
    }
};
