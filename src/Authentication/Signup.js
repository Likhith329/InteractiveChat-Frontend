import axios from 'axios';
import { Form, Formik, useFormik } from 'formik';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {

    const [profilepic,setProfilepic]=useState()

    const initialValues={
        name:'',
        email:'',
        password:'',
        confirmpassword:'',
        profilepic
    }
    
    const validate=(values)=>{
    let errors={}
    if(!values.name)errors.name='Required*'
    if(!values.email)errors.email='Required*'
    if(!values.password)errors.password='Required*'
    if(!values.confirmpassword)errors.confirmpassword='Required*'
    if(values.confirmpassword!=values.password)errors.confirmpassword="Password did'nt matched!"
    return errors;
    }

    const notifysuccess=()=> toast.success("Registration Successfull!")
    const notifyuserexist= () => toast.warning("User Already Exists!")

    const [disp,setDisp]=useState('')
    const styles1={
        display:disp
    }
    const styles2={
        display:disp==''?'none':''
    }


    const navigate=useNavigate()

    const onSubmit=(values)=>{
        values.profilepic=profilepic
        async function signup(){
            try {
                setDisp('none')
                await axios.post('http://localhost:8000/register/signup',{
                ...values
            }).then(res=>{
                localStorage.setItem('userInfo',JSON.stringify(res.data))
                notifysuccess()
                setTimeout(() => {
                    navigate('/chats')
                }, 1000);
                setDisp('')
            })
            } catch (error) {
                notifyuserexist()
                setDisp('')
                console.log(error)
            }
           }
           signup()
      }

    const formik=useFormik({
        initialValues,
        validate,
        onSubmit
    })

    function postpic(file){
        setDisp('none')
        if(file.type=='image/jpeg' || file.type=='image/png'){
            const data=new FormData()
            data.append('file',file)
            data.append('upload_preset','chat_app')
            data.append('cloud_name','likhithkumar')
            fetch('https://api.cloudinary.com/v1_1/likhithkumar/image/upload',{
                method:'post',
                body:data
            })
            .then(res=>res.json())
            .then(data=>{
                setProfilepic(data.url)
                setDisp('')
            })
        }
        else{
            console.log('Invalid type')
        }
    }


  return (
    <div>
        <Formik>
                <Form onSubmit={formik.handleSubmit} className='loginform'>

                    <div className='inputbox'>
                        <label>Name</label>
                        <input className='form-control loginp' type={'text'} name='name' onChange={formik.handleChange} onBlur={formik.handleBlur}></input>
                        <div className='error'>{formik.errors.name && formik.touched.name?<div className="error">{formik.errors.name}</div>:null}</div>
                    </div>

                    <div className='inputbox'>
                        <label>Email</label>
                        <input className='form-control loginp' type={'email'} name='email' onChange={formik.handleChange} onBlur={formik.handleBlur}></input>
                        <div className='error'>{formik.errors.email && formik.touched.email?<div className="error">{formik.errors.email}</div>:null}</div>
                    </div>

                    <div className='inputbox '>
                        <label>Password</label>
                        <input className='form-control loginp' type={'password'} name='password' onChange={formik.handleChange} onBlur={formik.handleBlur} ></input>
                        <div>{formik.errors.password && formik.touched.password?<div className="error">{formik.errors.password}</div>:null}</div>
                    </div>

                    <div className='inputbox'>
                        <label>Confirm Password</label>
                        <input className='form-control loginp' type={'password'} name='confirmpassword' onChange={formik.handleChange} onBlur={formik.handleBlur} ></input>
                        <div>{formik.errors.confirmpassword && formik.touched.confirmpassword?<div className="error">{formik.errors.confirmpassword}</div>:null}</div>
                    </div>

                    <div className='inputbox'>
                        <label>Upload Your Profile</label>
                        <input className='form-control loginp' type={'file'} accept='image/*' name='profilepic' onChange={e=>postpic(e.target.files[0])} onBlur={formik.handleBlur}></input>
                        <div className='error'>{formik.errors.profilepic && formik.touched.profilepic?<div className="error">{formik.errors.profilepic}</div>:null}</div>
                    </div>

                    <button type='submit' className='btn btn-primary lbtn' style={styles1}  >Sign up</button>
                    <button className='btn btn-primary lbtn' type="button" style={styles2} disabled>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Loading...
                    </button>

                    <div style={{marginTop:'10px'}}>Already registered? <Link to={'/'} className='signup'>Login</Link></div>
                </Form>
            </Formik>
            <ToastContainer />
    </div>
  )
}

export default Signup