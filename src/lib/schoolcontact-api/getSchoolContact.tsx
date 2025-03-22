import BASE_URL from "../../util/BaseUrl";

interface SchoolContact {
    schoolContactId: number;
    school: School;
    landline: string;
    schoolHead: string;
    schoolHeadNumber: string;
    schoolHeadEmail: string;
    propertyCustodian: string;
    propertyCustodianNumber: string;
    propertyCustodianEmail: string;
}

interface School {
    schoolRecordId: number;
    division: Division;
    district: District;
    classification: string | null;
    schoolId: string;
    name: string;
    address: string;
    previousStation: string | null;
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

export const getSchoolContactById = async (
    schoolContactId: number
): Promise<SchoolContact> => {
    try {
        const response = await fetch(
            `${BASE_URL}/school_contact/get/${schoolContactId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch school contact");
        }

        const responseData = await response.json();
        return responseData.data as SchoolContact;
    } catch (error) {
        console.error("Error fetching school contact:", error);
        throw error;
    }
};
