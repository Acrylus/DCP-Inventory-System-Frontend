import { useEffect, useState } from "react";
import { getAllPackage } from "../../lib/package-api/getAllPackage";

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
    name: string;
    address: string;
    previousStation: string;
}

interface SchoolBatchList {
    schoolBatchId: number;
    school: School;
    deliveryDate: string;
    numberOfPackage: number;
    status: string;
    keyStage: string;
    remarks: string;
    accountable: string;
}

interface Configuration {
    configurationId: number;
    item: string;
    type: string;
    quantity: number;
}

interface Package {
    packageId: number;
    schoolBatchList: SchoolBatchList;
    configuration: Configuration;
    status: string;
    component: string;
    serialNumber: string;
    assigned: string;
    remarks: string;
}

const Search = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const data = await getAllPackage();
                if (!Array.isArray(data))
                    throw new Error("Invalid data format");
                setPackages(data);
            } catch (err) {
                setError("Failed to fetch packages");
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

            {/* Loading and Error States */}
            {loading && <p className="text-center">Loading...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

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
                                Batch No
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
                                        {pkg.schoolBatchList.schoolBatchId}
                                    </td>
                                    <td className="px-4 py-2 border border-gray-200 text-center">
                                        {pkg.schoolBatchList.deliveryDate ||
                                            "N/A"}
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
        </div>
    );
};

export default Search;
