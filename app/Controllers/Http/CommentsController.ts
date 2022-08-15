 import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Comment from 'App/Models/Comment';
import Moment from 'App/Models/Moment';

export default class CommentsController {

    public async store({ request, response, params } : HttpContextContract) {
        const body = request.body();
        const momentId = params.momentId;

        await Moment.findByOrFail('id', momentId)
        body.moment_id = momentId;

        const comment = await Comment.create(body);
        response.status(201);

        return {
            message: "Comentário inserido com sucesso",
            data: comment,
        };
    }
}
