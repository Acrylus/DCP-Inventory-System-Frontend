import BASE_URL from "../../util/BaseUrl";

interface Municipality {
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

export const createMunicipalities = async (municipalities: Municipality[]) => {
    try {
        const response = await fetch(`${BASE_URL}/municipality/create_all`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(municipalities),
        });
        if (response.ok) {
            const data = await response.json();
            console.log("Municipalities created successfully:", data);
        } else {
            console.error(
                "Failed to create municipalities:",
                response.statusText
            );
        }
    } catch (error) {
        console.error("Error creating municipalities:", error);
    }
};
