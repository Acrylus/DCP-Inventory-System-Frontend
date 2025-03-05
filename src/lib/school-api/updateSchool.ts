import BASE_URL from "../../util/BaseUrl";

interface School {
    schoolRecordId: number;
    name: string;
    division: Division;
    district: District;
    classification?: string;
    schoolId?: string;
    address?: string;
    landline?: string;
    schoolHead?: string;
    schoolHeadNumber?: string;
    schoolHeadEmail?: string;
    propertyCustodian?: string;
    propertyCustodianNumber?: string;
    propertyCustodianEmail?: string;
    energized?: boolean;
    energizedRemarks?: boolean;
    localGridSupply?: boolean;
    connectivity?: boolean;
    smart?: boolean;
    globe?: boolean;
    digitalNetwork?: boolean;
    am?: boolean;
    fm?: boolean;
    tv?: boolean;
    cable?: boolean;
    ntcRemark?: string;
    designation?: string;
    previousStation?: string;
}

interface District {
    districtId: number;
    name: string;
    division: Division;
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

export const updateSchoolById = async (
    id: number,
    updatedSchool: School
): Promise<School> => {
    try {
        const response = await fetch(`${BASE_URL}/school/update/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedSchool),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(
                `Failed to update school. Status: ${response.status}, Message: ${errorMessage}`
            );
        }

        const responseData = await response.json();
        const data: School = responseData.data;

        console.log("School updated successfully:", data);
        return data;
    } catch (error) {
        console.error("Error updating school:", error);
        throw error;
    }
};
