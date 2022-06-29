const bunnForm = document.getElementById('bunnForm');

bunnForm.addEventListener('submit', (event) => {
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

    document.getElementById('output').textContent = 'Thanks!';
});
