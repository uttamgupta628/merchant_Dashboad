import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import axiosInstance from './Axios';
import BookingDetailPanel from './BookingDetailPanel';
import {
  C, StatsData, RecentBooking, VenueType,
  VENUE_COLOR, VENUE_BG, fmtDateTime, statusColor, statusBg,
} from './Tokens';
import { VenueIcon } from './Ui';

interface BookingsTabProps { data: StatsData; }

export const BookingsTab: React.FC<BookingsTabProps> = ({ data }) => {
  const [filter, setFilter]         = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [detailLoading, setDetailLoading]     = useState(false);

  const filtered = filter === 'all'
    ? data.recentBookings
    : data.recentBookings.filter(b => b.type === filter);

  if (selectedBooking) {
    return (
      <BookingDetailPanel
        bookingData={selectedBooking}
        onBack={() => setSelectedBooking(null)}
      />
    );
  }

  const handleRowClick = async (booking: RecentBooking) => {
    setDetailLoading(true);
    const token = sessionStorage.getItem('merchant_token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const endpointMap: Record<string, string> = {
        garage: 'garage', residence: 'residence', parking: 'parkinglot',
      };
      const id = booking._id;

      if (booking.type === 'parking') {
        const listRes = await axiosInstance.get('/merchants/parkinglot/booking', { headers });
        const list: any[] =
          listRes.data?.data?.bookings ?? listRes.data?.data?.records ??
          listRes.data?.data ?? listRes.data?.bookings ?? listRes.data ?? [];

        const d = Array.isArray(list) ? list.find((b: any) => b._id === id || b.bookingId === id) : null;
        if (!d) throw new Error('Not found in list');

        const raw = booking as any;
        setSelectedBooking({
          _id: d._id ?? id, bookingId: d._id ?? id,
          orderNumber: d.orderNumber ?? `#${id?.slice(-6).toUpperCase()}`,
          createdAt: d.bookingPeriod?.from ?? d.rentFrom ?? raw.from,
          vehicleNumber: d.vehicleNumber ?? raw.vehicleNumber ?? 'N/A',
          type: 'parking', slot: d.bookedSlot ?? d.rentedSlot ?? d.slot ?? raw.slot ?? '',
          status: d.paymentDetails?.status ?? d.status ?? raw.status,
          paymentMethod: d.paymentDetails?.method ?? d.paymentDetails?.paymentMethod ?? raw.paymentMethod ?? 'N/A',
          paymentStatus: d.paymentDetails?.status ?? raw.status,
          totalAmount: d.paymentDetails?.amountPaid ?? d.paymentDetails?.totalAmount ?? d.amountToPaid ?? raw.amount ?? 0,
          bookingPeriod: { from: d.bookingPeriod?.from ?? d.rentFrom ?? raw.from, to: d.bookingPeriod?.to ?? d.rentTo ?? raw.to },
          placeInfo: d.parking ? { name: d.parking.name ?? d.parking.parkingName ?? '', address: d.parking.address ?? '', phoneNo: d.parking.contactNumber ?? 'N/A' } : undefined,
          user: d.customer ? { firstName: d.customer.name?.split(' ')[0] ?? '', lastName: d.customer.name?.split(' ').slice(1).join(' ') ?? '', phone: d.customer.phone ?? '', email: d.customer.email ?? '' }
            : raw.customerName ? { firstName: raw.customerName?.split(' ')[0] ?? '', lastName: raw.customerName?.split(' ').slice(1).join(' ') ?? '', phone: '', email: '' } : undefined,
          paymentDetails: d.paymentDetails,
        });
        setDetailLoading(false);
        return;
      }

      const res = await axiosInstance.get(`/merchants/${endpointMap[booking.type]}/booking/${id}`, { headers });
      const d = res.data?.data;
      const raw = booking as any;
      setSelectedBooking({
        _id: d._id, bookingId: d._id,
        orderNumber: d.orderNumber ?? `#${d._id?.slice(-6).toUpperCase()}`,
        createdAt: d.bookingPeriod?.from ?? d.createdAt,
        vehicleNumber: d.vehicleNumber ?? 'N/A',
        type: booking.type, slot: d.slot ?? d.bookedSlot ?? d.slotNumber ?? '',
        status: d.paymentDetails?.status ?? booking.status,
        paymentMethod: d.paymentDetails?.method ?? 'N/A',
        paymentStatus: d.paymentDetails?.status ?? booking.status,
        totalAmount: d.paymentDetails?.amountPaid ?? d.paymentDetails?.totalAmount ?? booking.amount,
        bookingPeriod: d.bookingPeriod ? { from: d.bookingPeriod.from, to: d.bookingPeriod.to } : undefined,
        placeInfo: (() => {
          const place = d.garage ?? d.residence ?? d.parking;
          if (!place) return undefined;
          return { name: place.name ?? place.ownerName ?? '', address: place.address ?? '', phoneNo: place.contactNumber ?? 'N/A' };
        })(),
        user: d.customer ? { firstName: d.customer.name?.split(' ')[0] ?? '', lastName: d.customer.name?.split(' ').slice(1).join(' ') ?? '', phone: d.customer.phone ?? '', email: d.customer.email ?? '' } : undefined,
        paymentDetails: d.paymentDetails,
      });
    } catch {
      const raw = booking as any;
      setSelectedBooking({
        _id: raw._id, bookingId: raw._id,
        orderNumber: `#${raw._id?.slice(-6).toUpperCase()}`,
        createdAt: raw.from, vehicleNumber: raw.vehicleNumber ?? 'N/A',
        totalAmount: raw.amount ?? 0, type: booking.type, slot: raw.slot ?? '',
        status: raw.status, paymentMethod: raw.paymentMethod ?? 'N/A', paymentStatus: raw.status,
        bookingPeriod: raw.from && raw.to ? { from: raw.from, to: raw.to } : undefined,
        user: raw.customerName ? { firstName: raw.customerName?.split(' ')[0] ?? '', lastName: raw.customerName?.split(' ').slice(1).join(' ') ?? '', phone: '', email: '' } : undefined,
      });
    } finally { setDetailLoading(false); }
  };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%' }}>
      {detailLoading && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(247,243,238,0.7)',
          backdropFilter: 'blur(10px)', zIndex: 200,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 14,
        }}>
          <Loader2 size={32} color={C.brand} style={{ animation: 'spin 1s linear infinite' }} />
          <span style={{ color: C.textSub, fontSize: 14, fontWeight: 500 }}>Loading booking details…</span>
        </div>
      )}

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 9, marginBottom: 22, flexWrap: 'wrap' }}>
        {['all', 'parking', 'garage', 'residence'].map(f => {
          const active = filter === f;
          const vc = f === 'all' ? C.brand : VENUE_COLOR[f as VenueType];
          return (
            <button key={f} onClick={() => setFilter(f)} className="filter-pill" style={{
              border: `1.5px solid ${active ? vc : C.border}`,
              background: active ? `${vc}12` : C.card,
              color: active ? vc : C.gray,
              boxShadow: active ? `0 2px 8px ${vc}20` : 'none',
            }}>
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p style={{ color: C.gray, textAlign: 'center', padding: 48 }}>No bookings found.</p>
      )}

      <div className="fade-in" style={{
        background: C.card, borderRadius: 22,
        border: `1.5px solid ${C.border}`, overflow: 'hidden',
        boxShadow: '0 4px 16px rgba(28,20,16,0.07)',
      }}>
        {filtered.map(booking => {
          const vc  = VENUE_COLOR[booking.type];
          const vbg = VENUE_BG[booking.type];
          return (
            <div
              key={booking._id}
              className="booking-row"
              onClick={() => handleRowClick(booking)}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                background: vbg, border: `1px solid ${vc}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <VenueIcon type={booking.type} size={17} color={vc} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: 7, alignItems: 'center', marginBottom: 2 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{booking.customerName}</span>
                  {booking.isMonthly && (
                    <span style={{
                      fontSize: 10, fontWeight: 700,
                      background: C.brandLight, color: C.brand,
                      padding: '2px 7px', borderRadius: 20,
                    }}>Monthly</span>
                  )}
                </div>
                <p style={{ fontSize: 12, color: C.gray, margin: 0 }}>
                  Slot {booking.slot} · {fmtDateTime(booking.from)}
                </p>
              </div>

              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p style={{ fontWeight: 700, margin: 0, fontSize: 15 }}>
                  ${booking.amount.toFixed(2)}
                </p>
                <div style={{
                  padding: '2px 9px', borderRadius: 20, display: 'inline-block', marginTop: 4,
                  background: statusBg(booking.status),
                }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: statusColor(booking.status) }}>
                    {booking.status}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookingsTab;