

import  {
  useState,
} from 'react';

import { motion } from 'framer-motion';

import {
  ArrowLeft,
  Car,
  Warehouse,
  Home,
  Phone,
  Mail,
  LogOut,
  RefreshCw,
  User,
} from 'lucide-react';
/* ───────────────────────────────────────────── */
/* TYPES */
/* ───────────────────────────────────────────── */

type BookingType =
  | 'parking'
  | 'garage'
  | 'residence';

type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'active'
  | 'SUCCESS'
  | 'FAILED';

interface EarlyCheckOut {
  markedAt: string;
  originalTo: string;
}

interface BookingDetail {
  _id: string;
  bookingId: string;
  orderNumber: string;
  status: BookingStatus;
  createdAt: string;
  vehicleNumber: string;
  totalAmount: number;

  bookingPeriod?: {
    from: string;
    to: string;
  };

  placeInfo?: {
    name: string;
    address: string;
    phoneNo: string;
  };

  slot?: string;
  type: BookingType;

  paymentMethod?: string;
  paymentStatus?: string;

  earlyCheckOut?: EarlyCheckOut | null;

  user?: {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
  };
}

interface Props {
  bookingData: BookingDetail;
  onBack: () => void;
}

/* ───────────────────────────────────────────── */
/* COLORS */
/* ───────────────────────────────────────────── */

const C = {
  bg: '#06070b',
  card: 'rgba(17,20,30,0.78)',
  border: 'rgba(255,255,255,0.06)',

  text: '#ffffff',
  gray: '#94a3b8',

  brand: '#ff9500',
  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b',

  parking: '#60a5fa',
  garage: '#a78bfa',
  residence: '#34d399',
};

/* ───────────────────────────────────────────── */
/* HELPERS */
/* ───────────────────────────────────────────── */
const fadeUp = {
  hidden: {
    opacity: 0,
    y: 24,
  },

  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,

    transition: {
      delay: i * 0.07,
      duration: 0.55,
    },
  }),
};

const getTypeColor = (
  type: BookingType
) =>
  ({
    parking: C.parking,
    garage: C.garage,
    residence: C.residence,
  }[type]);

const getTypeBg = (
  type: BookingType
) =>
  ({
    parking: 'rgba(96,165,250,0.1)',
    garage: 'rgba(167,139,250,0.1)',
    residence: 'rgba(52,211,153,0.1)',
  }[type]);

const getTypeLabel = (
  type: BookingType
) =>
  ({
    parking: 'Parking Booking',
    garage: 'Garage Booking',
    residence: 'Residence Booking',
  }[type]);

const getStatusColor = (
  status: string
) => {
  switch (
    status?.toUpperCase()
  ) {
    case 'SUCCESS':
    case 'CONFIRMED':
    case 'ACTIVE':
    case 'COMPLETED':
      return C.success;

    case 'PENDING':
      return C.warning;

    case 'FAILED':
    case 'CANCELLED':
      return C.error;

    default:
      return '#60a5fa';
  }
};

const fmtDateTime = (
  iso: string
) => {
  try {
    return new Date(
      iso
    ).toLocaleString();
  } catch {
    return 'N/A';
  }
};

/* ───────────────────────────────────────────── */
/* ICON */
/* ───────────────────────────────────────────── */

const TypeIcon = ({
  type,
  size = 24,
}: {
  type: BookingType;
  size?: number;
}) => {
  const color =
    getTypeColor(type);

  if (type === 'parking')
    return (
      <Car
        size={size}
        color={color}
      />
    );

  if (type === 'garage')
    return (
      <Warehouse
        size={size}
        color={color}
      />
    );

  return (
    <Home
      size={size}
      color={color}
    />
  );
};

/* ───────────────────────────────────────────── */
/* MODERN COMPONENTS */
/* ───────────────────────────────────────────── */

const SectionTitle = ({
  children,
}: any) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent:
        'space-between',
      marginBottom: 16,
    }}
  >
    <h3
      style={{
        margin: 0,
        color: '#fff',
        fontSize: 20,
        fontWeight: 800,
      }}
    >
      {children}
    </h3>

    <div
      style={{
        width: 50,
        height: 4,
        borderRadius: 999,
        background:
          'linear-gradient(90deg,#ff9500,#ffb347)',
      }}
    />
  </div>
);

const Card = ({
  children,
  delay = 0,
}: any) => (
  <motion.div
    custom={delay}
    variants={fadeUp}
    initial="hidden"
    animate="visible"
    whileHover={{
      y: -3,
    }}
    style={{
      background: C.card,
      border:
        '1px solid rgba(255,255,255,0.06)',
      borderRadius: 28,
      padding: 24,
      backdropFilter: 'blur(18px)',
      boxShadow:
        '0 20px 50px rgba(0,0,0,0.28)',
      marginBottom: 20,
    }}
  >
    {children}
  </motion.div>
);

const InfoRow = ({
  label,
  value,
  valueColor,
}: any) => (
  <motion.div
    whileHover={{
      x: 4,
    }}
    style={{
      display: 'flex',
      justifyContent:
        'space-between',
      alignItems: 'center',
      padding: '15px 0',
      borderBottom:
        '1px solid rgba(255,255,255,0.05)',
    }}
  >
    <span
      style={{
        fontSize: 13,
        color: '#94a3b8',
      }}
    >
      {label}
    </span>

    <span
      style={{
        fontSize: 14,
        fontWeight: 700,
        color:
          valueColor || '#fff',
      }}
    >
      {value}
    </span>
  </motion.div>
);

/* ───────────────────────────────────────────── */
/* MAIN */
/* ───────────────────────────────────────────── */

export default function BookingDetailPanel({
  bookingData,
  onBack,
}: Props) {
  const [booking] =
    useState(bookingData);

  const typeColor =
    getTypeColor(
      booking.type
    );

  const statusColor =
    getStatusColor(
      booking.status
    );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      style={{
        maxWidth: 860,
        margin: '0 auto',
        width: '100%',
        paddingBottom: 50,
        position: 'relative',
      }}
    >
      {/* Glow */}
      <div
        style={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 260,
          height: 260,
          borderRadius: '50%',
          background:
            'rgba(255,149,0,0.08)',
          filter: 'blur(100px)',
        }}
      />

      {/* Back Button */}
      <motion.button
        whileHover={{
          x: -4,
        }}
        whileTap={{
          scale: 0.96,
        }}
        onClick={onBack}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background:
            'rgba(255,255,255,0.03)',
          border:
            '1px solid rgba(255,255,255,0.06)',
          color: '#d6d9e3',
          cursor: 'pointer',
          padding: '13px 18px',
          borderRadius: 16,
          fontFamily: 'inherit',
          fontSize: 14,
          fontWeight: 600,
          marginBottom: 24,
          backdropFilter:
            'blur(10px)',
        }}
      >
        <ArrowLeft size={16} />
        Back to Bookings
      </motion.button>

      {/* HERO */}
      <motion.div
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 30,
          padding: 30,
          marginBottom: 24,
          background:
            'linear-gradient(135deg, rgba(255,149,0,0.12), rgba(255,149,0,0.04))',
          border:
            '1px solid rgba(255,149,0,0.18)',
          backdropFilter:
            'blur(18px)',
          boxShadow:
            '0 30px 70px rgba(0,0,0,0.35)',
        }}
      >
        {/* Glow */}
        <div
          style={{
            position: 'absolute',
            top: -90,
            right: -90,
            width: 240,
            height: 240,
            borderRadius: '50%',
            background:
              'rgba(255,149,0,0.18)',
            filter: 'blur(90px)',
          }}
        />

        <div
          style={{
            display: 'flex',
            justifyContent:
              'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 20,
            position: 'relative',
            zIndex: 2,
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 18,
              alignItems: 'center',
            }}
          >
            <motion.div
              animate={{
                y: [0, -6, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
              }}
              style={{
                width: 80,
                height: 80,
                borderRadius: 26,
                background:
                  getTypeBg(
                    booking.type
                  ),
                border: `1px solid ${typeColor}30`,
                display: 'flex',
                alignItems: 'center',
                justifyContent:
                  'center',
              }}
            >
              <TypeIcon
                type={booking.type}
                size={36}
              />
            </motion.div>

            <div>
              <p
                style={{
                  margin: 0,
                  color: '#94a3b8',
                  fontSize: 12,
                  letterSpacing:
                    '2px',
                  textTransform:
                    'uppercase',
                  fontWeight: 700,
                }}
              >
                Booking Details
              </p>

              <h1
                style={{
                  margin:
                    '8px 0 4px',
                  color: '#fff',
                  fontSize: 34,
                  fontWeight: 900,
                  letterSpacing:
                    '-1px',
                }}
              >
                {
                  booking.orderNumber
                }
              </h1>

              <p
                style={{
                  margin: 0,
                  color: typeColor,
                  fontWeight: 700,
                }}
              >
                {getTypeLabel(
                  booking.type
                )}
              </p>
            </div>
          </div>

          {/* Amount */}
          <motion.div
            whileHover={{
              scale: 1.04,
            }}
            style={{
              background:
                'rgba(255,255,255,0.05)',
              border:
                '1px solid rgba(255,255,255,0.08)',
              borderRadius: 24,
              padding:
                '18px 24px',
              minWidth: 190,
              textAlign: 'right',
            }}
          >
            <p
              style={{
                margin: 0,
                color: '#94a3b8',
                fontSize: 11,
                letterSpacing:
                  '1px',
                textTransform:
                  'uppercase',
                fontWeight: 700,
              }}
            >
              Total Amount
            </p>

            <h2
              style={{
                margin:
                  '10px 0 0',
                color: '#fff',
                fontSize: 42,
                fontWeight: 900,
                letterSpacing:
                  '-2px',
              }}
            >
              $
              {booking.totalAmount?.toFixed(
                2
              )}
            </h2>
          </motion.div>
        </div>
      </motion.div>

      {/* STATUS */}
      <motion.div
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        style={{
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          marginBottom: 24,
        }}
      >
        <motion.div
          whileHover={{
            scale: 1.03,
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background:
              'rgba(255,255,255,0.04)',
            border: `1px solid ${statusColor}25`,
            padding:
              '12px 18px',
            borderRadius: 999,
          }}
        >
          <motion.div
            animate={{
              scale: [
                1,
                1.3,
                1,
              ],
            }}
            transition={{
              repeat:
                Infinity,
              duration: 2,
            }}
            style={{
              width: 10,
              height: 10,
              borderRadius:
                '50%',
              background:
                statusColor,
            }}
          />

          <span
            style={{
              color:
                statusColor,
              fontWeight: 800,
              fontSize: 13,
            }}
          >
            {booking.status}
          </span>
        </motion.div>
      </motion.div>

      {/* BOOKING INFO */}
      <SectionTitle>
        Booking Information
      </SectionTitle>

      <Card delay={2}>
        <InfoRow
          label="Order Number"
          value={
            booking.orderNumber
          }
        />

        <InfoRow
          label="Vehicle Number"
          value={
            booking.vehicleNumber
          }
          valueColor={C.brand}
        />

        <InfoRow
          label="Booking ID"
          value={
            booking.bookingId
          }
        />

        <InfoRow
          label="Created At"
          value={fmtDateTime(
            booking.createdAt
          )}
        />
      </Card>

      {/* CUSTOMER */}
      {booking.user && (
        <>
          <SectionTitle>
            Customer
          </SectionTitle>

          <Card delay={3}>
            <div
              style={{
                display: 'flex',
                alignItems:
                  'center',
                gap: 16,
                marginBottom: 20,
              }}
            >
              <motion.div
                whileHover={{
                  scale: 1.05,
                }}
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: 22,
                  background:
                    'rgba(255,149,0,0.1)',
                  border:
                    '1px solid rgba(255,149,0,0.2)',
                  display: 'flex',
                  alignItems:
                    'center',
                  justifyContent:
                    'center',
                }}
              >
                <User
                  size={28}
                  color={C.brand}
                />
              </motion.div>

              <div>
                <h3
                  style={{
                    margin:
                      '0 0 4px',
                    color: '#fff',
                    fontSize: 22,
                    fontWeight: 800,
                  }}
                >
                  {
                    booking.user
                      .firstName
                  }{' '}
                  {
                    booking.user
                      .lastName
                  }
                </h3>

                <p
                  style={{
                    margin: 0,
                    color:
                      '#94a3b8',
                  }}
                >
                  Customer
                </p>
              </div>
            </div>

            <InfoRow
              label="Phone"
              value={
                booking.user
                  .phone
              }
            />

            {booking.user
              .email && (
              <InfoRow
                label="Email"
                value={
                  booking.user
                    .email
                }
              />
            )}

            {/* ACTIONS */}
            <div
              style={{
                display: 'flex',
                gap: 12,
                marginTop: 22,
              }}
            >
              <motion.a
                whileHover={{
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                href={`tel:${booking.user.phone}`}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems:
                    'center',
                  justifyContent:
                    'center',
                  gap: 8,
                  background:
                    'linear-gradient(135deg,#ff9500,#ff7b00)',
                  padding:
                    '14px',
                  borderRadius: 18,
                  textDecoration:
                    'none',
                  color: '#fff',
                  fontWeight: 700,
                  boxShadow:
                    '0 14px 30px rgba(255,149,0,0.3)',
                }}
              >
                <Phone size={16} />
                Call
              </motion.a>

              {booking.user
                .email && (
                <motion.a
                  whileHover={{
                    scale: 1.02,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  href={`mailto:${booking.user.email}`}
                  style={{
                    flex: 1,
                    display:
                      'flex',
                    alignItems:
                      'center',
                    justifyContent:
                      'center',
                    gap: 8,
                    background:
                      'rgba(255,255,255,0.04)',
                    border:
                      '1px solid rgba(255,255,255,0.06)',
                    padding:
                      '14px',
                    borderRadius: 18,
                    textDecoration:
                      'none',
                    color:
                      '#fff',
                    fontWeight: 700,
                  }}
                >
                  <Mail size={16} />
                  Email
                </motion.a>
              )}
            </div>
          </Card>
        </>
      )}

      {/* PAYMENT */}
      <SectionTitle>
        Payment Details
      </SectionTitle>

      <Card delay={4}>
        <InfoRow
          label="Amount"
          value={`$${booking.totalAmount?.toFixed(
            2
          )}`}
          valueColor={C.success}
        />

        <InfoRow
          label="Payment Method"
          value={
            booking.paymentMethod ||
            'N/A'
          }
        />

        <InfoRow
          label="Payment Status"
          value={
            booking.paymentStatus ||
            'N/A'
          }
          valueColor={statusColor}
        />
      </Card>

      {/* ACTIONS */}
      <motion.div
        custom={5}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        style={{
          display: 'flex',
          gap: 14,
          flexWrap: 'wrap',
          marginTop: 10,
        }}
      >
        <motion.button
          whileHover={{
            scale: 1.02,
            y: -2,
          }}
          whileTap={{
            scale: 0.98,
          }}
          style={{
            flex: 1,
            minWidth: 220,
            display: 'flex',
            alignItems: 'center',
            justifyContent:
              'center',
            gap: 10,
            background:
              'linear-gradient(135deg,#ff9500,#ff7b00)',
            border: 'none',
            borderRadius: 20,
            padding:
              '18px',
            color: '#fff',
            fontWeight: 800,
            fontSize: 15,
            cursor: 'pointer',
            boxShadow:
              '0 16px 36px rgba(255,149,0,0.3)',
          }}
        >
          <RefreshCw size={18} />
          Update Status
        </motion.button>

        <motion.button
          whileHover={{
            scale: 1.02,
            y: -2,
          }}
          whileTap={{
            scale: 0.98,
          }}
          style={{
            flex: 1,
            minWidth: 220,
            display: 'flex',
            alignItems: 'center',
            justifyContent:
              'center',
            gap: 10,
            background:
              'rgba(239,68,68,0.12)',
            border:
              '1px solid rgba(239,68,68,0.2)',
            borderRadius: 20,
            padding:
              '18px',
            color: '#ef4444',
            fontWeight: 800,
            fontSize: 15,
            cursor: 'pointer',
          }}
        >
          <LogOut size={18} />
          Cancel Booking
        </motion.button>
      </motion.div>
    </motion.div>
  );
}