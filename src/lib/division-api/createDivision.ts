import BASE_URL from "../../util/BaseUrl";

interface Batch {
    batchId: number;
}

interface Division {
    divisionId: number;
    batch: Batch;
    division: string;
    title: string;
    sdsName: string;
    sdsPosition: string;
    itoName: string;
    itoEmail: string;
}

export const createDivision = async (division: Division) => {
    try {
        const response = await fetch(`${BASE_URL}/division/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(division),
        });

        if (!response.ok) {
            throw new Error("Failed to create division");
        }

        const data = await response.json();
        console.log("Division created successfully:", data);
        return data;
    } catch (error) {
        console.error("Error creating division:", error);
        throw error;
    }
};
