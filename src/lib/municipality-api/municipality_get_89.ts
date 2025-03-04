const BASE_URL = `${
    process.env.BASE_URL || "http://localhost"
}/municipality/get/89`;

interface Municipality {
    name: string;
    division: {
        divisionId: number;
    };
}

const getMunicipalityById = async () => {
    try {
        const response = await fetch(BASE_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.ok) {
            const data: Municipality = await response.json();
            console.log("Fetched Municipality:", data);
        } else {
            console.error("Failed to fetch municipality:", response.statusText);
        }
    } catch (error) {
        console.error("Error fetching municipality:", error);
    }
};

getMunicipalityById();
