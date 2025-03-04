const BASE_URL = `${
    process.env.BASE_URL || "http://localhost"
}/district/create`;

interface District {
    name: string;
    division: {
        divisionId: number;
    };
}

const createDistrict = async () => {
    const newDistrict: District = {
        name: "Alcantara",
        division: {
            divisionId: 1,
        },
    };

    try {
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newDistrict),
        });
        if (response.ok) {
            const data = await response.json();
            console.log("District created successfully:", data);
        } else {
            console.error("Failed to create district:", response.statusText);
        }
    } catch (error) {
        console.error("Error creating district:", error);
    }
};

createDistrict();
