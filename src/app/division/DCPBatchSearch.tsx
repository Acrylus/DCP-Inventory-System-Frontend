import { useEffect, useState } from "react";
import { getAllBatches } from "../../lib/batch-api/getAllBatch";
import { getAllSchools } from "../../lib/school-api/getAllSchool";
import { getSchoolBatchListByBatchId } from "../../lib/schoolbatchlist-api/getSchoolBatchListByBatchId";
import { getPackagesBySchoolBatchId } from "../../lib/package-api/getPackageBySchoolBatchId";
import { updateSchoolBatchListById } from "../../lib/schoolbatchlist-api/updateSchoolBatchList";
import { updatePackagesBySchoolBatch } from "../../lib/package-api/updatePackageBySchoolBatchId";
import { Alert, Box, CircularProgress, Snackbar } from "@mui/material";

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
    batch: Batch;
    school: School;
    deliveryDate: Date;
    numberOfPackage: number;
    status: string;
    keyStage: string;
    remarks: string;
    accountable: string;
    packages: Package[];
}

interface School {
    schoolRecordId: number;
    district: District;
    classification: string;
    schoolId: string;
    email: string;
    name: string;
    address: string;
    previousStation: string;
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
    id: Id;
    schoolBatchList: SchoolBatchList;
    configuration: Configuration;
    status: string;
    component: string;
    serialNumber: string;
    assigned: string;
    remarks: string;
}

interface Id {
    packageId: number;
    SchoolBatchListId: number;
}

interface District {
    districtId: number;
    name: string;
    division: Division;
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

const keyStageOptions = [
    "Kinder - Grade 3",
    "Grade 4-6",
    "Grade 7 - 10",
    "Teaching",
    "Non - Teaching",
];

const statusOptions = [
    "Unserviceable",
    "Serviceable",
    "Functional",
    "Non functional",
    "For relief of accountability",
];

const DCPBatchSearch = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
    const [batches, setBatches] = useState<Batch[]>([]);
    const [schoolBatchList, setSchoolBatchList] = useState<SchoolBatchList[]>(
        []
    );
    const [loading, setLoading] = useState(false);
    const [selectedSchoolBatchList, setSelectedSchoolBatchList] =
        useState<SchoolBatchList | null>(null);
    const [packages, setPackages] = useState<Package[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [schools, setSchools] = useState<School[]>([]);

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<
        "success" | "error"
    >("success");

    useEffect(() => {
        const fetchSchools = async () => {
            setLoading(true); // Start loading
            try {
                const data: School[] = await getAllSchools();
                setSchools(data);
            } catch (error) {
                console.error("Error fetching schools:", error);
            } finally {
                setLoading(false); // Stop loading
            }
        };
        fetchSchools();
    }, []);

    useEffect(() => {
        const fetchBatches = async () => {
            setLoading(true); // Start loading
            try {
                const data = await getAllBatches();
                console.log("Fetched batches:", data);

                if (!Array.isArray(data)) {
                    console.error(
                        "Invalid data format: expected an array",
                        data
                    );
                    setBatches([]);
                    return;
                }

                const transformedData: Batch[] = data.map((item: any) => ({
                    ...item,
                    schoolBatchList: item.schoolBatchList || [],
                    configurations: item.configurations || [],
                }));

                setBatches(transformedData);
            } catch (error) {
                console.error("Failed to fetch batches:", error);
                setBatches([]);
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchBatches();
    }, []);

    const fetchSchoolBatchList = async (batchId?: number) => {
        if (!batchId) {
            console.warn("Batch ID is missing or invalid");
            setSchoolBatchList([]);
            return;
        }

        try {
            setLoading(true);
            const data = await getSchoolBatchListByBatchId(batchId);
            console.log(
                `Fetched school batch list for batch ${batchId}:`,
                data
            );
            setSchoolBatchList(data || []);
        } catch (error) {
            console.error("Failed to fetch school batch list:", error);
            setSchoolBatchList([]);
        } finally {
            setLoading(false);
        }
    };

    const handleBatchSelection = (batch: Batch | null) => {
        if (loading) {
            console.warn("Data is still loading. Please wait...");
            setSnackbarMessage("Data is still loading. Please wait...");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            return;
        }

        if (!batch) {
            console.warn("No batch selected.");
            setSchoolBatchList([]);
            setSnackbarMessage("No batch selected.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            return;
        }

        console.log("BATCH SELECTED", batch);

        setSelectedBatch(batch);
        fetchSchoolBatchList(batch.batchId);

        setSnackbarMessage("Batch selected successfully.");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
    };

    const handleSelectSchoolBatchList = async (
        schoolBatchList: SchoolBatchList
    ) => {
        setSelectedSchoolBatchList(schoolBatchList);
        setShowModal(true);

        // Set loading state to true
        setLoading(true);

        // Show loading message in Snackbar
        setSnackbarMessage("Loading packages...");
        setSnackbarSeverity("success"); // Change severity to "info" to indicate loading
        setOpenSnackbar(true);

        try {
            const packagesData = await getPackagesBySchoolBatchId(
                schoolBatchList.schoolBatchId
            );
            console.log("Fetched packages:", packagesData);

            // Set packages data
            setPackages(Array.isArray(packagesData) ? packagesData : []);

            // Show success message in Snackbar
            setSnackbarMessage("Packages loaded successfully.");
            setSnackbarSeverity("success");
        } catch (error) {
            console.error("Failed to fetch packages:", error);

            // Show error message in Snackbar
            setSnackbarMessage("Failed to load packages.");
            setSnackbarSeverity("error");
            setPackages([]);
        } finally {
            // Set loading to false and ensure Snackbar closes after message
            setLoading(false);
            setOpenSnackbar(true); // Open Snackbar with final message
        }
    };

    const handleSaveChanges = async () => {
        if (!selectedSchoolBatchList) return;

        console.log(selectedSchoolBatchList);

        // Set loading to true to disable interactions during saving process
        setLoading(true);

        try {
            // Show loading message in Snackbar
            setSnackbarMessage("Saving changes...");
            setSnackbarSeverity("success"); // Use info severity for loading
            setOpenSnackbar(true);

            // Update the school batch and packages
            await updateSchoolBatchListById(
                selectedSchoolBatchList.schoolBatchId,
                selectedSchoolBatchList
            );
            await updatePackagesBySchoolBatch(
                selectedSchoolBatchList.schoolBatchId,
                packages
            );

            // Show success message after saving
            console.log("Changes saved successfully");
            setSnackbarMessage("Changes saved successfully.");
            setSnackbarSeverity("success");
        } catch (error) {
            console.error("Failed to save changes", error);

            // Show error message if saving fails
            setSnackbarMessage("Failed to save changes.");
            setSnackbarSeverity("error");
        } finally {
            // Set loading to false after operation completes
            setLoading(false);
            setOpenSnackbar(true); // Ensure Snackbar is displayed
        }
    };

    const handleSchoolChange = (schoolRecordId: number) => {
        const selectedSchool = schools.find(
            (school) => school.schoolRecordId === schoolRecordId
        );

        if (selectedSchool) {
            setSelectedSchoolBatchList((prev) => {
                if (!prev) return null;
                return { ...prev, school: selectedSchool };
            });

            // Show success snackbar
            setSnackbarMessage(`School ${selectedSchool.name} selected.`);
            setSnackbarSeverity("success");
            setOpenSnackbar(true); // Open the Snackbar
        } else {
            // Show error snackbar if no school found
            setSnackbarMessage("School not found.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true); // Open the Snackbar
        }
    };

    const handleBatchChange = (batchId: number) => {
        const selectedBatch = batches.find(
            (batch) => batch.batchId === batchId
        );

        if (selectedBatch) {
            setSelectedSchoolBatchList((prev) => {
                if (!prev) return null;
                return { ...prev, batch: selectedBatch };
            });

            // Show success snackbar
            setSnackbarMessage(`Batch ${selectedBatch.batchName} selected.`);
            setSnackbarSeverity("success");
            setOpenSnackbar(true); // Open the Snackbar
        } else {
            // Show error snackbar if no batch found
            setSnackbarMessage("Batch not found.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true); // Open the Snackbar
        }
    };

    const handleDeliveryDateChange = (dateString: string) => {
        const parsedDate = new Date(dateString);

        setSelectedSchoolBatchList((prev) => {
            if (!prev) return null;
            return { ...prev, deliveryDate: parsedDate };
        });

        // Show success snackbar for delivery date change
        setSnackbarMessage(
            `Delivery date set to ${parsedDate.toLocaleDateString()}.`
        );
        setSnackbarSeverity("success");
        setOpenSnackbar(true); // Open the Snackbar
    };

    const handlePackagesChange = (packages: string) => {
        setSelectedSchoolBatchList((prev) => {
            if (!prev) return null;
            return { ...prev, numberOfPackage: Number(packages) }; // Convert to number
        });
    };

    const handleKeyStageChange = (key: string) => {
        setSelectedSchoolBatchList((prev) => {
            if (!prev) return null;
            return { ...prev, keyStage: key };
        });
    };

    const handleRemarksChange = (remarks: string) => {
        setSelectedSchoolBatchList((prev) => {
            if (!prev) return null;
            return { ...prev, remarks: remarks };
        });
    };

    const handleStatusChange = (status: string) => {
        setSelectedSchoolBatchList((prev) => {
            if (!prev) return null;
            return { ...prev, status: status };
        });
    };

    const handleAccountableChange = (accountable: string) => {
        setSelectedSchoolBatchList((prev) => {
            if (!prev) return null;
            return { ...prev, accountable: accountable };
        });
    };

    const handleInputChange = (
        index: number,
        field: keyof Package,
        value: any
    ) => {
        setPackages((prevPackages) => {
            return prevPackages.map((pkg, i) =>
                i === index ? { ...pkg, [field]: value } : pkg
            );
        });
    };

    return (
        <div className="w-full p-8 text-black flex flex-col h-[85%]">
            {/* Search Bar */}
            <div className="relative mb-6">
                <input
                    type="search"
                    placeholder="Search Batch"
                    className="w-full h-10 px-4 pr-12 text-sm border-b border-slate-200 focus:border-emerald-500 outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Two-Column Layout */}
            <div className="flex gap-4 h-[70vh]">
                {/* Batch List (Left Table - 1/3 Width) */}
                <div className="w-1/3 border rounded-lg p-4 overflow-auto">
                    <h2 className="text-lg font-bold mb-3">Batch List</h2>
                    <div className="overflow-auto">
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
                                {batches.map((batch, index) => (
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
                    <div className="overflow-auto">
                        <table className="w-full border-collapse border border-slate-200">
                            <thead>
                                <tr className="bg-slate-100">
                                    <th className="px-4 py-2 border border-slate-300">
                                        Division
                                    </th>
                                    <th className="px-4 py-2 border border-slate-300">
                                        District
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
                                        <tr
                                            key={sbl.schoolBatchId}
                                            className="cursor-pointer hover:bg-gray-200"
                                            onClick={() =>
                                                handleSelectSchoolBatchList(sbl)
                                            }
                                        >
                                            <td className="px-4 py-2 border border-slate-300">
                                                {sbl.school?.district.division
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
                                            No schools found for this batch.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showModal && selectedSchoolBatchList && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-6xl h-[80%] overflow-auto">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            School Details
                        </h2>

                        <div className="grid grid-cols-3 gap-4 mt-2">
                            {/* Division (Disabled Input) */}
                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    Division
                                </label>
                                <input
                                    type="text"
                                    value={
                                        selectedSchoolBatchList.school.district
                                            .division.division || ""
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-200"
                                    disabled
                                />
                            </div>

                            {/* District (Disabled Input) */}
                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    District
                                </label>
                                <input
                                    type="text"
                                    value={
                                        selectedSchoolBatchList?.school
                                            ?.district?.name || ""
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-200"
                                    disabled
                                />
                            </div>

                            {/* School (Dropdown) */}
                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    School
                                </label>
                                <select
                                    value={
                                        selectedSchoolBatchList?.school
                                            ?.schoolRecordId || ""
                                    }
                                    onChange={(
                                        e: React.ChangeEvent<HTMLSelectElement>
                                    ) =>
                                        handleSchoolChange(
                                            Number(e.target.value)
                                        )
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-md bg-white"
                                >
                                    {schools.map((school) => (
                                        <option
                                            key={school.schoolRecordId}
                                            value={school.schoolRecordId}
                                        >
                                            {school.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Batch (Dropdown) */}
                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    Batch
                                </label>
                                <select
                                    value={
                                        selectedSchoolBatchList?.batch
                                            ?.batchId || ""
                                    }
                                    onChange={(e) =>
                                        handleBatchChange(
                                            Number(e.target.value)
                                        )
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-md bg-white"
                                >
                                    {batches.map((batch) => (
                                        <option
                                            key={batch.batchId}
                                            value={batch.batchId}
                                        >
                                            {batch.batchName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Delivery Date (Editable Input) */}
                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    Delivery Date
                                </label>
                                <input
                                    type="date"
                                    value={
                                        selectedSchoolBatchList?.deliveryDate
                                            ? selectedSchoolBatchList.deliveryDate
                                                  .toISOString()
                                                  .split("T")[0] // Convert to YYYY-MM-DD
                                            : ""
                                    }
                                    onChange={
                                        (e) =>
                                            handleDeliveryDateChange(
                                                e.target.value
                                            ) // Ensure the value is passed as a string
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    inputMode="none"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    Packages
                                </label>
                                <input
                                    type="number"
                                    value={
                                        selectedSchoolBatchList?.numberOfPackage ||
                                        ""
                                    }
                                    onChange={(e) => {
                                        const value = Math.max(
                                            1,
                                            Number(e.target.value)
                                        );
                                        handlePackagesChange(value.toString());
                                    }}
                                    min="1"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    Key Stage
                                </label>
                                <select
                                    value={
                                        selectedSchoolBatchList?.keyStage || ""
                                    }
                                    onChange={(e) =>
                                        handleKeyStageChange(e.target.value)
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-md bg-white"
                                >
                                    {keyStageOptions.map((stage) => (
                                        <option key={stage} value={stage}>
                                            {stage}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    Status
                                </label>
                                <input
                                    value={
                                        selectedSchoolBatchList?.status || ""
                                    }
                                    onChange={(e) =>
                                        handleStatusChange(e.target.value)
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                ></input>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    Accountable
                                </label>
                                <input
                                    value={
                                        selectedSchoolBatchList?.accountable ||
                                        ""
                                    }
                                    onChange={(e) =>
                                        handleAccountableChange(e.target.value)
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                ></input>
                            </div>

                            <div className="col-span-3">
                                <label className="text-sm font-medium text-gray-600">
                                    Remarks
                                </label>
                                <input
                                    type="text"
                                    value={
                                        selectedSchoolBatchList?.remarks || ""
                                    }
                                    onChange={(e) =>
                                        handleRemarksChange(e.target.value)
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto mt-4">
                            <table className="w-full border border-gray-200 rounded-lg">
                                <thead>
                                    <tr className="bg-gray-100 text-gray-700">
                                        <th className="px-4 py-3 text-sm font-medium border border-gray-300 text-center">
                                            Number
                                        </th>
                                        <th className="px-4 py-3 text-sm font-medium border border-gray-300">
                                            Item
                                        </th>
                                        <th className="px-4 py-3 text-sm font-medium border border-gray-300">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 text-sm font-medium border border-gray-300">
                                            Serial Number
                                        </th>
                                        <th className="px-4 py-3 text-sm font-medium border border-gray-300">
                                            Assigned
                                        </th>
                                        <th className="px-4 py-3 text-sm font-medium border border-gray-300">
                                            Remarks
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {packages.map((pkg, index) => (
                                        <tr
                                            key={pkg.id.packageId}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-4 py-3 border border-gray-300 text-center">
                                                {index + 1}
                                            </td>

                                            {/* Item (Read-only) */}
                                            <td className="px-4 py-3 border border-gray-300">
                                                <input
                                                    type="text"
                                                    value={
                                                        pkg.configuration
                                                            .item ?? ""
                                                    }
                                                    readOnly
                                                    className="w-full px-2 py-1 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                                                />
                                            </td>

                                            <td className="px-4 py-3 border border-gray-300">
                                                <select
                                                    value={pkg.status ?? ""}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            index,
                                                            "status",
                                                            e.target.value
                                                        )
                                                    }
                                                    disabled={
                                                        pkg.status ===
                                                        "For relief of accountability"
                                                    }
                                                    className={`w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                                                        pkg.status ===
                                                        "For relief of accountability"
                                                            ? "bg-gray-100 cursor-not-allowed"
                                                            : ""
                                                    }`}
                                                >
                                                    {statusOptions.map(
                                                        (option) => (
                                                            <option
                                                                key={option}
                                                                value={option}
                                                            >
                                                                {option}
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                            </td>

                                            {/* Serial Number (Editable) */}
                                            <td className="px-4 py-3 border border-gray-300">
                                                <input
                                                    type="text"
                                                    value={
                                                        pkg.serialNumber ?? ""
                                                    }
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            index,
                                                            "serialNumber",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                />
                                            </td>

                                            {/* Assigned (Editable) */}
                                            <td className="px-4 py-3 border border-gray-300">
                                                <input
                                                    type="text"
                                                    value={pkg.assigned ?? ""}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            index,
                                                            "assigned",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                />
                                            </td>

                                            {/* Remarks (Editable) */}
                                            <td className="px-4 py-3 border border-gray-300">
                                                <input
                                                    type="text"
                                                    value={pkg.remarks ?? ""}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            index,
                                                            "remarks",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Close Button */}
                        <div className="mt-6 flex justify-end space-x-4">
                            <button
                                className="px-5 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition"
                                onClick={handleSaveChanges}
                            >
                                Update
                            </button>
                            <button
                                className="px-5 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition"
                                onClick={() => setShowModal(false)}
                            >
                                Close
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
        </div>
    );
};

export default DCPBatchSearch;
