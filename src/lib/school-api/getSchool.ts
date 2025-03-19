import BASE_URL from "../../util/BaseUrl";

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
    division: Division;
    name: string;
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

export const getSchoolById = async (id: number): Promise<School> => {
    try {
        const response = await fetch(`${BASE_URL}/school/get/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(
                `Failed to fetch school. Status: ${response.status}, Message: ${errorMessage}`
            );
        }

        const responseData = await response.json();
        const data: School = responseData.data;

        console.log("Fetched School:", data);
        return data;
    } catch (error) {
        console.error("Error fetching school:", error);
        throw error;
    }
};
