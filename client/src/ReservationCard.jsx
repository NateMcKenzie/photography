import cookie from "cookie";

function ReservationCard(props) {
    const reservation = props.reservation;
    let timeString = ""

    if (props.confirmed == "true") {
        const date = new Date(Date.parse(reservation.date));
        date.setDate(date.getDate()+1)
        timeString = date.toDateString();
        const timeSplits = reservation.time.split(":");
        let hour = timeSplits[0];
        let pm = hour > 12;
        if (pm) hour -= 12;
        timeString = timeString.concat(", ", hour, ":", timeSplits[1], pm?"PM":"AM");
    }
    else {
        const openDate = new Date(Date.parse(reservation.openDate));
        const closeDate = new Date(Date.parse(reservation.closeDate));

        let openValues = openDate.toUTCString().split(" ")
        openValues = openValues.slice(1, 4);

        let closeValues = closeDate.toUTCString().split(" ")
        closeValues = closeValues.slice(1, 4);

        timeString = dateString(openValues) + " - " + dateString(closeValues);
    }

    function dateString(values) {
        return values[1] + " " + values[0] + ", " + values[2]
    }

    async function deleteReservation() {
        const res = await fetch("/reservation/delete/" + props.reservation.id + "/", {
            method: "post",
            credentials: "same-origin",
            headers: {
                "X-CSRFToken": cookie.parse(document.cookie).csrftoken
            }
        });
        const body = await res.json();
        props.setReservationRequestList(body.reservationList);
    }

    function BottomBar() {
        if (props.confirmed != "true") {
            return <>
                <nav>
                    <span className="buttonLike" onClick={_ => { props.updateEditID(reservation.id); }}>Edit</span>
                    <span className="buttonLike" onClick={deleteReservation}>Delete</span>
                </nav>
            </>;
        } else {
            return null;
        }
    }

    function BrokenNotes() {
        let brokenNotes = reservation.notes.split("\n");
        return <>
            <p>Notes: </p>
            <div className="notes">
                {brokenNotes.map(line => (
                    <>{line}<br /></>
                ))}
            </div>
        </>

    }

    return <>
        <div className="reservationCard">
            <h1>{timeString}</h1>
            <p>Location: {reservation.location}</p>
            <p>Type: {reservation.shootType}</p>
            <BrokenNotes />
            <BottomBar />
        </div>
    </>
}

export default ReservationCard;
