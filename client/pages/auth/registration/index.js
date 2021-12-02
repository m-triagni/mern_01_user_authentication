import Layout from '../../../components/Layout';
import {showSuccessMessage, showErrorMessage} from '../../../utils/alert';
import {useEffect, useState} from 'react';
import axios from 'axios';
import {API} from '../../../config';
import {isAuth} from '../../../utils/auth';
import Router from 'next/router'

import { listAPI } from '../../../listAPI';
import { listPage } from '../../../listPage';
 
const Registration = () =>  {
   
    //if user has login, can't display registration screen and will be redirected to home
    useEffect(() => {
        isAuth() && Router.push(listPage.Page_User)
    },[]);
   

    const buttonState = ['Submit', 'Registering..', 'Submitted'];

    const [state, setState] = useState({
        name: '',
        email: '',
        password: '',
        error:'',
        success:'',
        buttonText: buttonState[0]
    })

    const {name, email, password , error, success, buttonText} = state
  

    const registrationHead = () => {
        return (
            <React.Fragment>
                <h1>Register</h1>
                <br />
            </React.Fragment>
        )
    }

    const handleChange = (attributeName) => (e) => {
        setState({...state, [attributeName]: e.target.value, error:'', success:'', buttonText:buttonState[0]})
    }

    const handleSubmit =  async e => {
        e.preventDefault();

        setState({...state, buttonText: buttonState[1] })
        try {

            //console.table({name, email, password})
 
             const response = await axios.post(`${API}${listAPI.API_Register}`,{
                name, email, password
            })
 
             //if success , empty all field
             setState({...state,
                name:'',
                email:'',
                password:'',
                buttonText: buttonState[2],
                success: response.data.message,
                error: response.data.error,
            });

            Router.push(listPage.Page_RegistrationDone) ;
 
        }catch(error) {
            console.log('error: ' , error);
            setState({...state,
                buttonText:  buttonState[0],
                error: error.response.data.error
            });
        }
    }
 
    const registrationForm = () => {
        return (
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input 
                        value={name}
                        onChange={handleChange('name')} 
                        type="text" className="form-control" placeholder="Type your name we are in camera"
                        required
                        />
                </div>
                <div className="form-group">
                    <input 
                        value={state.email}
                        onChange={handleChange('email')} 
                        type="email" className="form-control" placeholder="Type your email" 
                        required
                        />
                </div>
                <div className="form-group">
                    <input 
                        value={state.password}
                        onChange={handleChange('password')} 
                        type="password" className="form-control" placeholder="Type your password" 
                        required
                        />
                </div>
                <div className="form-group">
                    <button className="btn btn-outline-warning" > {state.buttonText} </button>
                </div>
            </form>
        )
    }

    const registrationMessage = () => {
        return (
            <React.Fragment>
                {success && showSuccessMessage(success)}
                {error && showErrorMessage(error)}
            </React.Fragment>
        )
    }

    return (
        <Layout>
            
            <div className="col-md-6 offset-md-3">
                {registrationHead()}
                {registrationMessage()}
                {registrationForm()}
                <hr/>
            </div>
        </Layout>
    )
}

export default Registration