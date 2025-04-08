import React, { useState } from "react";
import * as XLSX from "xlsx";
import { useUploadSchoolData } from "../hooks/UploadSchool";
import { updateSchoolContact } from "../lib/schoolcontact-api/updateSchoolContact";

const UploadSchool = () => {
    const [file, setFile] = useState<File | null>(null);
    const [data, setData] = useState<any[]>([]);
    const [isUpdating, setIsUpdating] = useState(false);
    const { uploadData, isUploading, error } = useUploadSchoolData();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            console.log("Selected file:", file);
            setFile(file);
        }
    };

    const handleFileUpload = () => {
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const binaryStr = e.target?.result;
                if (binaryStr) {
                    const wb = XLSX.read(binaryStr, { type: "binary" });
                    const sheetName = wb.SheetNames[0];
                    const sheet = wb.Sheets[sheetName];
                    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

                    console.log("Rows before cleaning:", rows);
                    const cleanedRows = (rows as any[]).filter((row) => {
                        const isEmptyRow = row.every(
                            (cell: any) => cell === "" || cell == null
                        );
                        const containsTotal = row.some(
                            (cell: any) =>
                                typeof cell === "string" &&
                                (cell.toUpperCase().includes("TOTAL SCHOOL") ||
                                    cell
                                        .toUpperCase()
                                        .includes("DIVISION TOTAL"))
                        );
                        return !containsTotal && !isEmptyRow;
                    });

                    console.log("Rows after cleaning:", cleanedRows);
                    const headerRow: string[] = Array.isArray(cleanedRows[4])
                        ? cleanedRows[4]
                        : [];
                    const additionalHeader: string[] = Array.isArray(
                        cleanedRows[5]
                    )
                        ? cleanedRows[5]
                        : [];
                    const mergedHeaders = headerRow
                        .map((header: string, index: number) => {
                            if (header === "CONTACT NUMBERS")
                                return [additionalHeader[index], header];
                            return header;
                        })
                        .flat();

                    const jsonData = cleanedRows.slice(6).map((row: any) => {
                        return mergedHeaders.reduce(
                            (acc: any, header: string, index: number) => {
                                acc[header] = row[index] || "";
                                return acc;
                            },
                            {}
                        );
                    });

                    console.log("Parsed data with merged headers:", jsonData);
                    setData(jsonData);
                }
            };
            reader.readAsBinaryString(file);
        }
    };

    const handleUpdateContact = async () => {
        setIsUpdating(true);
        try {
            for (const row of data) {
                let schoolId = row["SCHOOL ID"]; // This is the actual school ID

                // If schoolId is missing or set to "No ID yet", treat it as 0
                if (!schoolId || schoolId === "No ID yet") {
                    schoolId = 0;
                }

                // Fetch the correct schoolRecordId from the backend
                let response = await fetch(
                    `http://localhost:8080/school/school_record_id/${schoolId}`
                );
                let schoolRecordId = response.ok ? await response.json() : null;

                // If schoolRecordId is 0, fetch by school name
                if (schoolRecordId === 0) {
                    const schoolName = row["SCHOOL"];
                    if (schoolName) {
                        console.warn(
                            `Duplicate ID detected, fetching by name: ${schoolName}`
                        );
                        response = await fetch(
                            `http://localhost:8080/school/school_record_id/name/${schoolName}`
                        );
                        schoolRecordId = response.ok
                            ? await response.json()
                            : null;
                    }
                }

                const contactData = {
                    landline: row["TELEPHONE (Office)"] || null,
                    schoolHead: row["NAME OF SCHOOL HEADS"] || null,
                    schoolHeadNumber: row["Active CELLPHONE Number"] || null,
                    schoolHeadEmail: row["DEPED-MAIL ADDRESS"] || null,
                    designation: row["DESIGNATION"] || null,
                    propertyCustodian: row["PROPERTY CUSTODIAN"] || null,
                    propertyCustodianNumber:
                        row["PROPERTY CUSTODIAN NUMBER"] || null,
                    propertyCustodianEmail:
                        row["PROPERTY CUSTODIAN EMAIL"] || null,
                };

                console.log(
                    `Updating contact for schoolRecordId: ${schoolRecordId}`
                );

                console.log(
                    `Updating contact for schoolRecordId: ${contactData.landline}`
                );
                await updateSchoolContact(schoolRecordId, contactData);
            }

            console.log("All school contacts updated successfully.");
        } catch (error) {
            console.error("Error updating school contacts:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleSaveData = () => {
        if (data.length > 0) {
            // Format data to match the new SchoolEntity structure
            const formattedData = data.map((row: any) => ({
                division: row["DIVISION"] || null,
                district: row["DISTRICT"] || null,
                schoolId: row["SCHOOL ID"] || null,
                email: `${row["SCHOOL ID"]}@deped.gov.ph`,
                name: row["SCHOOL"] || null,
                address: row["School Address"] || null,
                previousStation: row["Previous Station"] || null,
                classification: row["CLASSIFICATION"] || null,
            }));

            console.log("Formatted Data:", formattedData);
            uploadData(formattedData);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold text-black">
                Upload School Data
            </h2>

            {/* File Input */}
            <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                className="mt-2 text-black"
            />

            {/* Upload Button */}
            <button
                onClick={handleFileUpload}
                disabled={isUploading || !file}
                className="mt-4 p-2 bg-blue-500 text-white"
            >
                {isUploading ? "Uploading..." : "Upload File"}
            </button>

            {/* Save Data Button */}
            <button
                onClick={handleSaveData}
                disabled={isUploading || data.length === 0}
                className="mt-4 p-2 bg-green-500 text-white"
            >
                {isUploading ? "Saving..." : "Save Data"}
            </button>

            <button
                onClick={handleUpdateContact}
                disabled={isUpdating || data.length === 0}
                className="mt-4 p-2 bg-orange-500 text-white"
            >
                {isUpdating ? "Updating Contacts..." : "Update Contacts"}
            </button>

            {/* Display Uploaded Data */}
            {data.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-lg text-black">Preview Data</h3>
                    <table className="table-auto w-full mt-2">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border text-black">
                                    #
                                </th>
                                {Object.keys(data[0]).map((key, index) => (
                                    <th
                                        key={index}
                                        className="px-4 py-2 border text-black"
                                    >
                                        {key}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row: any, rowIndex: number) => (
                                <tr key={rowIndex}>
                                    <td className="px-4 py-2 border text-black">
                                        {rowIndex + 1}
                                    </td>
                                    {Object.values(row).map((cell, index) => (
                                        <td
                                            key={index}
                                            className="px-4 py-2 border text-black"
                                        >
                                            {String(cell)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Error Message */}
            {error && <div className="mt-2 text-red-500">{error}</div>}
        </div>
    );
};

export default UploadSchool;
