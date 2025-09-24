const Topbar = ()=>{
    return(
        <div className="topbar">
            <img src="/newLogo.svg" alt="" width='90px'/>
            <div className="d-flex align-items-center gap-2">
                {/* Link */}
                <button className="button">Cart</button>
                <button className="button">Login</button>
                <button className="button">SignUp</button>
                
            </div>
        </div>
    )
}

export default Topbar