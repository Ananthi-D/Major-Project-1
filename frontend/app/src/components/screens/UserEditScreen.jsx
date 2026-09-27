import React, { useState, useEffect } from "react";
import {Button,Form} from "react-bootstrap";
import { Link, useNavigate,useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";
import Message from "../Message";
import FormContainer from '../FormContainer'
import { USER_UPDATE_RESET } from "../../constants/userConstants";
import { updateUser,getUserProfile } from "../../actions/userActions";



function UserEditScreen() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const handleClose = () => setMessage(false);
  const [name, setName] = useState("");
  const [email,setEmail]=useState('')
  const [isAdmin,setIsAdmin]=useState(false)
 

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDetails = useSelector((state) => state.userDetails);
  const { user, error, loading } = userDetails;

  const userUpdate=useSelector(state=>state.userUpdate)
  const {error:errorUpdate,loading:loadingUpdate,success:successUpdate} = userUpdate

  

  useEffect(() => {
      if (!id) return;
      if (successUpdate){
        dispatch({type:USER_UPDATE_RESET})
        navigate('/admin/userlist')
      }else{
        if(!user || user?.id !== Number(id)){
          dispatch(getUserProfile(id))
        }else{
          setName(user.first_name + " " + user.last_name)
          setEmail(user.email || "")
          setIsAdmin(user.isAdmin)
        }
      }
    }, [dispatch,user,id,userInfo,successUpdate,navigate]);

      
      const submitHandler = (e) => {
      e.preventDefault()
      dispatch(updateUser({id,name,email,isAdmin}))
    }
  
  return (
    <>
    <br/>
    <div>
      <Link to='/admin/userlist'>
      Go Back
      </Link>

      <FormContainer>
      <h1>Edit User</h1>
      {loadingUpdate && <Loader/>}
      {errorUpdate && <Message variant='danger' onClose={handleClose}>{errorUpdate}</Message>}

      {loading ? <Loader/> :error ? (<Message variant='danger' onClose={handleClose}>{error}</Message>
       ) :(
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='name'>
            <Form.Label>Name</Form.Label>
            <Form.Control
            type='name'
            placeholder='Enter name'
            value={name}
            onChange={(e)=>setName(e.target.value)}
            ></Form.Control>
          </Form.Group>

           <Form.Group controlId='email'>
            <Form.Label>Email Address</Form.Label>
            <Form.Control
            type='email'
            placeholder='Enter Email'
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>

           <Form.Group controlId='isadmin'>
            <Form.Check
            type='checkbox'
            label='Is Admin'
            checked={isAdmin}
            onChange={(e)=>setIsAdmin(e.target.checked)}
            ></Form.Check> 
            </Form.Group>

          <Button type='submit' variant="primary">
            Update
          </Button>
           
        </Form>
      )}
    </FormContainer>
    </div>
    </>
  )
}



export default UserEditScreen
