export default function Searchresults({user,tags,setTags,memberIds,setMemberIds}){

    function handlesubmit(){
        let ids=[...memberIds]
        let tagsinst=[...tags]
        if(!memberIds.includes(user._id))ids.push(user._id)
        if(!tagsinst.includes(user.name))tagsinst.push(user.name)
        setTags(tagsinst)
        setMemberIds(ids)
    }
    

    return(
        <div className='usercont bg-white text-dark' onClick={()=>{handlesubmit()}}>
            <img className='userimg' src={user.profilepic}></img>
            <div className='userinfo'>
                <div className='username'>{user.name}</div>
                <div className='useremail'>{user.email}</div>
            </div>
        </div>
    )
}