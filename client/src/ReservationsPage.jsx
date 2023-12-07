import { useEffect, useState } from "react";
import cookie from "cookie";
import ReservationCard from "./ReservationCard"

function ReservationsPage() {
    const [location, setLocation] = useState("");
    const [shootType, setShootType] = useState("");
    const [notes, setNotes] = useState("");
    const [openDate, setOpenDate] = useState("");
    const [closeDate, setCloseDate] = useState("");
    const [reservationRequestList, setReservationRequestList] = useState([]);
    const [reservationConfirmedList, setReservationConfirmedList] = useState([]);
    const [editID, setEditID] = useState("");

    async function getReservationRequests() {
        const res = await fetch("/reservation/request/", {
            method: "get",
            credentials: "same-origin",
        });
        const body = await res.json();
        setReservationRequestList(body.reservationList);
    }

    async function getReservationsConfirmed() {
        const res = await fetch("/reservation/confirmed/", {
            method: "get",
            credentials: "same-origin",
        });
        const body = await res.json();
        setReservationConfirmedList(body.reservationList);
    }

    useEffect(() => {
        getReservationRequests();
        getReservationsConfirmed();
    }, []);

    async function createReservation(e) {
        e.preventDefault();
        const res = await fetch("/reservation/request/", {
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

        clearFields();
        const body = await res.json();
        setReservationRequestList(() => [...reservationRequestList, body.reservation]);
    }

    async function updateReservation(e) {
        e.preventDefault();
        const res = await fetch("/reservation/update/" + editID + "/", {
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
        clearFields();
        const body = await res.json();

        const newList = [...reservationRequestList];
        const editIndex = newList.findIndex((reservation) => {return reservation.id == editID;});
        newList[editIndex] = body.reservation;
        setReservationRequestList(newList);
        stopEdit();
    }

    function clearFields() {
        setLocation("");
        setShootType("");
        setNotes("");
        setOpenDate("");
        setCloseDate("");
    }

    function updateEditID(id) {
        const selected = reservationRequestList.filter(
            (reservation) => { return reservation.id == id; }
        )[0];

        const openDate = new Date(Date.parse(selected.openDate));
        const closeDate = new Date(Date.parse(selected.closeDate));
        //Server-Client results in the date slipping forward, correct this and get a string that the HTML element will like.
        //openDate.setDate(openDate.getDate() - 1);
        //closeDate.setDate(closeDate.getDate() - 1);
        let openString = openDate.toISOString();
        let closeString = closeDate.toISOString();
        openString = openString.substring(0, openString.indexOf('T'));
        closeString = closeString.substring(0, closeString.indexOf('T'));

        setEditID(id);
        //Load fields from id
        setLocation(selected.location);
        setShootType(selected.shootType);
        setNotes(selected.notes);
        setOpenDate(openString);
        setCloseDate(closeString);
    }

    function stopEdit() {
        setEditID("");
        clearFields();
    }

    function EditBar() {
        if (editID) {
            return <>
                <p>You are editing {editID}</p>
                <button onClick={stopEdit}>Stop Editing</button>
            </>
        }
        else {
            return null;
        }
    }

    return (
        <>
            <div className="reservationPage">
                <form onSubmit={editID ? updateReservation : createReservation}>
                    <EditBar />
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
                    </label>
                    <textarea cols="20" rows="20" value={notes} onChange={e => setNotes(e.target.value)} />
                    <button>Save</button>
                </form>
                <div className="reservationList">
                    <h1>Unconfirmed</h1>
                    <div className="fillScroll">
                        {reservationRequestList.map(reservation => (
                            <ReservationCard key={reservation.id} reservation={reservation} confirmed="false" setReservationRequestList={setReservationRequestList} updateEditID={updateEditID} />
                        ))}
                    </div>
                </div>
                <div className="reservationList">
                    <h1>Confirmed</h1>
                    <div className="fillScroll">
                        {reservationConfirmedList.map(reservation => (
                            <ReservationCard key={reservation.id} reservation={reservation} confirmed="true" />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ReservationsPage;