import BASE_URL from "../../util/BaseUrl";

interface District {
    districtId: number;
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

export const updateDistrict = async (district: District): Promise<District> => {
    try {
        const response = await fetch(
            `${BASE_URL}/district/update/${district.districtId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(district),
            }
        );
        if (!response.ok) {
            throw new Error("Failed to update district");
        }

        const data: District = await response.json();
        console.log("District updated successfully:", data);
        return data;
    } catch (error) {
        console.error("Error updating district:", error);
        throw error;
    }
};
