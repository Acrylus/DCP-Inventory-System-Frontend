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
    email: string;
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
