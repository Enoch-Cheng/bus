//global settings
const delay_factor = 1000;
const proxy = 'https://cors-anywhere.herokuapp.com/';


function initTable(id, settings){
    var table = document.getElementById(id);

    for (i = settings.list.length-1; i >= 0; i--) {
        //console.log(i);
        var row = table.insertRow(0);  
        var cell = row.insertCell(0); cell.innerHTML = "loading...";
        var cell = row.insertCell(0); cell.innerHTML = settings.list[i].stopname;
        var cell = row.insertCell(0); cell.innerHTML = settings.list[i].route;
    }

    var header = table.createTHead();
    row = header.insertRow(0);  
    cell = row.insertCell(0); cell.innerHTML = "<b>Estimated time of arrival</b>";
    cell = row.insertCell(0); cell.innerHTML = "<b>Stop</b>";
    cell = row.insertCell(0); cell.innerHTML = "<b>Route</b>";

    console.log('init table');
    
}

function updateTable(id, pos, value){
    var table = document.getElementById(id);
    table.rows[pos].cells[2].innerHTML = value; // ETA data is at column 3
    console.log('updating table');
}

async function getStuff(url) {
    const resp = await fetch(url);
    const data = await resp.json();            
    return data;
    console.log('getting some stuff');
}

function delay(interval){
    return new Promise(resolve => setTimeout(resolve, interval));
} 

async function getKmb_eta(d,idx,wait) {
    
    const url = 'http://etav3.kmb.hk/?action=geteta&lang=en' +
    '&route=' + d.route +
    '&bound=' + d.bound + 
    '&stop=' + d.stopcode + 
    '&stop_seq=' + d.stopseq;

    await delay(wait*delay_factor);
    console.log('Query: ' + url)
    const resp = await fetch(proxy + url);
    const data = await resp.json(); 
    if(data.hasOwnProperty('response')){
        console.log('Got ETA');
        // console.log(data.response);
        return {eta:data.response, idx:idx};
    }else{
        console.error('Cannot get ETA');
    }           
    
    
}

function parseKMB(eta){
    var string = "";
    for(i = 0; i < eta.length; i++ ){
        if(i == eta.length -1){
            string = string + eta[i].t;
        }else{
            string = string + eta[i].t + "<br>";
        }
    }
    return string;
}

async function getCnb_eta(d,idx,wait) {
   const url = 'https://rt.data.gov.hk/v1/transport/citybus-nwfb/eta/' +
   d.co + '/' + d.stopcode + '/' + d.route;

   await delay(wait*delay_factor);
   console.log('Query: ' + url)
   const resp = await fetch(url);
   const data = await resp.json(); 
   if(data.hasOwnProperty('data')){
       console.log('Got ETA');
       // console.log(data.data);
       return {eta:data.data, idx:idx};
   }else{
       console.error('Cannot get ETA');
   }           
    
}


function parseCNB(eta){
    var string = "";
    for(i = 0; i < eta.length; i++ ){
        if(i == eta.length -1){
            string = string + formatTime(eta[i].eta) + eta[i].rmk_en;
        }else{
            string = string + formatTime(eta[i].eta) + eta[i].rmk_en + "<br>";
        }
    }
    return string;
}

function setCurrentTime(id){
    var today = new Date(); 
    var hh = today.getHours();
    var mm = today.getMinutes();
    var ss = today.getSeconds();

    if (hh < 10)  hh = '0'+ hh;
    if (mm < 10)  mm = '0'+ mm;
    if (ss < 10)  ss = '0'+ ss;

    document.getElementById(id).textContent = hh + ':' + mm + ':' + ss;
    console.log('Getting current time');
}

function formatTime(datestring){
    var d = new Date(datestring); 
    var hh = d.getHours();
    var mm = d.getMinutes();
    var ss = d.getSeconds();

    if (hh < 10)  hh = '0'+ hh;
    if (ss>30) mm = mm + 1;
    if (mm < 10)  mm = '0'+ mm;
    

    return hh + ':' + mm;
    console.log('Getting current time');
}