import axios from 'axios';
import React, { useState } from 'react'
import {  useNavigate } from 'react-router-dom';
import { ChatState } from '../Context/Chatprovider';
import './Navbar.css';

const Navbar = () => {
    const user=JSON.parse(localStorage.getItem('userInfo'))
    const navigate=useNavigate()
    const {setSelectedchat}=ChatState()
    const [name,setName]=useState(user.name)
    const [pic,setPic]=useState()

    const [disp,setDisp]=useState('')
    const styles1={
      display:disp
    }
    const styles2={
      display:disp==''?'none':''
    }
    const [disp2,setDisp2]=useState('')
    const styles3={
      display:disp2
    }
    const styles4={
      display:disp2==''?'none':''
    }

    function postpic(file){
      if(file.type=='image/jpeg' || file.type=='image/png'){
          setDisp('none')
          const data=new FormData()
          data.append('file',file)
          data.append('upload_preset','chat_app')
          data.append('cloud_name','likhithkumar')
          fetch('https://api.cloudinary.com/v1_1/likhithkumar/image/upload',{
              method:'post',
              body:data
          })
          .then(res=>res.json())
          .then(async(data)=>{
            try {
              await axios.put('https://interactivechat-backend.onrender.com/users/setprofilepic',{
                profilepic:data.url
              },{
                headers:{
                  "access-token":user.token
              }
              }).then(resp=>{
                let newdata=resp.data
                localStorage.setItem('userInfo',JSON.stringify({...user,...newdata}))
              })
            } catch (error) {
              console.log(error)
            }
             setPic(data.url)
             setDisp('')
          })
      }
      else{
          console.log('Invalid type')
      }
  }

  const handlerename=async()=>{
    try {
      setDisp2('none')
      axios.put('https://interactivechat-backend.onrender.com/users/renameuser',{
        name:name
      },{
        headers:{
          "access-token":user.token
      }
      }).then(resp=>{
        let newdata=resp.data
        localStorage.setItem('userInfo',JSON.stringify({...user,...newdata}))
        setDisp2('')
      })
    } catch (error) {
      console.log(error)
    }
  }
   
  return (
    <div>
        <nav className="navbar navbar-expand-lg  bg-light ">
          <a className="navbar-brand" >TextMe</a>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0"></ul>
          <div className='profbox'>
              <button className='btn btn-outline-light'  data-bs-toggle="offcanvas" data-bs-target="#navbarprofile" aria-controls="navbarprofile"><img className='navimg' src={user.profilepic}></img></button>
              <button className='btn btn-light logoutbtn' onClick={()=>{
                  localStorage.removeItem('userInfo')
                  setSelectedchat('')
                  navigate('/')
              }}>Logout<i className="bi bi-box-arrow-right"></i></button>
          </div>
        </nav>


    <div className="offcanvas offcanvas-end"  tabIndex="-1" id="navbarprofile" aria-labelledby="navbarprofileLabel">
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="navbarprofileLabel">Profile</h5>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div className="offcanvas-body">
        <div className='d-flex flex-column align-items-center'>
          <img className='canvasimg' src={pic?pic:user.profilepic}></img>
          <div className='profilename'>{name?name:user.name}</div>
        </div>
        <div className='d-flex'>
          <input className='form-control' type={'text'} value={name} onChange={(e)=>{setName(e.target.value)}} ></input>
          <button className='btn btn-outline-primary' style={styles3} onClick={handlerename}>Update</button>
          <button className="btn btn-outline-primary" type="button" style={styles4}  disabled>
            <span className="spinner-border spinner-border-sm"  role="status" aria-hidden="true"></span>
          </button>
        </div>
        <input type={'file'} id='uploadpic' hidden onChange={(e)=>{postpic(e.target.files[0])}} ></input>
        <button className='btn btn-primary uploadbtn'  style={styles1}><label htmlFor='uploadpic'  >Upload new profile pic</label></button>
        <button className="btn btn-primary uploadbtn" type="button"  style={styles2} disabled>
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Uploading...
        </button>
      </div>
    </div>
    </div>
  )
}

export default Navbar