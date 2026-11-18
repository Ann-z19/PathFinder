import { useNavigate } from "react-router";
import { useAuth } from "../context/auth-context";
import { useShortlist } from "../context/shortlist-context";

//Save / unsave a career to the signed-in user's shortlist
function SaveButton({code, className=""}){
    const { user } = useAuth()
    const { saved, save, remove, ready } = useShortlist()
    const navigate = useNavigate()
    const isSaved = saved.some((row) => row.onet_code === code)

    function handleClick(){
        if(!user){
            navigate("/signin", {state:{reason: "save"}})
            return
        }
        if(isSaved){
            remove(code)
        }else{
            save(code)
        }
    }

    return(
        <button type="button" className={`btn btn-primary ${className}`} onClick={handleClick} disabled={user && !ready}>
            {isSaved ? "Remove" : "Save"}
        </button>
    )
}

export default SaveButton