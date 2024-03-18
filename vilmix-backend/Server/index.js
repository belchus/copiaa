import express  from 'express';
import cors from 'cors';
import { config as configDotenv } from 'dotenv'; // Cambio en la importación

// Cargar las variables de entorno desde el archivo .env
configDotenv();
// Mercado Pago SDK
import { MercadoPagoConfig, Preference } from 'mercadopago';

// Add Your credentials
const client = new MercadoPagoConfig({ accessToken:"TEST-6544339040733152-031522-4d7eb2feb9ef209e5b16692cae46e27b-191929307" });

const server = express();
server.use(express.json());
server.use(cors());

server.post('/Mercado_pago',async (req,res)=>{

    try {
        const body ={
            items:[
             {
                title:req.body.items[0].nombre,
                quantity:req.body.items[0].cantidad,
                unit_price:req.body.items[0].precio,
                currency_id : "ARS",
             },
         
            ],
            back_urls:{
                success:"https://www.mercadopago.com.ar/developers/en/docs/credentials",
                failure:"https://www.youtube.com/watch?v=vEXwN9-tKcs&ab_channel=onthecode",
                pending:"",
            },
            auto_return:"approved"

        
        };
        const preference = new Preference(client);
        const resutlt = await preference.create({body});

 res.status(200).json(resutlt.api_response.init_point)
} catch (error) {
    console.log(error)
    res.status(500).json({
        error: "ERROR AL CREAR LA PREFERENCIA"
    })
}

})
server.get("/",(req,res) => {
    res.send("Servidor up")
});

server.listen(4000,() => console.log('servidor levantado') );

