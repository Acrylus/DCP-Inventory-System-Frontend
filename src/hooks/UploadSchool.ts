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
                console.log("Sending request to fetch divisions...");
                const response = await fetch(`${BASE_URL}/division/get_all`);

                if (response.ok) {
                    const data = await response.json();
                    console.log("Fetched division data:", data); // Log the raw response data

                    if (data && data.data && Array.isArray(data.data)) {
                        const divisionNames = data.data.map(
                            (division: {
                                divisionId: number;
                                officeName: string;
                            }) => ({
                                id: division.divisionId,
                                name: division.officeName
                                    .toLowerCase()
                                    .replace(" division", "")
                                    .trim(),
                            })
                        );
                        setDivisions(divisionNames);
                        console.log("Processed divisions:", divisionNames); // Log the final divisions
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
                const normalizedDivision = school.division
                    ? school.division
                          .toLowerCase()
                          .replace(" division", "")
                          .trim()
                    : "";

                // console.log("Normalized division:", normalizedDivision);
                // console.log("Available divisions:", divisions);

                // Fetch existing division by officeName
                const division = divisions.find(
                    (d) => d.officeName.toLowerCase() === normalizedDivision
                );

                if (division) {
                    // If found, assign the existing division ID to the school
                    school.division = division.divisionId;
                    console.log(
                        `Assigned divisionId: ${division.divisionId} to school ${school.schoolName}`
                    );
                } else {
                    // Handle division mismatch by keeping the division null or fallback value
                    school.division = "Unknown Division"; // This can be null or your fallback value
                    // console.warn(
                    //     `Division mismatch for school ${school.schoolName}. Division set to Unknown.`
                    // );
                }

                // Handle "No ID yet" case
                if (school.schoolId === "No ID yet") {
                    school.schoolId = 0; // Set schoolId to 0 if it's "No ID yet"
                }

                return school;
            });

            const response = await fetch(`${BASE_URL}/school/create_all`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formattedData), // Send the array directly
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
