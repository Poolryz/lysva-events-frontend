const urls={
    localhost: "http://localhost:3000/",
    public: "lysvalife.ru/"
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