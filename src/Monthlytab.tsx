import React from "react";
import { motion, Variants } from "framer-motion";
import { Gift } from "lucide-react";
import { StatsData } from "./Tokens";
import { VenueIcon } from "./Ui";

interface MonthlyTabProps {
  data: StatsData;
}

const ORANGE = "#FFA629";
const ORANGE_LIGHT = "#FF8E0033";
const ORANGE_BORDER = "#FFA62940";

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

const statItemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.2 + i * 0.1,
      type: "spring" as const,
      stiffness: 200,
    },
  }),
};

export const MonthlyTab: React.FC<MonthlyTabProps> = ({ data }) => {
  const totalMRR = data.venues
    .filter((v) => v.monthlyChargeEnabled)
    .reduce((s, v) => s + v.monthlyRate * v.activeMonthlySubscriptions, 0);
  const totalSubs = data.venues
    .filter((v) => v.monthlyChargeEnabled)
    .reduce((s, v) => s + v.activeMonthlySubscriptions, 0);
  const monthlyVenues = data.venues.filter((v) => v.monthlyChargeEnabled);

  return (
    <>
      <style>{`
        .monthly-tab {
          max-width: 1280px;
          margin: 0 auto;
          width: 100%;
          padding: 0 4px;
          box-sizing: border-box;
          font-family: 'DM Sans', sans-serif;
        }

        .venue-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }
        @media (max-width: 900px) {
          .venue-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .venue-grid { grid-template-columns: 1fr; }
        }

        .venue-card {
          background: ${ORANGE_LIGHT};
          border-radius: 18px;
          padding: 16px 18px 14px;
          border: 1.5px solid ${ORANGE_BORDER};
          box-shadow: 0 2px 10px rgba(255,166,41,0.08);
          box-sizing: border-box;
          font-family: 'DM Sans', sans-serif;
        }

        .venue-card-header {
          display: flex;
          align-items: center;
          margin-bottom: 14px;
          gap: 12px;
        }

        .venue-icon-wrap {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          flex-shrink: 0;
          background: ${ORANGE};
          border: 1.5px solid rgba(255,255,255,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .venue-name {
          font-weight: 700;
          font-size: 15px;
          margin: 0;
          color: #1a1a1a;
          font-family: 'DM Sans', sans-serif;
        }

        .venue-type {
          font-size: 11px;
          color: #888;
          margin: 0;
          text-transform: capitalize;
          font-family: 'DM Sans', sans-serif;
        }

        .venue-rate {
          margin-left: auto;
          display: flex;
          align-items: baseline;
          gap: 2px;
          flex-shrink: 0;
        }

        .venue-rate-num {
          font-size: 22px;
          font-weight: 800;
          color: ${ORANGE};
          font-family: 'DM Sans', sans-serif;
        }

        .venue-rate-unit {
          font-size: 11px;
          color: #888;
          font-family: 'DM Sans', sans-serif;
        }

        .venue-stats {
          display: flex;
          background: rgba(255,255,255,0.55);
          border-radius: 12px;
          padding: 10px 0;
          border: 1px solid rgba(255,166,41,0.15);
          justify-content: space-around;
        }

        .stat-item {
          text-align: center;
          flex: 1;
        }

        .stat-item + .stat-item {
          border-left: 1px solid rgba(255,166,41,0.18);
        }

        .stat-val {
          font-size: 20px;
          font-weight: 800;
          margin: 0;
          font-family: 'DM Sans', sans-serif;
        }

        .stat-label {
          font-size: 10px;
          color: #888;
          margin: 0;
          font-family: 'DM Sans', sans-serif;
        }
      `}</style>

      <div className="monthly-tab">
        {/* Hero MRR Section */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          whileHover={{
            scale: 1.01,
            boxShadow: "0 10px 32px rgba(255,166,41,0.35)",
          }}
          style={{
            background: `linear-gradient(135deg, ${ORANGE} 0%, #E08A00 100%)`,
            borderRadius: 18,
            padding: "24px 28px",
            marginBottom: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 6px 24px rgba(255,166,41,0.30)",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <div>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "rgba(255,255,255,0.85)",
                letterSpacing: 2,
                margin: 0,
                textTransform: "uppercase",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Total Monthly Recurring
            </motion.p>
            <motion.p
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: [1, 1.02, 1],
              }}
              transition={{
                delay: 0.3,
                type: "spring" as const,
                stiffness: 150,
                scale: {
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut",
                },
              }}
              style={{
                fontSize: 48,
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "-2px",
                margin: "4px 0",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              ${totalMRR.toLocaleString()}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.85)",
                margin: 0,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {totalSubs} active subscribers
            </motion.p>
          </div>
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{
              scale: 1,
              rotate: 0,
              y: [0, -5, 0],
            }}
            transition={{
              delay: 0.5,
              type: "spring" as const,
              stiffness: 150,
              y: {
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut",
              },
            }}
            whileHover={{ rotate: 15, scale: 1.1 }}
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "rgba(255,255,255,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Gift size={26} color="#fff" />
          </motion.div>
        </motion.div>

        {/* Empty state */}
        {monthlyVenues.length === 0 && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              color: "#aaa",
              textAlign: "center",
              padding: 48,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            No venues with monthly billing.
          </motion.p>
        )}

        {/* Venue cards grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="venue-grid"
        >
          {monthlyVenues.map((v) => (
            <motion.div
              key={v.id}
              variants={cardVariants}
              layout
              whileHover={{
                y: -4,
                scale: 1.02,
                boxShadow: "0 8px 24px rgba(255,166,41,0.22)",
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.98 }}
              className="venue-card"
            >
              {/* Card Header */}
              <div className="venue-card-header">
                <motion.div
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ type: "spring" as const, stiffness: 300 }}
                  className="venue-icon-wrap"
                >
                  <VenueIcon type={v.type} size={18} color="#fff" />
                </motion.div>
                <div>
                  <p className="venue-name">{v.name}</p>
                  <p className="venue-type">{v.type}</p>
                </div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="venue-rate"
                >
                  <span className="venue-rate-num">${v.monthlyRate}</span>
                  <span className="venue-rate-unit">/mo</span>
                </motion.div>
              </div>

              {/* Stats */}
              <div className="venue-stats">
                {[
                  {
                    val: v.activeMonthlySubscriptions,
                    label: "Active Subs",
                    color: "#1a1a1a",
                  },
                  {
                    val: `$${v.monthlyRate * v.activeMonthlySubscriptions}`,
                    label: "MRR",
                    color: "#FFA629",
                  },
                  {
                    val: `${v.slots.booked}/${v.slots.total}`,
                    label: "Slots Used",
                    color: "#2aa8a0",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    custom={i}
                    variants={statItemVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ scale: 1.05 }}
                    className="stat-item"
                  >
                    <motion.p
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: 0.3 + i * 0.1,
                        type: "spring" as const,
                      }}
                      className="stat-val"
                      style={{ color: item.color }}
                    >
                      {item.val}
                    </motion.p>
                    <p className="stat-label">{item.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </>
  );
};

export default MonthlyTab;
