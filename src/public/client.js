let store = Immutable.Map( {
    user: Immutable.Map({ name: "Student" }),
    apod: '',
    rovers:Immutable.List(['Curiosity', 'Opportunity', 'Spirit']),
})

// add our markup to the page
const root = document.getElementById('root')
//update store object and send object to render
const updateStore = (store, newState) => {
    store = store.merge(store, newState)
    render(root, store)
}

//render page in root -> App
const render = async (root, state) => {
    root.innerHTML = App(state)
}
// create content
  // ${Greeting(store.get('user').get('name'))}
      // <p> ${ImageOfTheDay(state.get('apod'))} </p>
const App = (state) => {
  // let {rover} = state
  const rovers = state.get("rovers");
  const apod = state.getIn(['apod','image']);

    if (state.get('photos')){
      return ShowRoverContent(state);
    }
    return `
        <header>

        </header>
        <main>
        <div class="headline">
            <h1>MARS ROVER DASHBOARD</h1>
        </div>
            <section id="wrapper">
              <div id="stars"></div>
              <div id="stars2"></div>
              <div id="stars3"></div>
              <div class="roverContainer">
                  <div class="rover1" >
                    <button id="curiosity" type="button" value="curiosity" onclick="ClickRoverButton(this)">${state.getIn(['rovers',0])}</button>
                  </div>
                  <div class="rover2" >
                    <button id="opportunity" type="button" value="opportunity" onclick="ClickRoverButton(this)">${state.getIn(['rovers',1])}</button>
                  </div>
                  <div class="rover3" >
                    <button id="spirit" type="button" value="spirit" onclick="ClickRoverButton(this)">${state.getIn(['rovers',2])}</button>
                  </div>
              </div>
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
const ClickRoverButton = async (e) =>{
  await getRoverInfo(e.value);
}

const ShowRoverContent = (state) =>{
  let name1 =state.getIn(['photos',0,'rover','name'])
  console.log(name1)
  return `
        <div>
        <ul class="roverList">
          <li> Rover Name: ${ state.getIn(['photos',0,'rover','name'])} </li>
          <li> ID: ${ state.getIn(['photos',0,'rover','id'])} </li>
          <li> Launch Date: ${ state.getIn(['photos',0,'rover','launch_date'])} </li>
          <li> Landing Date: ${ state.getIn(['photos',0,'rover','landing_date'])} </li>
          <li> Mission Status: ${ state.getIn(['photos',0,'rover','status'])} </li>
          <li> Photos taken on: ${state.getIn(['photos',0,'earth_date'])} </li>
        </div>
        <div>
        <br>
        <button onclick= "backButton()" class="backButton"> Back </button>
        </div>
        <div>
        <br>
      ${roverImages(state)}
        </div>
        <br>
          <button onclick= "backButton()" class="backButton"> Back </button>
          `

};
// const roverImg = (src) => {
//   return `<img src= "${src}" class ="roverImage" height = "350px" width="50%">`;
// }
const roverImages = (state) => {
  const roverImg = (src) => {
    return `<img src= "${src}" class ="roverImage" height = "350px" width="50%">`;
  }
  return(state.get('photos'))
        .map(photo => roverImg(photo.get("img_src")))
        .reduce((a, b) => a + b);
      };


//   const roverPhotosArray = store.getIn(['photos']).map(photo => {
//     return `<img src= "${getIn(['photo','img_src'])}" height="350px" width="50%">`
//   });
//   return roverPhotosArray.reduce((a, b) => a + b)
// };
// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const backButton = () => {
  store = store.remove("photos");
  // delete store.photos
  render(root,store);
};

// const Greeting = (name) => {
//     if (name) {
//         return `
//             <h1>Welcome, ${name}!</h1>
//         `
//     }
//     return `
//         <h1>Hello!</h1>
//     `
// }

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {

    // If image does not already exist, or it is not from today -- request it again
    const today = new Date()
    // const photodate = new Date(apod.getIn(["image", "date"]));
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
const getImageOfTheDay = async (state) => {
  try {
    let { apod } = state
      await fetch(`http://localhost:3000/apod`)
        .then(res => res.json())
        .then(apod => updateStore(store, { apod }))
    // return data
  } catch(error){
    console.log('errors:', err)
  }

}

const getRoverInfo = async (roverName) =>{
  try{
        await fetch(`http://localhost:3000/roverInfo/${roverName}`)
            .then(res => res.json())
            .then(roverInfo => {
            updateStore(store,roverInfo)
            console.log(roverInfo)
            })
          }catch (error){
            console.log('error:',err);
          }
};
