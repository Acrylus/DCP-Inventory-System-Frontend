const BASE_URL = `${
    process.env.BASE_URL || "http://localhost"
}/municipality/create_all`;

interface Municipality {
    name: string;
    division: {
        divisionId: number;
    };
}

const createMunicipalities = async (municipalities: Municipality[]) => {
    try {
        const response = await fetch(BASE_URL, {
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

const sampleMunicipalities: Municipality[] = [
    {
        name: "Alcantara",
        division: { divisionId: 1 },
    },
    {
        name: "Alcoy",
        division: { divisionId: 1 },
    },
];

createMunicipalities(sampleMunicipalities);
