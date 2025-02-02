import { handlerPath } from '@libs/handlerResolver';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: 'delete',
                path: '/api/posts/{postId}',
                request: {
                    schemas: {
                    }
                }
            }
        }
    ]
}
