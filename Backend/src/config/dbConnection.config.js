// import libraries
import mongoose from 'mongoose';
// import enviroment variables
import 'dotenv/config';

// funtion to connect to mongodb
export const connectiondb = async()=>{
    // use the enviroment variable with the URI address to the mongodb database
    const URI = process.env.MONGODB_URI;
    
    // basic error if the enviroment variable can't be retrieved
    if(!URI){
        throw new Error('No se ha definido la URI de la base de datos');
    }

    // try to connect or catch the error, print in console what was achieved
    try{
        await mongoose.connect(URI);
        console.log('Base de datos conectada');
    }catch(e){
        console.error(e);
        throw new Error('Error a la hora de iniciar la base de datos');
    }
}

