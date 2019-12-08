import React from 'react';
import Modal from './../components/Modal /Modal';
import Backdrop from './../components/Backdrop/Backdrop';
import AuthContext from './../components/context/auth-context';
import Event from './events.svg';
import './Event.css'

class EventsPage extends  React.Component{
    constructor(props){
        super(props);

        this.state = {
            creating : false,
            events : []
        }

        this.startCreateEventHandler = this.startCreateEventHandler.bind(this);
        this.modalCancelHandler = this.modalCancelHandler.bind(this);
        this.modalConfirmHandler = this.modalConfirmHandler.bind(this);

        this.titleElRef = React.createRef();
        this.priceElRef = React.createRef();
        this.dateElRef  = React.createRef();
        this.descriptionElRef= React.createRef();
    }
    componentDidMount(){
        this.fetchEvents();
    }

        static contextType = AuthContext ;

        startCreateEventHandler =()=>{
            this.setState({
                creating : true
            })
        }
        
        modalConfirmHandler = () =>{
            this.setState({
                creating : false
            });

            const title = this.titleElRef.current.value;
            const price = this.priceElRef.current.value;
            const date = this.dateElRef.current.value;
            const description = this.descriptionElRef.current.value;

            if(
                title.trim().length === 0||
                price <= 0||
                date.trim().length === 0 ||
                description.trim().length === 0
                ){
                    return 
                }

            const event = { title , price , date , description };
            console.log(event);

            const requestBody = {
                query :`
                mutation{
                    createEvent(eventInput : {
                        title : "${ title }" , 
                        price : ${ price } ,
                        date : "${ date }",
                        description : "${ description }"
                    }){
                        _id 
                        title
                        description 
                        date
                        price
                        creator{
                            email 
                            _id
                        }
                    }
                }
            `
            };
        const token = this.context.token;    
    
        fetch('http://localhost:8000/graphql' ,{
            method : 'POST',
            body : JSON.stringify(requestBody),
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer '  + token 
            }
        })
        .then(response =>{
            if(response.status !== 200 && response.status !==201){
                throw new Error('Auth Failed')
            }
            return response.json();

        })
        .then(resData =>{
           //console.log( resData )
            this.fetchEvents();
        })
        .catch(error =>{
            console.log(error)
        })

        }

        modalCancelHandler =()=>{
            this.setState({
                creating : false
            })
        }

        fetchEvents = ()=>{
            const requestBody = {
                query :`
                query{
                    events{
                        _id 
                        title
                        description 
                        date
                        price
                        creator{
                            email 
                            _id
                        }
                    }
                }
            `
            };
        //const token = this.context.token;    
    
        fetch('http://localhost:8000/graphql' ,{
            method : 'POST',
            body : JSON.stringify(requestBody),
            headers : {
                'Content-Type': 'application/json'
            }
        })
        .then(response =>{
            if(response.status !== 200 && response.status !==201){
                throw new Error('Auth Failed')
            }
            return response.json();

        })
        .then(resData =>{
           console.log( resData );
           const events = resData.data.events;
           this.setState({
               events : events
           })
        })
        .catch(error =>{
            console.log(error)
        })
    }

    render(){
        const eventList = this.state.events.map(event =>{
            return( 
                <li key = { event._id }> { event.title } </li>
            )
        })
        return(
            <React.Fragment>
                {this.state.creating && <Backdrop />}
                {this.state.creating && (<Modal title = "Add Event" canCancel canConfirm 
                onCancel ={ this.modalCancelHandler } 
                onConfirm ={ this.modalConfirmHandler }>
                <p>Model Content</p>
                <form >
                    <label htmlFor ="title">
                    Title<input type="text" id ="title"  ref = { this.titleElRef } />
                    </label>
                    <label htmlFor ="price">
                    Price<input type="number" id ="price" ref ={ this.priceElRef } />
                    </label>
                    <label htmlFor = "date">
                    Date<input type="datetime-local" id = "date" ref = { this.dateElRef } />
                    </label>
                    <label htmlFor="description">
                    Description<textarea type="text" id= "description" rows = "4" ref = { this.descriptionElRef} />
                    </label>
                </form>
                </Modal> 
                )}
                {this.context.token && (<div className ="events-control">
                   <h1 style = {{ 'text-align': "center"}}>Event-Page.</h1>
                    <button id ="createButton" onClick ={ this.startCreateEventHandler }> Create-Event</button>
                </div>)}
                <section>
                <ul>{eventList}</ul>
                </section>
                <img src = { Event } alt = "event" />              
            </React.Fragment>
        )
    }
}
export default EventsPage;