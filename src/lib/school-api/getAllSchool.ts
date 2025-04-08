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
    district: District;
    classification: string;
    schoolId: string;
    email: string;
    name: string;
    address: string;
    previousStation: string;
}

export const getAllSchools = async (): Promise<School[]> => {
    try {
        const response = await fetch(`${BASE_URL}/school/get_all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(
                `Failed to fetch schools. Status: ${response.status}, Message: ${errorMessage}`
            );
        }

        const responseData = await response.json();

        // Extract the data array from the response
        const data: School[] = responseData.data;

        console.log("Fetched Schools:", data);
        return data;
    } catch (error) {
        console.error("Error fetching schools:", error);
        throw error;
    }
};
