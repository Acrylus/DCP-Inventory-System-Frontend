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
    classification: string | null;
    schoolId: string;
    name: string;
    address: string;
    previousStation: string | null;
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
