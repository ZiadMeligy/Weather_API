// List of stuff to do 
// 1. Embed Location to fetch weather data for a specific location
// 2. Embed Time to fetch weather data for a next hour. next day, next week
// 3. Embed Weather to fetch weather data for a specific weather condition (that depends on the API)
// 4. Embed Users accounts and add responses to their history of weather data
// 5. Allow only authenticated users to access the weather data
// 6. stop the user from accessing the weather data if they have exceeded the limit of requests


export const getAllWeather = async (req, res) => {
    try {
        const location = req.params.location;
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=LJBU6P5FG3UY5WB2KUV65GSSG&contentType=json`);

        if (!response.ok) {
            return res.status(response.status).json({ error: 'Failed to fetch weather data' });
        }

        const data = await response.json();

        res.json(data); 
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



export const getCurrentWeather = async (req, res) => {
    try {
        const response = await fetch('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/cairo?unitGroup=metric&key=LJBU6P5FG3UY5WB2KUV65GSSG&contentType=json');

        if (!response.ok) {
            return res.status(response.status).json({ error: 'Failed to fetch weather data' });
        }

        const data = await response.json();

        const currentTime = new Date().toLocaleString('en-US', { timeZone: 'Africa/Cairo' }); // Adjust the timezone as necessary
        const currentHour = currentTime.split(',')[1].split(':')[0].trim();

        const filteredData = {
            location: data.resolvedAddress,
            currentTime: currentTime,
            currentHour: currentHour,  
            currentConditions: {
                temperature: data.currentConditions.temp,  
                humidity: data.currentConditions.humidity,  
                windSpeed: data.currentConditions.windspeed,  
            },
            description: data.description 
        };

        res.json(filteredData); 
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const getWeatherByHourToday = async (req, res) => {
    try{
        const response = await fetch('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/cairo?unitGroup=metric&include=hours&key=LJBU6P5FG3UY5WB2KUV65GSSG&contentType=json');
        if (!response.ok) {
            return res.status(response.status).json({ error: 'Failed to fetch weather data' });
        }
        const data = await response.json();

        const filteredData={
            location: data.resolvedAddress,
            hourlyWeather: data.days[0].hours.map(hour => {
                return {
                    time: hour.datetime,
                    temperature: hour.temp,
                    feelslike: hour.feelslike,
                    humidity: hour.humidity,
                    windSpeed: hour.windspeed,
                    description: hour.conditions
                }
            })
        } 
        
        res.json(filteredData);




    }catch(e){
        console.log(e)
        res.status(500).json({message: "Server Error"})
    }
}

