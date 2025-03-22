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

export const getSchoolContact = async (
    schoolRecordId: number
): Promise<SchoolContact | null> => {
    try {
        const response = await fetch(`${BASE_URL}/school/${schoolRecordId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch school contact");
        }

        const responseData: SchoolContact = await response.json();
        return responseData ?? null; // Return `null` if response is empty
    } catch (error) {
        console.error("Error fetching school contact:", error);
        return null; // Return `null` in case of an error
    }
};
