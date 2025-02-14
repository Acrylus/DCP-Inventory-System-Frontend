const DCPBatchSearch = () => {
    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <div className="grid grid-cols-2 gap-4">
                {/* Left Side - Table Section */}
                <div>
                    <div className="bg-gray-300 text-black p-3 text-center font-bold text-lg">
                        DCP Batch Search
                    </div>
                    <div className="overflow-auto mt-4 bg-white p-4 shadow-md rounded-md">
                        <table className="w-full border-collapse border border-gray-300">
                            <thead className="bg-gray-300">
                                <tr>
                                    <th className="border p-2">Batch No.</th>
                                    <th className="border p-2">Budget Year</th>
                                    <th className="border p-2">
                                        Delivery Year
                                    </th>
                                    <th className="border p-2">Supplier</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border">
                                    <td className="border p-2"></td>
                                    <td className="border p-2"></td>
                                    <td className="border p-2"></td>
                                    <td className="border p-2"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Side - Input Form */}
                <div className="bg-white p-4 shadow-md rounded-md">
                    <div className="grid grid-cols-2 gap-4 items-center">
                        <label className="font-bold text-gray-600">
                            Record No.
                        </label>
                        <input
                            type="text"
                            className="border p-2 rounded w-full"
                        />

                        <label className="font-bold text-gray-600">
                            DCP Batch No.
                        </label>
                        <input
                            type="text"
                            className="border p-2 rounded w-full"
                        />

                        <label className="font-bold text-gray-600">
                            Budget Year
                        </label>
                        <input
                            type="text"
                            className="border p-2 rounded w-full"
                        />

                        <label className="font-bold text-gray-600">
                            Delivery Year
                        </label>
                        <input
                            type="text"
                            className="border p-2 rounded w-full"
                        />

                        <label className="font-bold text-gray-600">
                            Price per Package
                        </label>
                        <input
                            type="text"
                            className="border p-2 rounded w-full"
                        />

                        <label className="font-bold text-gray-600">
                            Supplier
                        </label>
                        <input
                            type="text"
                            className="border p-2 rounded w-full"
                        />

                        <label className="font-bold text-gray-600">
                            Remarks
                        </label>
                        <input
                            type="text"
                            className="border p-2 rounded w-full"
                        />
                    </div>
                </div>
            </div>

            {/* Below Input Form - New Table Section */}
            <div className="overflow-auto mt-4 bg-white p-4 shadow-md rounded-md">
                <table className="w-full border-collapse border border-gray-300">
                    <thead className="bg-gray-300">
                        <tr>
                            <th className="border p-2">Rec No.</th>
                            <th className="border p-2">Item</th>
                            <th className="border p-2">Type</th>
                            <th className="border p-2">Qty</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border">
                            <td className="border p-2"></td>
                            <td className="border p-2"></td>
                            <td className="border p-2"></td>
                            <td className="border p-2"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DCPBatchSearch;
