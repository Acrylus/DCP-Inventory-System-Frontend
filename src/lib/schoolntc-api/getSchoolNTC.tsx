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

export const getAllSchoolNTC = async (): Promise<SchoolNTC[]> => {
    try {
        const response = await fetch(`${BASE_URL}/school_ntc/get_all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch school NTC records");
        }

        const responseData = await response.json();
        const data: SchoolNTC[] = responseData.data;

        return data;
    } catch (error) {
        console.error("Error fetching school NTC records:", error);
        throw error;
    }
};
