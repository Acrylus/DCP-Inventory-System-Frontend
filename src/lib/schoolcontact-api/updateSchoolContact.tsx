import BASE_URL from "../../util/BaseUrl";

interface SchoolContact {
    schoolContactId: number;
    school: School;
    landline: string;
    schoolHead: string;
    schoolHeadNumber: string;
    schoolHeadEmail: string;
    designation: string;
    propertyCustodian: string;
    propertyCustodianNumber: string;
    propertyCustodianEmail: string;
    coordinators: Coordinator[];
}

interface Coordinator {
    coordinatorId: number;
    name: string;
    designation: string;
    email: string;
    number: string;
    remarks: string;
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
