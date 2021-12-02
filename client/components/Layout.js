import Head from "next/head"
import Link from 'next/link'
import Router from 'next/router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import React from 'react';
import { isAuth, logout, user_role} from '../utils/auth';

import { listPage } from '../listPage';
import { listEnum } from '../listEnum';

//Set route event for progress bar
Router.onRouteChangeStart = url => NProgress.start()
Router.onRouteChangeComplete = url => NProgress.done()
Router.onRouteChangeError = url => NProgress.done()

const Layout = ({children}) => {
    const head = () => ( 
        <React.Fragment>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0/css/bootstrap.min.css"   />
            <link rel="stylesheet"  href="/static/css/styles.css"   />

            <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" />
            <script src="https://jacoblett.github.io/bootstrap4-latest/bootstrap-4-latest.min.js" />
            
        </React.Fragment>
    ) 
  
    const navLogin = () => (
        <React.Fragment>
        {
            !isAuth()  && (
                <React.Fragment>
                    <li className="nav-item" >
                        <Link  href={listPage.Page_Login}>
                            <a className="nav-link text-white">Login</a>
                        </Link> 
                    </li>
                    <li className="nav-item">
                        <Link  href={listPage.Page_Registration}>
                            <a className="nav-link text-white">Registration</a>
                        </Link>
                    </li>
                </React.Fragment>
            )
        }
        </React.Fragment>
    )

    const navUser = () => (
        <React.Fragment>
            {
                isAuth() && isAuth().role === listEnum.user.role.admin && (
                    <li className="nav-item">
                        <Link  href={listPage.Page_Admin}>
                            <a className="nav-link text-white">Admin</a>
                        </Link>
                    </li>
                )
            } 
            {
                isAuth() && isAuth().role === listEnum.user.role.subscriber && (
                    <li className="nav-item">
                        <Link  href={listPage.Page_User}>
                            <a className="nav-link text-white">User</a>
                        </Link>
                    </li>
                )
            }
        </React.Fragment>
    )

    const navLogout = () => (
        <React.Fragment>
            {
                isAuth()  && (
                    <li className="nav-item">
                        <Link  href={listPage.Page_Home}>
                            <a onClick={logout} className="nav-link text-white">Logout</a> 
                        </Link> 
                    </li>
                )
            }
        </React.Fragment>
    )
    
    const nav = () => (
        <nav class="navbar bg-dark navbar-expand-lg navbar-dark">
            <a className="navbar-brand" href="/">Home</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav ml-auto">
                    {navLogin()}
                    {navUser()}
                    {navLogout()}
                </ul>
            </div>
        </nav>
        
    )

    return (
        <React.Fragment>
            {head()} {nav()} <div className="container pt-5 pb-5">{children}</div>
        </React.Fragment>
    );
}

export default Layout;