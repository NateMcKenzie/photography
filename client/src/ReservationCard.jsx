function ReservationCard(props){
    const reservation = props.reservation;
    let timeString = ""
    if(props.confirmed == "true"){
        const date = new Date(Date.parse(reservation.date));
        timeString = date.toLocaleString();
    }
    else{
        const openDate = new Date(Date.parse(reservation.openDate));
        const closeDate = new Date(Date.parse(reservation.closeDate));
        timeString = openDate.toLocaleDateString() + " - " + closeDate.toLocaleDateString();
    }
    return <>
        <div className="reservationCard">
            <h1>{timeString}</h1>
            <p>Location: {reservation.location}</p>
            <p>Type: {reservation.shootType}</p>
            <p>Notes: {reservation.notes}</p>
        </div>
    </>
}

export default ReservationCard;