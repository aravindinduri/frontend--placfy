import { useState, useEffect } from "react";
import {
    User, Mail, Phone, MapPin, Camera, Save, Lock,
    Globe, Calendar, Map, Building, BadgeCheck
} from "lucide-react";
import { getStoredToken, getSessionToken } from "../../utils/authToken";

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [activeTab, setActiveTab] = useState("personal");
    const [profileData, setProfileData] = useState({
        // Personal
        first_name: "",
        last_name: "",
        date_of_birth: "",
        gender: "",
        marital_status: "",
        nationality: "",
        // Contact
        phone_number: "",
        address_line_1: "",
        address_line_2: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
        // Additional
        bio: "",
        profile_picture: null, // URL or File object
        // Account (Read Only)
        username: "",
        email: "",
        // Password
        new_password: ""
    });

    // Preview for image upload
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        fetchProfileSettings();
    }, []);

    const fetchProfileSettings = async () => {
        try {
            setLoading(true);
            const sessionToken = getSessionToken();
            const token = sessionToken || getStoredToken();

            if (!token) {
                setError("Please login first");
                return;
            }

            const response = await fetch("http://localhost:8000/api/v1/profile/account_settings/", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setProfileData(prev => ({
                    ...prev,
                    ...data,
                    new_password: "" // Ensure password is empty
                }));
                if (data.profile_picture) {
                    setImagePreview(data.profile_picture); // Assuming full URL or relative path handled
                    // If relative, might need to prepend backend URL
                }
            } else {
                setError("Failed to load profile settings");
            }
        } catch (err) {
            console.error("Error fetching settings:", err);
            setError("Error loading settings");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProfileData(prev => ({ ...prev, profile_picture: file }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        setSuccess("");

        const sessionToken = getSessionToken();
        const token = sessionToken || getStoredToken();

        const formData = new FormData();

        // Append all fields
        Object.keys(profileData).forEach(key => {
            // Skip read-only or empty optional fields
            if (['username', 'email', 'full_name', 'full_address', 'age', 'gender_display', 'marital_status_display'].includes(key)) return;

            // Handle profile picture
            if (key === 'profile_picture') {
                if (profileData[key] instanceof File) {
                    formData.append(key, profileData[key]);
                }
                return;
            }

            // Handle standard fields
            if (profileData[key] !== null && profileData[key] !== undefined) {
                formData.append(key, profileData[key]);
            }
        });

        try {
            const response = await fetch("http://localhost:8000/api/v1/profile/account_settings/", {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`
                    // 'Content-Type': 'multipart/form-data' // DO NOT SET THIS MANUALLY with fetch + FormData
                },
                body: formData
            });

            if (response.ok) {
                const data = await response.json(); // Returns { message, settings }
                setSuccess("Settings updated successfully!");
                // Update local state with returned data (mostly to sync any backend formatting)
                if (data.settings) {
                    setProfileData(prev => ({
                        ...prev,
                        ...data.settings,
                        new_password: ""
                    }));
                }
                setTimeout(() => setSuccess(""), 3000);
            } else {
                const errData = await response.json();
                setError(JSON.stringify(errData) || "Failed to update settings");
            }
        } catch (err) {
            console.error("Error updating settings:", err);
            setError("An error occurred while saving");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    const tabs = [
        { id: "personal", label: "Personal Info", icon: <User size={18} /> },
        { id: "contact", label: "Contact Details", icon: <Phone size={18} /> },
        { id: "account", label: "Account & Security", icon: <Lock size={18} /> }
    ];

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-500 pb-8">
            {/* Header */}
            <header className="py-6 shrink-0 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Account Settings</h1>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Manage your profile & preferences</p>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="bg-indigo-600 text-white rounded-2xl py-3 px-6 font-black text-xs uppercase tracking-widest hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {saving ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <Save size={18} />
                    )}
                    Save Changes
                </button>
            </header>

            {/* Notifications */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold flex items-center gap-3">
                    <span className="bg-red-100 p-1 rounded-md">⚠️</span> {error}
                </div>
            )}
            {success && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-600 text-sm font-bold flex items-center gap-3">
                    <span className="bg-emerald-100 p-1 rounded-md">✓</span> {success}
                </div>
            )}

            <div className="flex gap-8 flex-1 min-h-0 overflow-hidden">
                {/* Sidebar / Tabs */}
                <div className="w-64 shrink-0 flex flex-col gap-2">
                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 mb-4 text-center">
                        <div className="relative w-24 h-24 mx-auto mb-4 group">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-50 shadow-inner bg-slate-100">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                        <User size={40} />
                                    </div>
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 p-2 bg-indigo-600 rounded-full text-white cursor-pointer hover:bg-indigo-700 shadow-lg hover:scale-110 transition-transform">
                                <Camera size={14} />
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                        </div>
                        <h3 className="font-bold text-slate-800 truncate">{profileData.full_name || profileData.username}</h3>
                        <p className="text-xs text-slate-400 font-bold truncate">{profileData.email}</p>
                    </div>

                    <nav className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 space-y-1">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all text-left ${activeTab === tab.id
                                    ? "bg-indigo-50 text-indigo-600 shadow-sm"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Main Content Form */}
                <div className="flex-1 bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 overflow-y-auto custom-scrollbar">
                    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">

                        {/* PERSONAL INFO TAB */}
                        {activeTab === "personal" && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <h2 className="font-black text-slate-800 text-lg">Personal Information</h2>
                                        <p className="text-xs font-bold text-slate-400">Basic details about you</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <InputGroup label="First Name" name="first_name" value={profileData.first_name} onChange={handleChange} />
                                    <InputGroup label="Last Name" name="last_name" value={profileData.last_name} onChange={handleChange} />
                                    <InputGroup label="Date of Birth" name="date_of_birth" type="date" value={profileData.date_of_birth} onChange={handleChange} />

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Gender</label>
                                        <select
                                            name="gender"
                                            value={profileData.gender || ""}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-bold text-slate-700 transition-all appearance-none"
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                            <option value="prefer_not_to_say">Prefer not to say</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Marital Status</label>
                                        <select
                                            name="marital_status"
                                            value={profileData.marital_status || ""}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-bold text-slate-700 transition-all appearance-none"
                                        >
                                            <option value="">Select Status</option>
                                            <option value="single">Single</option>
                                            <option value="married">Married</option>
                                            <option value="divorced">Divorced</option>
                                            <option value="widowed">Widowed</option>
                                            <option value="separated">Separated</option>
                                            <option value="prefer_not_to_say">Prefer not to say</option>
                                        </select>
                                    </div>

                                    <InputGroup label="Nationality" name="nationality" value={profileData.nationality} onChange={handleChange} icon={<Globe size={16} />} />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Bio</label>
                                    <textarea
                                        name="bio"
                                        value={profileData.bio || ""}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-bold text-slate-700 min-h-[120px] resize-none transition-all placeholder:text-slate-300"
                                        placeholder="Tell us a bit about yourself..."
                                    />
                                </div>
                            </div>
                        )}

                        {/* CONTACT TAB */}
                        {activeTab === "contact" && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <h2 className="font-black text-slate-800 text-lg">Contact Details</h2>
                                        <p className="text-xs font-bold text-slate-400">Where can we reach you?</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <InputGroup label="Phone Number" name="phone_number" value={profileData.phone_number} onChange={handleChange} icon={<Phone size={16} />} />
                                    <InputGroup label="Country" name="country" value={profileData.country} onChange={handleChange} icon={<Globe size={16} />} />

                                    <div className="col-span-2">
                                        <InputGroup label="Address Line 1" name="address_line_1" value={profileData.address_line_1} onChange={handleChange} icon={<MapPin size={16} />} />
                                    </div>
                                    <div className="col-span-2">
                                        <InputGroup label="Address Line 2" name="address_line_2" value={profileData.address_line_2} onChange={handleChange} placeholder="Apartment, suite, etc. (optional)" />
                                    </div>

                                    <InputGroup label="City" name="city" value={profileData.city} onChange={handleChange} icon={<Building size={16} />} />
                                    <InputGroup label="State / Province" name="state" value={profileData.state} onChange={handleChange} icon={<Map size={16} />} />
                                    <InputGroup label="Postal Code" name="postal_code" value={profileData.postal_code} onChange={handleChange} icon={<BadgeCheck size={16} />} />
                                </div>
                            </div>
                        )}

                        {/* ACCOUNT TAB */}
                        {activeTab === "account" && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                        <Lock size={20} />
                                    </div>
                                    <div>
                                        <h2 className="font-black text-slate-800 text-lg">Account & Security</h2>
                                        <p className="text-xs font-bold text-slate-400">Manage login credentials</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <InputGroup label="Username" value={profileData.username} disabled={true} icon={<User size={16} />} />
                                        <InputGroup label="Email Address" value={profileData.email} disabled={true} icon={<Mail size={16} />} />
                                    </div>

                                    <div className="pt-6 border-t border-slate-100">
                                        <h3 className="font-black text-slate-800 mb-4">Change Password</h3>
                                        <div className="max-w-md">
                                            <InputGroup
                                                label="New Password"
                                                name="new_password"
                                                type="password"
                                                value={profileData.new_password}
                                                onChange={handleChange}
                                                placeholder="Leave blank to keep current password"
                                                icon={<Lock size={16} />}
                                            />
                                            <p className="text-[10px] text-slate-400 font-bold mt-2 ml-1">
                                                * Only enter if you want to change your password.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </form>
                </div>
            </div>
        </div>
    );
}

// Reusable Input Component
function InputGroup({ label, name, value, onChange, type = "text", placeholder, icon, disabled = false }) {
    return (
        <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">{label}</label>
            <div className={`relative flex items-center ${disabled ? 'opacity-60' : ''}`}>
                {icon && (
                    <div className="absolute left-4 text-slate-400 pointer-events-none">
                        {icon}
                    </div>
                )}
                <input
                    type={type}
                    name={name}
                    value={value || ""}
                    onChange={onChange}
                    disabled={disabled}
                    placeholder={placeholder} // Removed generic placeholder
                    className={`w-full ${icon ? 'pl-12' : 'pl-4'} pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-bold text-slate-700 transition-all placeholder:text-slate-300 ${disabled ? 'cursor-not-allowed bg-slate-100' : ''}`}
                />
            </div>
        </div>
    );
}
