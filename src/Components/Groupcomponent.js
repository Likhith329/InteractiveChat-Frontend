import axios from 'axios'
import React, { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Searchresults from './Searchresults'
import Tagcomponent from './Tagcomponent'

const Groupcomponent = ({chats,setChats}) => {
    
    const [search,setSearch]=useState('')
    const [results,setResults]=useState('')
    const [groupname,setGroupname]=useState('')
    const [memberIds,setMemberIds]=useState([])
    const [tags,setTags]=useState([])
    const user=JSON.parse(localStorage.getItem('userInfo'))
    const token=user.token

    const [disp,setDisp]=useState('')
    const styles1={
        display:disp
    }
  
    async function getsearchedData(search){
        try {
        await axios.get('https://interactivechat-backend.onrender.com/register/signup?search='+search,{
        headers:{
            "access-token":token
        }
    }).then(response=>setResults(response.data))
        } catch (error) {
        console.log(error)
        }
    }

    async function Creategroup(){
        if(!groupname || memberIds.length<2) return alert('Select altleat 2 members or name is empty')
        setGroupname('')
        setSearch('')
        setResults([])
        setTags([])
        try {
            await axios.post('https://interactivechat-backend.onrender.com/chats/creategroup',{
                name:groupname,
                users:memberIds
            },{
                headers:{
                    "access-token":token
                }
            }).then((response)=>{
                setChats([response.data[0],...chats])
            })
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <div>
         <label>Group Name</label>
            <input type={'text'} placeholder='Enter group name' value={groupname} className='form-control' onChange={(e)=>{setGroupname(e.target.value)}}/>
            <label>Add members</label>
            <input className='form-control' value={search}  type={'text'} placeholder='Enter and select a member name' onChange={(e)=>{
                let val=e.target.value.trim()
            setSearch(val)
            if(val==''){
              setDisp('none')
            }
            else{
              setDisp('')
              getsearchedData(val)
            }
            }} />
            <div className='addbtn'><button className='btn btn-outline-primary'  data-bs-dismiss="offcanvas" data-bs-target="#groupcomponent" aria-label="Close" onClick={()=>{Creategroup()}} >Add</button></div>

            <div className='tags'>
                {
                tags.map((tag,index)=>(
                    <Tagcomponent key={index} tag={tag} tags={tags} setTags={setTags} del={true}/>
                ))}
            </div>
           
            <div style={styles1}>
                {results?
                results.map((user)=>(
                    <Searchresults key={user._id} tags={tags} setTags={setTags} user={user} memberIds={memberIds} setMemberIds={setMemberIds}/>
                )):''}
            </div>
    </div>
  )
}

export default Groupcomponent










