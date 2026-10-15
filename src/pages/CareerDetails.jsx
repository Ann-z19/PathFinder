import { useParams } from "react-router";

function CareerDetails(){
    const { code } = useParams()
    return(
        <section>
            <h1>Career details</h1>
            <p>O*NET Code: {code}</p>
        </section>
    )
}

export default CareerDetails