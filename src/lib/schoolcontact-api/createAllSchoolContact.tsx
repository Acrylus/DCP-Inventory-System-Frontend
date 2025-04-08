import BASE_URL from "../../util/BaseUrl";

interface SchoolContact {
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
