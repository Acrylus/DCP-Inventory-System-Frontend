import {
    ArrowDownTrayIcon,
    MagnifyingGlassIcon,
    PencilIcon,
} from "@heroicons/react/24/outline";
import {
    Card,
    CardHeader,
    Typography,
    Button,
    CardBody,
    Chip,
    CardFooter,
    Avatar,
    IconButton,
    Tooltip,
    Input,
} from "@material-tailwind/react";

const TABLE_HEAD = ["Transaction", "Amount", "Date", "Status", "Account", ""];

const TABLE_ROWS = [
    {
        img: "https://docs.material-tailwind.com/img/logos/logo-spotify.svg",
        name: "Spotify",
        amount: "$2,500",
        date: "Wed 3:00pm",
        status: "paid",
        account: "visa",
        accountNumber: "1234",
        expiry: "06/2026",
    },
    {
        img: "https://docs.material-tailwind.com/img/logos/logo-amazon.svg",
        name: "Amazon",
        amount: "$5,000",
        date: "Wed 1:00pm",
        status: "paid",
        account: "master-card",
        accountNumber: "1234",
        expiry: "06/2026",
    },
    {
        img: "https://docs.material-tailwind.com/img/logos/logo-pinterest.svg",
        name: "Pinterest",
        amount: "$3,400",
        date: "Mon 7:40pm",
        status: "pending",
        account: "master-card",
        accountNumber: "1234",
        expiry: "06/2026",
    },
    {
        img: "https://docs.material-tailwind.com/img/logos/logo-google.svg",
        name: "Google",
        amount: "$1,000",
        date: "Wed 5:00pm",
        status: "paid",
        account: "visa",
        accountNumber: "1234",
        expiry: "06/2026",
    },
    {
        img: "https://docs.material-tailwind.com/img/logos/logo-netflix.svg",
        name: "netflix",
        amount: "$14,000",
        date: "Wed 3:30am",
        status: "cancelled",
        account: "visa",
        accountNumber: "1234",
        expiry: "06/2026",
    },
];

const Dashboard = () => {
    return (
        <div className="flex h-full w-full">
            <Card
                className="h-full w-full"
                placeholder={undefined} // ✅ Fix TS error
                onPointerEnterCapture={undefined} // ✅ Fix TS error
                onPointerLeaveCapture={undefined} // ✅ Fix TS error
            >
                <CardHeader
                    floated={false}
                    shadow={false}
                    className="rounded-none"
                    placeholder={undefined} // ✅ Fix TS error
                    onPointerEnterCapture={undefined} // ✅ Fix TS error
                    onPointerLeaveCapture={undefined} // ✅ Fix TS error
                >
                    <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
                        <div>
                            <Typography
                                variant="h5"
                                color="blue-gray"
                                placeholder={undefined} // ✅ Fix TS error
                                onPointerEnterCapture={undefined} // ✅ Fix TS error
                                onPointerLeaveCapture={undefined} // ✅ Fix TS error
                            >
                                Recent Transactions
                            </Typography>
                            <Typography
                                color="gray"
                                className="mt-1 font-normal"
                                placeholder={undefined} // ✅ Fix TS error
                                onPointerEnterCapture={undefined} // ✅ Fix TS error
                                onPointerLeaveCapture={undefined} // ✅ Fix TS error
                            >
                                These are details about the last transactions
                            </Typography>
                        </div>
                        <div className="flex w-full shrink-0 gap-2 md:w-max">
                            <div className="w-full md:w-72">
                                <Input
                                    label="Search"
                                    icon={
                                        <MagnifyingGlassIcon className="h-5 w-5" />
                                    }
                                    placeholder={undefined} // ✅ Fix TS error
                                    onPointerEnterCapture={undefined} // ✅ Fix TS error
                                    onPointerLeaveCapture={undefined} // ✅ Fix TS error
                                    crossOrigin={undefined}
                                />
                            </div>
                            <Button
                                className="flex items-center gap-3"
                                size="sm"
                                placeholder={undefined} // ✅ Fix TS error
                                onPointerEnterCapture={undefined} // ✅ Fix TS error
                                onPointerLeaveCapture={undefined} // ✅ Fix TS error
                            >
                                <ArrowDownTrayIcon
                                    strokeWidth={2}
                                    className="h-4 w-4"
                                />{" "}
                                Download
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardBody
                    className="overflow-scroll px-0"
                    placeholder={undefined} // ✅ Fix TS error
                    onPointerEnterCapture={undefined} // ✅ Fix TS error
                    onPointerLeaveCapture={undefined} // ✅ Fix TS error
                >
                    <table className="w-full min-w-max table-auto text-left">
                        <thead>
                            <tr>
                                {TABLE_HEAD.map((head) => (
                                    <th
                                        key={head}
                                        className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                                    >
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal leading-none opacity-70"
                                            placeholder={undefined} // ✅ Fix TS error
                                            onPointerEnterCapture={undefined} // ✅ Fix TS error
                                            onPointerLeaveCapture={undefined} // ✅ Fix TS error
                                        >
                                            {head}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {TABLE_ROWS.map(
                                (
                                    {
                                        img,
                                        name,
                                        amount,
                                        date,
                                        status,
                                        account,
                                        accountNumber,
                                        expiry,
                                    },
                                    index
                                ) => {
                                    const isLast =
                                        index === TABLE_ROWS.length - 1;
                                    const classes = isLast
                                        ? "p-4"
                                        : "p-4 border-b border-blue-gray-50";

                                    return (
                                        <tr key={name}>
                                            <td className={classes}>
                                                <div className="flex items-center gap-3">
                                                    <Avatar
                                                        src={img}
                                                        alt={name}
                                                        size="md"
                                                        className="border border-blue-gray-50 bg-blue-gray-50/50 object-contain p-1"
                                                        placeholder={undefined} // ✅ Fix TS error
                                                        onPointerEnterCapture={
                                                            undefined
                                                        } // ✅ Fix TS error
                                                        onPointerLeaveCapture={
                                                            undefined
                                                        } // ✅ Fix TS error
                                                    />
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-bold"
                                                        placeholder={undefined} // ✅ Fix TS error
                                                        onPointerEnterCapture={
                                                            undefined
                                                        } // ✅ Fix TS error
                                                        onPointerLeaveCapture={
                                                            undefined
                                                        } // ✅ Fix TS error
                                                    >
                                                        {name}
                                                    </Typography>
                                                </div>
                                            </td>
                                            <td className={classes}>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                    placeholder={undefined} // ✅ Fix TS error
                                                    onPointerEnterCapture={
                                                        undefined
                                                    } // ✅ Fix TS error
                                                    onPointerLeaveCapture={
                                                        undefined
                                                    } // ✅ Fix TS error
                                                >
                                                    {amount}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                    placeholder={undefined} // ✅ Fix TS error
                                                    onPointerEnterCapture={
                                                        undefined
                                                    } // ✅ Fix TS error
                                                    onPointerLeaveCapture={
                                                        undefined
                                                    } // ✅ Fix TS error
                                                >
                                                    {date}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <div className="w-max">
                                                    <Chip
                                                        size="sm"
                                                        variant="ghost"
                                                        value={status}
                                                        color={
                                                            status === "paid"
                                                                ? "green"
                                                                : status ===
                                                                  "pending"
                                                                ? "amber"
                                                                : "red"
                                                        }
                                                    />
                                                </div>
                                            </td>
                                            <td className={classes}>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-12 rounded-md border border-blue-gray-50 p-1">
                                                        <Avatar
                                                            src={
                                                                account ===
                                                                "visa"
                                                                    ? "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/logos/visa.png"
                                                                    : "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/logos/mastercard.png"
                                                            }
                                                            size="sm"
                                                            alt={account}
                                                            variant="square"
                                                            className="h-full w-full object-contain p-1"
                                                            placeholder={
                                                                undefined
                                                            } // ✅ Fix TS error
                                                            onPointerEnterCapture={
                                                                undefined
                                                            } // ✅ Fix TS error
                                                            onPointerLeaveCapture={
                                                                undefined
                                                            } // ✅ Fix TS error
                                                        />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal capitalize"
                                                            placeholder={
                                                                undefined
                                                            } // ✅ Fix TS error
                                                            onPointerEnterCapture={
                                                                undefined
                                                            } // ✅ Fix TS error
                                                            onPointerLeaveCapture={
                                                                undefined
                                                            } // ✅ Fix TS error
                                                        >
                                                            {account
                                                                .split("-")
                                                                .join(" ")}{" "}
                                                            {accountNumber}
                                                        </Typography>
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal opacity-70"
                                                            placeholder={
                                                                undefined
                                                            } // ✅ Fix TS error
                                                            onPointerEnterCapture={
                                                                undefined
                                                            } // ✅ Fix TS error
                                                            onPointerLeaveCapture={
                                                                undefined
                                                            } // ✅ Fix TS error
                                                        >
                                                            {expiry}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={classes}>
                                                <Tooltip content="Edit User">
                                                    <IconButton
                                                        variant="text"
                                                        placeholder={undefined} // ✅ Fix TS error
                                                        onPointerEnterCapture={
                                                            undefined
                                                        } // ✅ Fix TS error
                                                        onPointerLeaveCapture={
                                                            undefined
                                                        } // ✅ Fix TS error
                                                    >
                                                        <PencilIcon className="h-4 w-4" />
                                                    </IconButton>
                                                </Tooltip>
                                            </td>
                                        </tr>
                                    );
                                }
                            )}
                        </tbody>
                    </table>
                </CardBody>
                <CardFooter
                    className="flex items-center justify-between border-t border-blue-gray-50 p-4"
                    placeholder={undefined} // ✅ Fix TS error
                    onPointerEnterCapture={undefined} // ✅ Fix TS error
                    onPointerLeaveCapture={undefined} // ✅ Fix TS error
                >
                    <Button
                        variant="outlined"
                        size="sm"
                        placeholder={undefined} // ✅ Fix TS error
                        onPointerEnterCapture={undefined} // ✅ Fix TS error
                        onPointerLeaveCapture={undefined} // ✅ Fix TS error
                    >
                        Previous
                    </Button>
                    <div className="flex items-center gap-2">
                        <IconButton
                            variant="outlined"
                            size="sm"
                            placeholder={undefined} // ✅ Fix TS error
                            onPointerEnterCapture={undefined} // ✅ Fix TS error
                            onPointerLeaveCapture={undefined} // ✅ Fix TS error
                        >
                            1
                        </IconButton>
                        <IconButton
                            variant="text"
                            size="sm"
                            placeholder={undefined} // ✅ Fix TS error
                            onPointerEnterCapture={undefined} // ✅ Fix TS error
                            onPointerLeaveCapture={undefined} // ✅ Fix TS error
                        >
                            2
                        </IconButton>
                        <IconButton
                            variant="text"
                            size="sm"
                            placeholder={undefined} // ✅ Fix TS error
                            onPointerEnterCapture={undefined} // ✅ Fix TS error
                            onPointerLeaveCapture={undefined} // ✅ Fix TS error
                        >
                            3
                        </IconButton>
                        <IconButton
                            variant="text"
                            size="sm"
                            placeholder={undefined} // ✅ Fix TS error
                            onPointerEnterCapture={undefined} // ✅ Fix TS error
                            onPointerLeaveCapture={undefined} // ✅ Fix TS error
                        >
                            ...
                        </IconButton>
                        <IconButton
                            variant="text"
                            size="sm"
                            placeholder={undefined} // ✅ Fix TS error
                            onPointerEnterCapture={undefined} // ✅ Fix TS error
                            onPointerLeaveCapture={undefined} // ✅ Fix TS error
                        >
                            8
                        </IconButton>
                        <IconButton
                            variant="text"
                            size="sm"
                            placeholder={undefined} // ✅ Fix TS error
                            onPointerEnterCapture={undefined} // ✅ Fix TS error
                            onPointerLeaveCapture={undefined} // ✅ Fix TS error
                        >
                            9
                        </IconButton>
                        <IconButton
                            variant="text"
                            size="sm"
                            placeholder={undefined} // ✅ Fix TS error
                            onPointerEnterCapture={undefined} // ✅ Fix TS error
                            onPointerLeaveCapture={undefined} // ✅ Fix TS error
                        >
                            10
                        </IconButton>
                    </div>
                    <Button
                        variant="outlined"
                        size="sm"
                        placeholder={undefined} // ✅ Fix TS error
                        onPointerEnterCapture={undefined} // ✅ Fix TS error
                        onPointerLeaveCapture={undefined} // ✅ Fix TS error
                    >
                        Next
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Dashboard;
