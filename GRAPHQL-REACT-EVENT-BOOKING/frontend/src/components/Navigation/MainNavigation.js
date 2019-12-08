import React from 'react';
import { NavLink } from 'react-router-dom';
import  './MainNavigation.css';
import AuthContext from './../context/auth-context'

const mainNavigation = props =>(
    <AuthContext.Consumer>
        {(context)=>{
            return( 
                <header className ="main-navigation">
                    <div className ="main-navigation_logo">
                        <h3>EasyEvent</h3>
                    </div>
                    <nav className = "main-navigation_items">
                        <ul>
                            {!context.token && (
                            <li>
                                <NavLink to ="/auth">Authenticate</NavLink>
                            </li>)}
                            <li>
                                <NavLink to ="/events">Events</NavLink>
                            </li>
                            { context.token && (
                                <React.Fragment>
                                    <li>
                                        <NavLink to ="/bookings">Bookings</NavLink>
                                    </li> 
                                    <li>
                                       <button  className ="button" onClick ={ context.logout }>Logout</button>
                                    </li>
                                </React.Fragment>
                            )}
                        </ul>
                    </nav>
                </header>

            )
            }}
    
    </AuthContext.Consumer>
)

export default mainNavigation