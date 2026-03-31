/**
 * RESERVATIONS PAGE COMPONENT
 * 
 * This page shows user's booking history and allows:
 * - Viewing past reservations
 * - Cancelling reservations
 * - Modifying reservations
 */

import { useEffect, useState } from 'react';

export default function ReservationPage() {
  const [reservations, setReservations] = useState<any[]>([]);

  useEffect(() => {
    // TODO: Fetch user's reservations from backend
    // const fetchReservations = async () => {
    //   const response = await axios.get('/api/v1/reservations', {
    //     headers: { Authorization: `Bearer ${token}` }
    //   });
    //   setReservations(response.data.data);
    // };
  }, []);

  return (
    <div className="reservation-page">
      <h1>My Reservations</h1>

      {reservations.length === 0 ? (
        <div>
          <p>You don't have any reservations yet.</p>
          <p>Search for restaurants and book a table!</p>
        </div>
      ) : (
        <div className="reservations-list">
          {reservations.map((res) => (
            <div key={res.id} className="reservation-card">
              <h3>{res.restaurantName}</h3>
              <p>Date: {res.date}</p>
              <p>Time: {res.time}</p>
              <p>Party Size: {res.partySize}</p>
              <p>Status: <strong>{res.status}</strong></p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
