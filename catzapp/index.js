async function y1k3s(){
    const name1 = document.getElementById('text1').value;
    const name2 = document.getElementById('text2').value;
    const name3 = document.getElementById('text3').value;
    const name4 = document.getElementById('text4').value;



    const URLparams = new URLSearchParams();
    URLparams.append('name1', name1);
    URLparams.append('name2', name2);
    URLparams.append('name3', name3);
    URLparams.append('name4', name4);

    const resp = await fetch('https://serverless-camp.azurewebsites.net/api/twocatz?code=snzVbL2KniJ3eYlzC7g0PDkhrDNT4Na1uiJ6cu0pxdLoAzFufssOgQ==&' + URLparams.toString(),
        {method:'GET'});
    const jsonResp = await resp.json();

    document.getElementById('image').src = add64(jsonResp.name1);
    document.getElementById('image').src = add64(jsonResp.name2);
    document.getElementById('image').src = add64(jsonResp.name3);
    document.getElementById('image').src = add64(jsonResp.name4);
}

function add64(image){
    return `data:image/png;base64,${image}`;
}