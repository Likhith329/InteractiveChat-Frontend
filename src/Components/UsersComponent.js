import axios from "axios"
import { ChatState } from "../Context/Chatprovider"

export default function UsersComponent({result,user,token,chats,setChats,setDisp,setSearch,setShowcross}){

    const {setSelectedchat}=ChatState()
    const userId=result._id

    const getsender=(user,chat)=>{
        return chat.users[0]._id===user._id?chat.users[1]:chat.users[0]
    }

    const handlefunction=async()=>{
        try {
            await axios.post('https://interactivechat-backend.onrender.com/chats',{userId},{
            headers:{
                "access-token":token
            }
        }).then(response=>{
          if(!chats.find((x)=> x._id===response.data._id)){
            setChats([response.data,...chats])
          }
          else{
            console.log("already exist")
          }
          let chat=response.data
          let chatname=chat.isGroup?chat.chatName:getsender(user,chat).name
          let pic=chat.isGroup?"https://cdn6.aptoide.com/imgs/1/2/2/1221bc0bdd2354b42b293317ff2adbcf_icon.png":getsender(user,chat).profilepic
          
          setSelectedchat({...response.data,sender:chatname,profilepic:pic})
        })
        setShowcross('none')
        setSearch('')
        setDisp('')
          } catch (error) {
            console.log(error)
          }
    }
    
    return(
      <div className='usercont' onClick={handlefunction} >
        <img className='userimg' src={result.profilepic}></img>
        <div className='userinfo'>
          <div className='username'>{result.name}</div>
          <div className='useremail'>{result.email}</div>
        </div>
      </div>
    )
  }