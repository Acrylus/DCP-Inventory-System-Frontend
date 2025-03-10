import BASE_URL from "../../util/BaseUrl";

interface Division {
    divisionId: number;
    officeName: string;
    headOfOffice: string;
    position: string;
    itoName: string;
    emailAddress: string;
}

export const updateDivision = async (division: Division): Promise<Division> => {
    try {
        const response = await fetch(
            `${BASE_URL}/division/update/${division.divisionId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(division),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to update division");
        }

        const data = await response.json();
        console.log("Division updated successfully:", data);
        return data as Division;
    } catch (error) {
        console.error("Error updating division:", error);
        throw error;
    }
};
