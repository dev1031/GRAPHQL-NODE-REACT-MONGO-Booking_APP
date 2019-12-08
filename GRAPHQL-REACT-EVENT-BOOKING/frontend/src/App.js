import React from 'react';
import { BrowserRouter , Route , Switch , Redirect } from 'react-router-dom';
import AuthPage from './pages/Auth'
import EventsPage from './pages/Events'
import BookingsPage from './pages/Bookings';
import MainNavigation from './components/Navigation/MainNavigation'
import './App.css';
import AuthContext from './components/context/auth-context' //this we can name anything bcz we are using 
//defalult export from the auth-context.js


class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      token :null,
      userId : null,

    }
  }
  login =(token, userId , tokenExpiration )=>{
    this.setState({
      token : token,
      userId : userId,
    })
  };

  logout =()=>{
    this.setState({
      token : null ,
      userId : null
    })
  };

  render(){
    return(
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider value = { {
            token: this.state.token , 
            userId : this.state.userId , 
            tokenExpiration:null , 
            login : this.login , 
            logout: this.logout
            }}>
            <MainNavigation />
              <main className = "main-content">
              <Switch>
                  {this.state.token && (<Redirect  exact from ="/" to ="/events" />)}
                  {this.state.token && (<Redirect  exact from ="/auth" to ="/events" />)}
                  {!this.state.token && (<Route path = "/auth" component = { AuthPage } />)}
                  <Route path = "/events" component = { EventsPage } />
                  { this.state.token &&(<Route path = "/bookings" component = { BookingsPage } />)}
                  {!this.state.token && (<Redirect exact to ="/auth" />)}
              </Switch>
              </main>
            </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}


export default App;
