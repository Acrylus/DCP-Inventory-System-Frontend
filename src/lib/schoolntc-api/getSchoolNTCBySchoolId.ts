import BASE_URL from "../../util/BaseUrl";

interface SchoolNTC {
    schoolNtcId: number;
    schoolRecordId: number;
    internet: boolean;
    pldt: boolean;
    globe: boolean;
    am: boolean;
    fm: boolean;
    tv: boolean;
    cable: boolean;
    remark: string;
}

export const getSchoolNTC = async (
    schoolRecordId: number
): Promise<SchoolNTC | null> => {
    try {
        const response = await fetch(
            `${BASE_URL}/api/school_ntc/${schoolRecordId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch school NTC data");
        }

        const data: SchoolNTC = await response.json(); // Assuming API returns a single object

        return data;
    } catch (error) {
        console.error("Error fetching school NTC data:", error);
        return null; // Return null instead of throwing
    }
};
