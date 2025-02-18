const DCPBatchSearch = () => {
    return (
        <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
            <div className="w-full max-w-8xl grid grid-cols-3 gap-6">
                {/* Left Section - DCP Batch Search */}
                <div className="col-span-1 bg-white shadow-md rounded-lg p-4">
                    <h2 className="bg-gray-300 text-black p-3 text-center font-bold text-lg rounded-t-lg">
                        DCP Batch Search
                    </h2>
                    <div className="w-full overflow-x-auto mt-4">
                        <table className="w-full text-left border border-separate border-slate-200 rounded-md">
                            <thead className="bg-slate-100">
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
                                <tr className="border border-slate-300 hover:bg-emerald-100">
                                    <td className="h-12 px-6 text-sm border border-slate-200"></td>
                                    <td className="h-12 px-6 text-sm border border-slate-200"></td>
                                    <td className="h-12 px-6 text-sm border border-slate-200"></td>
                                    <td className="h-12 px-6 text-sm border border-slate-200"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Middle Section - Input Form */}
                <div className="col-span-2 bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">
                        DCP Batch Details
                    </h2>
                    <div className="grid grid-cols-2 gap-6">
                        {[
                            "Record No.",
                            "DCP Batch No.",
                            "Budget Year",
                            "Delivery Year",
                            "Price per Package",
                            "Supplier",
                            "Remarks",
                        ].map((label, index) => (
                            <div key={index} className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600">
                                    {label}
                                </label>
                                <input
                                    type="text"
                                    className="h-12 w-full mt-1 rounded-lg border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                                    placeholder={`Enter ${label}`}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Section - Results Table */}
            <div className="w-full max-w-7xl mt-6">
                <div className="bg-white shadow-md rounded-lg p-4">
                    <h2 className="bg-gray-300 text-black p-3 text-center font-bold text-lg rounded-t-lg">
                        DCP Batch Items
                    </h2>
                    <div className="w-full overflow-x-auto mt-4">
                        <table className="w-full text-left border border-separate border-slate-200 rounded-md">
                            <thead className="bg-slate-100">
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
                                <tr className="border border-slate-300 hover:bg-emerald-100">
                                    <td className="h-12 px-6 text-sm border border-slate-200"></td>
                                    <td className="h-12 px-6 text-sm border border-slate-200"></td>
                                    <td className="h-12 px-6 text-sm border border-slate-200"></td>
                                    <td className="h-12 px-6 text-sm border border-slate-200"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DCPBatchSearch;
