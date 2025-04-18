import React, { useEffect, useState } from "react";
import { getAllBatches } from "../../lib/batch-api/getAllBatch";
import { Alert, Box, CircularProgress, Snackbar } from "@mui/material";
import {
    Square3Stack3DIcon,
    UserCircleIcon,
} from "@heroicons/react/24/outline";
import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
    Button,
} from "@material-tailwind/react";
import { createBatch } from "../../lib/batch-api/createBatch";
import { updateBatch } from "../../lib/batch-api/updateBatch";
import { deleteBatch } from "../../lib/batch-api/deleteBatch";
import { createConfiguration } from "../../lib/configuration-api/createConfiguration";
import { deleteConfiguration } from "../../lib/configuration-api/deleteConfiguration";
import { updateConfiguration } from "../../lib/configuration-api/updateConfiguration";

interface Batch {
    batchId: number;
    batchName: string;
    budgetYear: number;
    deliveryYear: number;
    price: number;
    supplier: string;
    numberOfPackage: number;
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

const componentOptions = [
    "Server/Host PC",
    "Desktop PC",
    "Laptop",
    "Tablet PC",
    "Thin Client",
    "Switch/Hub",
    "TV",
    "Projector",
    "Speaker",
    "Printer",
    "Wireless Router",
    "UPS",
    "AVR",
    "Peripheral",
];

const DCPBatchSearch = () => {
    const [batches, setBatches] = useState<Batch[]>([]);
    const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
    const [activeTab, setActiveTab] = useState("DCP");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<
        "success" | "error"
    >("success");
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newBatchData, setNewBatchData] = useState<any>({
        batchName: "",
        budgetYear: "",
        deliveryYear: "",
        price: "",
        supplier: "",
        numberOfPackage: "",
        remarks: "",
        configurations: [],
    });

    const [newConfig, setNewConfig] = useState({
        item: "",
        type: "",
        quantity: "",
    });

    const [showDeleteBatchModal, setShowDeleteBatchModal] = useState(false);
    const [configIndexToRemove, setConfigIndexToRemove] = useState<
        number | null
    >(null);
    const [showRemoveConfigModal, setShowRemoveConfigModal] = useState(false);

    useEffect(() => {
        fetchBatches();
    }, []);

    const fetchBatches = async () => {
        setLoading(true); // Set loading to true when starting to fetch
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
        } finally {
            setLoading(false); // Set loading to false when fetching is complete (success or failure)
        }
    };

    const handleBatchSelect = (batchId: number) => {
        const batch = batches.find((b) => b.batchId === batchId) || null;
        setSelectedBatch(batch);
    };

    const handleCreateBatch = async (newBatchData: any): Promise<void> => {
        setLoading(true);

        try {
            console.log("Creating batch with data:", newBatchData);

            const newBatch = await createBatch(newBatchData);
            console.log("Batch created successfully:", newBatch);

            await fetchBatches(); // Refresh batch list after adding

            setSnackbarMessage("Batch created successfully!");
            setSnackbarSeverity("success");
            setOpenSnackbar(true);
        } catch (error) {
            console.error("Error creating batch:", error);
            setSnackbarMessage("Failed to create batch");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        } finally {
            setLoading(false);
        }
    };

    const handleAddBatch = () => {
        setIsModalOpen(true);
        setSnackbarMessage("Opening Add Batch Modal.");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
    };

    const handleUpdateBatch = async (): Promise<void> => {
        setLoading(true);

        try {
            if (selectedBatch === null) {
                console.error("No batch selected");
                setSnackbarMessage("Please select a batch before updating");
                setSnackbarSeverity("error");
                setOpenSnackbar(true);
                return;
            }

            console.log("Updating batch:", selectedBatch);

            // Call the updateBatch function from your batch-api
            const updatedBatch: Batch = await updateBatch(selectedBatch);
            console.log("Batch updated successfully:", updatedBatch);

            await fetchBatches();

            setSnackbarMessage("Batch updated successfully!");
            setSnackbarSeverity("success");
            setOpenSnackbar(true);
        } catch (error) {
            console.error("Error updating batch:", error);
            setSnackbarMessage("Failed to update batch");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBatch = async (): Promise<void> => {
        setLoading(true);

        try {
            if (selectedBatch === null) {
                console.error("No batch selected");
                setSnackbarMessage("Please select a batch before deleting");
                setSnackbarSeverity("error");
                setOpenSnackbar(true);
                return;
            }

            console.log("Deleting batch with ID:", selectedBatch);

            // Call the deleteBatch function from your batch-api
            await deleteBatch(selectedBatch?.batchId);
            console.log("Batch deleted successfully");

            await fetchBatches();

            setSelectedBatch(null);

            setSnackbarMessage("Batch deleted successfully!");
            setSnackbarSeverity("success");
            setOpenSnackbar(true);
        } catch (error) {
            console.error("Error deleting batch:", error);
            setSnackbarMessage("Failed to delete batch");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        } finally {
            setLoading(false);
        }
    };

    const handleAddConfig = async () => {
        // Basic validation for required fields
        if (!newConfig.item || !newConfig.type || !newConfig.quantity) {
            setSnackbarMessage("Please fill out all fields.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            return;
        }

        // Ensure quantity is a valid positive integer
        const quantity = Number(newConfig.quantity);
        if (isNaN(quantity) || quantity <= 0) {
            setSnackbarMessage("Quantity must be a positive number.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            return;
        }

        // Ensure a batch is selected
        if (!selectedBatch) {
            setSnackbarMessage("Please select a batch.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            return;
        }

        // Create the configuration object
        const tempConfig: Configuration = {
            id: {
                configurationId: Date.now(), // Keep Date.now() for unique ID
                batchId: selectedBatch.batchId,
            },
            item: newConfig.item,
            type: newConfig.type,
            quantity,
        };

        try {
            // Attempt to save the configuration
            const savedConfig = await createConfiguration(tempConfig);

            // Update the batch configurations
            const updatedConfigs = [
                ...selectedBatch.configurations,
                savedConfig,
            ];

            setSelectedBatch({
                ...selectedBatch,
                configurations: updatedConfigs,
            });

            // Clear the input fields
            setNewConfig({ item: "", type: "", quantity: "" });

            // Display success message
            setSnackbarMessage("Configuration added successfully.");
            setSnackbarSeverity("success");
            setOpenSnackbar(true);
        } catch (error) {
            console.error("Error creating configuration:", error); // Log the error for debugging
            setSnackbarMessage("Failed to create configuration.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        }
    };

    const handleUpdateConfig = async (index: number) => {
        if (!selectedBatch) return;

        const configToUpdate = selectedBatch.configurations[index];

        try {
            const updatedConfiguration = await updateConfiguration(
                configToUpdate
            );

            const updatedConfigs = [...selectedBatch.configurations];
            updatedConfigs[index] = updatedConfiguration;

            setSelectedBatch({
                ...selectedBatch,
                configurations: updatedConfigs,
            });

            setSnackbarMessage("Configuration updated successfully.");
            setSnackbarSeverity("success");
        } catch (error) {
            console.error("Error updating config:", error);
            setSnackbarMessage("Error occurred while updating configuration.");
            setSnackbarSeverity("error");
        }

        setOpenSnackbar(true);
    };

    const handleRemoveConfig = async (index: number) => {
        if (!selectedBatch) return;

        const configToDelete = selectedBatch.configurations[index];

        try {
            const success = await deleteConfiguration(
                configToDelete.id.configurationId,
                configToDelete.id.batchId
            );

            if (success) {
                const updatedConfigs = selectedBatch.configurations.filter(
                    (_, i) => i !== index
                );

                setSelectedBatch({
                    ...selectedBatch,
                    configurations: updatedConfigs,
                });

                setSnackbarMessage("Configuration removed successfully.");
                setSnackbarSeverity("success");
            } else {
                setSnackbarMessage("Failed to remove configuration.");
                setSnackbarSeverity("error");
            }
        } catch (error) {
            console.error("Error deleting config:", error);
            setSnackbarMessage("Error occurred while removing configuration.");
            setSnackbarSeverity("error");
        }

        setOpenSnackbar(true);
    };

    const handleRemoveNewConfig = (index: number) => {
        if (!newBatchData || !newBatchData.configurations) return;

        // Filter out the configuration to remove
        const updatedConfigs = newBatchData.configurations.filter(
            (_: any, i: number) => i !== index
        );

        // Directly update newBatchData with the filtered configurations
        setNewBatchData({
            ...newBatchData,
            configurations: updatedConfigs,
        });

        // Log the updated newBatchData to confirm the change
        console.log("Updated newBatchData:", {
            ...newBatchData,
            configurations: updatedConfigs,
        });

        setSnackbarMessage("Configuration removed successfully.");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
    };
    const data = [
        {
            label: "DCP",
            value: "DCP",
            icon: Square3Stack3DIcon,
            content: (
                <div className="w-full bg-white shadow-md rounded-lg p-6 flex flex-col h-1/2 overflow-auto">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">
                        DCP Batch Details
                    </h2>
                    <div className="grid grid-cols-3 gap-6 overflow-y-auto">
                        {[
                            {
                                label: "DCP Batch No.",
                                value: selectedBatch?.batchName || "",
                                key: "batchName",
                            },
                            {
                                label: "Budget Year",
                                value: selectedBatch?.budgetYear || "",
                                key: "budgetYear",
                            },
                            {
                                label: "Delivery Year",
                                value: selectedBatch?.deliveryYear || "",
                                key: "deliveryYear",
                            },
                            {
                                label: "Price per Package",
                                value: selectedBatch?.price || "",
                                key: "price",
                            },
                            {
                                label: "Supplier",
                                value: selectedBatch?.supplier || "",
                                key: "supplier",
                            },
                            {
                                label: "Remarks",
                                value: selectedBatch?.remarks || "",
                                key: "remarks",
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
                                    onChange={(e) => {
                                        const value = e.target.value;

                                        // Apply specific validations
                                        if (
                                            field.key === "budgetYear" ||
                                            field.key === "deliveryYear"
                                        ) {
                                            if (/^\d{0,4}$/.test(value)) {
                                                handleBatchDetailsChange(
                                                    e,
                                                    field.key
                                                );
                                            }
                                        } else if (field.key === "price") {
                                            if (/^\d*\.?\d*$/.test(value)) {
                                                handleBatchDetailsChange(
                                                    e,
                                                    field.key
                                                );
                                            }
                                        } else {
                                            handleBatchDetailsChange(
                                                e,
                                                field.key
                                            );
                                        }
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ),
        },
        {
            label: "Configurations",
            value: "Configurations",
            icon: UserCircleIcon,
            content: (
                <div className="w-full bg-white shadow-md rounded-lg p-4 flex flex-col h-[65vh]">
                    <h2 className="bg-gray-300 text-black p-3 text-center font-bold text-lg rounded-t-lg">
                        DCP Batch Items
                    </h2>
                    <div className="w-full overflow-y-auto  mt-4 text-black">
                        <table className="w-full text-left border border-separate border-slate-200 rounded-md overflow-auto">
                            <thead className="bg-slate-100 sticky top-0">
                                <tr>
                                    {[
                                        "Rec No.",
                                        "Item",
                                        "Type",
                                        "Quantity",
                                        "Actions",
                                    ].map((header) => (
                                        <th
                                            key={header}
                                            className="h-12 px-6 text-sm font-semibold border border-slate-300"
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {selectedBatch &&
                                selectedBatch.configurations.length > 0 ? (
                                    selectedBatch.configurations.map(
                                        (config, index) => (
                                            <tr
                                                key={
                                                    config.id.configurationId ||
                                                    index
                                                }
                                                className="border border-slate-300 hover:bg-emerald-100"
                                            >
                                                <td className="h-12 px-6 text-sm border border-slate-200">
                                                    {index + 1}
                                                </td>
                                                <td className="h-12 px-6 text-sm border border-slate-200">
                                                    <input
                                                        type="text"
                                                        className="w-full border border-gray-300 rounded-md p-2"
                                                        value={config.item}
                                                        onChange={(e) =>
                                                            handleConfigUpdate(
                                                                e,
                                                                index,
                                                                "item"
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td className="h-12 px-6 text-sm border border-slate-200">
                                                    <select
                                                        value={
                                                            config.type || ""
                                                        }
                                                        onChange={(e) =>
                                                            handleConfigUpdate(
                                                                e,
                                                                index,
                                                                "type"
                                                            )
                                                        }
                                                        className="w-full border border-gray-300 rounded-md p-2"
                                                    >
                                                        <option
                                                            value=""
                                                            disabled
                                                        >
                                                            Select Type
                                                        </option>
                                                        {componentOptions.map(
                                                            (option, idx) => (
                                                                <option
                                                                    key={idx}
                                                                    value={
                                                                        option
                                                                    }
                                                                >
                                                                    {option}
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                </td>
                                                <td className="h-12 px-6 text-sm border border-slate-200">
                                                    <input
                                                        type="number"
                                                        className="w-full border border-gray-300 rounded-md p-2"
                                                        value={config.quantity}
                                                        onChange={(e) =>
                                                            handleConfigUpdate(
                                                                e,
                                                                index,
                                                                "quantity"
                                                            )
                                                        }
                                                        min="1"
                                                    />
                                                </td>
                                                <td className="h-12 p-2 gap-2 text-sm border border-slate-200 text-center flex flex-row">
                                                    <button
                                                        onClick={() =>
                                                            handleUpdateConfig(
                                                                index
                                                            )
                                                        }
                                                        className="text-white bg-green-500 hover:bg-green-600 px-4 py-1 rounded-md"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setConfigIndexToRemove(
                                                                index
                                                            );
                                                            setShowRemoveConfigModal(
                                                                true
                                                            );
                                                        }}
                                                        className="text-white bg-red-500 hover:bg-red-600 px-4 py-1 rounded-md"
                                                    >
                                                        -
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    )
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="text-center text-sm text-gray-500 py-6"
                                        >
                                            Select a batch to see configuration
                                            details
                                        </td>
                                    </tr>
                                )}

                                {/* Add new configuration row */}
                                <tr className="bg-slate-50 border">
                                    <td className="h-12 px-6 text-sm border border-slate-200">
                                        New
                                    </td>
                                    <td className="h-12 px-6 text-sm border border-slate-200">
                                        <input
                                            type="text"
                                            className="w-full border border-gray-300 rounded-md p-2"
                                            value={newConfig.item}
                                            onChange={(e) =>
                                                setNewConfig((prev) => ({
                                                    ...prev,
                                                    item: e.target.value,
                                                }))
                                            }
                                            placeholder="Enter item"
                                        />
                                    </td>
                                    <td className="h-12 px-6 text-sm border border-slate-200">
                                        <select
                                            value={newConfig.type}
                                            onChange={(e) =>
                                                setNewConfig((prev) => ({
                                                    ...prev,
                                                    type: e.target.value,
                                                }))
                                            }
                                            className="w-full border border-gray-300 rounded-md p-2"
                                        >
                                            <option value="" disabled>
                                                Select Type
                                            </option>
                                            {componentOptions.map(
                                                (option, idx) => (
                                                    <option
                                                        key={idx}
                                                        value={option}
                                                    >
                                                        {option}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </td>
                                    <td className="h-12 px-6 text-sm border border-slate-200">
                                        <input
                                            type="number"
                                            className="w-full border border-gray-300 rounded-md p-2"
                                            value={newConfig.quantity}
                                            onChange={(e) =>
                                                setNewConfig((prev) => ({
                                                    ...prev,
                                                    quantity: e.target.value,
                                                }))
                                            }
                                            min="1"
                                            placeholder="Enter quantity"
                                        />
                                    </td>
                                    <td className="h-12 px-6 text-sm text-center border border-slate-200">
                                        <button
                                            onClick={handleAddConfig}
                                            className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-1 rounded-md"
                                        >
                                            +
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            ),
        },
    ];

    const handleBatchDetailsChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        key: string
    ) => {
        const value = e.target.value;

        if (selectedBatch) {
            setSelectedBatch({
                ...selectedBatch,
                [key]: value,
            });
        }
    };

    const handleConfigUpdate = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
        index: number,
        field: string
    ) => {
        const value = e.target.value;

        if (selectedBatch && selectedBatch.configurations) {
            const updatedConfigs = [...selectedBatch.configurations];
            updatedConfigs[index] = {
                ...updatedConfigs[index],
                [field]: value,
            };
            setSelectedBatch({
                ...selectedBatch,
                configurations: updatedConfigs,
            });
        }
    };

    const handleAddConfiguration = () => {
        if (!newConfig.item || !newConfig.type || !newConfig.quantity) {
            setSnackbarMessage("Please fill out all fields.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            return;
        }

        const newConfiguration: Configuration = {
            id: {
                configurationId: Date.now(), // temp unique ID
                batchId: newBatchData.batchId,
            },
            item: newConfig.item,
            type: newConfig.type,
            quantity: Number(newConfig.quantity),
        };

        const updatedConfigs = [
            ...newBatchData.configurations,
            newConfiguration,
        ];

        setNewBatchData({
            ...newBatchData,
            configurations: updatedConfigs,
        });

        setNewConfig({ item: "", type: "", quantity: "" });

        setSnackbarMessage("Configuration added successfully.");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
    };

    const handleConfigChange = (
        index: number,
        field: string,
        value: string
    ) => {
        const updatedConfigurations = [...newBatchData.configurations];
        updatedConfigurations[index][field] = value;
        setNewBatchData({
            ...newBatchData,
            configurations: updatedConfigurations,
        });
    };

    return (
        <div className="p-5 h-full flex items-center justify-evenly gap-6 w-full">
            <div className="flex flex-col w-3/5 gap-6 h-[85vh]">
                <div className="flex justify-evenly">
                    {[
                        {
                            text: "ADD",
                            color: "blue",
                            onClick: handleAddBatch,
                        },
                        {
                            text: "DELETE",
                            color: "red",
                            onClick: () => {
                                if (!selectedBatch) {
                                    setSnackbarMessage(
                                        "Please select a batch to delete."
                                    );
                                    setSnackbarSeverity("error");
                                    setOpenSnackbar(true);
                                } else {
                                    setShowDeleteBatchModal(true);
                                }
                            },
                        },
                        {
                            text: "UPDATE",
                            color: "amber",
                            onClick: handleUpdateBatch,
                        },
                    ].map((btn) => (
                        <Button
                            key={btn.text}
                            variant="filled"
                            color={btn.color as any}
                            className="h-12 w-auto text-white font-bold shadow-md rounded-lg transition-transform transform hover:scale-105"
                            onClick={btn.onClick}
                            placeholder=""
                            onPointerEnterCapture={() => {}}
                            onPointerLeaveCapture={() => {}}
                        >
                            {btn.text}
                        </Button>
                    ))}
                </div>

                <Tabs
                    value={activeTab}
                    onChange={(val: string) => setActiveTab(val)}
                >
                    <TabsHeader
                        className="sticky top-0 z-10 bg-gray-100 shadow-md p-1 max-w-xlg mx-auto rounded-xl flex justify-center"
                        placeholder=""
                        onPointerEnterCapture={() => {}}
                        onPointerLeaveCapture={() => {}}
                    >
                        {data.map(({ label, value, icon }) => (
                            <Tab
                                key={value}
                                value={value}
                                placeholder=""
                                onPointerEnterCapture={() => {}}
                                onPointerLeaveCapture={() => {}}
                            >
                                <div className="flex items-center gap-2 text-gray-800 w-full">
                                    {/* ✅ Always Show Icon */}
                                    {React.createElement(icon, {
                                        className: "w-5 h-5",
                                    })}
                                    {/* ✅ Hide Text on Mobile (sm:hidden), Show on Larger Screens */}
                                    <span className="hidden sm:block">
                                        {label}
                                    </span>
                                </div>
                            </Tab>
                        ))}
                    </TabsHeader>

                    {/* ✅ Fix: Ensure `TabPanel` Uses Matching `value` Keys */}
                    <TabsBody
                        className="p-4"
                        placeholder=""
                        onPointerEnterCapture={() => {}}
                        onPointerLeaveCapture={() => {}}
                    >
                        {data.map(({ value, content }) => (
                            <TabPanel
                                key={value}
                                value={value}
                                className="flex h-full w-full"
                            >
                                {/* ✅ Show `content` if available, otherwise show `desc` */}
                                {content}
                            </TabPanel>
                        ))}
                    </TabsBody>
                </Tabs>
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

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 text-black">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-xlg h-full overflow-y-scroll">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                            Add New Batch
                        </h2>
                        <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Batch Name */}
                            <div className="flex flex-col col-span-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Batch Name:
                                </label>
                                <input
                                    type="text"
                                    value={newBatchData.batchName || ""}
                                    onChange={(e) =>
                                        setNewBatchData({
                                            ...newBatchData,
                                            batchName: e.target.value,
                                        })
                                    }
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                />
                            </div>

                            {/* Budget Year */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">
                                    Budget Year:
                                </label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="\d{4}"
                                    maxLength={4}
                                    value={newBatchData.budgetYear || ""}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^\d{0,4}$/.test(value)) {
                                            setNewBatchData({
                                                ...newBatchData,
                                                budgetYear: value,
                                            });
                                        }
                                    }}
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                />
                            </div>

                            {/* Delivery Year */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">
                                    Delivery Year:
                                </label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="\d{4}"
                                    maxLength={4}
                                    value={newBatchData.deliveryYear || ""}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^\d{0,4}$/.test(value)) {
                                            setNewBatchData({
                                                ...newBatchData,
                                                deliveryYear: value,
                                            });
                                        }
                                    }}
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                />
                            </div>

                            {/* Price */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">
                                    Price:
                                </label>
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    value={newBatchData.price || ""}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^\d*\.?\d*$/.test(value)) {
                                            setNewBatchData({
                                                ...newBatchData,
                                                price: value,
                                            });
                                        }
                                    }}
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                />
                            </div>

                            {/* Supplier */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">
                                    Supplier:
                                </label>
                                <input
                                    type="text"
                                    value={newBatchData.supplier || ""}
                                    onChange={(e) =>
                                        setNewBatchData({
                                            ...newBatchData,
                                            supplier: e.target.value,
                                        })
                                    }
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                />
                            </div>

                            {/* Remarks */}
                            <div className="flex flex-col col-span-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Remarks:
                                </label>
                                <textarea
                                    value={newBatchData.remarks || ""}
                                    onChange={(e) =>
                                        setNewBatchData({
                                            ...newBatchData,
                                            remarks: e.target.value,
                                        })
                                    }
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                ></textarea>
                            </div>

                            <table className="w-full text-left border border-separate border-slate-200 rounded-md overflow-auto col-span-2">
                                <thead className="bg-slate-100 sticky top-0">
                                    <tr>
                                        {[
                                            "Rec No.",
                                            "Item",
                                            "Type",
                                            "Quantity",
                                            "Actions",
                                        ].map((header) => (
                                            <th
                                                key={header}
                                                className="h-12 px-6 text-sm font-semibold border border-slate-300"
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {newBatchData.configurations.length > 0 ? (
                                        newBatchData.configurations.map(
                                            (config: any, index: number) => (
                                                <tr
                                                    key={index}
                                                    className="border border-slate-300 hover:bg-emerald-100"
                                                >
                                                    <td className="h-12 px-6 text-sm border border-slate-200">
                                                        {index + 1}
                                                    </td>
                                                    <td className="h-12 px-6 text-sm border border-slate-200">
                                                        <input
                                                            type="text"
                                                            placeholder="Item"
                                                            value={
                                                                config.item ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleConfigChange(
                                                                    index,
                                                                    "item",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className="w-full border border-gray-300 rounded-md p-2"
                                                        />
                                                    </td>
                                                    <td className="h-12 px-6 text-sm border border-slate-200">
                                                        <select
                                                            value={
                                                                config.type ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleConfigChange(
                                                                    index,
                                                                    "type",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className="w-full border border-gray-300 rounded-md p-2"
                                                        >
                                                            <option
                                                                value=""
                                                                disabled
                                                            >
                                                                Select Type
                                                            </option>
                                                            {componentOptions.map(
                                                                (
                                                                    option,
                                                                    idx
                                                                ) => (
                                                                    <option
                                                                        key={
                                                                            idx
                                                                        }
                                                                        value={
                                                                            option
                                                                        }
                                                                    >
                                                                        {option}
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>
                                                    </td>
                                                    <td className="h-12 px-6 text-sm border border-slate-200">
                                                        <input
                                                            type="number"
                                                            placeholder="Quantity"
                                                            value={
                                                                config.quantity ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleConfigChange(
                                                                    index,
                                                                    "quantity",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            min="1"
                                                            className="w-full border border-gray-300 rounded-md p-2"
                                                        />
                                                    </td>
                                                    <td className="h-12 px-6 text-sm border border-slate-200 text-center">
                                                        <button
                                                            onClick={() =>
                                                                handleRemoveNewConfig(
                                                                    index
                                                                )
                                                            }
                                                            className="text-white bg-red-500 hover:bg-red-600 px-4 py-1 rounded-md"
                                                        >
                                                            -
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        )
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="text-center text-sm text-gray-500 py-6"
                                            >
                                                No configurations added yet.
                                            </td>
                                        </tr>
                                    )}

                                    {/* Add New Configuration Row */}
                                    <tr className="bg-slate-50 border">
                                        <td className="h-12 px-6 text-sm border border-slate-200">
                                            New
                                        </td>
                                        <td className="h-12 px-6 text-sm border border-slate-200">
                                            <input
                                                type="text"
                                                className="w-full border border-gray-300 rounded-md p-2"
                                                value={newConfig.item}
                                                onChange={(e) =>
                                                    setNewConfig((prev) => ({
                                                        ...prev,
                                                        item: e.target.value,
                                                    }))
                                                }
                                                placeholder="Enter item"
                                            />
                                        </td>
                                        <td className="h-12 px-6 text-sm border border-slate-200">
                                            <select
                                                value={newConfig.type}
                                                onChange={(e) =>
                                                    setNewConfig((prev) => ({
                                                        ...prev,
                                                        type: e.target.value,
                                                    }))
                                                }
                                                className="w-full border border-gray-300 rounded-md p-2"
                                            >
                                                <option value="" disabled>
                                                    Select Type
                                                </option>
                                                {componentOptions.map(
                                                    (option, idx) => (
                                                        <option
                                                            key={idx}
                                                            value={option}
                                                        >
                                                            {option}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </td>
                                        <td className="h-12 px-6 text-sm border border-slate-200">
                                            <input
                                                type="number"
                                                className="w-full border border-gray-300 rounded-md p-2"
                                                value={newConfig.quantity}
                                                onChange={(e) =>
                                                    setNewConfig((prev) => ({
                                                        ...prev,
                                                        quantity:
                                                            e.target.value,
                                                    }))
                                                }
                                                min="1"
                                                placeholder="Enter quantity"
                                            />
                                        </td>
                                        <td className="h-12 px-6 text-sm text-center border border-slate-200">
                                            <button
                                                onClick={handleAddConfiguration}
                                                className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-1 rounded-md"
                                            >
                                                +
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-100 px-4 py-2 rounded-md hover:bg-gray-100 bg-red-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    console.log("Batch Data:", newBatchData);
                                    handleCreateBatch(newBatchData);
                                    setIsModalOpen(false);
                                }}
                                className="ml-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}

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

            {loading && (
                <Box
                    sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        bgcolor: "rgba(255, 255, 255, 0.8)",
                        zIndex: 9999,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <CircularProgress />
                </Box>
            )}

            {/* Delete Batch Confirmation Modal */}
            {showDeleteBatchModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Delete Batch
                        </h2>
                        <p className="text-sm text-gray-600 mb-6">
                            Are you sure you want to delete this batch?
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowDeleteBatchModal(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    await handleDeleteBatch();
                                    setShowDeleteBatchModal(false);
                                }}
                                className="px-4 py-2 bg-red-500 text-white rounded-md"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Remove Config Confirmation Modal */}
            {showRemoveConfigModal && configIndexToRemove !== null && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Remove Configuration
                        </h2>
                        <p className="text-sm text-gray-600 mb-6">
                            Are you sure you want to remove this configuration?
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowRemoveConfigModal(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    await handleRemoveConfig(
                                        configIndexToRemove
                                    );
                                    setConfigIndexToRemove(null);
                                    setShowRemoveConfigModal(false);
                                }}
                                className="px-4 py-2 bg-red-500 text-white rounded-md"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DCPBatchSearch;
