import BASE_URL from "../../util/BaseUrl";

interface SchoolNTC {
    schoolNTCId: number;
    school: School;
    internet: boolean;
    pldt: boolean;
    globe: boolean;
    am: boolean;
    fm: boolean;
    tv: boolean;
    cable: boolean;
    remark: string;
    providers: Provider[];
}

interface Provider {
    providerId: number;
    name: string;
    speed: number;
    unit: string;
}

interface Provider {
    providerId: number;
    name: string;
    speed: number;
    unit: string;
}

interface School {
    schoolRecordId: number;
    district: District;
    classification: string;
    schoolId: string;
    name: string;
    address: string;
    previousStation: string;
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

interface District {
    districtId: number;
    name: string;
    division: Division;
}

export const getSchoolNTC = async (
    schoolRecordId: number
): Promise<SchoolNTC | null> => {
    try {
        const response = await fetch(
            `${BASE_URL}/school_ntc/school/${schoolRecordId}`,
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
