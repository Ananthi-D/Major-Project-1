import React, { useState, useEffect } from "react";
import {Button,Table} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";
import Message from "../Message";
import { LinkContainer } from "react-router-bootstrap";
import { listUsers,deleteUser } from "../../actions/userActions";



function UserListScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const handleClose = () => setMessage(false);

  const userList = useSelector((state) => state.userList);
  const { users, error, loading } = userList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDelete = useSelector((state) => state.userDelete);
  const {success: successDelete } = userDelete;


  useEffect(() => {
  if (!userInfo) {
    navigate("/login");
    return;
  }

  if (userInfo.isAdmin) {
    dispatch(listUsers());
  }
}, [dispatch, userInfo, successDelete, navigate]);

    const deleteHandler=(id)=>{
      console.log("DELETE CLICKED", id)
      if(window.confirm('Are you sure you want to delete this user?')){
        dispatch(deleteUser(id))
        
      }
    }
  
  return (
    <>
    <br/>
      <h1>Users</h1>
      {loading
      ?(<Loader />)
      :error
      ?(<Message variant='danger' onClose={handleClose}>{error}</Message>)
      :(
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {users?.map(user=>(
              <tr key={user?._id || user?.id}>
                <td>{user._id || user?.id}</td>
                <td>{user.first_name} {user.last_name}</td>
                <td>{user.email}</td>
                <td>{user.isAdmin ?(

                <i className="fas fa-check" style={{color:'green'}}></i>
              ) : (
                  <i className="fa-shap fa-regular fa-circle-xmark" style={{color:'red'}}></i>
            )}
                  </td>

                  <td>
                    <LinkContainer to={`/admin/user/${user?._id || user?.id}/edit`}>
                    <Button variant="light" className="btn-sm">
                      <i className="fas fa-edit"></i>
                    </Button>
                    </LinkContainer>

                    <Button variant="danger" className="btn-sm" onClick={()=>deleteHandler(user._id || user?.id)}>
                      <i className="fas fa-trash"></i>
                    </Button>
                    
                  </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    
    </>
  )
}



export default UserListScreen
