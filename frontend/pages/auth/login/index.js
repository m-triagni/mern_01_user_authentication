 import Link from 'next/link'
 import Router from 'next/router'

 import Layout from '../../../components/Layout';
 import {showSuccessMessage, showErrorMessage} from '../../../utils/alert';
 import {useEffect, useState} from 'react';
 import axios from 'axios';
 import {API} from '../../../config';
 import {authenticate, isAuth} from '../../../utils/auth';

 import { listAPI } from '../../../listAPI';
 import { listPage } from '../../../listPage';
 import { listEnum } from '../../../listEnum';

const Login = () =>  {
     
    //if user has login, can't display registration screen and will be redirected to home
    useEffect(() => {
        isAuth() && Router.push(listPage.Page_User);
    }, []);
     

    //list of button state
    const buttonState = ['Login', 'Logging in..'];

    //set initial state
    const [state, setState] = useState({
        name: '',
        email: '',
        password: '',
        error:'',
        success:'',
        buttonText: buttonState[0]
    })

    const {name, email, password , error, success, buttonText} = state
   
    const handleChange = (attributeName) => (e) => {
        setState({...state, [attributeName]: e.target.value, error:'', success:'', buttonText: buttonState[0]})
    }

    const handleSubmit =  async e => {
        e.preventDefault();

        setState({...state, buttonText: buttonState[1] })
        try {

            //console.table({name, email, password})
            const response = await axios.post(`${API}${listAPI.API_Login}`,{
                email, password
            })

            //authenticate
            authenticate(response, () => {
                 return isAuth() && isAuth().role === listEnum.user.role.admin 
                    ? Router.push(listPage.Page_Admin) 
                    : Router.push(listPage.Page_User) ; // redirect to home
            })
  
        }catch(error) {
            console.log('error: ' , error);
            setState({...state,
                buttonText:  buttonState[0],
                error: error.response.data.error
            });
        }
    }
 
    //set head
    const loginHead = () => {
        return (
            <React.Fragment>
                <h1>Login</h1>
                <br />
            </React.Fragment>
        ) 
    }

    //set form
    const loginForm = () => {
        return (
            <form onSubmit={handleSubmit}>
                 
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
                <Link href={listPage.Page_PasswordForget}>
                    <a className="text-danger float-right">Forget Password</a>
                </Link>
                <div className="form-group">
                    <button className="btn btn-outline-warning" > {state.buttonText} </button>
                </div>
            </form>
        )
    }

    //set message
    const loginMessage = () => {
        return (
            <React.Fragment>
                {success && showSuccessMessage(success)}
                {error && showErrorMessage(error)}
            </React.Fragment>
        )
    }

    //return page layout
    return (
        <Layout>
            <div className="col-md-6 offset-md-3">
                {loginHead()}
                {loginMessage()}
                {loginForm()}
                <hr/>
             </div> 
        </Layout>
    )
}
  
export default Login