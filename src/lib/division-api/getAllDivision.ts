import BASE_URL from "../../util/BaseUrl";

interface Division {
    officeName: string;
    headOfOffice: string;
    position: string;
    itoName: string;
    emailAddress: string;
}

export const getAllDivisions = async (): Promise<Division[]> => {
    try {
        const response = await fetch(`${BASE_URL}/division/get_all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch divisions");
        }

        const data = await response.json();
        console.log("Fetched divisions successfully:", data);
        return data as Division[];
    } catch (error) {
        console.error("Error fetching divisions:", error);
        throw error;
    }
};
