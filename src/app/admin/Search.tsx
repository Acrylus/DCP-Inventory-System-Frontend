import { useState } from "react";

const Search = () => {
    const [searchQuery, setSearchQuery] = useState("");

    // Sample Data (Replace with API or Database Data)
    const data = [
        {
            division: "Division A",
            district: "District 1",
            school: "School Alpha",
            batch: "Batch 001",
            deliveryDate: "2024-02-15",
            item: "Laptop",
            serialNumber: "SN123456",
        },
        {
            division: "Division B",
            district: "District 2",
            school: "School Beta",
            batch: "Batch 002",
            deliveryDate: "2024-02-16",
            item: "Projector",
            serialNumber: "SN654321",
        },
        {
            division: "Division C",
            district: "District 3",
            school: "School Gamma",
            batch: "Batch 003",
            deliveryDate: "2024-02-17",
            item: "Tablet",
            serialNumber: "SN987654",
        },
    ];

    // Filter Data Based on Search Query
    const filteredData = data.filter((item) =>
        Object.values(item).some((val) =>
            val.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    return (
        <div className="w-full max-w-6xl mx-auto p-4">
            {/* Search Bar */}
            <div className="relative my-6">
                <input
                    id="id-s01"
                    type="search"
                    name="id-s01"
                    placeholder="Search here"
                    aria-label="Search content"
                    className="relative w-full h-10 px-4 pr-12 text-sm transition-all border-b outline-none focus-visible:outline-none peer border-slate-200 text-slate-500 autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-emerald-500 focus:outline-none invalid:focus:border-pink-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute top-2.5 right-4 h-5 w-5 cursor-pointer stroke-slate-400 peer-disabled:cursor-not-allowed"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden="true"
                    aria-label="Search icon"
                    role="graphics-symbol"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                </svg>
            </div>

            {/* Table */}
            <div className="w-full overflow-x-auto mt-4 text-black">
                <table className="w-full text-left border border-collapse rounded border-slate-200">
                    <thead>
                        <tr className="bg-slate-100">
                            <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                Division
                            </th>
                            <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                District
                            </th>
                            <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                School
                            </th>
                            <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                Batch
                            </th>
                            <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                Delivery Date
                            </th>
                            <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                Item
                            </th>
                            <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                Serial Number
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map((item, index) => (
                                <tr
                                    key={index}
                                    className="transition-colors duration-300 hover:bg-slate-50"
                                >
                                    <td className="h-12 px-6 text-sm border-t border-l first:border-l-0 border-slate-200">
                                        {item.division}
                                    </td>
                                    <td className="h-12 px-6 text-sm border-t border-l first:border-l-0 border-slate-200">
                                        {item.district}
                                    </td>
                                    <td className="h-12 px-6 text-sm border-t border-l first:border-l-0 border-slate-200">
                                        {item.school}
                                    </td>
                                    <td className="h-12 px-6 text-sm border-t border-l first:border-l-0 border-slate-200">
                                        {item.batch}
                                    </td>
                                    <td className="h-12 px-6 text-sm border-t border-l first:border-l-0 border-slate-200">
                                        {item.deliveryDate}
                                    </td>
                                    <td className="h-12 px-6 text-sm border-t border-l first:border-l-0 border-slate-200">
                                        {item.item}
                                    </td>
                                    <td className="h-12 px-6 text-sm border-t border-l first:border-l-0 border-slate-200">
                                        {item.serialNumber}
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
