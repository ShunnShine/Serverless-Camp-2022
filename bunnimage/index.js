bunnForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const fileUpload = document.getElementById('fileUpload');
    if (!/^.*\.(png|jpg|jpeg)$/.test(fileUpload.value)) {
        alert("Invalid File");
        return;
    }

    const fileName = document.getElementById('filename');
    if (!fileName.value){
        alert("No name given");
        return;
    }

    try {
        const payload = new FormData();
        const file = fileUpload.files[0]; // fileInput is the file upload input element
        payload.append("file", file);
        
        const response = fetch('https://serverless-camp.azurewebsites.net/api/bunnimage-upload?code=-TbWWi7m-D8CzAEOJNEZZahKE83BJ3-nAAgKZ8wpQvHvAzFucAAc2Q==', {
            method:'POST',
            body: payload,
            headers: {"codename": fileName.value},
        })
        .then( (response) => response.text())
        .then( (text) => document.getElementById('output').textContent = 'Your image has been stored successfully!');
    } catch (error) {
        alert("File upload failed. Reason:" + error);
        return;
    }
});

document.getElementById('button2').addEventListener('click', async (event) => {
    var username = document.getElementById('downloadusername').value;
    
    const resp = await fetch('https://serverless-camp.azurewebsites.net/api/bunnimage-download?code=WQdFhhAOOZxZe-4XNLU70hEagu78tbN7_y0r5GGWR9aJAzFuRDVeNQ==', {
        method:"GET",
        headers:{
            username: username
        }
    });
    const data = await resp.json();

    const link = data.downloadUri;
    window.open(link, '_self');
})
