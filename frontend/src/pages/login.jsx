import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ChevronRight } from "lucide-react";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

function LoginPage() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] =
        useState({
            klinikId: "",
            username: "",
            password: "",
        });
    const [isRobotChecked, setIsRobotChecked] = useState(false);
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const handleLogin = async (e) => {
        e.preventDefault();

        try {

            const response = await api.post("/auth/login", {
                    username: formData.username,
                    password: formData.password,
                }
            );

            console.log(response.data);

            // simpan token
            localStorage.setItem(
                "token",
                response.data.token
            );

            alert("Login berhasil 🚀");

            // redirect using React Router
            navigate("/dashboard");

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Login gagal"
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                {/* Logo */}
                <div className="mb-6">
                    <div className="flex items-center gap-1">
                        <span className="text-3xl font-light text-gray-600 tracking-tight">
                            Medeva
                        </span>
                        <svg
                            viewBox="0 0 40 24"
                            className="w-10 h-6"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M2 12h8l3-8 4 16 3-8h8"
                                stroke="#F59E0B"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                </div>

                {/* Welcome Text */}
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                    Selamat datang di Medeva! Silakan login untuk melanjutkan
                </p>

                {/* Form */}
                <form className="space-y-5"
                    onSubmit={handleLogin}>
                    {/* Klinik ID */}
                    <div>
                        <Label htmlFor="klinik-id" className="text-sm font-medium text-gray-700">
                            Klinik ID <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="klinik-id"
                            type="text"
                            placeholder="Masukkan Klinik ID"
                            className="mt-1 w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            name="klinikId"
                            value={formData.klinikId}
                            onChange={handleChange}
                        />
                    </div>

                    {/* User ID */}
                    <div>
                        <Label htmlFor="user-id" className="text-sm font-medium text-gray-700">
                            User ID <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="user-id"
                            type="text"
                            placeholder="Masukkan User ID"
                            className="mt-1 w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                            Password <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative mt-1">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Masukkan Password"
                                className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 pr-10 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Recaptcha */}
                    <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    id="robot"
                                    checked={isRobotChecked}
                                    onCheckedChange={(checked) => setIsRobotChecked(!!checked)}
                                    className="h-5 w-5"
                                />
                                <Label htmlFor="robot" className="text-sm text-gray-700 cursor-pointer font-normal">
                                    Saya bukan robot
                                </Label>
                            </div>
                            <div className="flex flex-col items-center">
                                <svg viewBox="0 0 64 64" className="w-10 h-10">
                                    <path
                                        d="M32 4C16.536 4 4 16.536 4 32s12.536 28 28 28 28-12.536 28-28S47.464 4 32 4z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M32 4v28l19.799 19.799C58.264 45.264 60 38.952 60 32c0-15.464-12.536-28-28-28z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M32 32L12.201 51.799C18.736 58.264 28.048 60 32 60c15.464 0 28-12.536 28-28H32z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M4 32c0 8.952 3.736 17.264 10.201 23.799L32 32H4z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                <span className="text-[10px] text-gray-400 italic">reCAPTCHA</span>
                            </div>
                        </div>
                    </div>

                    {/* Forgot Password */}
                    <div>
                        <a
                            href="#"
                            className="text-sm text-gray-500 hover:text-blue-500 transition"
                        >
                            Lupa Password?
                        </a>
                    </div>

                    {/* Button */}
                    <Button
                        type="submit"
                        className="w-full h-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-semibold text-base transition"
                    >
                        Masuk
                    </Button>

                    {/* Link */}
                    <div className="text-center">
                        <a
                            href="#"
                            className="inline-flex items-center text-sm text-gray-500 hover:text-blue-500 transition"
                        >
                            Masuk ke medeva apotek
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;

