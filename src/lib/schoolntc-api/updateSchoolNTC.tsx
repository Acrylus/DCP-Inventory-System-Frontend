import BASE_URL from "../../util/BaseUrl";

interface SchoolNTC {
    school: { schoolRecordId: number };
    energized: boolean;
    remarks: string;
    localGridSupply: boolean;
}

export const updateSchoolNTC = async (
    schoolNTCId: number,
    updatedData: Partial<SchoolNTC>
): Promise<SchoolNTC> => {
    try {
        const response = await fetch(
            `${BASE_URL}/school_ntc/update/${schoolNTCId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedData),
            }
        );

        if (!response.ok) {
            throw new Error(
                `Failed to update school NTC record with ID: ${schoolNTCId}`
            );
        }

        const responseData = await response.json();
        const data: SchoolNTC = responseData.data;

        return data;
    } catch (error) {
        console.error("Error updating school NTC record:", error);
        throw error;
    }
};
