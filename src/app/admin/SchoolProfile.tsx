import { Button, Card, CardBody } from "@material-tailwind/react";

const SchoolProfile = () => {
    return (
        <div className="p-8 bg-gray-100 min-h-screen flex flex-col items-center">
            {/* Search & Filters + Manage Schools */}
            <div className="w-full max-w-7xl grid grid-cols-2 gap-6">
                {/* Search & Filter */}
                <Card
                    shadow={true}
                    className="w-full bg-white rounded-xl"
                    placeholder=""
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                >
                    <CardBody
                        className="p-4"
                        placeholder=""
                        onPointerEnterCapture={() => {}}
                        onPointerLeaveCapture={() => {}}
                    >
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">
                            Search & Filter
                        </h2>

                        <div className="relative mb-4">
                            <input
                                type="search"
                                placeholder="Search for schools..."
                                className="h-12 w-full rounded-lg border border-gray-300 px-4 pr-12 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                            />
                        </div>

                        {/* Dropdown Filters */}
                        {["Division", "Municipality", "Classification"].map(
                            (label) => (
                                <div key={label} className="mb-4">
                                    <label className="text-sm font-medium text-gray-600">
                                        {label}:
                                    </label>
                                    <select className="h-12 w-full mt-1 rounded-lg border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400">
                                        <option value="" disabled selected>
                                            Select {label}
                                        </option>
                                    </select>
                                </div>
                            )
                        )}
                    </CardBody>
                </Card>

                {/* Manage Schools */}
                <Card
                    shadow={true}
                    className="w-full bg-white rounded-xl"
                    placeholder=""
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                >
                    <CardBody
                        className="p-4 flex flex-col items-center"
                        placeholder=""
                        onPointerEnterCapture={() => {}}
                        onPointerLeaveCapture={() => {}}
                    >
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">
                            Manage Schools
                        </h2>
                        <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                            {[
                                { text: "Add", color: "blue" },
                                { text: "Delete", color: "red" },
                                { text: "Update", color: "green" },
                                { text: "School Profile", color: "amber" },
                            ].map((btn) => (
                                <Button
                                    key={btn.text}
                                    variant="filled"
                                    color={btn.color as any}
                                    className="w-full h-12 text-lg font-semibold shadow-md focus:outline-none hover:shadow-lg rounded-lg transition-transform transform hover:scale-105"
                                    placeholder=""
                                    onPointerEnterCapture={() => {}}
                                    onPointerLeaveCapture={() => {}}
                                >
                                    {btn.text}
                                </Button>
                            ))}
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* School List & Details (Side by Side) */}
            <div className="w-full max-w-7xl mt-6 grid grid-cols-2 gap-6">
                {/* School List */}
                <Card
                    shadow={true}
                    className="w-full bg-white rounded-xl"
                    placeholder=""
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                >
                    <CardBody
                        className="p-4"
                        placeholder=""
                        onPointerEnterCapture={() => {}}
                        onPointerLeaveCapture={() => {}}
                    >
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">
                            School List
                        </h2>
                        <div className="overflow-auto">
                            <table className="w-full border-collapse border border-gray-200 rounded-lg overflow-hidden">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border p-3 text-left text-gray-700 font-medium">
                                            School ID
                                        </th>
                                        <th className="border p-3 text-left text-gray-700 font-medium">
                                            List of Schools
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        {
                                            id: "12345",
                                            name: "Sample School Name",
                                        },
                                        {
                                            id: "67890",
                                            name: "Another School Name",
                                        },
                                    ].map((school, index) => (
                                        <tr
                                            key={index}
                                            className={`border hover:bg-gray-100 ${
                                                index % 2 === 0
                                                    ? "bg-white"
                                                    : "bg-gray-50"
                                            }`}
                                        >
                                            <td className="border p-3">
                                                {school.id}
                                            </td>
                                            <td className="border p-3">
                                                {school.name}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardBody>
                </Card>

                {/* School Details */}
                <Card
                    shadow={true}
                    className="w-full bg-white rounded-xl"
                    placeholder=""
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                >
                    <CardBody
                        className="p-4"
                        placeholder=""
                        onPointerEnterCapture={() => {}}
                        onPointerLeaveCapture={() => {}}
                    >
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">
                            School Details
                        </h2>
                        {[
                            { label: "Record No.", type: "text" },
                            { label: "Division", type: "text" },
                            { label: "Municipality", type: "dropdown" },
                            { label: "Classification", type: "dropdown" },
                            { label: "School ID", type: "text" },
                            { label: "School Name", type: "text" },
                        ].map((field, index) => (
                            <div key={index} className="mb-3">
                                <label className="text-sm font-medium text-gray-600">
                                    {field.label}:
                                </label>
                                {field.type === "dropdown" ? (
                                    <select className="h-12 w-full mt-1 rounded-lg border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400">
                                        <option value="" disabled selected>
                                            Select {field.label}
                                        </option>
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        className="h-12 w-full mt-1 rounded-lg border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                                    />
                                )}
                            </div>
                        ))}

                        {/* Address Field */}
                        <div className="mb-3">
                            <label className="text-sm font-medium text-gray-600">
                                Address:
                            </label>
                            <textarea className="h-20 w-full mt-1 rounded-lg border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"></textarea>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default SchoolProfile;
