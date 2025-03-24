import BASE_URL from "../../util/BaseUrl";

interface SchoolNTC {
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
