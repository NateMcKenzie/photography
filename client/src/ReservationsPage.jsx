import { useState } from "react";


function ReservationsPage() {
    const [location, setLocation] = useState("");
    const [type, setType] = useState("");
    const [notes, setNotes] = useState("");
    const [openDate, setOpenDate] = useState("");
    const [closeDate, setCloseDate] = useState("");

    return (
        <>
            <form>
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
                    <input type="text" value={type} onChange={e => setType(e.target.value)} />
                </label>
                <label>
                    Additional notes:
                    <textarea cols="20" rows="20" value={notes} onChange={e => setNotes(e.target.value)} />
                </label>
            </form>
        </>
    )
}

export default ReservationsPage;