import React from 'react';
import './Auth.css'
import icon from './icon.svg';
import AuthContext from './../components/context/auth-context'

class AuthPage extends  React.Component{
    constructor(props){
        super(props);

        this.state  = {
            isLogin : true 
        };

        this.emailEl =  React.createRef();
        this.passwordEl = React.createRef();

    }
    static contextType = AuthContext;

    switchModeHandler = ()=>{
        this.setState(prevState =>{
            return { isLogin : !prevState.isLogin }
        })
    }

    submitHandler = (event) =>{
        event.preventDefault();
        const email = this.emailEl.current.value;
        const password = this.passwordEl.current.value;

        if(email.trim().length === 0 || password.trim().length === 0){
            return ;
        }

        let requestBody = {
            query :`
               query{ 
                   login(email :"${ email }" , password : "${ password }"){
                       userId 
                       token 
                       tokenExpiration
                   }

            }
            `
        }

        if(!this.state.isLogin){
            requestBody = {
                query :`
                mutation{
                    createUser(userInput : {email : "${email}" , password : "${password}" }){
                        _id 
                        email
                    }
                }
            `
            };
        }

    
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
            if(resData.data.login.token){
                this.context.login(
                    resData.data.login.token,
                    resData.data.login.userId,
                    resData.data.login.tokenExpiration
                )
            }
        })
        .catch(error =>{
            throw error;
        })

    }
    render(){
        return(
            <div>
                 <h1>Authentication.</h1>
                <form onSubmit = { this.submitHandler }>
                    <label htmlFor="email">E-mail</label>
                    <input type="email" id="email" name="email"  ref = { this.emailEl }/>

                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" ref ={ this.passwordEl } />

                    <button type="button" onClick ={ this.switchModeHandler }>Switch to {this.state.isLogin ? 'Signup' : 'Login' }</button>
                    <button type="submit" value = "Submit" >Submit</button>
                </form>
                <img src={ icon } alt="icon"/>
            </div>
        )
    }
}
export default AuthPage;