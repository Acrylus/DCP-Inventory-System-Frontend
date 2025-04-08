import { useEffect, useState } from "react";
import { getAllBatches } from "../../lib/batch-api/getAllBatch";
import { Alert, Snackbar } from "@mui/material";

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

interface Configuration {
    id: ConfigurationId;
    item: string;
    type: string;
    quantity: number;
}

interface ConfigurationId {
    configurationId: number;
    batchId: number;
}

const DCPBatchSearch = () => {
    const [batches, setBatches] = useState<Batch[]>([]);
    const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<
        "success" | "error"
    >("success");

    useEffect(() => {
        fetchBatches();
    }, []);

    const fetchBatches = async () => {
        try {
            const data = await getAllBatches();
            const transformedData: Batch[] = data.map((batch: any) => ({
                ...batch,
                schoolBatchList: batch.schoolBatchList || [],
                configurations: batch.configurations || [],
            }));
            setBatches(transformedData);
        } catch (error) {
            console.error("Failed to fetch batches:", error);
        }
    };

    const handleBatchSelect = (batchId: number) => {
        const batch = batches.find((b) => b.batchId === batchId) || null;
        setSelectedBatch(batch);
    };

    return (
        <div className="p-5 h-full flex items-center justify-evenly gap-6 w-full">
            <div className="flex flex-col w-3/5 gap-6 h-[85vh]">
                {/* Batch Details */}
                <div className="bg-white shadow-md rounded-lg p-6 flex flex-col h-1/2 overflow-auto">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">
                        DCP Batch Details
                    </h2>
                    <div className="grid grid-cols-3 gap-6 overflow-y-auto">
                        {[
                            {
                                label: "Record No.",
                                value: selectedBatch?.batchId || "",
                            },
                            {
                                label: "DCP Batch No.",
                                value: selectedBatch?.batchName || "",
                            },
                            {
                                label: "Budget Year",
                                value: selectedBatch?.budgetYear || "",
                            },
                            {
                                label: "Delivery Year",
                                value: selectedBatch?.deliveryYear || "",
                            },
                            {
                                label: "Price per Package",
                                value: selectedBatch?.price || "",
                            },
                            {
                                label: "Supplier",
                                value: selectedBatch?.supplier || "",
                            },
                            {
                                label: "Remarks",
                                value: selectedBatch?.remarks || "",
                            },
                        ].map((field, index) => (
                            <div key={index} className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600">
                                    {field.label}
                                </label>
                                <input
                                    type="text"
                                    className="h-12 w-full mt-1 rounded-lg border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                                    placeholder={`Enter ${field.label}`}
                                    value={field.value}
                                    readOnly
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Configuration Table */}
                <div className="bg-white shadow-md rounded-lg p-4 flex flex-col h-1/2 overflow-auto">
                    <h2 className="bg-gray-300 text-black p-3 text-center font-bold text-lg rounded-t-lg">
                        DCP Batch Items
                    </h2>
                    <div className="w-full overflow-x-auto mt-4 text-black">
                        <table className="w-full text-left border border-separate border-slate-200 rounded-md">
                            <thead className="bg-slate-100 sticky top-0">
                                <tr>
                                    <th className="h-12 px-6 text-sm font-semibold border border-slate-300">
                                        Rec No.
                                    </th>
                                    <th className="h-12 px-6 text-sm font-semibold border border-slate-300">
                                        Item
                                    </th>
                                    <th className="h-12 px-6 text-sm font-semibold border border-slate-300">
                                        Type
                                    </th>
                                    <th className="h-12 px-6 text-sm font-semibold border border-slate-300">
                                        Qty
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedBatch &&
                                selectedBatch.configurations.length > 0 ? (
                                    selectedBatch.configurations.map(
                                        (config, index) => (
                                            <tr
                                                key={config.id.configurationId}
                                                className="border border-slate-300 hover:bg-emerald-100"
                                            >
                                                <td className="h-12 px-6 text-sm border border-slate-200">
                                                    {index + 1}
                                                </td>
                                                <td className="h-12 px-6 text-sm border border-slate-200">
                                                    {config.item}
                                                </td>
                                                <td className="h-12 px-6 text-sm border border-slate-200">
                                                    {config.type}
                                                </td>
                                                <td className="h-12 px-6 text-sm border border-slate-200">
                                                    {config.quantity}
                                                </td>
                                            </tr>
                                        )
                                    )
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="text-center text-sm text-gray-500 py-6"
                                        >
                                            Select a batch to see configuration
                                            details
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Right Section - DCP Batch Search with Scrollable Area */}
            <div className="w-2/5 bg-white shadow-md rounded-lg p-4 h-[85vh]">
                <h2 className="bg-gray-300 text-black p-3 text-center font-bold text-lg rounded-t-lg">
                    DCP Batch Search
                </h2>
                <div className="w-full overflow-y-auto h-[70vh] mt-4 text-black">
                    <table className="w-full text-left border border-separate border-slate-200 rounded-md">
                        <thead className="bg-slate-100 sticky top-0 z-10">
                            <tr>
                                <th className="h-12 px-6 text-sm font-semibold border border-slate-300">
                                    Batch No.
                                </th>
                                <th className="h-12 px-6 text-sm font-semibold border border-slate-300">
                                    Budget Year
                                </th>
                                <th className="h-12 px-6 text-sm font-semibold border border-slate-300">
                                    Delivery Year
                                </th>
                                <th className="h-12 px-6 text-sm font-semibold border border-slate-300">
                                    Supplier
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {batches.map((batch) => (
                                <tr
                                    key={batch.batchId}
                                    onClick={() =>
                                        handleBatchSelect(batch.batchId)
                                    }
                                    className="border border-slate-300 hover:bg-emerald-100 cursor-pointer"
                                >
                                    <td className="h-12 px-6 text-sm border border-slate-200">
                                        {batch.batchName}
                                    </td>
                                    <td className="h-12 px-6 text-sm border border-slate-200">
                                        {batch.budgetYear}
                                    </td>
                                    <td className="h-12 px-6 text-sm border border-slate-200">
                                        {batch.deliveryYear}
                                    </td>
                                    <td className="h-12 px-6 text-sm border border-slate-200">
                                        {batch.supplier}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
            >
                <Alert
                    severity={snackbarSeverity}
                    onClose={() => setOpenSnackbar(false)}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default DCPBatchSearch;
