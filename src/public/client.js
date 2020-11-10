let store = {
    user: { name: "Student" },
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
}

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}


//when button click info show
const clickRoverBtn = (e) =>{
  getRoverInfo(e.value)
}
const showContent =(state) =>{
  // console.log(state.getIn(["photos", 0, "rover", "name"]))
  console.log(state.photos[0].rover.name)
  return `
        <div>
        <ul>
          <li> Name: ${ state.photos[0].rover.name} </li>
          <li> ID: ${ state.photos[0].rover.id} </li>
          <li> Launch Date: ${ state.photos[0].rover.launch_date} </li>
          <li> Landing Date: ${ state.photos[0].rover.landing_date} </li>
          <li> Status: ${ state.photos[0].rover.status} </li>
        </div>
          `
};
// create content
const App = (state) => {
    // let { rovers, apod } = state;
    //same as let state = {
      // rovers: "",
      // apod:"",}
    if (state.photos){
     return showContent(state);
    }
    return `
        <header>
        <button type="button" value="curiosity" onclick="clickRoverBtn(this)">${state.rovers[0]}</button>
        <button type="button" value="opportunity" onclick="clickRoverBtn(this)">${state.rovers[1]}</button>
        <button type="button" value="spirit" onclick="clickRoverBtn(this)">${state.rovers[2]}</button>
        </header>
        <main>
            ${Greeting(store.user.name)}
            <section>
                <h3>Put things on the page!</h3>
                <p>Here is an example section.</p>
                <p>
                    One of the most popular websites at NASA is the Astronomy Picture of the Day. In fact, this website is one of
                    the most popular websites across all federal agencies. It has the popular appeal of a Justin Bieber video.
                    This endpoint structures the APOD imagery and associated metadata so that it can be repurposed for other
                    applications. In addition, if the concept_tags parameter is set to True, then keywords derived from the image
                    explanation are returned. These keywords could be used as auto-generated hashtags for twitter or instagram feeds;
                    but generally help with discoverability of relevant imagery.
                </p>
                   ${ImageOfTheDay(state.apod)}
            </section>
        </main>
        <footer></footer>
    `
}
  // ${ImageOfTheDay(apod)}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
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
    console.log(photodate.getDate(), today.getDate());

    console.log(photodate.getDate() === today.getDate());
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
    } else {
        return (`


        `)
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

//getting rover info
// const getRoverInfo = (roverName) =>{
//   let {rovers} = roverName
//   fetch(`http://localhost:3000/rover/roverName`)
//     .then(res => res.json())
//     .then(data => {
//       updateStore(store,data)
//       console.log(data)
//     })
// };
const getRoverInfo = (roverName) =>{
  fetch(`http://localhost:3000/roverInfo/${roverName}`)
    .then(res => res.json())
    .then(roverInfo => {
      updateStore(store,roverInfo)
      console.log(roverInfo)


    })
};
