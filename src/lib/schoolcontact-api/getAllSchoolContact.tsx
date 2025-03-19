import BASE_URL from "../../util/BaseUrl";

interface SchoolContact {
    schoolContactId?: number; // Optional, since IDs are usually auto-generated
    school: { schoolRecordId: number };
    landline: string;
    schoolHead: string;
    schoolHeadNumber: string;
    schoolHeadEmail: string;
    propertyCustodian: string;
    propertyCustodianNumber: string;
    propertyCustodianEmail: string;
}

export const getAllSchoolContacts = async (): Promise<SchoolContact[]> => {
    try {
        const response = await fetch(`${BASE_URL}/school_contact/get_all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch school contacts");
        }

        const responseData = await response.json();
        const data: SchoolContact[] = responseData.data;

        return data;
    } catch (error) {
        console.error("Error fetching school contacts:", error);
        throw error;
    }
};
