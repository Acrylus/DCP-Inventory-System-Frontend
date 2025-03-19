import { useEffect, useState } from "react";
import { getAllBatches } from "../../lib/batch-api/getAllBatch";

interface SchoolBatchList {
    schoolBatchId: number;
    batch: Batch;
    school: School;
    deliveryDate: number;
    numberOfPackage: number;
    status: string;
    keyStage: string;
    remarks: string;
    accountable: string;
    packages: Package[];
}

interface Batch {
    batchId: number;
    batchName: string;
    budgetYear: number;
    deliveryYear: number;
    price: number;
    supplier: string;
    numberOfPackage: number;
    remarks: string;
    schoolBatchList: SchoolBatchList[];
    configurations: Configuration[];
}

interface School {
    schoolRecordId: number;
    name: string;
    division: Division;
    district: District;
    classification?: string;
    schoolId?: string;
    address?: string;
    landline?: string;
    schoolHead?: string;
    schoolHeadNumber?: string;
    schoolHeadEmail?: string;
    propertyCustodian?: string;
    propertyCustodianNumber?: string;
    propertyCustodianEmail?: string;
    energized?: boolean;
    energizedRemarks?: string;
    localGridSupply?: boolean;
    connectivity?: boolean;
    smart?: boolean;
    globe?: boolean;
    digitalNetwork?: boolean;
    am?: boolean;
    fm?: boolean;
    tv?: boolean;
    cable?: boolean;
    ntcRemark?: string;
    designation?: string;
    previousStation?: string;
}

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

interface Package {
    packageId: number;
    item: string;
    status?: string;
    component?: string;
    serialNumber?: string;
    assigned?: string;
    remarks?: string;
    schoolBatchList: SchoolBatchList;
    configuration: Configuration;
}

interface Configuration {
    configurationId: number;
    batch: Batch;
    item: string;
    type?: string;
    quantity?: number;
}

const DCPBatchSearch = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBatch, setSelectedBatch] = useState<Batch>();
    const [batches, setBatches] = useState<Batch[]>([]);

    useEffect(() => {
        fetchBatches();
    }, []);

    const fetchBatches = async () => {
        try {
            const data = await getAllBatches();
            console.error(data);
            const transformedData: Batch[] = data.map((item: any) => ({
                ...item,
                schoolBatchList: item.schoolBatchList || [],
                configurations: item.configurations || [],
            }));
            setBatches(transformedData);
        } catch (error) {
            console.error("Failed to fetch batches:", error);
        }
    };

    const filteredBatches = batches.filter((batch) =>
        batch.batchName.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                                            selectedBatch?.batchId ===
                                            batch.batchId
                                                ? "bg-emerald-200"
                                                : ""
                                        }`}
                                        onClick={() => setSelectedBatch(batch)}
                                    >
                                        <td className="px-4 py-2 border border-slate-300">
                                            {batch.batchName}
                                        </td>
                                        <td className="px-4 py-2 border border-slate-300 text-center">
                                            {batch.schoolBatchList?.reduce(
                                                (total, sbl) =>
                                                    total +
                                                    (sbl.numberOfPackage || 0),
                                                0
                                            )}
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
                        School Details{" "}
                        {selectedBatch && `for ${selectedBatch.batchName}`}
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
                                {selectedBatch?.schoolBatchList?.length ? (
                                    selectedBatch.schoolBatchList.map(
                                        (sbl, index) => (
                                            <tr key={index}>
                                                <td className="px-4 py-2 border border-slate-300">
                                                    {sbl.school?.division
                                                        ?.division || "N/A"}
                                                </td>
                                                <td className="px-4 py-2 border border-slate-300">
                                                    {sbl.school?.district
                                                        ?.name || "N/A"}
                                                </td>
                                                <td className="px-4 py-2 border border-slate-300">
                                                    {sbl.school
                                                        ?.classification ||
                                                        "N/A"}
                                                </td>
                                                <td className="px-4 py-2 border border-slate-300">
                                                    {sbl.school?.schoolId ||
                                                        "N/A"}
                                                </td>
                                                <td className="px-4 py-2 border border-slate-300">
                                                    {sbl.school?.name || "N/A"}
                                                </td>
                                                <td className="px-4 py-2 border border-slate-300 text-center">
                                                    {sbl.numberOfPackage || 0}
                                                </td>
                                            </tr>
                                        )
                                    )
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
