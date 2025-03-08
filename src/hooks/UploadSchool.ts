import { useState, useEffect } from "react";
import BASE_URL from "../util/BaseUrl"; // Adjust the import as necessary

export const useUploadSchoolData = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [divisions, setDivisions] = useState<any[]>([]); // Store the full division objects
    const [districts, setDistricts] = useState<any[]>([]); // Store the full district objects

    useEffect(() => {
        const fetchDivisions = async () => {
            try {
                const response = await fetch(`${BASE_URL}/division/get_all`);
                if (response.ok) {
                    const data = await response.json();
                    if (data?.data && Array.isArray(data.data)) {
                        setDivisions(data.data);
                        console.log("Fetched divisions:", data.data);
                    } else {
                        console.error("Invalid division data format:", data);
                        setError("Failed to load divisions.");
                    }
                } else {
                    console.error(
                        "Failed to fetch divisions:",
                        response.status
                    );
                    setError("Failed to fetch divisions.");
                }
            } catch (err) {
                console.error("Error fetching divisions:", err);
                setError("An error occurred while fetching divisions.");
            }
        };

        const fetchDistricts = async () => {
            try {
                const response = await fetch(`${BASE_URL}/district/get_all`);
                if (response.ok) {
                    const data = await response.json();
                    if (data?.data && Array.isArray(data.data)) {
                        setDistricts(data.data);
                        console.log("Fetched districts:", data.data);
                    } else {
                        console.error("Invalid district data format:", data);
                        setError("Failed to load districts.");
                    }
                } else {
                    console.error(
                        "Failed to fetch districts:",
                        response.status
                    );
                    setError("Failed to fetch districts.");
                }
            } catch (err) {
                console.error("Error fetching districts:", err);
                setError("An error occurred while fetching districts.");
            }
        };

        fetchDivisions();
        fetchDistricts();
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
                    console.warn(`Invalid division for school ${school.name}`);
                    normalizedDivision = "unknown division";
                }

                let normalizedDistrict = "";
                if (school.district && typeof school.district === "string") {
                    normalizedDistrict = school.district
                        .toLowerCase()
                        .replace(" district", "")
                        .trim();
                } else {
                    console.warn(`Invalid district for school ${school.name}`);
                    normalizedDistrict = "unknown district";
                }

                console.log(
                    `Normalized division for school ${school.name}:`,
                    normalizedDivision
                );
                console.log(
                    `Normalized district for school ${school.name}:`,
                    normalizedDistrict
                );

                const division = divisions.find(
                    (d) => d.division.toLowerCase() === normalizedDivision
                );

                if (division) {
                    school.division = {
                        divisionId: division.divisionId,
                        division: division.division,
                    };
                    console.log(
                        `Assigned divisionId: ${division.divisionId} and officeName: ${division.division} to school ${school.name}`
                    );
                } else {
                    school.division = {
                        divisionId: null,
                        division: "Unknown Division",
                    };
                    console.warn(
                        `Division mismatch for school ${school.name}. Division set to Unknown.`
                    );
                }

                const district = districts.find(
                    (d) => d.name.toLowerCase() === normalizedDistrict
                );

                if (district) {
                    school.district = district;
                    console.log(
                        `Assigned districtId: ${district.districtId} and name: ${district.name} to school ${school.name}`
                    );
                } else {
                    school.district = {
                        districtId: null,
                        name: "Unknown District",
                    };
                    console.warn(
                        `District mismatch for school ${school.name}. District set to Unknown. ${district}`
                    );
                }

                if (school.schoolId === "No ID yet") {
                    school.schoolId = 0;
                }

                school.name = school.name || "Unnamed School";

                return school;
            });

            console.log("Formatted data for upload:", formattedData);

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
