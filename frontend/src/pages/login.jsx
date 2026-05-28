import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ChevronRight } from "lucide-react";
import * as yup from "yup";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const loginSchema = yup.object().shape({
  klinikId: yup.string().required("Klinik ID wajib diisi"),
  username: yup.string().required("User ID wajib diisi"),
  password: yup.string().required("Password wajib diisi"),
});

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
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        if (errors[e.target.name]) {
            setErrors((prev) => {
                const copy = { ...prev };
                delete copy[e.target.name];
                return copy;
            });
        }
    };
    const handleLogin = async (e) => {
        e.preventDefault();
        setErrors({});

        try {
            await loginSchema.validate(formData, { abortEarly: false });
        } catch (err) {
            const fieldErrors = {};
            err.inner.forEach((validationErr) => {
                fieldErrors[validationErr.path] = validationErr.message;
            });
            setErrors(fieldErrors);
            return;
        }

        if (!isRobotChecked) {
            setErrors((prev) => ({ ...prev, robot: "Harap centang 'Saya bukan robot'" }));
            return;
        }

        setLoading(true);

        try {
            const response = await api.post("/auth/login", {
                    klinikId: formData.klinikId,
                    username: formData.username,
                    password: formData.password,
                }
            );

            localStorage.setItem(
                "token",
                response.data.token
            );
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            navigate("/dashboard");
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Login gagal"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                {/* Logo */}
                <div className="mb-6">
                  <img src="/img/medeva.webp" alt="Medeva" style={{ height: "48px", objectFit: "contain" }} />
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
                        {errors.klinikId && <p style={{ fontSize: "11px", color: "#ef4444", marginTop: "4px" }}>{errors.klinikId}</p>}
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
                        {errors.username && <p style={{ fontSize: "11px", color: "#ef4444", marginTop: "4px" }}>{errors.username}</p>}
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
                        {errors.password && <p style={{ fontSize: "11px", color: "#ef4444", marginTop: "4px" }}>{errors.password}</p>}
                    </div>

                    {/* Recaptcha */}
                    <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    id="robot"
                                    checked={isRobotChecked}
                                    onCheckedChange={(checked) => {
                                        setIsRobotChecked(!!checked);
                                        if (errors.robot) {
                                            setErrors((prev) => {
                                                const copy = { ...prev };
                                                delete copy.robot;
                                                return copy;
                                            });
                                        }
                                    }}
                                    className="h-5 w-5"
                                />
                                <Label htmlFor="robot" className="text-sm text-gray-700 cursor-pointer font-normal">
                                    Saya bukan robot
                                </Label>
                            </div>
                            <div className="flex flex-col items-center">
                                <img src="/img/ReCAPTCHA_icon.svg.png" alt="reCAPTCHA" style={{ width: "40px", height: "40px" }} />
                                <span className="text-[10px] text-gray-400 italic">reCAPTCHA</span>
                            </div>
                        </div>
                        {errors.robot && <p style={{ fontSize: "11px", color: "#ef4444", marginTop: "4px" }}>{errors.robot}</p>}
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
                        disabled={loading}
                        className="w-full h-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-semibold text-base transition"
                    >
                        {loading ? "Memproses..." : "Masuk"}
                    </Button>

                    {/* Link */}
                    <div className="text-right">
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

