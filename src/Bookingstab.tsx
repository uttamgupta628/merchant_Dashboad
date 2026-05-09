import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import axiosInstance from "./Axios";
import BookingDetailPanel from "./BookingDetailPanel";
import { C, StatsData, RecentBooking, VenueType, VENUE_COLOR, VENUE_BG, fmtDateTime, statusColor, statusBg } from "./Tokens";
import { VenueIcon } from "./Ui";

interface BookingsTabProps { data: StatsData; }

const O = {
  primary:     "#FFA629",
  primaryDark: "#E08A00",
  white:       "#FFFFFF",
  muted:       "rgba(255,255,255,0.75)",
  iconBg:      "rgba(255,255,255,0.25)",
  iconBorder:  "rgba(255,255,255,0.35)",
  shadow:      "rgba(255,142,0,0.14)",
  successBg:   "#22C55E",
  pendingBg:   "#F59E0B",
  failedBg:    "#EF4444",
};

const getStatusStyle = (status: string) => {
  const s = (status || "").toUpperCase();
  if (["SUCCESS","CONFIRMED","ACTIVE","COMPLETED"].includes(s)) return { bg: O.successBg, color: "#fff" };
  if (["PENDING","IN_PROGRESS"].includes(s)) return { bg: O.pendingBg, color: "#fff" };
  return { bg: O.failedBg, color: "#fff" };
};

export const BookingsTab: React.FC<BookingsTabProps> = ({ data }) => {
  const [filter, setFilter] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const filtered = filter === "all" ? data.recentBookings : data.recentBookings.filter(b => b.type === filter);

  if (selectedBooking) {
    return <BookingDetailPanel bookingData={selectedBooking} onBack={() => setSelectedBooking(null)} />;
  }

  const handleRowClick = async (booking: RecentBooking) => {
    setDetailLoading(true);
    const token = sessionStorage.getItem("merchant_token");
    const headers = { Authorization: "Bearer " + token };
    try {
      const endpointMap: Record<string, string> = { garage: "garage", residence: "residence", parking: "parkinglot" };
      const id = booking._id;
      if (booking.type === "parking") {
        const listRes = await axiosInstance.get("/merchants/parkinglot/booking", { headers });
        const list: any[] = listRes.data?.data?.bookings ?? listRes.data?.data?.records ?? listRes.data?.data ?? listRes.data?.bookings ?? listRes.data ?? [];
        const d = Array.isArray(list) ? list.find((b: any) => b._id === id || b.bookingId === id) : null;
        if (!d) throw new Error("Not found");
        const raw = booking as any;
        setSelectedBooking({ _id: d._id ?? id, bookingId: d._id ?? id, orderNumber: d.orderNumber ?? "#" + id?.slice(-6).toUpperCase(), createdAt: d.bookingPeriod?.from ?? d.rentFrom ?? raw.from, vehicleNumber: d.vehicleNumber ?? raw.vehicleNumber ?? "N/A", type: "parking", slot: d.bookedSlot ?? d.rentedSlot ?? d.slot ?? raw.slot ?? "", status: d.paymentDetails?.status ?? d.status ?? raw.status, paymentMethod: d.paymentDetails?.method ?? d.paymentDetails?.paymentMethod ?? raw.paymentMethod ?? "N/A", paymentStatus: d.paymentDetails?.status ?? raw.status, totalAmount: d.paymentDetails?.amountPaid ?? d.paymentDetails?.totalAmount ?? d.amountToPaid ?? raw.amount ?? 0, bookingPeriod: { from: d.bookingPeriod?.from ?? d.rentFrom ?? raw.from, to: d.bookingPeriod?.to ?? d.rentTo ?? raw.to }, placeInfo: d.parking ? { name: d.parking.name ?? d.parking.parkingName ?? "", address: d.parking.address ?? "", phoneNo: d.parking.contactNumber ?? "N/A" } : undefined, user: d.customer ? { firstName: d.customer.name?.split(" ")[0] ?? "", lastName: d.customer.name?.split(" ").slice(1).join(" ") ?? "", phone: d.customer.phone ?? "", email: d.customer.email ?? "" } : raw.customerName ? { firstName: raw.customerName?.split(" ")[0] ?? "", lastName: raw.customerName?.split(" ").slice(1).join(" ") ?? "", phone: "", email: "" } : undefined, paymentDetails: d.paymentDetails });
        setDetailLoading(false);
        return;
      }
      const res = await axiosInstance.get("/merchants/" + endpointMap[booking.type] + "/booking/" + id, { headers });
      const d = res.data?.data;
      const raw = booking as any;
      setSelectedBooking({ _id: d._id, bookingId: d._id, orderNumber: d.orderNumber ?? "#" + d._id?.slice(-6).toUpperCase(), createdAt: d.bookingPeriod?.from ?? d.createdAt, vehicleNumber: d.vehicleNumber ?? "N/A", type: booking.type, slot: d.slot ?? d.bookedSlot ?? d.slotNumber ?? "", status: d.paymentDetails?.status ?? booking.status, paymentMethod: d.paymentDetails?.method ?? "N/A", paymentStatus: d.paymentDetails?.status ?? booking.status, totalAmount: d.paymentDetails?.amountPaid ?? d.paymentDetails?.totalAmount ?? booking.amount, bookingPeriod: d.bookingPeriod ? { from: d.bookingPeriod.from, to: d.bookingPeriod.to } : undefined, placeInfo: (() => { const place = d.garage ?? d.residence ?? d.parking; if (!place) return undefined; return { name: place.name ?? place.ownerName ?? "", address: place.address ?? "", phoneNo: place.contactNumber ?? "N/A" }; })(), user: d.customer ? { firstName: d.customer.name?.split(" ")[0] ?? "", lastName: d.customer.name?.split(" ").slice(1).join(" ") ?? "", phone: d.customer.phone ?? "", email: d.customer.email ?? "" } : undefined, paymentDetails: d.paymentDetails });
    } catch {
      const raw = booking as any;
      setSelectedBooking({ _id: raw._id, bookingId: raw._id, orderNumber: "#" + raw._id?.slice(-6).toUpperCase(), createdAt: raw.from, vehicleNumber: raw.vehicleNumber ?? "N/A", totalAmount: raw.amount ?? 0, type: booking.type, slot: raw.slot ?? "", status: raw.status, paymentMethod: raw.paymentMethod ?? "N/A", paymentStatus: raw.status, bookingPeriod: raw.from && raw.to ? { from: raw.from, to: raw.to } : undefined, user: raw.customerName ? { firstName: raw.customerName?.split(" ")[0] ?? "", lastName: raw.customerName?.split(" ").slice(1).join(" ") ?? "", phone: "", email: "" } : undefined });
    } finally { setDetailLoading(false); }
  };

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", width: "100%" }}>
      {detailLoading && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(255,246,230,0.85)", backdropFilter: "blur(10px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 14 }}>
          <Loader2 size={32} color={O.primary} style={{ animation: "spin 1s linear infinite" }} />
          <span style={{ color: O.primaryDark, fontSize: 14, fontWeight: 600 }}>Loading booking details...</span>
        </div>
      )}

      <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
        {(["all", "parking", "garage", "residence"] as const).map(f => {
          const active = filter === f;
          return (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 22px", borderRadius: 30, border: "1.5px solid " + (active ? O.primary : "#E5E7EB"), background: active ? O.primary : "#FFFFFF", color: active ? "#FFFFFF" : "#374151", fontWeight: 700, fontSize: 13, cursor: "pointer", outline: "none", transition: "all 0.2s ease", boxShadow: active ? "0 4px 14px rgba(255,166,41,0.30)" : "none" }}>
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && <p style={{ color: "#8A7560", textAlign: "center", padding: 48 }}>No bookings found.</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map(booking => {
          const st = getStatusStyle(booking.status);
          return (
            <div
              key={booking._id}
              onClick={() => handleRowClick(booking)}
              style={{ background: O.primary, borderRadius: 16, border: "1.5px solid " + O.primaryDark, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", transition: "transform 0.18s ease, box-shadow 0.18s ease", boxShadow: "0 2px 10px " + O.shadow }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(255,142,0,0.28)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 10px " + O.shadow; }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 13, flexShrink: 0, background: O.iconBg, border: "1.5px solid " + O.iconBorder, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <VenueIcon type={booking.type} size={20} color={O.white} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 3 }}>
                  <span style={{ fontWeight: 700, fontSize: 15, color: O.white, fontFamily: "Playfair Display, serif" }}>{booking.customerName}</span>
                  {booking.isMonthly && <span style={{ fontSize: 10, fontWeight: 700, background: "rgba(255,255,255,0.25)", color: O.white, padding: "2px 8px", borderRadius: 20 }}>Monthly</span>}
                </div>
                <p style={{ fontSize: 12, color: O.muted, margin: 0 }}>Slot {booking.slot} &middot; {fmtDateTime(booking.from)}</p>
              </div>

              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <p style={{ fontWeight: 800, margin: "0 0 6px", fontSize: 18, color: O.white, fontFamily: "Playfair Display, serif" }}>${booking.amount.toFixed(2)}</p>
                <span style={{ display: "inline-block", padding: "4px 14px", borderRadius: 20, background: st.bg, color: st.color, fontSize: 11, fontWeight: 700 }}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1).toLowerCase()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookingsTab;