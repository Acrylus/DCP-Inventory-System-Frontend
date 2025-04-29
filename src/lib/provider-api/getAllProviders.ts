import BASE_URL from "../../util/BaseUrl";

interface Provider {
    providerId: ProviderId;
    name: string;
    speed: number;
    unit: string;
}

interface ProviderId {
    providerId: number;
    schoolNTCId: number;
}

export const getAllProviders = async (): Promise<Provider[]> => {
    try {
        const response = await fetch(`${BASE_URL}/provider/get_all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch providers");
        }

        const responseData = await response.json();
        const data: Provider[] = responseData.data;

        return data;
    } catch (error) {
        console.error("Error fetching providers:", error);
        throw error;
    }
};
