import { useState, useEffect } from "react";
import BASE_URL from "../util/BaseUrl"; // Adjust the import as necessary

export const useUploadSchoolData = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [divisions, setDivisions] = useState<any[]>([]); // Store the full division objects

    useEffect(() => {
        console.log("Sending request to fetch divisions...");
        const fetchDivisions = async () => {
            try {
                const response = await fetch(`${BASE_URL}/division/get_all`);

                if (response.ok) {
                    const data = await response.json();
                    console.log("Fetched division data:", data); // Log the raw response data

                    if (data && data.data && Array.isArray(data.data)) {
                        // Store the complete division objects
                        setDivisions(data.data);
                        console.log("Processed divisions:", data.data); // Log the complete division data
                    } else {
                        setError("No division data found in the response");
                        console.error("API response format issue:", data);
                    }
                } else {
                    const errorText = await response.text();
                    setError(
                        "Failed to fetch divisions. Response: " + errorText
                    );
                    console.error(
                        "Failed to fetch divisions. Status:",
                        response.status,
                        "Text:",
                        errorText
                    );
                }
            } catch (err) {
                setError("An error occurred while fetching divisions");
                console.error("Error fetching divisions:", err);
            }
        };

        fetchDivisions();
    }, []);

    const uploadData = async (data: any[]) => {
        setIsUploading(true);
        setError(null);

        try {
            const formattedData = data.map((school: any) => {
                let normalizedDivision = "";
                if (school.division && typeof school.division === "string") {
                    normalizedDivision = school.division
                        .toLowerCase()
                        .replace(" division", "")
                        .trim();
                } else {
                    console.warn(
                        `Invalid division for school ${school.schoolName}`
                    );
                    normalizedDivision = "unknown division"; // Set to a fallback value
                }

                // Check for schoolName or assign a default value
                if (!school.schoolName) {
                    throw new Error(
                        `School name is missing for ${school.schoolId}`
                    );
                }

                console.log(
                    `Normalized division for school ${school.schoolName}:`,
                    normalizedDivision
                );

                // Fetch existing division by officeName (using the full division object now)
                const division = divisions.find(
                    (d) => d.name.toLowerCase() === normalizedDivision
                );

                if (division) {
                    school.division = {
                        divisionId: division.id,
                        officeName: division.name,
                    };
                    console.log(
                        `Assigned divisionId: ${division.id} and officeName: ${division.name} to school ${school.schoolName}`
                    );
                } else {
                    school.division = {
                        divisionId: null,
                        officeName: "Unknown Division",
                    };
                    console.warn(
                        `Division mismatch for school ${school.schoolName}. Division set to Unknown.`
                    );
                }

                // Ensure schoolId is handled properly
                if (school.schoolId === "No ID yet") {
                    school.schoolId = 0; // Set schoolId to 0 if it's "No ID yet"
                }

                // Ensure name is assigned (can use schoolName)
                school.name = school.schoolName || "Unnamed School";

                return school;
            });

            console.log(formattedData);

            const response = await fetch(`${BASE_URL}/school/create_all`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formattedData),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage || "Failed to upload data");
            }

            alert("Data uploaded successfully");
        } catch (err) {
            setError((err as Error).message);
            console.error("Upload error:", err);
        } finally {
            setIsUploading(false);
        }
    };

    return { uploadData, isUploading, error };
};
