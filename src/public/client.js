let store = {
    user: { name: "Student" },
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
}

// add our markup to the page
const root = document.getElementById('root')
//update store object and send object to render
const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

//render page in root -> App
const render = async (root, state) => {
    root.innerHTML = App(state)
}
// create content
const App = (state) => {
  const rovers = state.rovers;
  const apod = state.apod.image;

    if (state.photos){
      return showRoverContent(state);
    }
    return `
        <header>
        <button type="button" value="curiosity" onclick="clickRoverButton(this)">${state.rovers[0]}</button>
        <button type="button" value="opportunity" onclick="clickRoverButton(this)">${state.rovers[1]}</button>
        <button type="button" value="spirit" onclick="clickRoverButton(this)">${state.rovers[2]}</button>
        </header>
        <main>
            ${Greeting(store.user.name)}
            <section>
                <h3>Put things on the page!</h3>
                <p>Here is an example section.</p>
                <p> ${ImageOfTheDay(state.apod)} </p>
            </section>
        </main>
        <footer></footer>
    `
}
// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})
// ------------------------------------------------------  COMPONENTS

//when button click info show
const clickRoverButton = (e) =>{
  getRoverInfo(e.value);
}

const showRoverContent = (state) =>{
  // let rname = state[0].rover.name;
  // let landingDate = state.photos[0].rover.launch_date
  // console.log(landingDate)
  // console.log(rname);
  let img = state.photos[0].img_src;
  console.log(img)
  return `
        <div>
        <ul>
          <li> Rover Name: ${ state.photos[0].rover.name} </li>
          <li> ID: ${ state.photos[0].rover.id} </li>
          <li> Launch Date: ${ state.photos[0].rover.launch_date} </li>
          <li> Landing Date: ${ state.photos[0].rover.landing_date} </li>
          <li> Mission Status: ${ state.photos[0].rover.status} </li>
          <li> Earth Date: ${state.photos[0].earth_date} </li>
        </div>
        <div>
        <button onclick = "backButton()" class= "backButton"> Back </button>
        </div>
        <div>
        <img src="${state.photos[0].img_src}" height="350px" width="50%">
        <img src="${roverImages(state)}">
        </div>
          `

};

const roverImages = () => {
  const roverPhotosArray = store.photos.map(photo => {
    return `<img src="${photo.img_src}">`
  });
  return roverPhotosArray.reduce((a, b) => a + b)
};
// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const backButton = () => {
  store = store.remove("photos");
  render(root,store);
};

const Greeting = (name) => {
    if (name) {
        return `
            <h1>Welcome, ${name}!</h1>
        `
    }
    return `
        <h1>Hello!</h1>
    `
}

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {

    // If image does not already exist, or it is not from today -- request it again
    const today = new Date()
    const photodate = new Date(apod.date)
    // console.log(photodate.getDate(), today.getDate());
    // console.log(photodate.getDate() === today.getDate());
    if (!apod || apod.date === today.getDate() ) {
        getImageOfTheDay(store)
    }
    // check if the photo of the day is actually type video!
    if (apod.media_type === "video") {
        return (`
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `)
    }
    else {
        return
    }
}
// <p>${apod.image.explanation}</p>
// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = (state) => {
    let { apod } = state

    fetch(`http://localhost:3000/apod`)
        .then(res => res.json())
        .then(apod => updateStore(store, { apod }))

    // return data
}

const getRoverInfo = (roverName) =>{
  fetch(`http://localhost:3000/roverInfo/${roverName}`)

    .then(res => res.json())
    .then(roverInfo => {
      updateStore(store,roverInfo)
      console.log(roverInfo)


    })
};
