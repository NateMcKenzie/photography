import ReservationCard from "./ReservationCard"

function ReservationList(props) {

    /**
     * Renders the list of reservations, or a message indicating there are none.
     * @returns {JSX.Element} The rendered content.
     */
    function Content() {
        if (props.list.length > 0) {
            return <>
                <div className="fillScroll">
                    {props.list.map(reservation => (
                        <ReservationCard key={reservation.id} reservation={reservation} confirmed={props.confirmed} setReservationRequestList={props.setReservationRequestList} updateEditID={props.updateEditID} />
                    ))}
                </div>
            </>
        }
        else {
            return <><h1>No Reservations</h1></>
        }
    }

    return <>
        <div className="reservationList">
            <h1>{props.confirmed == "true" ? "Confirmed" : "Uncomfirmed"}</h1>
            <Content/>
        </div>
    </>
}

export default ReservationList;