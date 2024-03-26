window.onload = function(){

    var fileInput = document.getElementById('fileInput');
    let video     = document.getElementById('myVideo');
    let play      = document.getElementById('play');
    let pause     = false;
    let reload    = document.getElementById('reload');
    let line      = document.getElementById('line'); //input type="range"
    let mud       = document.getElementById('mud');
    let open      = document.getElementById('open');
    let time      = document.getElementById('timeCurrent');
    let volume    = document.getElementById('volume');
    let vm        = document.getElementById('volume+');
    let vmm       = document.getElementById('volume++');
    let vs        = document.getElementById('volume-');
    let vss       = document.getElementById('volume--');
    let tempoTotal= document.getElementById('tempoTotal');
    let full      = document.getElementById('full');
    let titulo    = document.getElementById('titulo');
    let rangerVol = document.getElementById('rangerVolume');
    let avanca10  = document.getElementById("avanca10");
    let voltar10  = document.getElementById("voltar10");
    let carregar  = document.getElementById("carregar");
    let player    = document.getElementById("player");
    let timeDiv   = document.getElementById('timeDiv');
    let boxLine   = document.getElementById('boxLine');
    line.max      = video.duration;
    tamanho = 0;
    video.volume  = 0.5;

    // Aumentar a velocidade de reprodução
    video.playbackRate = 2.0;

    // Diminuir a velocidade de reprodução
    video.playbackRate = 0.5;

    // Diminuir a velocidade de reprodução
    video.playbackRate = 1.0;

    console.log('Largura do quadro de vídeo: ' + video.videoWidth 
                + ' pixels');
    console.log('Altura do quadro de vídeo: '  + video.videoHeight 
                + ' pixels');
    console.log('Taxa de quadros do vídeo: ' + video.videoPlaybackRate 
                + ' fps');
    
    rangerVol.addEventListener('input', function(event) {
        video.volume = rangerVol.value;
    })
    fileInput.addEventListener('change', function(event) {

        player.style.display = "block";
        carregar.style.display = "none";
        
        var file = event.target.files[0];
        console.log(file.size)
        console.log(file.name)
        console.log(file.type)
        var videoURL = URL.createObjectURL(file);
        video.src = videoURL;
        video.addEventListener('loadeddata',()=>{
            
            line.max = video.duration;
            //retira a extenção
            titulo.innerText = file.name;
            tempoTotal.innerText = ajustarTime(Math.floor(video.duration));

            line.style.width = video.videoWidth + "px";
            tamanho = video.videoWidth;
            video.play();
        })
    });
    carregar.addEventListener("click",()=>{
        fileInput.click();
    })
    avanca10.addEventListener("click",()=>{
        video.currentTime -= 5;
    })
    voltar10.addEventListener("click",()=>{
        video.currentTime += 5;
    })
    open.onclick = () => {
        fileInput.click();
    }
    function fullScreen(){
        if (video.requestFullscreen) {
            video.requestFullscreen();
        } else if (video.mozRequestFullScreen) { // Firefox
            video.mozRequestFullScreen();
        } else if (video.webkitRequestFullscreen) { // Chrome, Safari, Opera
            video.webkitRequestFullscreen();
        } else if (video.msRequestFullscreen) { // IE/Edge
            video.msRequestFullscreen();
        }
    }
    full.addEventListener('click',()=>fullScreen())
    video.addEventListener('dblclick',()=>fullScreen())

    let playCondicao = false;
    video.addEventListener('click',()=>{
        play.click();
    })
    play.addEventListener('click',()=>{
        
        if(pause) {
            
            video.play();
            playCondicao = true;
            pause = false;
            play.style.backgroundPosition = "-205px -7px";
        
        } else {
            
            video.pause();
            playCondicao = false;
            pause = true;
            play.style.backgroundPosition = "-155px -7px";

        }
    })
    mud.addEventListener('click',()=>{
        
        if(video.muted){
            
            video.muted = false;
            volume.innerText = (video.volume*100).toString();
            mud.style.backgroundPosition = "-154px -108px";
        
        } else {
            
            video.muted = true;
            volume.innerText = '0';
            mud.style.backgroundPosition = "-104px -108px";
        
        }
        rangerVol.value = volume.innerText/100;
    })
    reload.addEventListener('click',()=>{
        video.play();
        video.currentTime = 0;
    })
    mudar = true
    video.addEventListener('timeupdate',()=>{
        if(mudar){
            line.value = video.currentTime;
            time.innerText = ajustarTime(Math.floor(video.currentTime)+'');
        }
    })
    line.addEventListener('change',()=>{
        mudar = true;
        video.currentTime = line.value;
    })
    line.addEventListener('mousemove', function(e) {

        var x = Math.max(0, e.clientX - line.getBoundingClientRect().left);
        //timeDiv.style.display = "block";
        timeDiv.style.left = x + 'px';

        valorAtual = (x * video.duration) / line.offsetWidth;

        timeDiv.innerHTML = ajustarTime(Math.floor(valorAtual));
    });
    boxLine.addEventListener('mouseleave', function(e) {
        timeDiv.style.display = "none";
    });
    //terrope quando o usuario estiver arrastando
    line.addEventListener('input', function() {
        mudar = false;
    });
    line.addEventListener('click',()=>{
        video.currentTime = line.value;
    })
    video.addEventListener('volumechange',()=>{
        if(video.muted == true){
            volume.innerText = '0';
        } else {
            volume.innerText = Math.floor(video.volume*100);
        }
    })
    vm.addEventListener('click',()=>{
        video.volume += 0.01;
        rangerVol.value = video.volume;
        if(video.muted == true) video.muted = false;
    })
    vmm.addEventListener('click',()=>{
        if(video.volume < 1){
            if(video.volume >= 0.9)
                video.volume = 1;
            else
                video.volume += 0.1;
        }
        rangerVol.value = video.volume;
        if(video.muted == true) video.muted = false;
    })        
    vs.addEventListener('click',()=>{        
        video.volume -= 0.01;        
        if(video.volume <= 0 || video.volume < 0.01)
            video.volume = 0;
        rangerVol.value = video.volume;
    })
    vss.addEventListener('click',()=>{
        if(video.volume <= 0.1)
            video.volume = 0;
        else
            video.volume -= 0.1;
        rangerVol.value = video.volume;
    })
    function ajustarTime(tempo){
        
        if(tempo >= 60){

            let hora   = Math.floor(tempo/60);
            let minuto = tempo % 60;

            if(minuto < 10) minuto = '0' + minuto;
            tempo = "" + hora + ":" + minuto;
        } else {
            if(tempo > 9) 
                tempo = "0:" + tempo;
            else
                tempo = "0:0" + tempo;
        }
        return tempo;
    }
}