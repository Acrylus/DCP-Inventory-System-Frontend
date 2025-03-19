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

export const createSchoolContacts = async (
    schoolContacts: SchoolContact[]
): Promise<SchoolContact[]> => {
    try {
        const response = await fetch(`${BASE_URL}/school_contact/create_all`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(schoolContacts),
        });

        if (!response.ok) {
            throw new Error("Failed to create school contacts");
        }

        const responseData = await response.json();

        const data: SchoolContact[] = responseData.data;

        return data;
    } catch (error) {
        console.error("Error creating school contacts:", error);
        throw error;
    }
};
