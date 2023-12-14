import cookie from "cookie";

function ReservationCard(props) {
    const reservation = props.reservation;
    let heading = ""

    // Generate the appropriate heading for whether or not the reservation is confirmed.
    if (props.confirmed == "true") {
        //Parse the date
        const date = new Date(Date.parse(reservation.date));
        date.setDate(date.getDate() + 1)
        heading = date.toDateString();

        //Add the time
        const timeSplits = reservation.time.split(":");
        let hour = timeSplits[0];
        let pm = hour > 12;
        if (pm) hour -= 12;
        heading = heading.concat(", ", hour, ":", timeSplits[1], pm ? "PM" : "AM");
    }
    else {
        //Parse both dates and compose into one string
        const openDate = new Date(Date.parse(reservation.openDate));
        const closeDate = new Date(Date.parse(reservation.closeDate));

        let openValues = openDate.toUTCString().split(" ")
        openValues = openValues.slice(1, 4);

        let closeValues = closeDate.toUTCString().split(" ")
        closeValues = closeValues.slice(1, 4);

        heading = dateString(openValues) + " - " + dateString(closeValues);
    }

    /**
     * Formats the given date values into a string representation.
     * @param {Array} values - The date values [day, month, year].
     * @returns {string} The formatted date string.
     */
    function dateString(values) {
        return values[1] + " " + values[0] + ", " + values[2];
    }

    /**
     * Deletes a reservation by sending a POST request to the server.
     * @returns {Promise<void>} A Promise that resolves when the reservation is successfully deleted.
     */
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

    /**
     * Renders the bottom bar for the reservation card.
     * @returns {JSX.Element|null} The JSX element representing the bottom bar, or null if the reservation is confirmed.
     */
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

    return <>
        <div className="reservationCard">
            <h1>{heading}</h1>
            <p>Location: {reservation.location}</p>
            <p>Type: {reservation.shootType}</p>
            <p className="notes">{reservation.notes}</p>
            <BottomBar />
        </div>
    </>
}

export default ReservationCard;
