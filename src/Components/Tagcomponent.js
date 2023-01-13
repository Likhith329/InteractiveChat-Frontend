export default function Tagcomponent({tag,tags,setTags,del}){
    function handlefunction(){
        let tagsinst=tags.filter(x=>x!==tag)
        setTags(tagsinst)
    }
    console.log(tags)
    return(
        <div className='tag'>
            <div>{tag}</div>
            <i className="bi bi-x-circle" style={{display:del==true?'':'none'}} onClick={()=>{handlefunction()}}></i>
        </div>
    )
}