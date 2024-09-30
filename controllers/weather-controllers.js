



export const getAllWeather = async (req, res) => {
    try {
        const response = await fetch('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/cairo?unitGroup=metric&key=LJBU6P5FG3UY5WB2KUV65GSSG&contentType=json');

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


export const getWeatherByHour = async (req, res) => {
    try{
        const response = await fetch('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/cairo?unitGroup=metric&include=hours&key=LJBU6P5FG3UY5WB2KUV65GSSG&contentType=json');
        if (!response.ok) {
            return res.status(response.status).json({ error: 'Failed to fetch weather data' });
        }
        const data = await response.json();
        res.json(data);




    }catch(e){
        console.log(e)
        res.status(500).json({message: "Server Error"})
    }
}