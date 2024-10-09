console.log("lets go");
let audio = new Audio;
let songs = [];
let curentfolder;

async function get_songs(folder) {
    currentfold = folder;
    let a = await fetch(`http://127.0.0.1:3000/Spotify_clone/music/${folder}/`);
    let response = await a.text();
    let element = document.createElement("div");
    element.innerHTML = response;
    let song = [];
    let as = element.getElementsByTagName("a");
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            song.push(element.href.split(`/music/${folder}/`)[1]);
        }
    }
    return song

}
function secondsToMinutesSeconds(seconds) {

    if (isNaN(seconds) || seconds < 0) {
        return "00:00"
    }
    // Round the seconds to the nearest whole number
    var roundedSeconds = Math.round(seconds);

    // Calculate whole minutes and remaining seconds
    var minutes = Math.floor(roundedSeconds / 60);
    var remainingSeconds = roundedSeconds % 60;

    // Format the result as "mm:ss"
    var formattedTime = minutes.toString().padStart(2, '0') + ':' + remainingSeconds.toString().padStart(2, '0');

    return formattedTime;
}
async function playmusic(a) {
    console.log(a);

    audio.src = `http://127.0.0.1:3000/Spotify_clone/music/${currentfold}/` + a + ".mp3"
    audio.play();
    play.src = "favicons/icons8-pause-60.png"
    document.querySelector(".songname").innerHTML = decodeURI(a)
    document.querySelector(".songduration").innerHTML = "00:00 / 00:00"

}
async function dynamicalbum(){
let a = await fetch(`http://127.0.0.1:3000/Spotify_clone/music/`);

let response = await a.text();
let element = document.createElement("div");
console.log(element);
    element.innerHTML = response;
    let anchors=element.getElementsByTagName("a");
    let cardcont=document.querySelector(".cards");
    let arr= Array.from(anchors);
    for (let index = 0; index < arr.length; index++) {
        const e= arr[index];
        if(e.href.includes("/music")){
            let folder1=e.href.split("/").slice(-2)[0];
            //get data
            let a = await fetch(`http://127.0.0.1:3000/Spotify_clone/music/${folder1}/info.JSON`);
            let response= await a.json();
            cardcont.innerHTML=cardcont.innerHTML+`<div data-folder="${folder1}" class="card">
                            <img src="music/${folder1}/album.jpeg" alt="">
                            <div class="musictitle">${response.title}</div>
                            <div class="artist"> ${response.description}</div>
                            <button class="playbutton"><img src="favicons/icons8-play-30.png" alt=""></button>
                            </div>`

        }
        
    }
}
async function main() {
    await dynamicalbum();

    // album listner
    Array.from(document.getElementsByClassName("card")).forEach(element => {
        element.addEventListener("click", async item => {
            console.log(element);
            songs = await get_songs(item.currentTarget.dataset.folder);
            //img at top
            document.querySelector(".liked_song>img").src = element.querySelector("img").src;
            document.querySelector(".liked_song>div>h1").innerHTML = element.querySelector(".musictitle").innerHTML;
            document.querySelector(".liked_song>div>p").innerHTML=`Playlist . ${songs.length} Songs`
            
            //list adder
            let songlist = document.querySelector(".songs ul");

            if (songlist) {
                songlist.innerHTML = ""; 
                console.log(songs);
                for (const s1 of songs) {
                    songlist.innerHTML += `<li class="flex">
                        <div class="flex">
                            <img src="favicons/icons8-musical-note-24.png" alt="">
                            <div class="musictitle">${s1.replaceAll("%20", " ").replaceAll(".mp3", "")}</div>
                        </div>
                        <img src="favicons/icons8-play-30 (1).png" alt="">
                    </li>`;
                }
                Array.from(songlist.getElementsByTagName("li")).forEach(element => {
                    element.addEventListener("click", () => {
                        playmusic(element.querySelector(".musictitle").innerHTML.trim());
                        console.log(element.querySelector(".musictitle").innerHTML.trim());
                        document.querySelector(".songname").innerHTML = element.querySelector(".musictitle").innerHTML.trim();
                    });
                });
            } else {
                console.error("Song list element not found");
            }


        })
    });


    //play pause 
    play.addEventListener("click", () => {
        if (audio.paused) {
            audio.play();
            play.src = "favicons/icons8-pause-60.png"
        }
        else {
            audio.pause();
            play.src = "favicons/icons8-play-60.png"

        }
    })

    //time update event
    audio.addEventListener("timeupdate", () => {
        document.querySelector(".songduration").innerHTML = `${secondsToMinutesSeconds(audio.currentTime)}/${secondsToMinutesSeconds(audio.duration)}`
        document.querySelector(".seek").style.left = (audio.currentTime / audio.duration) * 100 + "%";
    })
    //seekbar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let per = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".seek").style.left = per + "%";
        audio.currentTime = audio.duration * (per / 100);
    })
    //ham
    document.querySelector(".ham").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0;
    })
    //hamcross
    document.querySelector(".logo>img").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";

    })
    //next

    next.addEventListener("click", async () => {
        audio.pause();

        let currentIndex = songs.indexOf(audio.src.split("/").slice(-1)[0]);
        if (currentIndex + 1 < songs.length) {
            await playmusic(songs[currentIndex + 1].replace(".mp3", ""));
        }
        audio.play();
    });
    //prev
    prev.addEventListener("click", async () => {
        audio.pause();

        let currentIndex = songs.indexOf(audio.src.split("/").slice(-1)[0]);
        if (currentIndex - 1 >= 0) {
            await playmusic(songs[currentIndex - 1].replace(".mp3", ""));
        }
        audio.play();
    });
    //vol
    vol.addEventListener("change", (e) => {
        audio.volume = parseInt(e.target.value) / 100;
        if (e.target.value <= 0) {
            document.querySelector(".volu>img").src = "favicons/icons8-mute-50 (1).png"
        }
        else
            document.querySelector(".volu>img").src = "favicons/icons8-voice-50.png"
    })


}
main();
