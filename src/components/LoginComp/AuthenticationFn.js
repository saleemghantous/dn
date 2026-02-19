

export const adminAuthentication = (userSlice, navigate) => {
    if (userSlice.admin !== true || userSlice.loginStatus !== true) {
        navigate("/")
        return false
    }
    else{
        return true
    }
}


export const userAuthentication = (userSlice, navigate) => {
    if (userSlice.loginStatus !== true) {
        navigate("/")
        return false
    }
    else{
        return true
    }
}



