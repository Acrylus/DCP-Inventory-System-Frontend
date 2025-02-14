import { useState } from "react";

const DCPBatchSearch = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBatch, setSelectedBatch] = useState<string | null>(null); // ✅ Fixed type

    // Sample Batch Data (Replace with API Data)
    const batchData = [
        { batchNo: "DCP FY2025", numOfPkg: 1 },
        { batchNo: "DCP FY2021", numOfPkg: 375 },
        { batchNo: "Batch 2019-2", numOfPkg: 13 },
        { batchNo: "Batch 2019-1", numOfPkg: 27 },
    ];

    // Sample School Data (Replace with API Data)
    const schoolData = [
        {
            division: "Cebu Province",
            municipality: "Dalaguete",
            classification: "Elementary",
            schoolID: "119311",
            schoolName: "ABLAYAN ELEMENTARY SCHOOL",
            numOfPkg: 1,
            batchNo: "DCP FY2025",
        },
        {
            division: "Cebu Province",
            municipality: "Cebu City",
            classification: "Secondary",
            schoolID: "112233",
            schoolName: "CEBU HIGH SCHOOL",
            numOfPkg: 5,
            batchNo: "DCP FY2021",
        },
    ];

    // Filter batch list based on search query
    const filteredBatches = batchData.filter((batch) =>
        batch.batchNo.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filter school data based on selected batch
    const filteredSchools = selectedBatch
        ? schoolData.filter((school) => school.batchNo === selectedBatch)
        : [];

    return (
        <div className="w-full max-w-6xl mx-auto p-4 text-black">
            {/* Search Bar */}
            <div className="relative my-6">
                <input
                    type="search"
                    placeholder="Search Batch"
                    className="w-full h-10 px-4 pr-12 text-sm border-b border-slate-200 focus:border-emerald-500 outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Two-Column Layout */}
            <div className="flex gap-4">
                {/* Batch List (Left Table - 1/3 Width) */}
                <div className="w-1/3 border rounded-lg p-4 overflow-auto">
                    <h2 className="text-lg font-bold mb-3">Batch List</h2>
                    <div className="overflow-auto max-h-96">
                        <table className="w-full border-collapse border border-slate-200">
                            <thead>
                                <tr className="bg-slate-100">
                                    <th className="px-4 py-2 border border-slate-300">
                                        Batch No
                                    </th>
                                    <th className="px-4 py-2 border border-slate-300">
                                        # of Pkg
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBatches.map((batch, index) => (
                                    <tr
                                        key={index}
                                        className={`cursor-pointer hover:bg-emerald-100 ${
                                            selectedBatch === batch.batchNo
                                                ? "bg-emerald-200"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            setSelectedBatch(batch.batchNo)
                                        }
                                    >
                                        <td className="px-4 py-2 border border-slate-300">
                                            {batch.batchNo}
                                        </td>
                                        <td className="px-4 py-2 border border-slate-300 text-center">
                                            {batch.numOfPkg}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* School Details (Right Table - 2/3 Width) */}
                <div className="w-2/3 border rounded-lg p-4 overflow-auto">
                    <h2 className="text-lg font-bold mb-3">
                        School Details {selectedBatch && `for ${selectedBatch}`}
                    </h2>
                    <div className="overflow-auto max-h-96">
                        <table className="w-full border-collapse border border-slate-200">
                            <thead>
                                <tr className="bg-slate-100">
                                    <th className="px-4 py-2 border border-slate-300">
                                        Division
                                    </th>
                                    <th className="px-4 py-2 border border-slate-300">
                                        Municipality
                                    </th>
                                    <th className="px-4 py-2 border border-slate-300">
                                        Classification
                                    </th>
                                    <th className="px-4 py-2 border border-slate-300">
                                        School ID
                                    </th>
                                    <th className="px-4 py-2 border border-slate-300">
                                        School Name
                                    </th>
                                    <th className="px-4 py-2 border border-slate-300">
                                        # of Pkg
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSchools.length > 0 ? (
                                    filteredSchools.map((school, index) => (
                                        <tr
                                            key={index}
                                            className="hover:bg-slate-100"
                                        >
                                            <td className="px-4 py-2 border border-slate-300">
                                                {school.division}
                                            </td>
                                            <td className="px-4 py-2 border border-slate-300">
                                                {school.municipality}
                                            </td>
                                            <td className="px-4 py-2 border border-slate-300">
                                                {school.classification}
                                            </td>
                                            <td className="px-4 py-2 border border-slate-300">
                                                {school.schoolID}
                                            </td>
                                            <td className="px-4 py-2 border border-slate-300">
                                                {school.schoolName}
                                            </td>
                                            <td className="px-4 py-2 border border-slate-300 text-center">
                                                {school.numOfPkg}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="text-center py-4 text-gray-500"
                                        >
                                            {selectedBatch
                                                ? "No schools found for this batch."
                                                : "Select a batch to view details."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DCPBatchSearch;
