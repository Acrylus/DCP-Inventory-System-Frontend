const BASE_URL = `${
    process.env.BASE_URL || "http://localhost"
}/municipality/get_all`;

interface Municipality {
    name: string;
    division: {
        divisionId: number;
    };
}

const getMunicipalities = async () => {
    try {
        const response = await fetch(BASE_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.ok) {
            const data: Municipality[] = await response.json();
            console.log("Fetched Municipalities:", data);
        } else {
            console.error(
                "Failed to fetch municipalities:",
                response.statusText
            );
        }
    } catch (error) {
        console.error("Error fetching municipalities:", error);
    }
};

getMunicipalities();
