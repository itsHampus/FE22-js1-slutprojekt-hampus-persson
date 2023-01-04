//errorMessage
const errorMessage = document.getElementById('errorMessage');
errorMessage.style.display = 'none';

//Laddningsanimation
const animationContainer = document.getElementById('animationContainer');
animationContainer.style.display = 'none';
const loadingAnimation = {
    targets: '#animationContainer p',
    direction: 'alternate',
    duration: 50,
    fontSize: '20px',
    paddingRight: '.5px',
    translateY: -3,
    delay: anime.stagger(50),
    endDelay: anime.stagger(10),
    loop: true,
}
anime(loadingAnimation);

//Index för bilderna (slides)
let slideIndex = 1;

//Visa inte Containern med bilderna när det inte finns några bilder i den
document.getElementById('containerForTheSlideshowContainer').style.display = 'none';

const searchBtn = document.getElementById('userSearchButton');
searchBtn.addEventListener('click', searchForPictures);
function searchForPictures(event) {
    //Kollar om användaren har fyllt i form korrekt
    let isFormValid = document.getElementById('userForm').checkValidity();
    if (!isFormValid) {
        document.getElementById('userForm').reportValidity();
    }
    //Om användaren har fyllt i form korrekt
    else {
        event.preventDefault();
        //Tömmer bilderna i slideshowContainer vid nytt sök
        document.getElementById('slideshowContainer').innerText = '';
        document.getElementById('containerForTheSlideshowContainer').style.display = 'none';
        //Errormessage tas bort vid nytt sök
        errorMessage.style.display = 'none';
        //Laddningsanimationen visas medan man hämtar bilderna
        animationContainer.style.display = 'flex';

        //Hämtar användarens input och lägger till de i Url:en
        const searchWord = document.getElementById('userSearchWord').value;
        const searchNumber = document.getElementById('userSearchNumber').value;
        const searchSort = document.getElementById('userSort').value;

        const urlGetJson = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=f3cb843555a121a72402fa3b394ef86a&text=${searchWord}&format=json&nojsoncallback=1&per_page=${searchNumber}&sort=${searchSort}`;

        //Gör om url:en till JSON
        fetch(urlGetJson).then(
            (response) => {
                return response.json();
            }
        ).then(
            (data) => {
                //Kollar om det blev en misslyckad sökning
                if (data.photos.photo.length == 0) {
                    throw 1;
                }
                else {
                    const photoArray = data.photos.photo;
                    let slideNumberIndex = 0;
                    // Skapa bilderna och pussla ihop url:en för img src
                    for (const el of photoArray) {
                        const serverId = el.server;
                        const id = el.id;
                        const secret = el.secret;
                        const sizeSuffix = document.getElementById('userSizeSuffix').value;
                        let url = `https://live.staticflickr.com/${serverId}/${id}_${secret}_${sizeSuffix}.jpg`;

                        const img = document.createElement('img');
                        img.src = url;

                        //Hålla koll på vilken bild (slide) man är på ex. 1/50
                        slideNumberIndex++;
                        let slideNumber = document.createElement('p');
                        slideNumber.classList.add('slideNumber');
                        slideNumber.innerText = `${slideNumberIndex} / ${photoArray.length}`;

                        //Lägg till bilderna i slideshow
                        const slides = document.createElement('div');
                        slides.classList.add('slides');
                        slides.append(slideNumber, img);
                        document.getElementById('slideshowContainer').append(slides);
                    }
                    // Visa den första bilden i slideshowen, visa slideshow i DOM
                    slideIndex = 1;
                    showSlides(slideIndex);
                    document.getElementById('containerForTheSlideshowContainer').style.display = 'flex';
                }
            }
        ).catch(
            (error) => {
                // Är error 1 har det blivit fel med sökordet och det har inte funnits några bilder under det ordet
                if (error == 1) {
                    errorMessage.innerText = 'Något blev fel vid din sökning. Testa med annat sökord.';
                    errorMessage.style.display = 'block';
                }
                //Har det blivit fel med nåt utanför sökningen ändras felmeddelandet
                else {
                    errorMessage.innerText = 'Något gick fel med din sökning. Försök igen senare.';
                    errorMessage.style.display = 'block';
                }
            }
        ).then(
            () => {
                //När all information är laddad och färdig visa inte laddningsanimationen
                animationContainer.style.display = 'none';
            }
        )
    }
}
//EventListeners för att användaren ska kunna navigera mellan bilderna via pilarna
const prev = document.getElementsByClassName('prev')[0];
prev.addEventListener('click', () => {
    plusSlides(-1);
});
const next = document.getElementsByClassName('next')[0];
next.addEventListener('click', () => {
    plusSlides(1);
})

//Funktion för att kontrollera prev och next
function plusSlides(n) {
    showSlides(slideIndex += n);
}
function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName('slides');
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = 'none';
    }
    slides[slideIndex - 1].style.display = 'block';

}