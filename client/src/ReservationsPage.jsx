import { useEffect, useState } from "react";
import cookie from "cookie";
import ReservationList from "./ReservationList"

function ReservationsPage() {
    const [location, setLocation] = useState("");
    const [shootType, setShootType] = useState("");
    const [notes, setNotes] = useState("");
    const [openDate, setOpenDate] = useState("");
    const [closeDate, setCloseDate] = useState("");
    const [reservationRequestList, setReservationRequestList] = useState([]);
    const [reservationConfirmedList, setReservationConfirmedList] = useState([]);
    const [editID, setEditID] = useState("");

    // Initial set-up on first load
    useEffect(() => {
        getReservationRequests();
        getReservationsConfirmed();
    }, []);

    /**
     * Fetches reservation requests from the server.
     * @returns {Promise<void>}
     */
    async function getReservationRequests() {
        const res = await fetch("/reservation/request/", {
            method: "get",
            credentials: "same-origin",
        });

        const body = await res.json();
        setReservationRequestList(body.reservationList);
    }

    /**
     * Fetches confirmed reservations from the server.
     * @returns {Promise<void>}
     */
    async function getReservationsConfirmed() {
        const res = await fetch("/reservation/confirmed/", {
            method: "get",
            credentials: "same-origin",
        });

        const body = await res.json();
        setReservationConfirmedList(body.reservationList);
    }

    /**
     * Creates a reservation by sending a POST request to the server.
     * @param {Event} e - The event object.
     * @returns {Promise<void>} - A promise that resolves when the reservation is created.
     */
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

        //Update state
        const body = await res.json();
        clearFields();
        setReservationRequestList(() => [...reservationRequestList, body.reservation]);
    }

    /**
     * Updates a reservation by sending a POST request to the server.
     * @param {Event} e - The event object.
     * @returns {Promise<void>} - A promise that resolves when the reservation is updated.
     */
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

        //Update state
        const body = await res.json();
        clearFields();

        const newList = [...reservationRequestList];
        const editIndex = newList.findIndex((reservation) => { return reservation.id == editID; });
        newList[editIndex] = body.reservation;
        setReservationRequestList(newList);
        stopEdit();
    }

    /**
     * Clears input fields.
     */
    function clearFields() {
        setLocation("");
        setShootType("");
        setNotes("");
        setOpenDate("");
        setCloseDate("");
    }

    /**
     * Updates the edit ID and loads the corresponding fields from the reservation with the given ID.
     * @param {number} id - The ID of the reservation to update.
     */
    function updateEditID(id) {
        const selected = reservationRequestList.filter(
            (reservation) => { return reservation.id == id; }
        )[0];

        //Parse the dates to load into the input fields.
        const openDate = new Date(Date.parse(selected.openDate));
        const closeDate = new Date(Date.parse(selected.closeDate));
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

    /**
     * Stops the editing process by resetting the edit ID and clearing the fields.
     */
    function stopEdit() {
        setEditID("");
        clearFields();
    }

    /**
     * Renders the EditBar component only if editing is in progress.
     * @returns {JSX.Element|null} The rendered EditBar component or null if editID is falsy.
     */
    function EditBar() {
        if (editID) {
            return <>
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
                <ReservationList list={reservationRequestList} setReservationRequestList={setReservationRequestList} updateEditID={updateEditID} confirmed="false" />
                <ReservationList list={reservationConfirmedList} confirmed="true" />
            </div>
        </>
    )
}

export default ReservationsPage;