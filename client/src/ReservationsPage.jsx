import { useEffect, useState } from "react";
import cookie from "cookie";
import ReservationCard from "./ReservationCard"

function ReservationsPage() {
    const [location, setLocation] = useState("");
    const [shootType, setShootType] = useState("");
    const [notes, setNotes] = useState("");
    const [openDate, setOpenDate] = useState("2023-11-29");
    const [closeDate, setCloseDate] = useState("2023-12-29");
    const [reservationList, setReservationList] = useState([]);

    async function getReservations() {
        const res = await fetch("/reservations/", {
            method: "get",
            credentials: "same-origin",
        });
        const body = await res.json();
        setReservationList(body.reservationList);
    }

    useEffect(() => {
        getReservations();
    }, []);

    async function createReservation(e) {
        e.preventDefault();
        const res = await fetch("/reservations/", {
            method: "post",
            credentials: "same-origin",
            body: JSON.stringify({
                openDate,
                closeDate,
                location,
                shootType,
                notes
            }),
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": cookie.parse(document.cookie).csrftoken
            }
        });

        //TODO: Input validation somewhere?
        if (res.ok) {
            clearFields();
            const body = await res.json();
            setReservationList(() => [...reservationList, body.reservation]);
            //TODO: Tell users that the request was a success.
        } else {
            console.log("Error.")
            //TODO: Tell users that there was an error.
        }
    }

    function clearFields() {
        setLocation("");
        setShootType("");
        setNotes("");
        setOpenDate("");
        setCloseDate("");
    }

    return (
        <>
            <div className="reservationPage">
                <form onSubmit={createReservation}>
                    <label>
                        First Available Date:
                        <input type="date" value={openDate} onChange={e => setOpenDate(e.target.value)} />
                    </label>
                    <label>
                        Last Available Date:
                        <input type="date" value={closeDate} onChange={e => setCloseDate(e.target.value)} />
                    </label>
                    <label>
                        Location:
                        <input type="text" value={location} onChange={e => setLocation(e.target.value)} />
                    </label>
                    <label>
                        Shoot Type:
                        <input type="text" value={shootType} onChange={e => setShootType(e.target.value)} />
                    </label>
                    <label>
                        Additional notes:
                        <textarea cols="20" rows="20" value={notes} onChange={e => setNotes(e.target.value)} />
                    </label>
                    <button>Save</button>
                </form>
                <div className="reservationList">
                    {reservationList.map(reservation => (
                        <ReservationCard key={reservation.id} reservation={reservation} />
                    ))}
                </div>
            </div>
        </>
    )
}

export default ReservationsPage;