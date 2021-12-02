import Layout from '../../../components/Layout';

const RegistrationDone = () => {
    const registrationDone = () => {
        return (
            <React.Fragment>
                <h1>Registration Done</h1>
                <br />
                <p>Please check your email to activate your email</p>
            </React.Fragment>
        ) 
    }
    return (
        <Layout>
            
            <div className="col-md-6 offset-md-3">
                {registrationDone()} 
            </div> 
        </Layout>
    )
}

export default RegistrationDone;