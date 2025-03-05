import React, { useState } from "react";
import * as XLSX from "xlsx";
import { useUploadSchoolData } from "../hooks/UploadSchool";

const UploadSchool = () => {
    const [file, setFile] = useState<File | null>(null);
    const [data, setData] = useState<any[]>([]);
    const { uploadData, isUploading, error } = useUploadSchoolData();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            console.log("Selected file:", file); // Check if file is selected
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
                        ); // Check for empty row
                        const containsTotal = row.some((cell: any) => {
                            return (
                                typeof cell === "string" &&
                                (cell.toUpperCase().includes("TOTAL SCHOOL") ||
                                    cell
                                        .toUpperCase()
                                        .includes("DIVISION TOTAL"))
                            );
                        });
                        // Exclude rows that are empty or contain "TOTAL SCHOOL" or "DIVISION TOTAL"
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

    const handleSaveData = () => {
        if (data.length > 0) {
            // Format data
            const formattedData = data.map((row: any) => ({
                division: row["DIVISION"] || null,
                district: row["DISTRICT"] || null,
                schoolId: row["SCHOOL ID"] || null,
                name: row["SCHOOL"] || null,
                address: row["School Address"] || null,
                schoolHead: row["NAME OF SCHOOL HEADS"] || null,
                designation: row["DESIGNATION"] || null,
                schoolHeadNumber: row["CONTACT NUMBERS"] || null,
                landline: row["TELEPHONE (Office)"] || null,
                schoolHeadEmail: row["DEPED-MAIL ADDRESS"] || null,
                previousStation: row["Previous Station"] || null,
                propertyCustodian: null,
                propertyCustodianNumber: null,
                propertyCustodianEmail: null,
                energized: null,
                energizedRemarks: null,
                localGridSupply: null,
                connectivity: null,
                smart: null,
                globe: null,
                digitalNetwork: null,
                am: null,
                fm: null,
                tv: null,
                cable: null,
                ntcRemark: null,
                numberOfPackage: null,
                classification: null,
            }));
            console.log(formattedData);
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

            {/* Display Uploaded Data */}
            {data.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-lg text-black">Preview Data</h3>{" "}
                    {/* Black text for title */}
                    <table className="table-auto w-full mt-2">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border text-black">
                                    #
                                </th>{" "}
                                {/* Count column */}
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
                                    </td>{" "}
                                    {/* Row count */}
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
