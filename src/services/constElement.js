const urls={
    localhost: "http://localhost:3000/",
    public: "http://176.32.33.100:3000/"
}


function urlChanger(){
    let dev = false
    if (dev){
        return urls.localhost
    }
else{
    return urls.public
}

}

export default urlChanger