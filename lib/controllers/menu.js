const Menu = require('../models/Menu')
const self = module.exports;

self.create = async (req, res) => {
    try {
        const menu = new Menu(req.body)
        menu.date = (new Date()).getTime()
        menu.isActive = true
        await menu.save()
        res.status(201).send(menu)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}

self.update = async (req, resp) => {
    try {
        await (new Menu(req.body)).validate()
        const count = await Menu.findOne({_id:req.params.id}).countDocuments()
        if(!count)
            throw new Error('Upss! No se encontrĂ³ el registro')
            req.body.lastUpdate = (new Date()).getTime();
        const result = await Menu.updateOne({_id:req.params.id}, req.body);
        resp.status(200).send(req.body)
    } catch (error) {
        resp.status(400).send({error:error.message})
    }
}
self.isActive = async (req, resp) => {
    try {
        const { id } = req.params
        const admin = await Menu.findOne({_id:id})
        if(!admin)
            throw new Error('Upss! No se encontrĂ³ el Elemento')
        admin.isActive = req.body.isActive;
        admin.lastUpdate = (new Date()).getTime()
        const result = await admin.save();
        resp.status(200).send(result)
    } catch (error) {
        resp.status(400).send({error:error.message})
    }
}
self.retrieve = async(req, res) => {    
    try {
        const consulta = await Menu.find({}).sort({index:1})
        if(!consulta)
        res.status(404).send()
        res.status(200).send(consulta)
    } catch (error) {
        res.status(400).send(error)
    }
}

self.get  =  async(req, res) => {    
    try {
        const menu = await Menu.findOne({_id:req.params.id})
        if(!menu)
        res.status(404).send()
        res.status(200).send(menu)
    } catch (error) {
        res.status(400).send(error)
    }
}

self.delete  =  async(req, res) => {    
    try {
        const response = await Menu.deleteOne({_id:req.params.id})
        if(!response.deletedCount)
            res.status(404).send({ error : "El registro no existe"})
        else
            res.status(200).send({})
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}

self.order = async (req, resp) => {
    try {
        if(!req.body.length)
            throw new Error('Upss! No se encontrĂ³ el registro')

        for(let i in req.body){
            const item = req.body[i]
            await Menu.updateOne({ _id:item._id }, { $set: { index: item.index } });
        }
        resp.status(200).send({})
    } catch (error) {
        resp.status(400).send({error:error.message})
    }
}