import BASE_URL from "../../util/BaseUrl";

interface SchoolNTC {
    school: { schoolRecordId: number };
    internet: boolean;
    pldt: boolean;
    globe: boolean;
    am: boolean;
    fm: boolean;
    tv: boolean;
    cable: boolean;
    remark: string;
}

export const createMultipleSchoolNTC = async (
    schoolNTCRecords: SchoolNTC[]
): Promise<SchoolNTC[]> => {
    try {
        const response = await fetch(`${BASE_URL}/school_ntc/create_all`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(schoolNTCRecords),
        });

        if (!response.ok) {
            throw new Error("Failed to create multiple school NTC records");
        }

        const responseData = await response.json();
        const data: SchoolNTC[] = responseData.data;

        return data;
    } catch (error) {
        console.error("Error creating multiple school NTC records:", error);
        throw error;
    }
};
