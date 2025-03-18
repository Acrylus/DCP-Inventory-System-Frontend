import { useState, useEffect } from "react";
import BASE_URL from "../util/BaseUrl"; // Adjust import path as necessary

export const useUploadSchoolData = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [divisions, setDivisions] = useState<any[]>([]);
    const [districts, setDistricts] = useState<any[]>([]);

    useEffect(() => {
        const fetchDivisionsAndDistricts = async () => {
            try {
                const [divRes, distRes] = await Promise.all([
                    fetch(`${BASE_URL}/division/get_all`),
                    fetch(`${BASE_URL}/district/get_all`),
                ]);

                if (!divRes.ok || !distRes.ok) {
                    throw new Error("Failed to fetch divisions or districts");
                }

                const divData = await divRes.json();
                const distData = await distRes.json();

                if (Array.isArray(divData?.data)) {
                    setDivisions(divData.data);
                    console.log("Fetched Divisions:", divData.data);
                } else {
                    console.error("Invalid division data format:", divData);
                }

                if (Array.isArray(distData?.data)) {
                    setDistricts(distData.data);
                    console.log("Fetched Districts:", distData.data);
                } else {
                    console.error("Invalid district data format:", distData);
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(
                    "An error occurred while fetching divisions and districts."
                );
            }
        };

        fetchDivisionsAndDistricts();
    }, []);

    const uploadData = async (data: any[]) => {
        setIsUploading(true);
        setError(null);

        try {
            const formattedData = data.map((school) => {
                if (!school.name) school.name = "Unnamed School";

                // Normalize division and district names
                const normalizedDivision =
                    school.division
                        ?.toLowerCase()
                        ?.replace(" division", "")
                        .trim() || "";
                const normalizedDistrict =
                    school.district
                        ?.toLowerCase()
                        ?.replace(" district", "")
                        .trim() || "";

                // Find the matching division
                const division = divisions.find(
                    (d) => d.division.toLowerCase() === normalizedDivision
                );
                school.division = division
                    ? {
                          divisionId: division.divisionId,
                          division: division.division,
                      }
                    : { divisionId: null, division: "Unknown Division" };

                // Find the matching district
                const district = districts.find(
                    (d) => d.name.toLowerCase() === normalizedDistrict
                );
                school.district = district
                    ? { districtId: district.districtId, name: district.name }
                    : { districtId: null, name: "Unknown District" };

                // Ensure schoolId is a number
                school.schoolId =
                    school.schoolId === "No ID yet" ? 0 : school.schoolId;

                return school;
            });

            console.log("Final Data for Upload:", formattedData);

            const response = await fetch(`${BASE_URL}/school/create_all`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formattedData),
            });

            if (!response.ok) {
                throw new Error(
                    (await response.text()) || "Failed to upload data"
                );
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
