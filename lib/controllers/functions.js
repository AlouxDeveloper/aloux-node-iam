const Functions = require('../models/Functions')
const admin          = require('./admin')
const self = module.exports;

self.create = async (req, res) => {
    try {
        const functions = new Functions(req.body)
        functions.date = (new Date()).getTime()
        functions.isActive = true
        await functions.save()
        res.status(201).send(functions)
    } catch (error) {
        console.log(error)
        res.status(400).send({error:error.message})
    }
}

self.update = async (req, resp) => {
    try {
        await (new Functions(req.body)).validate()
        const count = await Functions.findOne({_id:req.params.id}).countDocuments()
        if(!count)
            throw new Error('Upss! No se encontrĂ³ el registro')
            req.body.lastUpdate = (new Date()).getTime();
        const result = await Functions.updateOne({_id:req.params.id}, req.body);
        resp.status(200).send(req.body)
    } catch (error) {
        resp.status(400).send({error:error.message})
    }
}
self.isActive = async (req, resp) => {
    try {
        const { id } = req.params
        const functions = await Functions.findOne({_id:id})
        if(!functions)
            throw new Error('Upss! No se encontrĂ³ el Elemento')
            functions.isActive = req.body.isActive;
            functions.lastUpdate = (new Date()).getTime()
        const result = await functions.save();
        resp.status(200).send(result)
    } catch (error) {
        resp.status(400).send({error:error.message})
    }
}
self.retrieve = async(req, res) => {    
    try {
        let consulta = [] 

        // ********* Mejora ********
        if((await admin.getMe(req, res)).permission['iam.permission.propietario'])
            consulta = await Functions.find({isActive: true}).sort({date:-1})
        else
            consulta = await Functions.find({'name': {$ne:'Propietario'}, isActive: true}).sort({date:-1})

        
        res.status(200).send(consulta)
    } catch (error) {
        res.status(400).send(error)
    }
}

self.get  =  async(req, res) => {    
    try {
        const functions = await Functions.findOne({_id:req.params.id}).populate([{ path: "_menu", },{ path: "_permission"}])
        if(!functions)
        res.status(404).send()
        res.status(200).send(functions)
    } catch (error) {
        res.status(400).send(error)
    }
}

self.delete  =  async(req, res) => {    
    try {
        const response = await Functions.deleteOne({_id:req.params.id})
        if(!response.deletedCount)
            res.status(404).send({ error : "El registro no existe"})
        else
            res.status(200).send({})
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}