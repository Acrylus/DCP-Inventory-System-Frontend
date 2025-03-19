import { useEffect, useState } from "react";
import { getAllBatches } from "../../lib/batch-api/getAllBatch";
import { getSchoolBatchListByBatchId } from "../../lib/schoolbatchlist-api/getSchoolBatchListByBatchId";

interface Batch {
    batchId: number;
    batchName: string;
    budgetYear: string;
    deliveryYear: string;
    price: string;
    supplier: string;
    numberOfPackage: string;
    remarks: string;
    configurations: Configuration[];
}

interface SchoolBatchList {
    schoolBatchId: number;
    school: School;
    deliveryDate?: number | null;
    numberOfPackage: number;
    status?: string | null;
    keyStage?: string | null;
    remarks?: string | null;
    accountable?: string | null;
    packages: Package[];
}

interface School {
    schoolRecordId: number;
    schoolId: string;
    name: string;
    address: string;
    division: Division;
    district: District;
    classification?: string | null;
    previousStation?: string | null;
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
}

interface Configuration {
    configurationId: number;
    item: string;
    type: string;
    quantity: number;
}

const DCPBatchSearch = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBatch, setSelectedBatch] = useState<Batch>();
    const [batches, setBatches] = useState<Batch[]>([]);
    const [schoolBatchList, setSchoolBatchList] = useState<SchoolBatchList[]>(
        []
    );
    const [loading, setLoading] = useState(false);

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

    const fetchSchoolBatchList = async (batchId: number) => {
        try {
            setLoading(true);
            const data = await getSchoolBatchListByBatchId(batchId);
            setSchoolBatchList(data);
        } catch (error) {
            console.error("Failed to fetch school batch list:", error);
            setSchoolBatchList([]);
        } finally {
            setLoading(false);
        }
    };

    const handleBatchSelection = (batch: Batch) => {
        setSelectedBatch(batch);
        fetchSchoolBatchList(batch.batchId);
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
                                        onClick={() =>
                                            handleBatchSelection(batch)
                                        }
                                    >
                                        <td className="px-4 py-2 border border-slate-300">
                                            {batch.batchName}
                                        </td>
                                        <td className="px-4 py-2 border border-slate-300 text-center">
                                            {batch.numberOfPackage}
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
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="text-center py-4 text-gray-500"
                                        >
                                            Loading...
                                        </td>
                                    </tr>
                                ) : schoolBatchList.length > 0 ? (
                                    schoolBatchList.map((sbl) => (
                                        <tr key={sbl.schoolBatchId}>
                                            <td className="px-4 py-2 border border-slate-300">
                                                {sbl.school?.division
                                                    ?.division || "N/A"}
                                            </td>
                                            <td className="px-4 py-2 border border-slate-300">
                                                {sbl.school?.district?.name ||
                                                    "N/A"}
                                            </td>
                                            <td className="px-4 py-2 border border-slate-300">
                                                {sbl.school?.classification ||
                                                    "N/A"}
                                            </td>
                                            <td className="px-4 py-2 border border-slate-300">
                                                {sbl.school?.schoolId || "N/A"}
                                            </td>
                                            <td className="px-4 py-2 border border-slate-300">
                                                {sbl.school?.name || "N/A"}
                                            </td>
                                            <td className="px-4 py-2 border border-slate-300 text-center">
                                                {sbl.numberOfPackage || 0}
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
