import BASE_URL from "../../util/BaseUrl";

interface District {
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

export const createDistrict = async (district: District) => {
    try {
        const response = await fetch(`${BASE_URL}/district/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(district),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(
                `Failed to create district. Status: ${response.status}, Message: ${errorMessage}`
            );
        }

        const data = await response.json();
        console.log("District created successfully:", data);
        return data;
    } catch (error) {
        console.error("Error creating district:", error);
        throw error;
    }
};
