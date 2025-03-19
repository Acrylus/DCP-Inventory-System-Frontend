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

export const createSchoolContact = async (
    schoolContact: SchoolContact
): Promise<SchoolContact> => {
    try {
        const response = await fetch(`${BASE_URL}/school_contact/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(schoolContact),
        });

        if (!response.ok) {
            throw new Error("Failed to create school contact");
        }

        const responseData = await response.json();

        const data: SchoolContact = responseData.data;

        return data;
    } catch (error) {
        console.error("Error creating school contact:", error);
        throw error;
    }
};
