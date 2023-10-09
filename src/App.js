import { useState, useRef, useEffect } from 'react';
import './App.css';
import axios from "axios"

function App() {

  // Create Your API KEY From these Website
  // 👉https://www.weatherapi.com

  const apikey = ""
  const [data, setdata] = useState()
  const cityinput = useRef()
  const alertbox = useRef()

  // For Focusing City Input from user 
  useEffect(() => {
    cityinput.current.focus()
    fetchdata()
    cityinput.current.value = "Mumbai"
  }, [])


  // Formating Date For 3-Forecast 
  function formatDate(dateString) {
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  }



  // Main Function For Fetching Data From Api And Error Small Handling
  const fetchdata = async () => {
    setdata("")
    try {
      let result = await axios.get(`https://api.weatherapi.com/v1/forecast.json?key=${apikey}&q=${cityinput.current.value === "" ? "mumbai" : cityinput.current.value}&days=7`)
      await setdata(result)
      console.log(result)
    } catch (error) {
      cityinput.current.value = ""
      cityinput.current.placeholder = "Please Enter City Name"
      cityinput.current.focus()
      alertbox.current.classList.remove("hidden")
      setTimeout(() => {
        alertbox.current.classList.add("hidden")
      }, 5000);
    }
  }




  return (
    <>
      <div ref={alertbox} className="bg-blue-100 hidden transition-all border-t-4 border-blue-500 rounded-b text-blue-900 px-4 py-3 shadow-md" role="alert">
        <div className="flex">
          <div className="py-1 ml-8">
            <img className='mx-2' src={require("./images/icon.png")} alt="" height={40} width={40} />
          </div>
          <div>
            <p className="font-bold">Unable to Found !</p>
            <p className="text-sm">Please Enter a Valid Country or city Name</p>
          </div>
        </div>
      </div>

      <nav className="text-gray-600 body-font">
        <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">

          <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
            <img src={require("./images/icon.png")} alt="wind-icon" height={40} width={40} />
            <span className="ml-3 text-xl">Weather App</span>
          </a>

          <nav className="md:mr-auto md:ml-4 md:py-1 md:pl-4 0flex flex-wrap items-center text-base justify-center">
            {/* <a className='group-hover:text-gray-900 cursor-pointer mr-5'>About Us</a>
            <a className='group-hover:text-gray-900 cursor-pointer mr-5'>Contact Us</a> */}
          </nav>

          <div className="">
            <input ref={cityinput} className='mr-3 sm:my-6  items-center bg-gray-100 border-0 py-1 px-3 focus:outline-blue-600 caret-blue-600  hover:bg-gray-200 rounded placeholder:fill-zinc-700 group-hover:text-white text-base mt-4' type="text" placeholder='Enter Your City Name' />
            <button onClick={fetchdata} className="inline-flex outline-blue-600 outline-1 sm:my-6 items-center bg-gray-100 py-1 px-3 rounded hover:text-white hover:bg-blue-600  text-base mt-4">Search
              <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-1" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>

        </div>
      </nav>


      <div className="flex mx-10 maincontainer gap-7">
        <div className="w-1/2 first-column">
          <div className="border flex first-first mb-2">
            <div className="w-1/2 rounded p-5">
              <h1 className='md:ml-6 text-2xl'>{data ? data.data.location.name : <div className="skeleton h-8 w-32 bg-gray-300 rounded"></div>}</h1>
              <p className='md:ml-6'>{data ? data.data.current.condition.text : <div className="skeleton h-4 w-1/2 bg-gray-300 rounded"></div>}</p>
              <h1 className='text-3xl md:ml-6 md:mt-2'>{data ? data.data.current.temp_c + "º" : <div className="skeleton h-8 w-24 bg-gray-300 rounded"></div>}</h1>
            </div>
            <div className="w-1/2">
              {data ? (
                <img src={data.data.current.condition.icon} height={100} width={100} className='' alt="" />
              ) : (
                <div className="skeleton h-100 w-100 bg-gray-300 rounded"></div>
              )}
              <p className='md:ml-6'>{data ? "Chances Of Rain : " + data.data.forecast.forecastday[0].day.daily_chance_of_rain + "%" : <div className="skeleton h-4 w-1/2 bg-gray-300 rounded"></div>}</p>
            </div>
          </div>
          <div className="p-5 border box-border first-second mb-2">
            <h1 className='text-md p-2 pl-3 '>Today's Forecast</h1>
            <div className="container mob-container flex">
              {/* Hourly forecast blocks */}
              {Array.from({ length: 6 }).map((_, index) => {
                if (data) {
                  const forecastHour = data.data.forecast.forecastday[0].hour[6 + (3 * index)];
                  const time = new Date(forecastHour.time);
                  const formattedTime = time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

                  return (
                    <div className="container flex flex-col w-1/6 border-l-2 border-dotted" key={index}>
                      <h1 className="heading py-2 text-center">{formattedTime}</h1>
                      <img className='mx-auto' src={forecastHour.condition.icon} alt="" height={50} width={50} />
                      <h1 className='pt-2 text-center'>{forecastHour.temp_c + "º"}</h1>
                      <h1 className='pb-2 text-center text-sm'>{forecastHour.condition.text}</h1>
                    </div>
                  );
                } else {
                  return (
                    <div className="container flex flex-col w-1/6 border-l-2 border-dotted" key={index}>
                      {/* Skeleton loading placeholders */}
                      <h1 className="heading py-5 text-center skeleton h-6 w-16 bg-gray-300 rounded"></h1>
                      <div className="skeleton h-50 w-50 bg-gray-300 rounded"></div>
                      <h1 className='pt-2 text-center skeleton h-6 w-16 bg-gray-300 rounded'></h1>
                      <h1 className='pb-2 text-center text-sm skeleton h-4 w-24 bg-gray-300 rounded'></h1>
                    </div>
                  );
                }
              })}
            </div>
          </div>


          <div className="aircontainer border p-5 first-third mb-2">
            <h1 className='ml-3 mb-2'>Air Condition</h1>
            <div className="container flex x-small">
              <div className="w-1/2 sub-div">
                <div className="p-2">
                  <div className="container inline-flex">
                    <img src={require("./images/thermometer.png")} height={15} width={25} alt="" />
                    <h1>Feels Like</h1>
                  </div>
                  <p className='pl-6'>{data ? data.data.current.feelslike_c + "º" : <div className="skeleton h-4 w-16 bg-gray-300 rounded"></div>}</p>
                </div>
                <div className="p-2">
                  <div className="container inline-flex">
                    <img src={require("./images/drop.png")} height={15} width={25} alt="" />
                    <h1>Humidity</h1>
                  </div>
                  <p className='pl-6'>{data ? data.data.current.humidity + " %" : <div className="skeleton h-4 w-16 bg-gray-300 rounded"></div>}</p>
                </div>
              </div>
              <div className="w-1/2 sub-div">
                <div className="p-2">
                  <div className="container inline-flex">
                    <img src={require("./images/wind.png")} height={15} width={25} alt="" />
                    <h1>Wind</h1>
                  </div>
                  <p className='pl-6'>{data ? data.data.current.wind_kph + " Km/h" : <div className="skeleton h-4 w-16 bg-gray-300 rounded"></div>}</p>
                </div>
                <div className="p-2">
                  <div className="container inline-flex">
                    <img src={require("./images/sun.png")} height={15} width={25} alt="" />
                    <h1>UV Index</h1>
                  </div>
                  <p className='pl-6'>{data ? data.data.current.uv : <div className="skeleton h-4 w-16 bg-gray-300 rounded"></div>}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-1/2 mx-2 h-fit p-5 border box-border second-column">
          <h1 className='text-md p-2 pl-3'>3-Days Forecast</h1>
          <div className="table">
            {[...Array(3)].map((_, index) => (
              <div className="table-row" key={index}>
                <div className="table-cell">
                  <h1 className="heading p-5 mob-text">
                    {data ? formatDate(data.data.forecast.forecastday[index].date) : <div className="skeleton h-6 w-20 bg-gray-300 rounded"></div>}
                  </h1>
                </div>
                <div className="table-cell align-middle">
                  <div className="mob-margin">
                    {data ? (
                      <img className="mob-margin" src={data.data.forecast.forecastday[index].day.condition.icon} alt="" height={50} width={50} />
                    ) : (
                      <div className="skeleton h-10 w-10 bg-gray-300 rounded"></div>
                    )}
                  </div>
                </div>
                <div className="table-cell justify-center items-center">
                  <p className='mob-margin mob-text'>
                    {data ? data.data.forecast.forecastday[index].day.condition.text : <div className="skeleton h-4 w-32 bg-gray-300 rounded"></div>}
                  </p>
                </div>
                <div className="table-cell">
                  <p className='p-5 mob-text '>
                    {data ? `Chances of Rain: ${data.data.forecast.forecastday[index].day.daily_chance_of_rain}%` : <div className="skeleton h-4 w-40 bg-gray-300 rounded"></div>}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>


      </div>

    </>
  );
}

export default App;
