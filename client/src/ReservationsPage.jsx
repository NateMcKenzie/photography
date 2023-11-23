import { useState } from "react";
import cookie from "cookie";

function ReservationsPage() {
    const [location, setLocation] = useState("");
    const [shootType, setShootType] = useState("");
    const [notes, setNotes] = useState("");
    const [openDate, setOpenDate] = useState("");
    const [closeDate, setCloseDate] = useState("");

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
        })
        if(res.ok){
            console.log("all good in the hood.")
        } else{
            console.log("The hood is not good today.")
        }
    }

    return (
        <>
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
        </>
    )
}

export default ReservationsPage;