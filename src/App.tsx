import { useState, useRef, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import "./styles/global.css";
import dpmall from "./assets/malls/dpmall.jpg";
import paragon from "./assets/malls/paragon.jpg";
import queencity from "./assets/malls/queencity.jpg";
import thepark from "./assets/malls/thepark.jpg";
import {
  MapPin,
  Car,
  Lock,
  Globe,
  LogOut,
  Phone,
  Navigation,
  Search,
  User,
  Pencil,
  House,
  Ticket,
  SquareParking,
  Trash2,
  MessageCircle,
  Mail,
  PhoneCall,
  Info,
  Sparkles,
  ShieldCheck,
  Bell,
  LucideIcon,
  Signal,
  BatteryFull,
  Wifi,
  SignalHigh,
  ArrowLeft,
  ChevronRight,
  Check,
  CarFront,
  Star,
  QrCode,
  Wallet,
  ReceiptText,
  MoveRight,
} from "lucide-react";
import parkingHero from "./assets/illustrations/smartpark-hero.svg";
import {
  authApi,
  parkingApi,
  bookingApi,
  paymentApi,
  userApi,
  setTokens,
  clearTokens,
} from "./services/api";

const onboardingContent = [
  {
    title: "Find the nearest parking lot",
    description: "Avoid getting late by finding a parking spot near you.",
  },
  {
    title: "Book your Slot on the go",
    description:
      "Reserve your parking space anytime and enjoy hassle-free parking.",
  },
  {
    title: "Search, Discover & Park",
    description:
      "Explore nearby parking locations and reserve your spot instantly.",
  },
  {
    title: "Welcome to SmartPark",
    description: "Smart parking solution designed for modern cities.",
  },
];

const onboardingImages = [
  new URL("./assets/iPhone 14 & 15 Pro Max - 1.png", import.meta.url).href,
  new URL("./assets/iPhone 14 & 15 Pro Max - 2.png", import.meta.url).href,
  new URL("./assets/iPhone 14 & 15 Pro Max - 3.png", import.meta.url).href,
  new URL("./assets/iPhone 14 & 15 Pro Max - 4.png", import.meta.url).href,
];

const screenImages: Record<
  "login" | "signup" | "profile" | "editProfile" | "bookings",
  string
> = {
  login: new URL("./assets/Login Version 2.png", import.meta.url).href,
  signup: new URL("./assets/Sign Up Version 2.png", import.meta.url).href,
  profile: new URL("./assets/Profile.png", import.meta.url).href,
  editProfile: new URL("./assets/Edit Profile.png", import.meta.url).href,
  bookings: new URL("./assets/45_History_Upcoming.png", import.meta.url).href,
};

function AssetScreen({
  image,
  actionLabel,
  action,
}: {
  image: string;
  actionLabel: string;
  action: () => void;
}) {
  return (
    <div className="asset-screen" style={{ backgroundImage: `url(${image})` }}>
      <div className="asset-screen-footer">
        <button className="primary-button" onClick={action}>
          {actionLabel}
        </button>
      </div>
    </div>
  );
}

type ParkingOption = {
  id: number;
  title: string;
  rating: string;
  subtitle: string;
  price: string;
  slots: string;
  image?: string;
};
type BookingItem = { title: string; subtitle: string; time: string };
type RecentBooking = {
  title: string;
  subtitle: string;
  time: string;
  amount: string;
  code: string;
};
type User = { name: string; email: string; phone: string; birthdate: string };
type Vehicle = { name: string; plate: string };

const initialParkingOptions: ParkingOption[] = [
  {
    id: 1,
    title: "DP Mall",
    rating: "4.5",
    subtitle: "Jl. Pemuda No. 118",
    price: "Rp10.000/hr",
    slots: "120/150 Slots",
    image: dpmall,
  },
  {
    id: 2,
    title: "Paragon Mall",
    rating: "4.2",
    subtitle: "Jl. Gajah Mada No. 17",
    price: "Rp10.000/hr",
    slots: "120/150 Slots",
    image: paragon,
  },
  {
    id: 3,
    title: "Queen City Mall",
    rating: "4.0",
    subtitle: "Jl. Ahmad Yani No. 45",
    price: "Rp10.000/hr",
    slots: "120/150 Slots",
    image: queencity,
  },
  {
    id: 4,
    title: "The Park Mall",
    rating: "4.5",
    subtitle: "Jl. Pandanaran No. 32",
    price: "Rp10.000/hr",
    slots: "120/150 Slots",
    image: thepark,
  },
];

// initial booking data
const initialUpcoming = [
  { title: "DP Mall", subtitle: "F 481 AN", time: "Today at 10:30 am" },
  { title: "Paragon Mall", subtitle: "F 481 AN", time: "Tomorrow at 10:30 am" },
];

const initialCompleted = [
  { title: "Queen City Mall", subtitle: "F 481 AN", time: "Done" },
  { title: "The Park Mall", subtitle: "F 481 AN", time: "Done" },
  { title: "Tentrem Mall", subtitle: "F 481 AN", time: "Done" },
  { title: "Java Supermall", subtitle: "F 481 AN", time: "Done" },
];

type ProfileOptionAction =
  | "account"
  | "car"
  | "resetPassword"
  | "language"
  | "logout";

const profileOptions: {
  label: string;
  hint: string;
  icon: LucideIcon;
  action: ProfileOptionAction;
}[] = [
  {
    label: "My Account",
    hint: "Make changes to your account",
    icon: User,
    action: "account",
  },
  {
    label: "Select Your Car",
    hint: "Manage your car",
    icon: Car,
    action: "car",
  },
  {
    label: "Reset Password",
    hint: "Change your password",
    icon: Lock,
    action: "resetPassword",
  },
  {
    label: "Change Language",
    hint: "Pilih bahasa aplikasi",
    icon: Globe,
    action: "language",
  },
  {
    label: "Log out",
    hint: "",
    icon: LogOut,
    action: "logout",
  },
];

export default function App() {
  const [screen, setScreen] = useState<
    | "onboarding"
    | "home"
    | "bookings"
    | "profile"
    | "login"
    | "signup"
    | "editProfile"
    | "parkingDetails"
    | "parkingSelection"
    | "payment"
    | "paymentSuccess"
    | "activeTicket"
    | "carSelection"
    | "help"
    | "about"
    | "resetPassword"
    | "language"
  >("onboarding");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "info",
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };
  const [language, setLanguage] = useState<"ID" | "EN">("ID");
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { name: "Toyota Avanza", plate: "B 1234 TKP" },
    { name: "Honda BR-V", plate: "B 5678 XYZ" },
    { name: "Suzuki Ertiga", plate: "B 9012 MNO" },
  ]);
  const [selectedCar, setSelectedCar] = useState("Toyota Avanza");
  const [newCarName, setNewCarName] = useState("");
  const [newCarPlate, setNewCarPlate] = useState("");
  const [onboardingIndex, setOnboardingIndex] = useState(0);
  const [bookingTab, setBookingTab] = useState<"upcoming" | "completed">(
    "upcoming",
  );
  const [search, setSearch] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loginEmail, setLoginEmail] = useState("ceosmartpark@gmail.com");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [signupData, setSignupData] = useState({
    name: "Bagas Aji Herlambang",
    email: "ceosmartpark@gmail.com",
    birthdate: "18/03/2024",
    phone: "+62 (454) 726-0592",
    password: "123",
  });

  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("smartparkUser");
    return stored ? JSON.parse(stored) : null;
  });
  const [profileEdit, setProfileEdit] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    car: selectedCar,
    carPlate: "",
    birthdate: "",
  });
  const [parkingOptionsState, setParkingOptionsState] = useState<
    ParkingOption[]
  >(initialParkingOptions);
  const [parkingLoading, setParkingLoading] = useState(false);
  const [upcomingBookingsState, setUpcomingBookings] =
    useState<BookingItem[]>(initialUpcoming);
  const [completedBookingsState, setCompletedBookings] =
    useState<BookingItem[]>(initialCompleted);
  const [selectedParking, setSelectedParking] = useState<ParkingOption | null>(
    null,
  );
  const [recentBooking, setRecentBooking] = useState<RecentBooking | null>(
    null,
  );
  const [activeFloor, setActiveFloor] = useState("Floor 3");
  const [floorsData, setFloorsData] = useState<
    { id: string; floorName: string }[]
  >([]);
  const [slotsData, setSlotsData] = useState<
    Record<string, { label: string; occupied: boolean; id: string }[]>
  >({});
  const [floorsLoading, setFloorsLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>("F3-53");
  const [bookingDuration, setBookingDuration] = useState<number>(3);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "QRIS" | "DANA"
  >("QRIS");
  const [arrivalHour, setArrivalHour] = useState(10);
  const [arrivalMinute, setArrivalMinute] = useState(0);
  const [bookingSummary, setBookingSummary] = useState({
    total: 0,
    active: 0,
    completed: 0,
  });

  const maxArrivalHour = Math.max(10, 23 - bookingDuration);
  const hourOptions = Array.from(
    { length: maxArrivalHour - 10 + 1 },
    (_, i) => 10 + i,
  );
  const minuteOptions =
    arrivalHour === maxArrivalHour
      ? [0]
      : Array.from({ length: 12 }, (_, i) => i * 5);
  // wheel measurements (must match CSS .wheel-option height)
  const ITEM_HEIGHT = 40;
  const hourWheelRef = useRef<HTMLDivElement | null>(null);
  const minuteWheelRef = useRef<HTMLDivElement | null>(null);
  const hourScrollTimeoutRef = useRef<number | null>(null);
  const minuteScrollTimeoutRef = useRef<number | null>(null);

  const floors = ["Floor 1", "Floor 2", "Floor 3", "Floor 4", "Floor 5"];
  const floorSlots =
    Object.keys(slotsData).length > 0
      ? slotsData
      : {
          "Floor 1": [
            { id: "", label: "F1-12", occupied: true },
            { id: "", label: "F1-13", occupied: false },
          ],
        };
  const activeFloorSlots = floorSlots[activeFloor] ?? [];
  const availableSlotCount = activeFloorSlots.filter(
    (slot) => !slot.occupied,
  ).length;

  // Calculate departure time
  const departureHour = Math.floor((arrivalHour + bookingDuration) % 24);
  const departureMinute = arrivalMinute;

  const formatTime = (hour: number, minute: number) => {
    return `${hour.toString().padStart(2, "0")}.${minute.toString().padStart(2, "0")}`;
  };

  // keep wheels scrolled so selected item sits on the center line
  useEffect(() => {
    if (arrivalHour > maxArrivalHour) {
      setArrivalHour(maxArrivalHour);
    }
    if (arrivalHour === maxArrivalHour && arrivalMinute > 0) {
      setArrivalMinute(0);
    }
  }, [bookingDuration, maxArrivalHour]);

  useEffect(() => {
    const idx = hourOptions.indexOf(arrivalHour);
    if (hourWheelRef.current && idx >= 0) {
      hourWheelRef.current.scrollTo({
        top: idx * ITEM_HEIGHT,
        behavior: "smooth",
      });
    }
  }, [arrivalHour, hourOptions]);

  useEffect(() => {
    const idx = minuteOptions.indexOf(arrivalMinute);
    if (minuteWheelRef.current && idx >= 0) {
      minuteWheelRef.current.scrollTo({
        top: idx * ITEM_HEIGHT,
        behavior: "smooth",
      });
    }
  }, [arrivalMinute, minuteOptions]);

  const durationOptions = [1, 2, 3, 4];

  const filteredParking = parkingOptionsState.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(search.toLowerCase()),
  );

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setScreen("login");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => setScreen("login"),
      () => setScreen("login"),
    );
  };

  const handleLogin = async () => {
    const email = loginEmail.trim().toLowerCase();
    const password = loginPassword;

    if (!email || !password) {
      setLoginError("Email dan password wajib diisi");
      return;
    }

    setLoginLoading(true);
    setLoginError("");

    try {
      const res = await authApi.login({ email, password });
      const { tokens, user } = res.data;
      const { accessToken, refreshToken } = tokens;

      setTokens(accessToken, refreshToken);

      const authenticatedUser: User = {
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        birthdate: user.birthdate || "",
      };

      setUser(authenticatedUser);
      localStorage.setItem("smartparkUser", JSON.stringify(authenticatedUser));
      setScreen("home");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login gagal";
      setLoginError(message);
      showToast(message, "error");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = async () => {
    if (
      !signupData.name ||
      !signupData.email ||
      !signupData.phone ||
      !signupData.birthdate ||
      !signupData.password
    ) {
      setSignupError("Lengkapi semua bidang pendaftaran terlebih dahulu.");
      return;
    }

    setSignupLoading(true);
    setSignupError("");

    try {
      const res = await authApi.register({
        name: signupData.name,
        email: signupData.email,
        password: signupData.password,
        phone: signupData.phone,
      });

      const { tokens, user } = res.data;
      const { accessToken, refreshToken } = tokens;

      setTokens(accessToken, refreshToken);

      const registeredUser: User = {
        name: user.name,
        email: user.email,
        phone: user.phone || signupData.phone,
        birthdate: signupData.birthdate,
      };

      setUser(registeredUser);
      localStorage.setItem("smartparkUser", JSON.stringify(registeredUser));
      setScreen("home");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Registrasi gagal";
      setSignupError(message);
      showToast(message, "error");
    } finally {
      setSignupLoading(false);
    }
  };

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID").format(value);
  };

  const handleBookingConfirm = async () => {
    if (!selectedParking || !selectedSlot) return;

    // Cari slot id dari slotsData
    const floorSlotList = slotsData[activeFloor] ?? [];
    const slotObj = floorSlotList.find((s) => s.label === selectedSlot);

    if (!slotObj?.id) {
      setBookingError("Slot tidak valid, silakan pilih ulang.");
      return;
    }

    // Cari vehicle id
    const vehicleObj = vehicles.find((v) => v.name === selectedCar);
    if (!vehicleObj) {
      setBookingError("Kendaraan tidak ditemukan.");
      return;
    }

    setBookingLoading(true);
    setBookingError("");

    try {
      const arrivalTime = new Date();
      arrivalTime.setHours(arrivalHour, arrivalMinute, 0, 0);
      const departureTime = new Date(arrivalTime);
      departureTime.setHours(departureTime.getHours() + bookingDuration);

      const res = await bookingApi.create({
        vehicleId: (vehicleObj as any).id ?? "",
        slotId: slotObj.id,
        arrivalTime: arrivalTime.toISOString(),
        departureTime: departureTime.toISOString(),
        durationHours: bookingDuration,
        paymentMethod: selectedPaymentMethod ?? "QRIS",
      });

      const booking = res.data;
      setActiveBookingId(booking.id);

      // Simulasi payment success
      await paymentApi.success(booking.id);

      const pricePerHour = (selectedParking as any).pricePerHour ?? 10000;
      const amountValue = bookingDuration * pricePerHour;
      const newBooking: RecentBooking = {
        title: selectedParking.title,
        subtitle: selectedSlot,
        time: `${bookingDuration} hr`,
        amount: `Rp ${formatRupiah(amountValue)}`,
        code: booking.bookingCode,
      };

      setRecentBooking(newBooking);
      showToast("Booking berhasil!", "success");
      setScreen("paymentSuccess");
      setScreen("paymentSuccess");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Booking gagal";
      setBookingError(message);
      showToast(message, "error");
    } finally {
      setBookingLoading(false);
    }
  };

  const handleViewBookingBarcode = (booking: BookingItem) => {
    const code = `${booking.title.slice(0, 3).toUpperCase()}-${booking.subtitle.replace(/[^A-Z0-9]/gi, "")}-${Date.now()}`;
    const bookingDetails: RecentBooking = {
      title: booking.title,
      subtitle: booking.subtitle,
      time: booking.time,
      amount: "Rp 30.000",
      code,
    };

    setRecentBooking(bookingDetails);
    setScreen("paymentSuccess");
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (_) {
      // tetap logout meski API gagal
    } finally {
      clearTokens();
      setUser(null);
      localStorage.removeItem("smartparkUser");
      setScreen("login");
    }
  };

  const handleOpenDirection = () => {
    if (!selectedParking) {
      return;
    }
    const destination = `${selectedParking.title} ${selectedParking.subtitle}`;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`;
    window.open(mapsUrl, "_blank");
  };

  useEffect(() => {
    const stored = localStorage.getItem("smartparkUser");
    const token = localStorage.getItem("accessToken");
    if (stored && token) {
      setUser(JSON.parse(stored));
      setScreen("home");
    }
  }, []);

  useEffect(() => {
    if (screen === "home") {
      fetchParkingLocations();
    }
  }, [screen]);

  const fetchParkingLocations = async () => {
    setParkingLoading(true);
    try {
      const res = await parkingApi.getAll();
      const locations = res.data;

      const mapped: ParkingOption[] = locations.map((loc: any) => ({
        id: loc.id,
        title: loc.name,
        subtitle: loc.address,
        rating: String(loc.rating),
        price: `Rp${loc.pricePerHour.toLocaleString("id-ID")}/hr`,
        slots: `${loc.availableSlots}/${loc.totalSlots} Slots`,
        image: loc.image || dpmall,
      }));

      setParkingOptionsState(mapped);
    } catch (error) {
      // fallback ke data dummy jika API gagal
      setParkingOptionsState(initialParkingOptions);
    } finally {
      setParkingLoading(false);
    }
  };

  const fetchFloorsAndSlots = async (parkingId: string) => {
    setFloorsLoading(true);
    try {
      const res = await parkingApi.getFloors(parkingId);
      const floors = res.data;
      setFloorsData(floors);

      if (floors.length > 0) {
        setActiveFloor(floors[0].floorName);

        const slotMap: Record<
          string,
          { label: string; occupied: boolean; id: string }[]
        > = {};

        await Promise.all(
          floors.map(async (floor: any) => {
            const slotRes = await parkingApi.getSlots(floor.id);
            slotMap[floor.floorName] = slotRes.data.map((slot: any) => ({
              id: slot.id,
              label: slot.slotCode,
              occupied: slot.status !== "AVAILABLE",
            }));
          }),
        );

        setSlotsData(slotMap);
      }
    } catch (error) {
      // fallback ke dummy jika gagal
    } finally {
      setFloorsLoading(false);
    }
  };

  useEffect(() => {
    if (screen === "bookings") {
      fetchBookings();
    }
  }, [screen]);

  const fetchBookings = async () => {
    try {
      const [activeRes, upcomingRes, historyRes] = await Promise.all([
        bookingApi.getActive(),
        bookingApi.getUpcoming(),
        bookingApi.getHistory(),
      ]);

      const upcoming: BookingItem[] = upcomingRes.data.map((b: any) => ({
        title: b.slot?.floor?.parkingLocation?.name ?? "Parking",
        subtitle: b.slot?.slotCode ?? "",
        time: `${b.durationHours} hr`,
      }));

      const completed: BookingItem[] = historyRes.data.map((b: any) => ({
        title: b.slot?.floor?.parkingLocation?.name ?? "Parking",
        subtitle: b.slot?.slotCode ?? "",
        time: `${b.durationHours} hr`,
      }));

      setUpcomingBookings(upcoming);
      setCompletedBookings(completed);

      setBookingSummary({
        total: upcoming.length + completed.length,
        active: activeRes.data ? 1 : 0,
        completed: completed.length,
      });

      // Set active booking jika ada
      if (activeRes.data) {
        const b = activeRes.data;
        setActiveBookingId(b.id);
        setRecentBooking({
          title: b.slot?.floor?.parkingLocation?.name ?? "",
          subtitle: b.slot?.slotCode ?? "",
          time: `${b.durationHours} hr`,
          amount: `Rp ${formatRupiah(b.totalAmount)}`,
          code: b.bookingCode,
        });
      }
    } catch (error) {
      // fallback
    }
  };

  useEffect(() => {
    if (screen === "activeTicket" && activeBookingId) {
      fetchActiveTicket();
    }
  }, [screen]);

  const fetchActiveTicket = async () => {
    if (!activeBookingId) return;
    try {
      const res = await bookingApi.getDetail(activeBookingId);
      const b = res.data;

      setRecentBooking({
        title:
          b.slot?.floor?.parkingLocation?.name ?? recentBooking?.title ?? "",
        subtitle: b.slot?.slotCode ?? "",
        time: `${b.durationHours} hr`,
        amount: `Rp ${formatRupiah(b.totalAmount)}`,
        code: b.bookingCode,
      });
    } catch (_) {
      // fallback ke data yang sudah ada
    }
  };

  useEffect(() => {
    const name = user?.name ?? signupData.name;
    const [firstName, ...rest] = name.split(" ");
    const selectedVehicle = vehicles.find(
      (vehicle) => vehicle.name === selectedCar,
    );
    setProfileEdit({
      firstName: firstName || "",
      lastName: rest.join(" ") || "",
      phone: user?.phone ?? signupData.phone,
      car: selectedCar,
      carPlate: selectedVehicle?.plate ?? "",
      birthdate: user?.birthdate ?? signupData.birthdate,
    });
  }, [user, selectedCar, signupData, vehicles]);

  const handleSaveProfile = async () => {
    const fullName = `${profileEdit.firstName} ${profileEdit.lastName}`.trim();

    try {
      await userApi.updateProfile({
        name: fullName || user?.name || "",
        phone: profileEdit.phone,
        birthdate: profileEdit.birthdate,
      });

      const updatedUser: User = {
        name: fullName || user?.name || signupData.name,
        email: user?.email ?? signupData.email,
        phone: profileEdit.phone,
        birthdate: profileEdit.birthdate,
      };

      setUser(updatedUser);
      localStorage.setItem("smartparkUser", JSON.stringify(updatedUser));

      if (!vehicles.some((v) => v.name === profileEdit.car)) {
        setVehicles((prev) => [
          ...prev,
          { name: profileEdit.car, plate: profileEdit.carPlate || "N/A" },
        ]);
      }

      setSelectedCar(profileEdit.car);
      setScreen("profile");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Update profile gagal";
      showToast(message, "error");
    }
  };

  const handleAddCar = () => {
    const trimmed = newCarName.trim();
    const plate = newCarPlate.trim().toUpperCase();
    if (!trimmed || !plate) {
      showToast("Masukkan nama mobil dan plat nomor terlebih dahulu.", "error");
      return;
    }
    if (vehicles.some((vehicle) => vehicle.name === trimmed)) {
      showToast("Mobil sudah ada dalam daftar.", "error");
      return;
    }
    setVehicles((prev) => [...prev, { name: trimmed, plate }]);
    setSelectedCar(trimmed);
    setProfileEdit((prev) => ({ ...prev, car: trimmed, carPlate: plate }));
    setNewCarName("");
    setNewCarPlate("");
  };

  const handleRemoveCar = (name: string) => {
    setVehicles((prev) => {
      const nextVehicles = prev.filter((vehicle) => vehicle.name !== name);
      if (selectedCar === name) {
        const next = nextVehicles[0];
        setSelectedCar(next?.name ?? "");
        setProfileEdit((prev) => ({ ...prev, car: next?.name ?? "" }));
      }
      return nextVehicles;
    });
  };

  const handleGoogleLogin = () => {
    showToast("Google login belum tersedia.", "info");
  };

  const handleProfileOption = (action: ProfileOptionAction) => {
    switch (action) {
      case "account":
        setScreen("editProfile");
        break;
      case "car":
        setScreen("carSelection");
        break;
      case "resetPassword":
        setScreen("resetPassword");
        break;
      case "language":
        setScreen("language");
        break;
      case "logout":
        handleLogout();
        break;
    }
  };

  const handleFacebookLogin = () => {
    showToast("Facebook login belum tersedia.", "info");
  };

  return (
    <div className="app-shell">
      <div className="phone-frame">
        {["home", "bookings", "profile"].includes(screen) && (
          <div className="phone-topbar">
            <span className="iphone-time">10:00</span>
            <div className="status-icons">
              <SignalHigh size={14} strokeWidth={2.5} />
              <span>5G</span>
              <BatteryFull size={18} strokeWidth={2.5} />
            </div>
          </div>
        )}

        <div
          className={`screen-container ${
            screen === "onboarding"
              ? "no-padding"
              : screen === "login" || screen === "signup"
                ? "no-padding auth-container"
                : ""
          }`}
        >
          {screen === "login" ? (
            <div className="auth-screen">
              <div className="auth-card">
                <button
                  className="back-button"
                  onClick={() => setScreen("onboarding")}
                >
                  <ArrowLeft size={18} />
                </button>
                <h1>Login</h1>
                <p className="auth-switch">
                  Don't have an account?{" "}
                  <button
                    className="text-button"
                    onClick={() => setScreen("signup")}
                  >
                    Sign Up
                  </button>
                </p>
                <div className="input-group">
                  <label>Email</label>
                  <input
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
                <div className="auth-row">
                  <label className="checkbox-wrapper">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />{" "}
                    Remember me
                  </label>
                  <button
                    className="text-button"
                    onClick={() => setScreen("resetPassword")}
                  >
                    Forgot Password ?
                  </button>
                </div>
                {loginError && (
                  <p
                    style={{
                      color: "red",
                      fontSize: "13px",
                      marginBottom: "8px",
                    }}
                  >
                    {loginError}
                  </p>
                )}
                <button
                  className="primary-button"
                  onClick={() => handleLogin()}
                  disabled={loginLoading}
                >
                  {loginLoading ? "Loading..." : "Log In"}
                </button>
                <div className="divider">Or</div>
                <button
                  className="social-button google"
                  onClick={() => handleGoogleLogin()}
                >
                  Continue with Google
                </button>
                <button
                  className="social-button facebook"
                  onClick={() => handleFacebookLogin()}
                >
                  Continue with Facebook
                </button>
              </div>
            </div>
          ) : screen === "signup" ? (
            <div className="auth-screen">
              <div className="auth-card">
                <button
                  className="back-button"
                  onClick={() => setScreen("onboarding")}
                >
                  <ArrowLeft size={18} />
                </button>
                <h1>Sign up</h1>
                <p className="auth-switch">
                  Already have an account?{" "}
                  <button
                    className="text-button"
                    onClick={() => setScreen("login")}
                  >
                    Login
                  </button>
                </p>
                <div className="input-group">
                  <label>Full Name</label>
                  <input
                    value={signupData.name}
                    onChange={(e) =>
                      setSignupData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="input-group">
                  <label>Email</label>
                  <input
                    value={signupData.email}
                    onChange={(e) =>
                      setSignupData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="input-group">
                  <label>Birth of date</label>
                  <input
                    value={signupData.birthdate}
                    onChange={(e) =>
                      setSignupData((prev) => ({
                        ...prev,
                        birthdate: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="input-group">
                  <label>Phone Number</label>
                  <input
                    value={signupData.phone}
                    onChange={(e) =>
                      setSignupData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="input-group">
                  <label>Set Password</label>
                  <input
                    type="password"
                    value={signupData.password}
                    onChange={(e) =>
                      setSignupData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                  />
                </div>
                {signupError && (
                  <p
                    style={{
                      color: "red",
                      fontSize: "13px",
                      marginBottom: "8px",
                    }}
                  >
                    {signupError}
                  </p>
                )}
                <button
                  className="primary-button"
                  onClick={() => handleSignup()}
                  disabled={signupLoading}
                >
                  {signupLoading ? "Loading..." : "Register"}
                </button>
                <div className="divider">Or</div>
                <button
                  className="social-button google"
                  onClick={() => handleGoogleLogin()}
                >
                  Continue with Google
                </button>
                <button
                  className="social-button facebook"
                  onClick={() => handleFacebookLogin()}
                >
                  Continue with Facebook
                </button>
              </div>
            </div>
          ) : screen === "editProfile" ? (
            <div className="screen screen-edit-profile">
              <div className="minimal-header">
                <button
                  className="back-button"
                  onClick={() => setScreen("profile")}
                >
                  <ArrowLeft size={18} />
                </button>

                <h1>Bio-data</h1>
              </div>
              <div className="profile-header-card">
                <div className="avatar-circle profile-avatar">B</div>
                <div>
                  <strong>{user?.name ?? signupData.name}</strong>
                  <span>{user?.email ?? signupData.email}</span>
                </div>
              </div>
              <div className="form-card">
                <label>What's your first name?</label>
                <input
                  value={profileEdit.firstName}
                  onChange={(e) =>
                    setProfileEdit((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                />
                <label>And your last name?</label>
                <input
                  value={profileEdit.lastName}
                  onChange={(e) =>
                    setProfileEdit((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                />
                <label>Phone Number</label>
                <input
                  value={profileEdit.phone}
                  onChange={(e) =>
                    setProfileEdit((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                />
                <label>Select your car</label>
                <select
                  value={profileEdit.car}
                  onChange={(e) =>
                    setProfileEdit((prev) => ({ ...prev, car: e.target.value }))
                  }
                >
                  <option>Toyota Avanza</option>
                  <option>Honda BR-V</option>
                  <option>Suzuki Ertiga</option>
                </select>
                <label>What is your date of birth?</label>
                <input
                  value={profileEdit.birthdate}
                  onChange={(e) =>
                    setProfileEdit((prev) => ({
                      ...prev,
                      birthdate: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="booking-actions">
                <button className="primary-button" onClick={handleSaveProfile}>
                  Save
                </button>
              </div>
            </div>
          ) : screen === "onboarding" ? (
            <div
              className={`onboarding-screen ${onboardingIndex === 3 ? "onboarding-screen--last" : ""}`}
            >
              {/* Gambar: slide 1-3 full bleed, slide 4 sebagai ilustrasi */}
              <img
                src={onboardingImages[onboardingIndex]}
                alt="SmartPark Onboarding"
                className={
                  onboardingIndex === 3
                    ? "onboarding-image--last"
                    : "onboarding-image"
                }
              />

              {/* Semua UI overlay di atas gambar */}
              <div className="onboarding-overlay">
                {/* Login button pojok kanan atas */}
                {onboardingIndex < 3 && (
                  <button
                    className="onboarding-login-btn"
                    onClick={() => setScreen("login")}
                  >
                    Login
                  </button>
                )}

                {/* Teks + navigasi di bagian bawah */}
                <div className="onboarding-bottom">
                  <div className="onboarding-copy">
                    <h2 className="onboarding-title">
                      {onboardingContent[onboardingIndex].title}
                    </h2>
                    <p className="onboarding-desc">
                      {onboardingContent[onboardingIndex].description}
                    </p>
                  </div>

                  {onboardingIndex < 3 ? (
                    <div className="onboarding-footer">
                      <div className="onboarding-dots">
                        {[0, 1, 2, 3].map((i) => (
                          <span
                            key={i}
                            className={`onboarding-dot ${i === onboardingIndex ? "active" : ""}`}
                            onClick={() => setOnboardingIndex(i)}
                          />
                        ))}
                      </div>
                      <div className="onboarding-actions">
                        <button
                          className="onboarding-skip-btn"
                          onClick={() => setOnboardingIndex(3)}
                        >
                          Skip
                        </button>
                        <button
                          className="onboarding-next-btn"
                          onClick={() =>
                            setOnboardingIndex((prev) => Math.min(prev + 1, 3))
                          }
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="onboarding-footer">
                      <div className="onboarding-location-hint">
                        <MapPin size={14} strokeWidth={2} />
                        <span>Enable location to find nearby parking</span>
                      </div>
                      <button
                        className="onboarding-next-btn full-width"
                        onClick={requestLocation}
                      >
                        Get Started
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
              {screen === "home" && (
                <div className="phone-header">
                  <div>
                    <div className="home-greeting">
                      <span className="text-highlight">Find Parking</span>
                      <h2>Near You</h2>
                    </div>
                    <button
                      className="location-button"
                      onClick={() => setScreen("home")}
                    >
                      <MapPin size={16} /> Semarang
                    </button>
                  </div>
                </div>
              )}
              <div className="content-screen">
                {screen === "home" && (
                  <div className="screen screen-home">
                    <div className="welcome-card">
                      <div className="welcome-content">
                        <span className="welcome-label">Hello, Bagas</span>

                        <div className="welcome-stats">
                          <strong>420</strong>
                          <span>Available Slots Nearby</span>
                        </div>

                        <div className="welcome-actions">
                          <button className="welcome-action">
                            <CarFront size={16} />
                            <span>My Vehicle</span>
                          </button>

                          <button className="welcome-action">
                            <Ticket size={16} />
                            <span>History</span>
                          </button>
                        </div>
                      </div>

                      <img
                        src={parkingHero}
                        alt="Parking Hero"
                        className="welcome-hero"
                      />
                    </div>

                    <div className="search-block">
                      <span className="search-icon">
                        <Search size={20} />
                      </span>
                      <input
                        className="search-input"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search parking location"
                      />
                    </div>
                    <div className="section-header">
                      <h3>Nearby Parking</h3>
                      <button>See All</button>
                    </div>
                    <div className="parking-list">
                      {parkingLoading ? (
                        // Skeleton Loading
                        [1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="parking-card"
                            style={{ pointerEvents: "none" }}
                          >
                            <div
                              className="parking-image-wrapper"
                              style={{
                                background: "#e5e7eb",
                                borderRadius: "12px",
                                width: "80px",
                                height: "80px",
                                flexShrink: 0,
                                animation:
                                  "skeleton-pulse 1.5s ease-in-out infinite",
                              }}
                            />
                            <div
                              className="parking-details"
                              style={{
                                flex: 1,
                                gap: "8px",
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <div
                                style={{
                                  height: "16px",
                                  background: "#e5e7eb",
                                  borderRadius: "6px",
                                  width: "70%",
                                  animation:
                                    "skeleton-pulse 1.5s ease-in-out infinite",
                                }}
                              />
                              <div
                                style={{
                                  height: "12px",
                                  background: "#e5e7eb",
                                  borderRadius: "6px",
                                  width: "90%",
                                  animation:
                                    "skeleton-pulse 1.5s ease-in-out infinite",
                                }}
                              />
                              <div
                                style={{
                                  height: "12px",
                                  background: "#e5e7eb",
                                  borderRadius: "6px",
                                  width: "50%",
                                  animation:
                                    "skeleton-pulse 1.5s ease-in-out infinite",
                                }}
                              />
                            </div>
                          </div>
                        ))
                      ) : filteredParking.length === 0 ? (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            padding: "48px 24px",
                            gap: "12px",
                            color: "#9ca3af",
                          }}
                        >
                          <MapPin size={48} strokeWidth={1} color="#d1d5db" />
                          <p
                            style={{
                              margin: 0,
                              fontWeight: 600,
                              color: "#6b7280",
                            }}
                          >
                            Parkir tidak ditemukan
                          </p>
                          <p style={{ margin: 0, fontSize: "13px" }}>
                            Coba kata kunci lain
                          </p>
                        </div>
                      ) : (
                        filteredParking.map((parking, index) => (
                          <button
                            key={`${parking.title}-${index}`}
                            className="parking-card"
                            onClick={() => {
                              setSelectedParking(parking);
                              setSelectedSlot(null);
                              setScreen("parkingDetails");
                            }}
                          >
                            <div className="parking-image-wrapper">
                              <img
                                src={parking.image}
                                alt={parking.title}
                                className="parking-thumb"
                              />
                              <div className="parking-rating">
                                <Star size={12} fill="currentColor" />
                                <span>{parking.rating}</span>
                              </div>
                            </div>
                            <div className="parking-details">
                              <div className="parking-title-row">
                                <strong>{parking.title}</strong>
                              </div>
                              <span className="parking-address">
                                {parking.subtitle}
                              </span>
                              <div className="parking-meta">
                                <span>{parking.price}</span>
                                <span className="meta-dot"></span>
                                <span className="parking-slots">
                                  {parking.slots}
                                </span>
                              </div>
                            </div>
                            <span className="arrow">
                              <ChevronRight size={18} />
                            </span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {screen === "bookings" && (
                  <div className="screen screen-bookings">
                    <div className="screen-header">
                      <h1>My Bookings</h1>
                    </div>

                    <div
                      className="active-booking-card"
                      onClick={() => {
                        if (recentBooking) {
                          setScreen("activeTicket");
                        }
                      }}
                    >
                      <div className="active-booking-header">
                        <span className="active-badge">Active Booking</span>

                        <div className="active-booking-icon">
                          <QrCode size={18} />
                        </div>
                      </div>

                      <h2>{recentBooking?.title ?? "DP Mall"}</h2>

                      <p>
                        {activeFloor} • Slot{" "}
                        {recentBooking?.subtitle ?? "F3-54"}
                      </p>

                      <div className="active-booking-meta">
                        <div>
                          <span>Arrival</span>
                          <strong>
                            {formatTime(arrivalHour, arrivalMinute)}
                          </strong>
                        </div>

                        <div>
                          <span>Departure</span>
                          <strong>
                            {formatTime(departureHour, departureMinute)}
                          </strong>
                        </div>

                        <div>
                          <span>Duration</span>
                          <strong>{bookingDuration}h</strong>
                        </div>
                      </div>
                    </div>

                    <div className="booking-summary-card">
                      <div className="summary-item">
                        <strong>{bookingSummary.total}</strong>
                        <span>Total</span>
                      </div>
                      <div className="summary-divider" />
                      <div className="summary-item">
                        <strong>{bookingSummary.active}</strong>
                        <span>Active</span>
                      </div>
                      <div className="summary-divider" />
                      <div className="summary-item">
                        <strong>{bookingSummary.completed}</strong>
                        <span>Completed</span>
                      </div>
                    </div>
                    <div className="toggle-card">
                      <button
                        className={`toggle-button ${bookingTab === "upcoming" ? "active" : ""}`}
                        onClick={() => setBookingTab("upcoming")}
                      >
                        Upcoming
                      </button>
                      <button
                        className={`toggle-button ${bookingTab === "completed" ? "active" : ""}`}
                        onClick={() => setBookingTab("completed")}
                      >
                        Completed
                      </button>
                    </div>
                    <div className="booking-list">
                      {(bookingTab === "upcoming"
                        ? upcomingBookingsState
                        : completedBookingsState
                      ).length === 0 ? (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "48px 24px",
                            gap: "12px",
                            color: "#9ca3af",
                          }}
                        >
                          <Ticket size={48} strokeWidth={1} color="#d1d5db" />
                          <p
                            style={{
                              margin: 0,
                              fontWeight: 600,
                              color: "#6b7280",
                            }}
                          >
                            {bookingTab === "upcoming"
                              ? "Tidak ada booking mendatang"
                              : "Belum ada riwayat booking"}
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "13px",
                              textAlign: "center",
                            }}
                          >
                            {bookingTab === "upcoming"
                              ? "Buat booking baru untuk mulai parkir"
                              : "Riwayat booking kamu akan muncul di sini"}
                          </p>
                        </div>
                      ) : (
                        (bookingTab === "upcoming"
                          ? upcomingBookingsState
                          : completedBookingsState
                        ).map((item, index) => (
                          <button
                            key={`${item.title}-${index}`}
                            className={`booking-card booking-card--match ${bookingTab === "upcoming" ? "booking-card--clickable" : ""}`}
                            onClick={
                              bookingTab === "upcoming"
                                ? () => handleViewBookingBarcode(item)
                                : undefined
                            }
                          >
                            <div>
                              <strong>{item.title}</strong>
                              <span>{item.subtitle}</span>
                            </div>
                            <div className="booking-right">
                              <span
                                className={
                                  bookingTab === "completed"
                                    ? "booking-done"
                                    : "booking-time"
                                }
                              >
                                {item.time}
                              </span>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {screen === "parkingDetails" && selectedParking && (
                  <div className="screen screen-parking-details">
                    <div className="parking-details-topcard">
                      <button
                        className="back-button"
                        onClick={() => setScreen("home")}
                      >
                        <ArrowLeft size={18} />
                      </button>
                      <div className="parking-details-topcard-grid">
                        <div className="parking-details-topcard-content">
                          <div>
                            <h1>{selectedParking.title}</h1>
                            <p className="subtitle">
                              {selectedParking.subtitle}
                            </p>
                          </div>
                          <div className="parking-meta-row">
                            <div className="parking-meta-pill">
                              <SquareParking size={18} />
                              <span>{availableSlotCount} Available</span>
                            </div>

                            <div className="parking-meta-pill">
                              <MapPin size={16} />
                              <span>200 m Away</span>
                            </div>

                            <div className="parking-meta-pill">
                              <Star size={16} />
                              <span>{selectedParking.rating}</span>
                            </div>
                          </div>
                        </div>
                        <img
                          src={selectedParking.image}
                          alt={selectedParking.title}
                          className="parking-top-image"
                        />
                      </div>
                      <div className="parking-top-actions">
                        <button
                          type="button"
                          className="outline-button"
                          onClick={() => window.open("tel:+62247600000")}
                        >
                          <>
                            <Phone size={16} />
                            Call
                          </>
                        </button>
                        <button
                          type="button"
                          className="outline-button"
                          onClick={handleOpenDirection}
                        >
                          <Navigation size={16} />
                          Direction
                        </button>
                      </div>
                    </div>

                    <div className="parking-details-section">
                      <h2>Details</h2>
                      <div className="parking-details-info">
                        <div>
                          <span className="parking-details-label">ADDRESS</span>
                          <p>{selectedParking.subtitle}</p>
                        </div>
                        <div>
                          <span className="parking-details-label">
                            OPERATION
                          </span>
                          <p>Open Daily • 10:00 AM - 10:00 PM</p>
                        </div>
                      </div>
                    </div>

                    <div className="parking-duration-section">
                      <h2>Select Parking Duration</h2>
                      <div className="duration-grid duration-grid--compact">
                        {durationOptions.map((duration) => (
                          <button
                            key={duration}
                            type="button"
                            className={`duration-card ${bookingDuration === duration ? "active" : ""}`}
                            onClick={() => setBookingDuration(duration)}
                          >
                            <span>{`Rp10k/h`}</span>
                            <strong>
                              {duration} {duration === 1 ? "Hour" : "Hours"}
                            </strong>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="parking-price-card">
                      <span className="price-label">Estimated Price</span>

                      <strong className="price-value">
                        Rp {formatRupiah(bookingDuration * 10000)}
                      </strong>
                    </div>

                    {selectedSlot && (
                      <div className="selected-slot-card">
                        <span className="selected-slot-label">
                          Selected Parking Slot
                        </span>

                        <strong className="selected-slot-value">
                          {selectedSlot}
                        </strong>

                        <div className="selected-slot-meta">
                          <span>{activeFloor}</span>

                          <span>Pillar 12</span>

                          <span>30m Walk</span>
                        </div>
                      </div>
                    )}

                    <button
                      className="select-slot-button"
                      onClick={() => {
                        if (selectedParking) {
                          fetchFloorsAndSlots(String(selectedParking.id));
                        }
                        setScreen("parkingSelection");
                      }}
                    >
                      Select Slot
                    </button>
                  </div>
                )}

                {screen === "parkingSelection" && selectedParking && (
                  <div className="screen screen-parking-selection">
                    <div className="minimal-header">
                      <button
                        className="back-button"
                        onClick={() => setScreen("parkingDetails")}
                      >
                        <ArrowLeft size={18} />
                      </button>

                      <h1>Select Parking Spot</h1>
                    </div>

                    <div className="floor-tabs">
                      <div className="floor-summary">
                        <div>
                          <span>Current Floor</span>
                          <strong>{activeFloor}</strong>
                        </div>

                        <div>
                          <span>Available</span>
                          <strong>{availableSlotCount}</strong>
                        </div>
                      </div>
                      {floors.map((floor) => (
                        <button
                          key={floor}
                          className={`floor-tab ${activeFloor === floor ? "active" : ""}`}
                          onClick={() => setActiveFloor(floor)}
                        >
                          {floor}
                        </button>
                      ))}
                    </div>

                    <div className="parking-map">
                      <div className="parking-map-side parking-left">
                        <div className="pillar-pill">Pillar No. 12</div>
                        <div className="slot-column">
                          {(floorSlots[activeFloor] ?? [])
                            .filter((_, index) => index % 2 === 0)
                            .map((slot) => (
                              <button
                                key={slot.label}
                                className={`slot-card ${selectedSlot === slot.label ? "active" : ""} ${slot.occupied ? "occupied" : ""}`}
                                onClick={() =>
                                  !slot.occupied && setSelectedSlot(slot.label)
                                }
                                disabled={slot.occupied}
                              >
                                <div className="slot-card-content">
                                  {slot.occupied ? (
                                    <>
                                      <span className="slot-icon">
                                        <CarFront size={16} />
                                      </span>

                                      <span>
                                        {slot.label.replace("-", " - ")}
                                      </span>

                                      <span className="occupied-badge">
                                        Occupied
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <CarFront size={14} />

                                      <span>
                                        {slot.label.replace("-", " - ")}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </button>
                            ))}
                        </div>
                      </div>
                      <div className="parking-map-divider"></div>
                      <div className="parking-map-side parking-right">
                        <div className="pillar-pill">Pillar No. 13</div>
                        <div className="slot-column">
                          {(floorSlots[activeFloor] ?? [])
                            .filter((_, index) => index % 2 === 1)
                            .map((slot) => (
                              <button
                                key={slot.label}
                                className={`slot-card ${selectedSlot === slot.label ? "active" : ""} ${slot.occupied ? "occupied" : ""}`}
                                onClick={() =>
                                  !slot.occupied && setSelectedSlot(slot.label)
                                }
                                disabled={slot.occupied}
                              >
                                <div className="slot-card-content">
                                  {slot.occupied ? (
                                    <>
                                      <span className="slot-icon">
                                        <CarFront size={16} />
                                      </span>

                                      <span>
                                        {slot.label.replace("-", " - ")}
                                      </span>

                                      <span className="occupied-badge">
                                        Occupied
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <CarFront size={14} />

                                      <span>
                                        {slot.label.replace("-", " - ")}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </button>
                            ))}
                        </div>
                      </div>
                    </div>

                    <div className="slot-legend">
                      <div className="legend-item">
                        <span className="legend-box occupied"></span>
                        Occupied
                      </div>

                      <div className="legend-item">
                        <span className="legend-box available"></span>
                        Available
                      </div>

                      <div className="legend-item">
                        <span className="legend-box selected"></span>
                        Selected
                      </div>
                    </div>

                    <div className="booking-actions">
                      <button
                        className="booking-button"
                        disabled={!selectedSlot}
                        onClick={() => setScreen("payment")}
                      >
                        Continue Booking
                      </button>
                    </div>
                  </div>
                )}

                {screen === "payment" && selectedParking && (
                  <div className="screen screen-payment">
                    <div className="minimal-header">
                      <button
                        className="back-button"
                        onClick={() => setScreen("parkingSelection")}
                      >
                        <ArrowLeft size={18} />
                      </button>

                      <h1>Booking Details</h1>
                    </div>

                    <div className="booking-hero-card">
                      <div className="booking-hero-content">
                        <span className="booking-hero-location">
                          {selectedParking.title}
                        </span>

                        <h2 className="booking-hero-slot">{selectedSlot}</h2>

                        <div className="booking-hero-meta">
                          <span className="booking-pill">
                            Spot {selectedSlot}
                          </span>

                          <span className="booking-pill">{activeFloor}</span>

                          <span className="booking-pill">
                            {bookingDuration} Hours
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bookings-stats-card">
                      <div className="booking-arrival-section">
                        <span className="booking-summary-label">Arriving</span>

                        <div className="time-picker-wrapper">
                          <div className="time-picker-display">
                            <div className="time-wheel-container">
                              <div
                                ref={hourWheelRef}
                                className="time-wheel"
                                onScroll={(e) => {
                                  const el = e.currentTarget as HTMLDivElement;
                                  const idx = Math.round(
                                    el.scrollTop / ITEM_HEIGHT,
                                  );
                                  const clamped = Math.max(
                                    0,
                                    Math.min(hourOptions.length - 1, idx),
                                  );
                                  const hr = hourOptions[clamped];

                                  if (hr !== arrivalHour) setArrivalHour(hr);

                                  if (hourScrollTimeoutRef.current) {
                                    window.clearTimeout(
                                      hourScrollTimeoutRef.current,
                                    );
                                  }

                                  hourScrollTimeoutRef.current =
                                    window.setTimeout(() => {
                                      el.scrollTo({
                                        top: clamped * ITEM_HEIGHT,
                                        behavior: "smooth",
                                      });

                                      hourScrollTimeoutRef.current = null;
                                    }, 120);
                                }}
                              >
                                {hourOptions.map((hour) => (
                                  <button
                                    key={hour}
                                    className={`wheel-option ${hour === arrivalHour ? "active" : ""}`}
                                    onClick={() => setArrivalHour(hour)}
                                  >
                                    {String(hour).padStart(2, "0")}
                                  </button>
                                ))}
                              </div>

                              <div className="wheel-center-line" />
                            </div>

                            <span className="time-separator">:</span>

                            <div className="time-wheel-container">
                              <div
                                ref={minuteWheelRef}
                                className="time-wheel"
                                onScroll={(e) => {
                                  const el = e.currentTarget as HTMLDivElement;
                                  const idx = Math.round(
                                    el.scrollTop / ITEM_HEIGHT,
                                  );
                                  const clamped = Math.max(
                                    0,
                                    Math.min(11, idx),
                                  );

                                  const minute = clamped * 5;

                                  if (minute !== arrivalMinute) {
                                    setArrivalMinute(minute);
                                  }

                                  if (minuteScrollTimeoutRef.current) {
                                    window.clearTimeout(
                                      minuteScrollTimeoutRef.current,
                                    );
                                  }

                                  minuteScrollTimeoutRef.current =
                                    window.setTimeout(() => {
                                      el.scrollTo({
                                        top: clamped * ITEM_HEIGHT,
                                        behavior: "smooth",
                                      });

                                      minuteScrollTimeoutRef.current = null;
                                    }, 120);
                                }}
                              >
                                {minuteOptions.map((minute) => (
                                  <button
                                    key={minute}
                                    className={`wheel-option ${minute === arrivalMinute ? "active" : ""}`}
                                    onClick={() => setArrivalMinute(minute)}
                                  >
                                    {String(minute).padStart(2, "0")}
                                  </button>
                                ))}
                              </div>

                              <div className="wheel-center-line" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="booking-divider"></div>

                      <div className="booking-duration-section">
                        <span className="duration-label">Duration</span>

                        <div className="booking-duration-pill">
                          {bookingDuration} Hours
                        </div>
                      </div>

                      <div className="booking-divider"></div>

                      <div className="booking-leaving-section">
                        <strong className="booking-summary-time">
                          {formatTime(departureHour, departureMinute)}
                        </strong>

                        <span className="leaving-label">Leaving Time</span>
                      </div>
                    </div>

                    <div className="vehicle-detail-card">
                      <div className="vehicle-card-top">
                        <div className="vehicle-icon-box">
                          <CarFront size={22} />
                        </div>

                        <div className="vehicle-info">
                          <strong>{selectedCar}</strong>

                          <span>
                            {selectedCar.includes("Avanza")
                              ? "MPV"
                              : selectedCar.includes("BR-V")
                                ? "SUV"
                                : "MPV"}
                          </span>
                        </div>
                      </div>

                      <div className="vehicle-plate-card">
                        <span className="vehicle-plate-label">
                          Plate Number
                        </span>

                        <strong>
                          {
                            vehicles.find(
                              (vehicle) => vehicle.name === selectedCar,
                            )?.plate
                          }
                        </strong>
                      </div>
                    </div>

                    <div className="amount-banner">
                      <div className="payment-total-card">
                        <div className="payment-total-content">
                          <div>
                            <span className="payment-total-label">
                              Total Payment
                            </span>

                            <strong className="payment-total-price">
                              Rp {formatRupiah(bookingDuration * 10000)}
                            </strong>

                            <span className="payment-total-note">
                              {bookingDuration} Hours Parking
                            </span>
                          </div>

                          <div className="payment-total-icon">
                            <ReceiptText size={46} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="payment-method-card">
                      <div className="payment-method-header">
                        <div>
                          <h3>Payment method</h3>
                        </div>
                        <button className="text-button" onClick={() => {}}>
                          CHANGE
                        </button>
                      </div>
                      <div className="payment-method-list">
                        {["QRIS", "DANA"].map((method) => (
                          <button
                            key={method}
                            className={`payment-method-item ${
                              selectedPaymentMethod === method ? "selected" : ""
                            }`}
                            onClick={() =>
                              setSelectedPaymentMethod(
                                method as "QRIS" | "DANA",
                              )
                            }
                          >
                            <div className="payment-method-left">
                              <span className="payment-method-icon">
                                {method === "QRIS" ? (
                                  <QrCode size={18} />
                                ) : (
                                  <Wallet size={18} />
                                )}
                              </span>

                              <span>{method}</span>
                            </div>

                            {selectedPaymentMethod === method && (
                              <Check size={18} />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {bookingError && (
                      <p
                        style={{
                          color: "red",
                          fontSize: "13px",
                          marginBottom: "8px",
                          textAlign: "center",
                        }}
                      >
                        {bookingError}
                      </p>
                    )}
                    <div className="booking-actions">
                      <button
                        className="booking-button"
                        onClick={() => handleBookingConfirm()}
                        disabled={bookingLoading}
                      >
                        {bookingLoading ? "Processing..." : "Pay & Reserve"}
                      </button>
                    </div>
                  </div>
                )}

                {screen === "paymentSuccess" && recentBooking && (
                  <div className="screen screen-payment-success">
                    {/* Header sukses — hijau gradient */}
                    <div className="success-hero">
                      <div className="success-hero-icon">
                        <Check size={32} strokeWidth={3} />
                      </div>
                      <h1 className="success-hero-title">Booking Confirmed!</h1>
                      <p className="success-hero-sub">
                        Your parking slot has been reserved
                      </p>
                    </div>

                    {/* E-Ticket Card */}
                    <div className="eticket">
                      {/* Ticket Top */}
                      <div className="eticket-top">
                        <div className="eticket-location">
                          <MapPin size={14} strokeWidth={2} />
                          <span>{recentBooking.title}</span>
                        </div>

                        <div className="eticket-slot-row">
                          <div className="eticket-info-block">
                            <span className="eticket-label">Slot</span>
                            <strong className="eticket-value">
                              {selectedSlot}
                            </strong>
                          </div>
                          <div className="eticket-divider-v" />
                          <div className="eticket-info-block">
                            <span className="eticket-label">Floor</span>
                            <strong className="eticket-value">
                              {activeFloor.replace("Floor ", "")}
                            </strong>
                          </div>
                          <div className="eticket-divider-v" />
                          <div className="eticket-info-block">
                            <span className="eticket-label">Duration</span>
                            <strong className="eticket-value">
                              {bookingDuration}h
                            </strong>
                          </div>
                        </div>

                        <div className="eticket-time-row">
                          <div className="eticket-info-block">
                            <span className="eticket-label">Arrival</span>
                            <strong className="eticket-time">
                              {formatTime(arrivalHour, arrivalMinute)}
                            </strong>
                          </div>
                          <div className="eticket-arrow">
                            <MoveRight size={18} strokeWidth={1.5} />
                          </div>
                          <div className="eticket-info-block eticket-info-block--right">
                            <span className="eticket-label">Departure</span>
                            <strong className="eticket-time">
                              {formatTime(departureHour, departureMinute)}
                            </strong>
                          </div>
                        </div>

                        <div className="eticket-vehicle-row">
                          <CarFront size={16} strokeWidth={1.5} />
                          <span>{selectedCar}</span>
                          <span className="eticket-plate">
                            {vehicles.find((v) => v.name === selectedCar)
                              ?.plate ?? ""}
                          </span>
                        </div>
                      </div>

                      {/* Perforated divider */}
                      <div className="eticket-perforation">
                        <div className="eticket-notch eticket-notch--left" />
                        <div className="eticket-dash-line" />
                        <div className="eticket-notch eticket-notch--right" />
                      </div>

                      {/* Ticket Bottom — QR */}
                      <div className="eticket-bottom">
                        <p className="eticket-booking-id">
                          {recentBooking.code.slice(0, 28)}
                        </p>
                        <div className="eticket-qr">
                          <QRCodeSVG
                            value={recentBooking.code}
                            size={160}
                            bgColor="#ffffff"
                            fgColor="#111827"
                            level="M"
                          />
                        </div>
                        <div className="eticket-amount-row">
                          <span>Total Paid</span>
                          <strong>{recentBooking.amount}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="success-actions">
                      <button
                        className="success-btn-secondary"
                        onClick={() => setScreen("home")}
                      >
                        <House size={16} />
                        Back to Home
                      </button>
                      <button
                        className="success-btn-primary"
                        onClick={() => {
                          setScreen("bookings");
                          setSelectedParking(null);
                          setSelectedSlot(null);
                          setSelectedPaymentMethod("QRIS");
                          setBookingDuration(3);
                        }}
                      >
                        <Ticket size={16} />
                        My Bookings
                      </button>
                    </div>
                  </div>
                )}

                {screen === "activeTicket" && recentBooking && (
                  <div className="screen screen-active-ticket">
                    <div className="minimal-header">
                      <button
                        className="back-button"
                        onClick={() => setScreen("bookings")}
                      >
                        <ArrowLeft size={18} />
                      </button>

                      <h1>Active Parking Pass</h1>
                    </div>

                    <div className="ticket-card">
                      <div className="ticket-top">
                        <span className="ticket-status">Active Booking</span>

                        <QrCode size={20} />
                      </div>

                      <h2>{recentBooking.title}</h2>

                      <p>
                        {activeFloor} • Slot {recentBooking.subtitle}
                      </p>

                      <div className="ticket-qr-wrapper">
                        <QRCodeSVG
                          value={recentBooking.code}
                          size={220}
                          bgColor="#FFFFFF"
                          fgColor="#143B33"
                        />
                      </div>

                      <span className="ticket-id">{recentBooking.code}</span>
                    </div>

                    <div className="ticket-info-card">
                      <div className="ticket-info-row">
                        <span>Vehicle</span>
                        <strong>{selectedCar}</strong>
                      </div>

                      <div className="ticket-info-row">
                        <span>Arrival</span>
                        <strong>
                          {String(arrivalHour).padStart(2, "0")}:
                          {String(arrivalMinute).padStart(2, "0")}
                        </strong>
                      </div>

                      <div className="ticket-info-row">
                        <span>Departure</span>
                        <strong>
                          {String(departureHour).padStart(2, "0")}:
                          {String(departureMinute).padStart(2, "0")}
                        </strong>
                      </div>

                      <div className="ticket-info-row">
                        <span>Duration</span>
                        <strong>{bookingDuration} Hours</strong>
                      </div>
                    </div>
                  </div>
                )}

                {screen === "profile" && (
                  <div className="screen screen-profile">
                    <div className="screen-header profile-top-title">
                      <h1>Profile</h1>
                    </div>
                    <div className="profile-header-card">
                      <img
                        src="/profile-parking.svg"
                        alt="SmartPark Profile"
                        className="profile-hero-svg"
                      />

                      <strong>Bagas Aji Herlambang</strong>

                      <span>@ceosmartpark</span>

                      <div className="profile-member-badge">
                        SmartPark Member
                      </div>

                      <button
                        className="profile-edit-btn"
                        title="Edit Profile"
                        onClick={() => setScreen("editProfile")}
                      >
                        <Pencil size={16} />
                      </button>
                    </div>
                    <div className="profile-card">
                      {profileOptions.map((option) => (
                        <button
                          key={option.label}
                          className="profile-item"
                          onClick={() => handleProfileOption(option.action)}
                        >
                          <div className="profile-item-left">
                            <span className="profile-item-icon">
                              <option.icon size={18} />
                            </span>
                            <div>
                              <strong>{option.label}</strong>
                              {option.hint && <span>{option.hint}</span>}
                            </div>
                          </div>
                          <span className="arrow">
                            <ChevronRight size={18} />
                          </span>
                        </button>
                      ))}
                    </div>
                    <div className="more-card">
                      <h2>More</h2>
                      <button
                        className="profile-item"
                        onClick={() => setScreen("help")}
                      >
                        <div className="profile-item-left">
                          <span className="profile-item-icon">
                            <Bell size={18} />
                          </span>
                          <div>
                            <strong>Help & Support</strong>
                          </div>
                        </div>
                        <span className="arrow">
                          <ChevronRight size={18} />
                        </span>
                      </button>
                      <button
                        className="profile-item"
                        onClick={() => setScreen("about")}
                      >
                        <div className="profile-item-left">
                          <span className="profile-item-icon">
                            <Info size={18} />
                          </span>
                          <div>
                            <strong>About App</strong>
                          </div>
                        </div>
                        <span className="arrow">
                          <ChevronRight size={18} />
                        </span>
                      </button>
                    </div>
                  </div>
                )}
                {screen === "carSelection" && (
                  <div className="screen screen-car-selection">
                    <div className="minimal-header">
                      <button
                        className="back-button"
                        onClick={() => setScreen("profile")}
                      >
                        <ArrowLeft size={18} />
                      </button>

                      <h1>Select Your Car</h1>
                    </div>
                    <div className="form-card">
                      <label>Tambah Mobil Baru</label>
                      <input
                        placeholder="Masukkan nama mobil"
                        value={newCarName}
                        onChange={(e) => setNewCarName(e.target.value)}
                      />
                      <input
                        placeholder="Masukkan plat nomor"
                        value={newCarPlate}
                        onChange={(e) => setNewCarPlate(e.target.value)}
                      />
                      <button className="outline-button" onClick={handleAddCar}>
                        Add Car
                      </button>
                    </div>
                    <div className="profile-card">
                      {vehicles.map((vehicle) => (
                        <div
                          key={vehicle.name}
                          className={`profile-item ${selectedCar === vehicle.name ? "active" : ""}`}
                        >
                          <button
                            className="profile-select-button"
                            onClick={() => {
                              setSelectedCar(vehicle.name);
                              setProfileEdit((prev) => ({
                                ...prev,
                                car: vehicle.name,
                                carPlate: vehicle.plate,
                              }));
                            }}
                          >
                            <div className="profile-item-left">
                              <span className="profile-item-icon">
                                <Car size={18} />
                              </span>
                              <div>
                                <strong>{vehicle.name}</strong>
                                <span>{vehicle.plate}</span>
                              </div>
                            </div>
                            <span className="arrow">
                              {selectedCar === vehicle.name
                                ? "<Check size={18}/>"
                                : "<ChevronRight size={18}/>"}
                            </span>
                          </button>
                          <button className="small-icon-button">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="booking-actions">
                      <button
                        className="primary-button"
                        onClick={() => setScreen("profile")}
                      >
                        Save Vehicle
                      </button>
                    </div>
                  </div>
                )}
                {screen === "resetPassword" && (
                  <div className="screen screen-reset-password">
                    <div className="minimal-header">
                      <button
                        className="back-button"
                        onClick={() => setScreen("profile")}
                      >
                        <ArrowLeft size={18} />
                      </button>

                      <h1>Reset Password</h1>
                    </div>
                    <div className="form-card">
                      <label>Email</label>
                      <input
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                      />
                      <label>New Password</label>
                      <input
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                      />
                    </div>
                    <div className="booking-actions">
                      <button
                        className="primary-button"
                        onClick={() => {
                          showToast(
                            "Password berhasil di-reset. Silakan login kembali.",
                            "success",
                          );
                          setScreen("login");
                        }}
                      >
                        Reset Password
                      </button>
                    </div>
                  </div>
                )}
                {screen === "language" && (
                  <div className="screen screen-language">
                    <div className="minimal-header">
                      <button
                        className="back-button"
                        onClick={() => setScreen("profile")}
                      >
                        <ArrowLeft size={18} />
                      </button>

                      <h1>Change Language</h1>
                    </div>
                    <div className="form-card">
                      {[
                        { code: "ID", label: "Bahasa Indonesia" },
                        { code: "EN", label: "English" },
                      ].map((lang) => (
                        <button
                          key={lang.code}
                          className={`profile-item ${language === lang.code ? "active" : ""}`}
                          onClick={() => setLanguage(lang.code as "ID" | "EN")}
                        >
                          <div className="profile-item-left">
                            <span className="profile-item-icon">
                              <Globe size={18} />
                            </span>
                            <div>
                              <strong>{lang.label}</strong>
                            </div>
                          </div>
                          <span className="arrow">
                            {language === lang.code
                              ? "<Check size={18}/>"
                              : "<ChevronRight size={18}/>"}
                          </span>
                        </button>
                      ))}
                    </div>
                    <div className="booking-actions">
                      <button
                        className="primary-button"
                        onClick={() => setScreen("profile")}
                      >
                        Save Language
                      </button>
                    </div>
                  </div>
                )}
                {screen === "help" && (
                  <div className="screen screen-help">
                    <div className="minimal-header">
                      <button
                        className="back-button"
                        onClick={() => setScreen("profile")}
                      >
                        <ArrowLeft size={18} />
                      </button>

                      <h1>Help & Support</h1>
                    </div>
                    <div className="profile-card">
                      <div className="profile-item-left">
                        <span className="profile-item-icon">
                          <MessageCircle size={18} />
                        </span>
                        <div>
                          <strong>Chat Support</strong>
                          <span>Chat dengan tim bantuan</span>
                        </div>
                      </div>
                      <div className="profile-item-left">
                        <span className="profile-item-icon">
                          <Mail size={18} />
                        </span>
                        <div>
                          <strong>Email</strong>
                          <span>support@smartpark.id</span>
                        </div>
                      </div>
                      <div className="profile-item-left">
                        <span className="profile-item-icon">
                          <PhoneCall size={18} />
                        </span>
                        <div>
                          <strong>Hotline</strong>
                          <span>021-1234-5678</span>
                        </div>
                      </div>
                    </div>
                    <div className="booking-actions">
                      <button
                        className="primary-button"
                        onClick={() => setScreen("profile")}
                      >
                        Back to Profile
                      </button>
                    </div>
                  </div>
                )}
                {screen === "about" && (
                  <div className="screen screen-about">
                    <div className="minimal-header">
                      <button
                        className="back-button"
                        onClick={() => setScreen("profile")}
                      >
                        <ArrowLeft size={18} />
                      </button>

                      <h1>About App</h1>
                    </div>
                    <div className="profile-card">
                      <div className="profile-item-left">
                        <span className="profile-item-icon">
                          <Info size={18} />
                        </span>
                        <div>
                          <strong>Version</strong>
                          <span>1.0.0</span>
                        </div>
                      </div>
                      <div className="profile-item-left">
                        <span className="profile-item-icon">
                          <Sparkles size={18} />
                        </span>
                        <div>
                          <strong>Theme</strong>
                          <span>Modern Soft UI</span>
                        </div>
                      </div>
                      <div className="profile-item-left">
                        <span className="profile-item-icon">
                          <ShieldCheck size={18} />
                        </span>
                        <div>
                          <strong>Security</strong>
                          <span>Protected by Secure Login</span>
                        </div>
                      </div>
                    </div>
                    <div className="booking-actions">
                      <button
                        className="primary-button"
                        onClick={() => setScreen("profile")}
                      >
                        Back to Profile
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {["home", "bookings", "profile"].includes(screen) && (
          <div className="bottom-nav">
            <button
              className={`nav-action ${screen === "home" ? "active" : ""}`}
              onClick={() => setScreen("home")}
            >
              <span>
                <House size={20} />
              </span>
              <span>Home</span>
            </button>
            <button
              className={`nav-action ${screen === "bookings" ? "active" : ""}`}
              onClick={() => setScreen("bookings")}
            >
              <span>
                <Ticket size={20} />
              </span>
              <span>My bookings</span>
            </button>
            <button
              className={`nav-action ${screen === "profile" ? "active" : ""}`}
              onClick={() => setScreen("profile")}
            >
              <span>
                <User size={20} />
              </span>
              <span>Profile</span>
            </button>
          </div>
        )}
        {/* Toast Notification */}
        {toast && (
          <div
            style={{
              position: "fixed",
              bottom: "80px",
              left: "50%",
              transform: "translateX(-50%)",
              background:
                toast.type === "success"
                  ? "#16a34a"
                  : toast.type === "error"
                    ? "#dc2626"
                    : "#1d4ed8",
              color: "white",
              padding: "12px 20px",
              borderRadius: "12px",
              fontSize: "13px",
              fontWeight: 500,
              zIndex: 9999,
              maxWidth: "320px",
              textAlign: "center",
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
              animation: "fadeInUp 0.3s ease",
            }}
          >
            {toast.message}
          </div>
        )}
      </div>
    </div>
  );
}
