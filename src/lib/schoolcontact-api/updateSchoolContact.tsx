import BASE_URL from "../../util/BaseUrl";

interface SchoolContact {
    landline: string;
    schoolHead: string;
    schoolHeadNumber: string;
    schoolHeadEmail: string;
    designation: string;
    propertyCustodian: string;
    propertyCustodianNumber: string;
    propertyCustodianEmail: string;
}

export const updateSchoolContact = async (
    schoolContactId: number,
    schoolContact: SchoolContact
): Promise<SchoolContact> => {
    try {
        const response = await fetch(
            `${BASE_URL}/school_contact/update/${schoolContactId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(schoolContact),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to update school contact");
        }

        const responseData = await response.json();
        console.log(`Response from server:`, responseData);
        return responseData.data as SchoolContact;
    } catch (error) {
        console.error("Error updating school contact:", error);
        throw error;
    }
};
