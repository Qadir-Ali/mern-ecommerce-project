import Spinner from 'react-bootstrap/Spinner'

export default function LoadingBox () {

 

    return (
        <Spinner animation='border' role='status' style={{display : 'block' , margin : 'auto'}} >
            <span className="visually-hidden" >Loading...</span>
        </Spinner>

    )
}