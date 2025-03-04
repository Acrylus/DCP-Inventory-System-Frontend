const BASE_URL = `${
    process.env.BASE_URL || "http://localhost"
}/municipality/update/89`;

interface MunicipalityUpdate {
    name: string;
    division: {
        divisionId: number;
    };
}

const updateMunicipality = async () => {
    const updatedMunicipality: MunicipalityUpdate = {
        name: "Alcantara TEST",
        division: {
            divisionId: 1,
        },
    };

    try {
        const response = await fetch(BASE_URL, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedMunicipality),
        });
        if (response.ok) {
            const data = await response.json();
            console.log("Municipality updated successfully:", data);
        } else {
            console.error(
                "Failed to update municipality:",
                response.statusText
            );
        }
    } catch (error) {
        console.error("Error updating municipality:", error);
    }
};

updateMunicipality();
