import axios from 'axios';
import { Form, Formik, useFormik } from 'formik';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import './Login.css';

const Login = () => {

    const navigate=useNavigate()

    const [disp,setDisp]=useState('')
    const styles1={
        display:disp
    }
    const styles2={
        display:disp==''?'none':''
    }

    const initialValues={
        email:'',
        password:''
    }

    const validate=(values)=>{
    let errors={}
    if(!values.email)errors.email='Required*'
    if(!values.password)errors.password='Required*'
    return errors;
    }

    const notifysuccess=()=> toast.success("Login Successfull!")
    const notifyinvalid= () => toast.error("Invalid Email or Password!")

    const onSubmit=(values)=>{
        async function signup(){
            try {
                setDisp('none')
                await axios.post('http://localhost:8000/register/signin',{
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
                notifyinvalid()
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
  return (
    <div>
        <Formik>
                <Form onSubmit={formik.handleSubmit} className='loginform'>

                    <div className='inputbox'>
                        <label>Email</label>
                        <div className='input-group'><input className='form-control loginp' type={'email'} name='email' onChange={formik.handleChange} onBlur={formik.handleBlur}></input></div>
                        <div className='error'>{formik.errors.email && formik.touched.email?<div className="error">{formik.errors.email}</div>:null}</div>
                    </div>

                    <div className='inputbox'>
                        <label>Password</label>
                        <input className='form-control loginp' type={'password'} name='password' onChange={formik.handleChange} onBlur={formik.handleBlur} ></input>
                        <div>{formik.errors.password && formik.touched.password?<div className="error">{formik.errors.password}</div>:null}</div>
                    </div>

                    <button type='submit' className='btn btn-primary lbtn' style={styles1}>Login</button>
                    <button className='btn btn-primary lbtn' type="button" style={styles2} disabled>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Loading...
                    </button>

                    <div style={{marginTop:'10px'}}>Don't have an account? <Link to={'/signup'} className='signup'>Sign up</Link></div>
                </Form>
            </Formik>
            <ToastContainer/>
    </div>
  )
}

export default Login