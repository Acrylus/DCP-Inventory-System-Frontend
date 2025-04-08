import BASE_URL from "../../util/BaseUrl";

interface School {
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

export const createAllSchools = async (schools: School[]) => {
    try {
        const response = await fetch(`${BASE_URL}/school/create_all`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(schools),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(
                `Failed to create schools. Status: ${response.status}, Message: ${errorMessage}`
            );
        }

        const data = await response.json();
        console.log("Schools created successfully:", data);
        return data;
    } catch (error) {
        console.error("Error creating schools:", error);
        throw error;
    }
};
