import { useEffect, useState } from "react";
import { getSchoolBatchListBySchoolRecordId } from "../../lib/schoolbatchlist-api/getSchoolBatchListBySchoolRecordId";
import {
    Card,
    CardBody,
    Chip,
    Spinner,
    Typography,
} from "@material-tailwind/react";
import { useUserInfo } from "../../store/UserInfoStore";
import { getPackagesBySchoolBatchId } from "../../lib/package-api/getPackageBySchoolBatchId";
import { updatePackagesBySchoolBatch } from "../../lib/package-api/updatePackageBySchoolBatchId";

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

        try {
            const packagesData = await getPackagesBySchoolBatchId(
                schoolBatchList.schoolBatchId
            );
            console.log("Fetched packages:", packagesData);
            setPackages(Array.isArray(packagesData) ? packagesData : []);
        } catch (error) {
            console.error("Failed to fetch packages:", error);
            setPackages([]);
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
        console.log("saving", packages);
        try {
            await updatePackagesBySchoolBatch(
                selectedSchoolBatchList.schoolBatchId,
                packages
            );
            console.log("Changes saved successfully", packages);
        } catch (error) {
            console.error("Failed to save changes", error);
        }
    };

    return (
        <div className="p-6">
            <Typography
                variant="h4"
                color="blue-gray"
                className="mb-4"
                placeholder=""
                onPointerEnterCapture={() => {}}
                onPointerLeaveCapture={() => {}}
            >
                School Batch List
            </Typography>
            {loading ? (
                <div className="flex justify-center items-center">
                    <Spinner
                        className="h-10 w-10 text-blue-500"
                        onPointerEnterCapture={() => {}}
                        onPointerLeaveCapture={() => {}}
                    />
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {schoolBatchList.length > 0 ? (
                        schoolBatchList.map((sbl) => (
                            <Card
                                key={sbl.schoolBatchId}
                                shadow={true}
                                className="p-4 border border-gray-200"
                                placeholder=""
                                onPointerEnterCapture={() => {}}
                                onPointerLeaveCapture={() => {}}
                                onClick={() => handleSelectSchoolBatchList(sbl)}
                            >
                                <CardBody
                                    placeholder=""
                                    onPointerEnterCapture={() => {}}
                                    onPointerLeaveCapture={() => {}}
                                >
                                    <Typography
                                        variant="h6"
                                        color="blue-gray"
                                        placeholder=""
                                        onPointerEnterCapture={() => {}}
                                        onPointerLeaveCapture={() => {}}
                                    >
                                        {sbl.school.name}
                                    </Typography>
                                    <Typography
                                        variant="small"
                                        className="text-gray-500"
                                        placeholder=""
                                        onPointerEnterCapture={() => {}}
                                        onPointerLeaveCapture={() => {}}
                                    >
                                        {sbl.school.address}
                                    </Typography>
                                    <hr className="my-3" />
                                    <Typography
                                        variant="small"
                                        color="gray"
                                        className="font-semibold"
                                        placeholder=""
                                        onPointerEnterCapture={() => {}}
                                        onPointerLeaveCapture={() => {}}
                                    >
                                        Batch:{" "}
                                        <span className="text-blue-500">
                                            {sbl.batch.batchName}
                                        </span>
                                    </Typography>
                                    <Typography
                                        variant="small"
                                        color="gray"
                                        placeholder=""
                                        onPointerEnterCapture={() => {}}
                                        onPointerLeaveCapture={() => {}}
                                    >
                                        Budget Year:{" "}
                                        <span className="font-medium">
                                            {sbl.batch.budgetYear}
                                        </span>
                                    </Typography>
                                    <Typography
                                        variant="small"
                                        color="gray"
                                        placeholder=""
                                        onPointerEnterCapture={() => {}}
                                        onPointerLeaveCapture={() => {}}
                                    >
                                        Delivery Year:{" "}
                                        <span className="font-medium">
                                            {sbl.batch.deliveryYear}
                                        </span>
                                    </Typography>
                                    <Typography
                                        variant="small"
                                        color="gray"
                                        placeholder=""
                                        onPointerEnterCapture={() => {}}
                                        onPointerLeaveCapture={() => {}}
                                    >
                                        Supplier:{" "}
                                        <span className="font-medium">
                                            {sbl.batch.supplier}
                                        </span>
                                    </Typography>
                                    <Typography
                                        variant="small"
                                        color="gray"
                                        placeholder=""
                                        onPointerEnterCapture={() => {}}
                                        onPointerLeaveCapture={() => {}}
                                    >
                                        No. of Packages:{" "}
                                        <span className="font-medium">
                                            {sbl.numberOfPackage}
                                        </span>
                                    </Typography>
                                    <div className="mt-3">
                                        <Chip
                                            variant="gradient"
                                            color={
                                                sbl.status === "Delivered"
                                                    ? "green"
                                                    : "red"
                                            }
                                            value={sbl.status}
                                        />
                                    </div>
                                </CardBody>
                            </Card>
                        ))
                    ) : (
                        <Typography
                            color="red"
                            className="text-center"
                            placeholder=""
                            onPointerEnterCapture={() => {}}
                            onPointerLeaveCapture={() => {}}
                        >
                            No school batches found.
                        </Typography>
                    )}
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
        </div>
    );
};

export default Dashboard;
