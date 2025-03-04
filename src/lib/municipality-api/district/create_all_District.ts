import BASE_URL from "../../../util/BaseUrl";

interface District {
    name: string;
    division: {
        divisionId: number;
    };
}

export const createAllDistricts = async (districts: District[]) => {
    try {
        const response = await fetch(`${BASE_URL}/district/create_all`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(districts),
        });
        if (!response.ok) {
            throw new Error("Failed to create districts");
        }

        const data = await response.json();
        console.log("Districts created successfully:", data);
        return data;
    } catch (error) {
        console.error("Error creating districts:", error);
        throw error;
    }
};

const sampleDistricts: District[] = [
    { name: "Alcantara", division: { divisionId: 1 } },
    { name: "Alcoy", division: { divisionId: 1 } },
    { name: "Alegria", division: { divisionId: 1 } },
    { name: "Aloguinsan", division: { divisionId: 1 } },
    { name: "Argao", division: { divisionId: 1 } },
    { name: "Asturias", division: { divisionId: 1 } },
];

createAllDistricts(sampleDistricts);
