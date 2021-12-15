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
                <form>
                    <h1>User Page</h1>
                    <div className="form-group">
                        <label >Name</label>
                        <input 
                            value={user.name} 
                            class="form-control" 
                            disabled
                            />
                    </div>
                    <div className="form-group">
                        <label >Email</label>
                        <input 
                            value={user.email} 
                            class="form-control" 
                            disabled
                            />
                    </div>
                    <div className="form-group">
                        <label >Role</label>
                        <input 
                            value={user.role} 
                            class="form-control" 
                            disabled
                            />
                    </div>
                    <div className="form-group">
                        <label >Username</label>
                        <input 
                            value={user.username} 
                            class="form-control" 
                            disabled
                            />
                    </div>
                    
                </form>
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
