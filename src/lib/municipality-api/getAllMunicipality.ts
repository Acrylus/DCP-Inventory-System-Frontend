import BASE_URL from "../../util/BaseUrl";

interface Municipality {
    municipalityId: number;
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

const getMunicipalities = async () => {
    try {
        const response = await fetch(`${BASE_URL}/municipality/get_all`, {
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
