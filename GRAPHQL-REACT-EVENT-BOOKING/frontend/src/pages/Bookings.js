import React from 'react';
import booking from "./bookings.svg";

class BookingsPage extends  React.Component{
    render(){
        return(
            <div>
                <h1>Booking-Page.</h1>
                <img src ={ booking } alt ="booking" />
            </div>
        )
    }
}
export default BookingsPage;