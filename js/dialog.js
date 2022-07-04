export default function showDialog(title, text){
    const dialog = {
        screen: document.querySelector("#dialogScreen"),
        window: document.querySelector("#dialogWindow"),
        title: document.querySelector("#dialogWindow h2"),
        text: document.querySelector("#dialogWindow p"),
        closeButton: document.querySelector("#dialogCloseButton"),
    };

    dialog.title.textContent = title;
    dialog.text.innerHTML = text;
    dialog.screen.style.display = "flex";

    dialog.closeButton.addEventListener("click", closeDialog);

    function closeDialog(){
        dialog.screen.style.display = "none";
        dialog.closeButton.removeEventListener("click", closeDialog);
    }
}
