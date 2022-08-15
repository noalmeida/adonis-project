import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Moment from 'App/Models/Moment'
import Application from '@ioc:Adonis/Core/Application'
import { v4 as uuidv4 } from 'uuid'
import EmptyException from 'App/Exceptions/EmptyException'


export default class MomentsController {
  validationOptions = {
            size: '2mb',
            extnames: ['jpg', 'png', 'gif'],
    }
    public async store({ request, response }: HttpContextContract) {
        const RequestBody = request.body()
        
        const imageInput = request.file('image', this.validationOptions)
        
        if (imageInput?.isValid) {
            const imageInputUuid = `${uuidv4()}.${imageInput.extname}`
            await imageInput.move(Application.tmpPath('uploads'), {
                name: imageInputUuid
            })
            RequestBody.image = imageInputUuid;
             
        } else {
            return imageInput?.errors;
        }
        const moment = await Moment.create(RequestBody)
        response.status(201)
        return {
            message: "momento criado com sucesso!",
            data: moment
        }
    }
    public async index() {
        const moment = await Moment.all();
        return {
            message: "Registro retornado com sucesso",
            data: moment
        }
    }
    public async show({ params }: HttpContextContract) {
        let moment: any = '';
        try {
            moment = await Moment.findByOrFail('id', params.id);
        } catch (error) {
            throw new EmptyException("Não Existe registro para esse ID no banco de dados", 404, 'ERRO_CODE_EMPTY_DB')
        }
        if (moment) {
            return {
                message: 'Retornado registro passado por Id com sucesso',
                data: moment
            }
        }   
    }
    public async destroy({ params }: HttpContextContract) {
        const moment = await Moment.findByOrFail('id', params.id);
        if (moment) {
            moment.delete();
        } 
        return {
            message: "Registro deletado com sucesso",
            data : moment,
        }
    }
    public async update({ params, request }: HttpContextContract) {
        const RequestBody = request.body()
        const moment = await Moment.findByOrFail('id', params.id);

        moment.title = RequestBody.title;
        moment.description = RequestBody.description;

        if (moment.image != RequestBody.image || !moment.image) {
          const imageInput = request.file('image', this.validationOptions);
            if (imageInput) { 
                const imageInputUuid = `${uuidv4()}.${imageInput.extname}`
                await imageInput.move(Application.tmpPath('uploads'), {
                    name: imageInputUuid
                })
                moment.image = imageInputUuid; 
                moment.updatedAt 
                await moment.save();
            }     
         }
          
      
        return {
            message: "Registro atualizado com sucesso",
            data : moment,
        }
        
    }
}
