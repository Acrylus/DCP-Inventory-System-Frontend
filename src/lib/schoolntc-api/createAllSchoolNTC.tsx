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

export const createSchoolNTC = async (
    schoolNTC: SchoolNTC
): Promise<SchoolNTC> => {
    try {
        const response = await fetch(`${BASE_URL}/school_ntc/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(schoolNTC),
        });

        if (!response.ok) {
            throw new Error("Failed to create school NTC record");
        }

        const responseData = await response.json();
        const data: SchoolNTC = responseData.data;

        return data;
    } catch (error) {
        console.error("Error creating school NTC record:", error);
        throw error;
    }
};
