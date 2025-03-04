const BASE_URL = `${
    process.env.BASE_URL || "http://localhost"
}/municipality/delete/89`;

interface MunicipalityDelete {
    name: string;
    division: {
        divisionId: number;
    };
}

const deleteMunicipality = async () => {
    const municipalityToDelete: MunicipalityDelete = {
        name: "Alcantara TEST",
        division: {
            divisionId: 1,
        },
    };

    try {
        const response = await fetch(BASE_URL, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(municipalityToDelete),
        });
        if (response.ok) {
            console.log("Municipality deleted successfully");
        } else {
            console.error(
                "Failed to delete municipality:",
                response.statusText
            );
        }
    } catch (error) {
        console.error("Error deleting municipality:", error);
    }
};

deleteMunicipality();
