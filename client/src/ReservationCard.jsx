function ReservationCard(props){
    const reservation = props.reservation;
    return <>
        <p className="reservationCard">{reservation.notes}</p>
    </>
}

export default ReservationCard;