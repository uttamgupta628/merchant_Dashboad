import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Car, Warehouse, Home, Phone, Mail, LogOut, RefreshCw, User } from "lucide-react";

type BookingType = "parking" | "garage" | "residence";
interface BookingDetail {
  _id: string; bookingId: string; orderNumber: string; status: any;
  createdAt: string; vehicleNumber: string; totalAmount: number;
  bookingPeriod?: { from: string; to: string };
  placeInfo?: { name: string; address: string; phoneNo: string };
  slot?: string; type: BookingType;
  paymentMethod?: string; paymentStatus?: string;
  user?: { firstName: string; lastName: string; phone: string; email?: string };
}
interface Props { bookingData: BookingDetail; onBack: () => void; }

const O = {
  primary:"#FFA629", primaryDark:"#E08A00", primaryLight:"rgba(255,166,41,0.12)",
  primaryBorder:"rgba(255,166,41,0.30)", card:"#FFFFFF", cardBorder:"rgba(255,166,41,0.25)",
  text:"#1A0F00", muted:"#8A7560", divider:"rgba(255,166,41,0.15)",
  shadow:"rgba(255,142,0,0.10)", success:"#22C55E", warning:"#F59E0B", error:"#EF4444",
};

const fadeUp = {
  hidden:{opacity:0,y:20},
  visible:(i:number=0)=>({opacity:1,y:0,transition:{delay:i*0.07,duration:0.5}}),
};

const getStatusStyle = (status:string) => {
  const s=(status||"").toUpperCase();
  if(["SUCCESS","CONFIRMED","ACTIVE","COMPLETED"].includes(s)) return {bg:O.success,color:"#fff"};
  if(["PENDING","IN_PROGRESS"].includes(s)) return {bg:O.warning,color:"#fff"};
  return {bg:O.error,color:"#fff"};
};

const TypeIcon = ({type,size=24}:{type:BookingType;size?:number}) => {
  if(type==="parking") return <Car size={size} color="#FFFFFF"/>;
  if(type==="garage") return <Warehouse size={size} color="#FFFFFF"/>;
  return <Home size={size} color="#FFFFFF"/>;
};

const fmtDate = (iso:string) => { try{return new Date(iso).toLocaleString();}catch{return "N/A";} };

const InfoRow = ({label,value,valueColor}:{label:string;value:string;valueColor?:string}) => (
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 0",borderBottom:"1px solid "+O.divider}}>
    <span style={{fontSize:13,color:O.muted,fontWeight:500}}>{label}</span>
    <span style={{fontSize:14,fontWeight:700,color:valueColor||O.text}}>{value}</span>
  </div>
);

const Section = ({title,children,delay}:any) => (
  <motion.div custom={delay} variants={fadeUp} initial="hidden" animate="visible"
    style={{background:O.card,borderRadius:20,border:"1.5px solid "+O.cardBorder,padding:"20px 22px",marginBottom:16,boxShadow:"0 4px 18px "+O.shadow}}
  >
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
      <h3 style={{margin:0,color:O.text,fontSize:16,fontWeight:800,fontFamily:"Playfair Display, serif"}}>{title}</h3>
      <div style={{width:40,height:3,borderRadius:999,background:"linear-gradient(90deg,"+O.primary+","+O.primaryDark+")"}}/>
    </div>
    {children}
  </motion.div>
);

export default function BookingDetailPanel({bookingData,onBack}:Props) {
  const [booking] = useState(bookingData);
  const st = getStatusStyle(booking.status);
  return (
    <motion.div initial="hidden" animate="visible" style={{maxWidth:860,margin:"0 auto",width:"100%",paddingBottom:50}}>
      <motion.button whileHover={{x:-4}} whileTap={{scale:0.97}} onClick={onBack}
        style={{display:"flex",alignItems:"center",gap:10,background:O.primaryLight,border:"1.5px solid "+O.primaryBorder,color:O.primaryDark,cursor:"pointer",padding:"11px 18px",borderRadius:14,fontFamily:"inherit",fontSize:14,fontWeight:700,marginBottom:22}}
      >
        <ArrowLeft size={16} color={O.primaryDark}/>Back to Bookings
      </motion.button>

      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
        style={{background:O.primary,borderRadius:24,padding:"28px",marginBottom:20,boxShadow:"0 8px 32px rgba(255,142,0,0.25)",position:"relative",overflow:"hidden"}}
      >
        <div style={{position:"absolute",top:-60,right:-60,width:200,height:200,borderRadius:"50%",background:"rgba(255,255,255,0.10)",pointerEvents:"none"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:20,position:"relative",zIndex:2}}>
          <div style={{display:"flex",gap:18,alignItems:"center"}}>
            <motion.div animate={{y:[0,-5,0]}} transition={{repeat:Infinity,duration:3}}
              style={{width:72,height:72,borderRadius:22,background:"rgba(255,255,255,0.22)",border:"1.5px solid rgba(255,255,255,0.35)",display:"flex",alignItems:"center",justifyContent:"center"}}
            >
              <TypeIcon type={booking.type} size={32}/>
            </motion.div>
            <div>
              <p style={{margin:0,color:"rgba(255,255,255,0.80)",fontSize:11,letterSpacing:"2px",textTransform:"uppercase",fontWeight:700}}>Booking Details</p>
              <h1 style={{margin:"6px 0 4px",color:"#FFFFFF",fontSize:30,fontWeight:900,letterSpacing:"-1px",fontFamily:"Playfair Display, serif"}}>{booking.orderNumber}</h1>
              <p style={{margin:0,color:"rgba(255,255,255,0.85)",fontWeight:600,fontSize:13,textTransform:"capitalize"}}>{booking.type} Booking</p>
            </div>
          </div>
          <div style={{background:"rgba(255,255,255,0.20)",border:"1.5px solid rgba(255,255,255,0.30)",borderRadius:18,padding:"16px 22px",textAlign:"right",minWidth:160}}>
            <p style={{margin:0,color:"rgba(255,255,255,0.80)",fontSize:11,letterSpacing:"1px",textTransform:"uppercase",fontWeight:700}}>Total Amount</p>
            <h2 style={{margin:"8px 0 0",color:"#FFFFFF",fontSize:38,fontWeight:900,letterSpacing:"-1.5px",fontFamily:"Playfair Display, serif"}}>${booking.totalAmount?.toFixed(2)}</h2>
          </div>
        </div>
      </motion.div>

      <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible" style={{marginBottom:20}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:8,background:st.bg+"18",border:"1.5px solid "+st.bg+"40",padding:"10px 18px",borderRadius:999}}>
          <motion.div animate={{scale:[1,1.35,1]}} transition={{repeat:Infinity,duration:2}} style={{width:9,height:9,borderRadius:"50%",background:st.bg}}/>
          <span style={{color:st.bg,fontWeight:800,fontSize:13}}>{booking.status}</span>
        </div>
      </motion.div>

      <Section title="Booking Information" delay={2}>
        <InfoRow label="Order Number"   value={booking.orderNumber}/>
        <InfoRow label="Vehicle Number" value={booking.vehicleNumber} valueColor={O.primary}/>
        <InfoRow label="Booking ID"     value={booking.bookingId}/>
        <InfoRow label="Created At"     value={fmtDate(booking.createdAt)}/>
        {booking.slot && <InfoRow label="Slot" value={String(booking.slot)}/>}
        {booking.bookingPeriod && (<><InfoRow label="From" value={fmtDate(booking.bookingPeriod.from)}/><InfoRow label="To" value={fmtDate(booking.bookingPeriod.to)}/></>)}
      </Section>

      {booking.placeInfo && (
        <Section title="Venue" delay={3}>
          <InfoRow label="Name"    value={booking.placeInfo.name}/>
          <InfoRow label="Address" value={booking.placeInfo.address}/>
          <InfoRow label="Phone"   value={booking.placeInfo.phoneNo}/>
        </Section>
      )}

      {booking.user && (
        <Section title="Customer" delay={4}>
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16}}>
            <div style={{width:56,height:56,borderRadius:18,background:O.primaryLight,border:"1.5px solid "+O.primaryBorder,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <User size={24} color={O.primary}/>
            </div>
            <div>
              <h3 style={{margin:"0 0 2px",color:O.text,fontSize:18,fontWeight:800,fontFamily:"Playfair Display, serif"}}>{booking.user.firstName} {booking.user.lastName}</h3>
              <p style={{margin:0,color:O.muted,fontSize:12}}>Customer</p>
            </div>
          </div>
          <InfoRow label="Phone" value={booking.user.phone}/>
          {booking.user.email && <InfoRow label="Email" value={booking.user.email}/>}
          <div style={{display:"flex",gap:10,marginTop:18}}>
            <motion.a whileHover={{scale:1.02}} whileTap={{scale:0.97}} href={"tel:"+booking.user.phone}
              style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:O.primary,padding:"13px",borderRadius:14,textDecoration:"none",color:"#fff",fontWeight:700,fontSize:14,boxShadow:"0 6px 18px rgba(255,166,41,0.30)"}}
            ><Phone size={15}/> Call</motion.a>
            {booking.user.email && (
              <motion.a whileHover={{scale:1.02}} whileTap={{scale:0.97}} href={"mailto:"+booking.user.email}
                style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:O.primaryLight,border:"1.5px solid "+O.primaryBorder,padding:"13px",borderRadius:14,textDecoration:"none",color:O.primaryDark,fontWeight:700,fontSize:14}}
              ><Mail size={15} color={O.primaryDark}/> Email</motion.a>
            )}
          </div>
        </Section>
      )}

      <Section title="Payment Details" delay={5}>
        <InfoRow label="Amount"         value={"$"+booking.totalAmount?.toFixed(2)} valueColor={O.success}/>
        <InfoRow label="Payment Method" value={booking.paymentMethod||"N/A"}/>
        <InfoRow label="Payment Status" value={booking.paymentStatus||"N/A"} valueColor={st.bg}/>
      </Section>

      <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible" style={{display:"flex",gap:12,flexWrap:"wrap",marginTop:8}}>
        <motion.button whileHover={{scale:1.02,y:-2}} whileTap={{scale:0.97}}
          style={{flex:1,minWidth:200,display:"flex",alignItems:"center",justifyContent:"center",gap:10,background:O.primary,border:"none",borderRadius:16,padding:"16px",color:"#fff",fontWeight:800,fontSize:15,cursor:"pointer",boxShadow:"0 8px 24px rgba(255,166,41,0.30)"}}
        ><RefreshCw size={17}/> Update Status</motion.button>
        <motion.button whileHover={{scale:1.02,y:-2}} whileTap={{scale:0.97}}
          style={{flex:1,minWidth:200,display:"flex",alignItems:"center",justifyContent:"center",gap:10,background:"rgba(239,68,68,0.10)",border:"1.5px solid rgba(239,68,68,0.25)",borderRadius:16,padding:"16px",color:"#EF4444",fontWeight:800,fontSize:15,cursor:"pointer"}}
        ><LogOut size={17}/> Cancel Booking</motion.button>
      </motion.div>
    </motion.div>
  );
}