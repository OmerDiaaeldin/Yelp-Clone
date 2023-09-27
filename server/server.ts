import { Express, Request, Response } from 'express';
const express = require('express')
const cors= require("cors")
import {PrismaClient, Prisma} from '@prisma/client';
require("dotenv").config()

const prisma = new PrismaClient();

const app: Express = express();

app.use(cors());
app.use(express.json());

//get data of all restaurants
app.get("/api/v1/restaurants", async (req: Request, res: Response) => {
    try {
//        const restaurants = await db.query("select * from restaurants");
        const restaurants:{
            id: any,
            name: string,
            location: string,
            price_range: number
        }[] = await prisma.restaurants.findMany();
        let obj;
        for (obj of restaurants){
            obj.id = Number(obj.id)
        }
        res.status(200).json({
            'status': "success",
            'restaurants': restaurants,
        })
    } catch (error) {
    }
        
})

//get data of single restaurant
app.get("/api/v1/restaurants/:restaurant_id", async (req: Request, res: Response) => {
    
    try {
        //const restaurant = await db.query(`select * from restaurants where id = $1`, [req.params.restaurant_id])
        const restaurant:{
            id: any,
            name: string,
            location: string,
            price_range: number
        }|null = await prisma.restaurants.findUnique({
            where:{
                id: BigInt(req.params.restaurant_id),
            },
        })
        if(restaurant == null){
            throw "non-existent";
        }else{
            restaurant.id = Number(restaurant.id)
        }
        res.status(200).json({
            'status': 'success',
            'restaurant': restaurant,
        })
    } catch (error) {
        res.status(400).json({
            'status': 'failure',
            'error': error
        })
    }
})

//create a restaurant
app.post("/api/v1/restaurants", async (req: Request, res: Response) => {
    try {
        //const result = await db.query("INSERT INTO restaurants(name, location, price_range) VALUES ($1,$2,$3) returning *", [req.body.name, req.body.location, req.body.price_range]);
        const result:{
            id: any,
            name: string,
            location: string,
            price_range: number
        } = await prisma.restaurants.create({
            data: {
                name: req.body.name,
                location: req.body.location,
                price_range: req.body.price_range
            },
        })
        result.id = Number(result.id);
        
        res.status(200).json({
            'status': 'success',
            'data': result
        })
    } catch (error) {
        res.status(400).json({
            'status': 'failure',
            'data': error
        })
    }
})

//Update the restaurant data
app.put("/api/v1/restaurants/:restaurant_id", async (req: Request, res: Response) => {
    try {
        //const result = await db.query("UPDATE restaurants SET name=$1, location = $2, price_range = $3 WHERE id = $4 returning *", [req.body.name, req.body.location, req.body.price_range, req.params.restaurant_id]);
        const result:{
            id: any,
            name: string,
            location: string,
            price_range: number
        } = await prisma.restaurants.update({
            data: {
                name: req.body.name,
                location: req.body.location,
                price_range: req.body.price_range
            },
            where: {
                id: BigInt(req.params.restaurant_id)
            }
        })

        result.id = Number(result.id)
        res.status(200).json({
            'status': 'success',
            'data': result
        })
    } catch (error) {
        res.status(400).json({
            'status': 'failure',
            'data': error
        })
    }
})

//Delete the restaurant data
app.delete("/api/v1/restaurants/:restaurant_id", async (req: Request, res: Response) => {
    try {
        //const results = await db.query("DELETE FROM restaurants WHERE id=$1", [req.params.restaurant_id]);
        const result = await prisma.restaurants.delete({
            where: {
                id: Number(req.params.restaurant_id)
            }
        })
        res.status(200).json({
            'status': 'success',
        })
    } catch (error) {
        res.status(400).json({
            'status': 'failure',
            'data': error
        })
    }
})


const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`server is up and running at port ${port}`)
})