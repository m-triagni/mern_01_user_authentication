import axios from 'axios';
import Layout from '../../components/Layout';
import { useEffect, useState } from 'react';

import withUser from './withUser'
import { API } from '../../config'
import { getCookie } from '../../utils/auth';
import { listAPI } from '../../listAPI'
import { listEnum } from '../../listEnum';

const User = ({user, token}) => {
    const userHead = () => {
        return (
            <React.Fragment>
                <h1>User Page</h1>
                <p>User profile: {JSON.stringify(user)}</p>
                <p>Token: {JSON.stringify(token)}</p>                
                <br />
            </React.Fragment>
        ) 
    }
    return (
        <Layout>
            
            <div className="col-md-6 offset-md-3">
                {userHead()} 
                <hr/>
            </div> 
        </Layout>
    )
}
 

export default withUser(User);
