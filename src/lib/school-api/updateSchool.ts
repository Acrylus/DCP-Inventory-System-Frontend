import BASE_URL from "../../util/BaseUrl";

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
    updatedSchool: School
): Promise<School> => {
    try {
        const response = await fetch(
            `${BASE_URL}/school/update/${updatedSchool.schoolRecordId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedSchool),
            }
        );

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
