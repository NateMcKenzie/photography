import cookie from "cookie";

//TODO: buttons and functionallity for editing / deleting requests.
function ReservationCard(props) {
    const reservation = props.reservation;
    let timeString = ""

    if (props.confirmed == "true") {
        const date = new Date(Date.parse(reservation.date));
        timeString = date.toLocaleString();
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

    function dateString(values){
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

    return <>
        <div className="reservationCard">
            <h1>{timeString}</h1>
            <p>Location: {reservation.location}</p>
            <p>Type: {reservation.shootType}</p>
            <p>Notes: {reservation.notes}</p>
            <BottomBar />
        </div>
    </>
}

export default ReservationCard;
