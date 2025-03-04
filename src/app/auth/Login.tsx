import {
    Alert,
    Button,
    Input,
    Spinner,
    Typography,
} from "@material-tailwind/react";
import { useState } from "react";
import DepedImage from "../../assets/images/deped logo 1.png";
import { useLogin } from "../../hooks/LoginUser";

export function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { loading, error, handleSubmit } = useLogin();

    return (
        <div>
            <section className="flex items-center justify-center h-screen w-screen bg-white ">
                <div className="flex items-center justify-center w-[80%] h-[80%] bg-white rounded-3xl shadow-lg shadow-gray-500">
                    {/* Image Section */}
                    <div
                        className="h-full lg:w-1/2 rounded-l-3xl flex items-center justify-between "
                        style={{
                            background:
                                "linear-gradient(to top left, #FAC203 29%, #FFFFFF 30%, #2F80ED 31%, #2F80ED 69%, #FFFFFF 70%, #136306 71%)",
                            backgroundSize: "cover",
                            backgroundPosition: "center center",
                            backgroundRepeat: "no-repeat",
                        }}
                    >
                        <div className=" inset-0 flex flex-col items-center justify-center ">
                            <img
                                src={DepedImage}
                                className="h-1/2 w-1/2 object-contain"
                                alt="DepEd"
                            />
                            <Typography
                                variant="h2"
                                className="font-bold mb-4 text-white text-3xl bg-[rgba(0,0,0,0.7)] p-5 rounded-3xl "
                                placeholder={undefined} // ✅ Fix TS error
                                onPointerEnterCapture={undefined} // ✅ Fix TS error
                                onPointerLeaveCapture={undefined} // ✅ Fix TS error
                            >
                                DepEd Computerization Program Inventory System
                            </Typography>
                        </div>
                    </div>
                    {/* Login Form Section */}
                    <div className="h-full lg:w-1/2 flex items-center justify-center ">
                        <div className="w-full p-6 bg-white h-full rounded-r-3xl flex flex-col items-center justify-center align-middle">
                            <div className="text-center">
                                <Typography
                                    variant="h2"
                                    className="font-bold mb-4 text-black text-6xl"
                                    placeholder={undefined} // ✅ Fix TS error
                                    onPointerEnterCapture={undefined} // ✅ Fix TS error
                                    onPointerLeaveCapture={undefined} // ✅ Fix TS error
                                >
                                    Sign-In
                                </Typography>
                            </div>
                            <form
                                className="max-w-screen-lg lg:w-1/2 flex flex-col gap-2"
                                onSubmit={(e) =>
                                    handleSubmit(e, username, password)
                                }
                            >
                                {error && (
                                    <Alert color="red" className="mb-4">
                                        {error}
                                    </Alert>
                                )}

                                <div className="mb-4 flex-col flex gap-5">
                                    <label
                                        htmlFor="username"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Username
                                    </label>
                                    <Input
                                        variant="outlined"
                                        id="username"
                                        size="lg"
                                        placeholder="Enter your username"
                                        value={username}
                                        onChange={(e) =>
                                            setUsername(e.target.value)
                                        }
                                        className="!border !border-gray-700 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                                        labelProps={{
                                            className: "hidden",
                                        }}
                                        onPointerEnterCapture={undefined} // ✅ Fix TS error
                                        onPointerLeaveCapture={undefined} // ✅ Fix TS error
                                        crossOrigin={undefined} // ✅ Fix TS error
                                    />
                                </div>

                                <div className="mb-4 flex-col flex gap-5">
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Password
                                    </label>
                                    <Input
                                        id="password"
                                        type="password"
                                        size="lg"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        className="!border !border-gray-700 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                                        labelProps={{
                                            className: "hidden",
                                        }}
                                        onPointerEnterCapture={undefined} // ✅ Fix TS error
                                        onPointerLeaveCapture={undefined} // ✅ Fix TS error
                                        crossOrigin={undefined} // ✅ Fix TS error
                                        error={false} // ✅ Fix TS error (if applicable)
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="mt-10 bg-[#4067E2] text-white hover:bg-orange-700 text-lg"
                                    fullWidth
                                    disabled={loading}
                                    placeholder={undefined} // ✅ Fix TS error
                                    onPointerEnterCapture={undefined} // ✅ Fix TS error
                                    onPointerLeaveCapture={undefined} // ✅ Fix TS error
                                    //onClick={() => navigate("/dashboard")}
                                >
                                    {loading ? (
                                        <Spinner
                                            className="h-5 w-5"
                                            onPointerEnterCapture={undefined} // ✅ Fix TS error
                                            onPointerLeaveCapture={undefined} // ✅ Fix TS error
                                        />
                                    ) : (
                                        "Log in"
                                    )}
                                </Button>

                                <div className="text-center mt-6">
                                    <Typography
                                        variant="small"
                                        className="font-medium text-gray-900"
                                        placeholder={undefined} // ✅ Fix TS error
                                        onPointerEnterCapture={undefined} // ✅ Fix TS error
                                        onPointerLeaveCapture={undefined} // ✅ Fix TS error
                                    >
                                        <a href="#">Forgot Password?</a>
                                    </Typography>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Login;
