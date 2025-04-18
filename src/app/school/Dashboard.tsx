import { useEffect, useState } from "react";
import { getSchoolBatchListBySchoolRecordId } from "../../lib/schoolbatchlist-api/getSchoolBatchListBySchoolRecordId";
import { Card, Typography } from "@material-tailwind/react";
import { useUserInfo } from "../../store/UserInfoStore";
import { getPackagesBySchoolBatchId } from "../../lib/package-api/getPackageBySchoolBatchId";
import { updatePackagesBySchoolBatch } from "../../lib/package-api/updatePackageBySchoolBatchId";
import image from "../../assets/images/DCP Packages.png";
import { Alert, Box, CircularProgress, Snackbar } from "@mui/material";
import * as XLSX from "xlsx";

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

interface SchoolBatchList {
    schoolBatchId: number;
    batch: Batch;
    school: School;
    deliveryDate: string;
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

interface District {
    districtId: number;
    name: string;
    division: Division;
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

const statusOptions = [
    "UNSERVICEABLE",
    "SERVICEABLE",
    "FUNCTIONAL",
    "NON FUNCTIONAL",
];

const Dashboard = () => {
    const [schoolBatchList, setSchoolBatchList] = useState<SchoolBatchList[]>(
        []
    );
    const [loading, setLoading] = useState(false);

    const { userInfo } = useUserInfo();

    const [packages, setPackages] = useState<Package[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedSchoolBatchList, setSelectedSchoolBatchList] =
        useState<SchoolBatchList | null>(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<
        "success" | "error"
    >("success");

    const [openSummaryModal, setOpenSummaryModal] = useState(false);
    const [summaryData, setSummaryData] = useState<SchoolBatchList[]>([]);

    useEffect(() => {
        fetchSchoolBatchList(userInfo.referenceId); // Example ID, replace accordingly
    }, []);

    const fetchSchoolBatchList = async (schoolRecordId?: number) => {
        if (!schoolRecordId) {
            console.warn("School Record Id is missing or invalid");
            setSchoolBatchList([]);
            return;
        }

        try {
            setLoading(true);
            const data = await getSchoolBatchListBySchoolRecordId(
                schoolRecordId
            );
            console.log(
                `Fetched school batch list for batch ${schoolRecordId}:`,
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

    const handleSelectSchoolBatchList = async (
        schoolBatchList: SchoolBatchList
    ) => {
        setSelectedSchoolBatchList(schoolBatchList);
        setShowModal(true);
        setLoading(true);

        try {
            const packagesData = await getPackagesBySchoolBatchId(
                schoolBatchList.schoolBatchId
            );
            console.log("Fetched packages:", packagesData);
            setPackages(Array.isArray(packagesData) ? packagesData : []);

            setSnackbarMessage("Packages loaded successfully.");
            setSnackbarSeverity("success");
        } catch (error) {
            console.error("Failed to fetch packages:", error);
            setPackages([]);

            setSnackbarMessage("Failed to load packages.");
            setSnackbarSeverity("error");
        } finally {
            setOpenSnackbar(true);
            setLoading(false);
        }
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

    const handleSaveChanges = async () => {
        if (!selectedSchoolBatchList) return;

        setLoading(true);
        try {
            await updatePackagesBySchoolBatch(
                selectedSchoolBatchList.schoolBatchId,
                packages
            );
            console.log("Changes saved successfully", packages);

            setSnackbarMessage("Changes saved successfully!");
            setSnackbarSeverity("success");
        } catch (error) {
            console.error("Failed to save changes", error);
            setSnackbarMessage("Failed to save changes.");
            setSnackbarSeverity("error");
        } finally {
            setOpenSnackbar(true);
            setLoading(false);
        }
    };

    const handleOpenSummaryModal = async () => {
        try {
            setLoading(true);
            const enrichedData = await Promise.all(
                schoolBatchList.map(async (schoolBatch) => {
                    const packages = await getPackagesBySchoolBatchId(
                        schoolBatch.schoolBatchId
                    );
                    return {
                        ...schoolBatch,
                        packages,
                    };
                })
            );
            setSummaryData(enrichedData);
            setOpenSummaryModal(true);
        } catch (error) {
            console.error("Error fetching summary packages:", error);
            setSnackbarMessage("Failed to load summary data.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        } finally {
            setLoading(false);
        }
    };

    const exportSummaryToExcel = () => {
        const exportData = summaryData.flatMap((schoolBatch) =>
            (schoolBatch.packages || []).map((pkg) => ({
                Batch: schoolBatch.batch.batchName || "-",
                Item: pkg.configuration?.item || "-",
                Type: pkg.configuration?.type || "-",
                Component: pkg.component || "-",
                Quantity: pkg.configuration?.quantity ?? "-",
                Remarks: pkg.remarks || "-",
            }))
        );

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "DCP Summary");

        XLSX.writeFile(wb, "DCP_Package_Summary.xlsx");
    };

    return (
        <div className="w-full mx-auto p-4">
            <div className="flex items-center justify-between mb-4">
                <Typography
                    variant="h4"
                    color="blue-gray"
                    className="text-black"
                    placeholder=""
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                >
                    DCP Packages
                </Typography>

                <button
                    onClick={handleOpenSummaryModal}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                    Summary
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center">
                    Loading...
                </div>
            ) : (
                <div className="w-full pt-20">
                    <div className="flex gap-6 h-full items-center px-4 overflow-x-auto">
                        {" "}
                        {/* Adjust height if needed */}
                        {schoolBatchList.length > 0 ? (
                            schoolBatchList.map((sbl) => (
                                <Card
                                    placeholder=""
                                    onPointerEnterCapture={() => {}}
                                    onPointerLeaveCapture={() => {}}
                                    key={sbl.schoolBatchId}
                                    className="w-64 min-w-64 h-full flex flex-col rounded-xl overflow-hidden border border-gray-200 cursor-pointer"
                                    onClick={() =>
                                        handleSelectSchoolBatchList(sbl)
                                    }
                                >
                                    <div className="h-1/3 bg-black">
                                        <img
                                            src={image}
                                            alt="Batch"
                                            className="object-contain w-full h-full"
                                        />
                                    </div>

                                    <div className="px-4 py-3 bg-white text-center flex-grow">
                                        <h2 className="text-lg font-bold text-black">
                                            {sbl.batch.batchName}
                                        </h2>
                                        <p className="text-sm text-gray-700">
                                            {sbl.batch.deliveryYear} •{" "}
                                            {sbl.batch.supplier}
                                        </p>
                                    </div>

                                    <div className="bg-blue-700 text-white text-center py-2">
                                        <p className="font-bold text-sm">
                                            No. of Packages
                                        </p>
                                        <p className="text-2xl font-bold text-yellow-400">
                                            {sbl.numberOfPackage}
                                        </p>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <Typography
                                placeholder=""
                                onPointerEnterCapture={() => {}}
                                onPointerLeaveCapture={() => {}}
                                color="red"
                                className="text-center"
                            >
                                No school batches found.
                            </Typography>
                        )}
                    </div>
                </div>
            )}

            {showModal && selectedSchoolBatchList && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm text-black">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-6xl h-[80%] overflow-auto">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            School Details
                        </h2>

                        <div className="grid grid-cols-3 gap-4 mt-2">
                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    Division
                                </label>
                                <input
                                    type="text"
                                    value={
                                        selectedSchoolBatchList?.school.district
                                            ?.division?.division || ""
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-200"
                                    disabled
                                />
                            </div>
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
                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    School Name
                                </label>
                                <input
                                    type="text"
                                    value={
                                        selectedSchoolBatchList?.school?.name ||
                                        ""
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-200"
                                    disabled
                                />
                            </div>

                            {/* Batch (Dropdown) */}
                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    Batch
                                </label>
                                <input
                                    value={
                                        selectedSchoolBatchList?.batch
                                            ?.batchName || ""
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-200"
                                    disabled
                                ></input>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    Delivery Date
                                </label>
                                <input
                                    type="date"
                                    value={
                                        selectedSchoolBatchList?.deliveryDate ||
                                        ""
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-200"
                                    disabled
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
                                    readOnly
                                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-200"
                                    disabled
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    Key Stage
                                </label>
                                <input
                                    value={
                                        selectedSchoolBatchList?.keyStage || ""
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-200"
                                    disabled
                                ></input>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    Status
                                </label>
                                <input
                                    value={
                                        selectedSchoolBatchList?.status || ""
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-200"
                                    disabled
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
                                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-200"
                                    disabled
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
                                    readOnly
                                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-200"
                                    disabled
                                />
                            </div>
                        </div>

                        {/* Modernized Table */}
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
                                            key={`${pkg.id.packageId}-${index}`}
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
                        <div className="mt-6 flex justify-end">
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

            {openSummaryModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 text-black">
                    <div className="bg-white w-full max-w-4xl p-6 rounded-lg shadow-lg overflow-y-auto max-h-[80vh] flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">
                                DCP Package Summary
                            </h2>
                        </div>

                        {summaryData.length === 0 ? (
                            <p>No batches found.</p>
                        ) : (
                            summaryData.map((schoolBatch) => (
                                <div
                                    key={schoolBatch.schoolBatchId}
                                    className="mb-6"
                                >
                                    <h3 className="text-lg font-semibold mb-2">
                                        DCP: {schoolBatch.batch.batchName}
                                    </h3>
                                    <table className="w-full border border-collapse text-sm">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="border px-4 py-2">
                                                    Item
                                                </th>
                                                <th className="border px-4 py-2">
                                                    Type
                                                </th>
                                                <th className="border px-4 py-2">
                                                    Component
                                                </th>
                                                <th className="border px-4 py-2">
                                                    Quantity
                                                </th>
                                                <th className="border px-4 py-2">
                                                    Status
                                                </th>
                                                <th className="border px-4 py-2">
                                                    Serial Number
                                                </th>
                                                <th className="border px-4 py-2">
                                                    Assigned
                                                </th>
                                                <th className="border px-4 py-2">
                                                    Remarks
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(schoolBatch.packages || []).map(
                                                (
                                                    pkg: Package,
                                                    index: number
                                                ) => (
                                                    <tr key={index}>
                                                        <td className="border px-4 py-2">
                                                            {pkg.configuration
                                                                ?.item || "-"}
                                                        </td>
                                                        <td className="border px-4 py-2">
                                                            {pkg.configuration
                                                                ?.type || "-"}
                                                        </td>
                                                        <td className="border px-4 py-2">
                                                            {pkg.component ||
                                                                "-"}
                                                        </td>
                                                        <td className="border px-4 py-2">
                                                            {pkg.configuration
                                                                ?.quantity ??
                                                                "-"}
                                                        </td>
                                                        <td className="border px-4 py-2">
                                                            {pkg.status || "-"}
                                                        </td>
                                                        <td className="border px-4 py-2">
                                                            {pkg.serialNumber ||
                                                                "-"}
                                                        </td>
                                                        <td className="border px-4 py-2">
                                                            {pkg.assigned ||
                                                                "-"}
                                                        </td>
                                                        <td className="border px-4 py-2">
                                                            {pkg.remarks || "-"}
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            ))
                        )}

                        {/* Buttons at the bottom */}
                        <div className="mt-auto pt-4 flex justify-end gap-3">
                            <button
                                onClick={exportSummaryToExcel}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                Export to Excel
                            </button>
                            <button
                                onClick={() => setOpenSummaryModal(false)}
                                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
