import { useEffect, useState } from "react";
import { getAllPackage } from "../../lib/package-api/getAllPackage";
import { Box, CircularProgress } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { useUserInfo } from "../../store/UserInfoStore";

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
    division: Division;
    name: string;
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

interface SchoolBatchList {
    schoolBatchId: number;
    school: School;
    batch: Batch;
    deliveryDate: string;
    numberOfPackage: number;
    status: string;
    keyStage: string;
    remarks: string;
    accountable: string;
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

const Search = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);
    const { userInfo } = useUserInfo();
    const navigate = useNavigate();

    useEffect(() => {
        if (userInfo && userInfo.userType !== 'division') {
            navigate('/'); // Redirect to default/home
        }
    }, [userInfo, navigate]);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const data = await getAllPackage();
                if (!Array.isArray(data))
                    throw new Error("Invalid data format");
                setPackages(data);
            } catch (error) {
                console.error("Failed to fetch packages:", error);
                setPackages([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPackages();
    }, []);

    const filteredData = packages.filter((pkg) =>
        [
            pkg.schoolBatchList?.school?.district.division?.division,
            pkg.schoolBatchList?.school?.district?.name,
            pkg.schoolBatchList?.school?.name,
            pkg.configuration.item,
            pkg.serialNumber,
        ]
            .filter(Boolean) // Remove undefined values
            .some((field) =>
                field
                    ?.toString()
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
            )
    );

    return (
        <div className="w-full mx-auto p-8">
            {/* Search Bar */}
            <div className="relative my-6 text-black">
                <input
                    type="search"
                    placeholder="Search here"
                    className="w-full h-10 px-4 border-b border-gray-300 outline-none focus:border-emerald-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="w-full border rounded-lg shadow-md overflow-hidden">
                <table className="w-full border-collapse text-left bg-white">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700">
                            <th className="px-4 py-3 border border-gray-200">
                                Division
                            </th>
                            <th className="px-4 py-3 border border-gray-200">
                                District
                            </th>
                            <th className="px-4 py-3 border border-gray-200">
                                School
                            </th>
                            <th className="px-4 py-3 border border-gray-200">
                                Batch
                            </th>
                            <th className="px-4 py-3 border border-gray-200">
                                Delivery Date
                            </th>
                            <th className="px-4 py-3 border border-gray-200">
                                Item
                            </th>
                            <th className="px-4 py-3 border border-gray-200">
                                Serial Number
                            </th>
                        </tr>
                    </thead>
                    <tbody className="text-black">
                        {filteredData.length > 0 ? (
                            filteredData.map((pkg, index) => (
                                <tr
                                    key={index}
                                    className={`hover:bg-emerald-100 ${
                                        index % 2 === 0
                                            ? "bg-gray-50"
                                            : "bg-white"
                                    }`}
                                >
                                    <td className="px-4 py-2 border border-gray-200">
                                        {
                                            pkg.schoolBatchList.school.district
                                                .division.division
                                        }
                                    </td>
                                    <td className="px-4 py-2 border border-gray-200">
                                        {
                                            pkg.schoolBatchList.school.district
                                                .name
                                        }
                                    </td>
                                    <td className="px-4 py-2 border border-gray-200">
                                        {pkg.schoolBatchList.school.name}
                                    </td>
                                    <td className="px-4 py-2 border border-gray-200 text-center">
                                        {pkg.schoolBatchList.batch.batchName}
                                    </td>
                                    <td className="px-4 py-2 border border-gray-200 text-center">
                                        {pkg.schoolBatchList.deliveryDate
                                            ? new Date(
                                                  pkg.schoolBatchList.deliveryDate
                                              ).toLocaleDateString("en-CA")
                                            : "N/A"}
                                    </td>
                                    <td className="px-4 py-2 border border-gray-200">
                                        {pkg.configuration.item}
                                    </td>
                                    <td className="px-4 py-2 border border-gray-200 text-center">
                                        {pkg.serialNumber}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="text-center py-4 text-gray-500"
                                >
                                    No results found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

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

export default Search;
