const urls={
    localhost: "http://localhost:3000/",
    public: "http://api.lysvalife.ru/"
}


function urlChanger(){
    let dev = true
    if (dev){
        return urls.localhost
    }
else{
    return urls.public
}

}

export default urlChanger