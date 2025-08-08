import React, { useState } from "react";
import axios from "axios";

function App() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [slot, setSlot] = useState("");
  const [date, setDate] = useState("");

  const handleBooking = async () => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/book`);
    console.log(res.data);
    alert("Booking request sent. Proceed to payment.");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Cricket Turf Booking</h1>
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} /><br />
      <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} /><br />
      <input placeholder="Slot" value={slot} onChange={(e) => setSlot(e.target.value)} /><br />
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} /><br />
      <button onClick={handleBooking}>Book Now</button>
    </div>
  );
}

export default App;
