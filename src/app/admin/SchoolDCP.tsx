const SchoolDCP = () => {
    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <div className="grid grid-cols-2 gap-4">
                {/* Left Side - School Information */}
                <div>
                    <div className="bg-green-700 text-white p-3 text-center font-bold text-lg">
                        School Information
                    </div>

                    {/* Table Section */}
                    <div className="overflow-auto mt-4 bg-white p-4 shadow-md rounded-md">
                        <table className="w-full border-collapse border border-gray-300">
                            <thead className="bg-green-700 text-white">
                                <tr>
                                    <th className="border p-2">Record No.</th>
                                    <th className="border p-2">Division</th>
                                    <th className="border p-2">Municipality</th>
                                    <th className="border p-2">School ID</th>
                                    <th className="border p-2">School Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border">
                                    <td className="border p-2">1</td>
                                    <td className="border p-2">
                                        Sample Division
                                    </td>
                                    <td className="border p-2">
                                        Sample Municipality
                                    </td>
                                    <td className="border p-2">12345</td>
                                    <td className="border p-2">
                                        Sample School
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Filter Section */}
                    <div className="bg-white p-4 shadow-md rounded-md mt-4">
                        <div className="grid grid-cols-1 gap-4">
                            <label className="flex items-center">
                                <span className="font-bold mr-2">Search:</span>
                                <input
                                    type="text"
                                    className="border p-2 rounded w-full"
                                />
                            </label>
                            <label className="flex items-center">
                                <span className="font-bold mr-2">
                                    Division:
                                </span>
                                <select className="border p-2 rounded w-full">
                                    <option>Cebu Province</option>
                                </select>
                            </label>
                            <label className="flex items-center">
                                <span className="font-bold mr-2">
                                    Municipality:
                                </span>
                                <select className="border p-2 rounded w-full">
                                    <option>Select Municipality</option>
                                </select>
                            </label>
                            <label className="flex items-center">
                                <span className="font-bold mr-2">
                                    Classification:
                                </span>
                                <select className="border p-2 rounded w-full">
                                    <option>Select Classification</option>
                                </select>
                            </label>
                        </div>
                    </div>

                    {/* School List Section */}
                    <div className="overflow-auto mt-4 bg-white p-4 shadow-md rounded-md">
                        <table className="w-full border-collapse border border-gray-300">
                            <thead className="bg-gray-300">
                                <tr>
                                    <th className="border p-2">School ID</th>
                                    <th className="border p-2">
                                        List of Schools
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border">
                                    <td className="border p-2">12345</td>
                                    <td className="border p-2">
                                        Sample School
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Side - Config Table */}
                <div className="overflow-auto bg-white p-4 shadow-md rounded-md">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead className="bg-gray-300">
                            <tr>
                                <th className="border p-2">Config</th>
                                <th className="border p-2">Batch No.</th>
                                <th className="border p-2">Delivery Date</th>
                                <th className="border p-2">Package No.</th>
                                <th className="border p-2">KeyStage</th>
                                <th className="border p-2">Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border">
                                <td className="border p-2 text-blue-500 cursor-pointer">
                                    Config
                                </td>
                                <td className="border p-2 font-bold">
                                    Batch 19
                                </td>
                                <td className="border p-2"></td>
                                <td className="border p-2">1</td>
                                <td className="border p-2 font-bold">
                                    Grade 4 - 6
                                </td>
                                <td className="border p-2"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SchoolDCP;
