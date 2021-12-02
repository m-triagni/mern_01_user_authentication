import Layout from '../../components/Layout';
import withAdmin from './withAdmin'

const Admin = ({user, token}) => {
    const adminHead = () => {
        return (
            <React.Fragment>
                <h1>Admin Page</h1>
                <p>User profile: {JSON.stringify(user)}</p>
                <p>Token: {JSON.stringify(token)}</p>

                <br />
            </React.Fragment>
        ) 
    }
    return (
        <Layout>
            
            <div className="col-md-6 offset-md-3">
                {adminHead()} 
                <hr/>
            </div> 
        </Layout>
    )
}

export default withAdmin(Admin);