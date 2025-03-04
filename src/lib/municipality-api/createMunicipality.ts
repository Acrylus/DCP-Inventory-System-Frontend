import BASE_URL from "../../util/BaseUrl";

interface Municipality {
    name: string;
    division: {
        divisionId: number;
    };
}

export const createMunicipality = async (municipality: Municipality) => {
    try {
        const response = await fetch(`${BASE_URL}/municipality/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(municipality),
        });
        if (!response.ok) {
            throw new Error("Failed to create municipality");
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error creating municipality:", error);
        throw error;
    }
};
