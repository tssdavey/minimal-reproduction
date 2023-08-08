import { error, json, Router } from 'itty-router' 
import { createServerAdapter } from '@whatwg-node/server' 
import { createServer } from 'http' 

import 'isomorphic-fetch' //I think problem is in this library?
// import { Response } from 'node-fetch' //similar behaviour, but throws an error on two


export class responseOne extends Response {
  constructor(body) {
    super(body) //doesnt work
  }
}

export class responseTwo extends Response {
  constructor(body) {
    return new Response(body) //works
  }
}

const router = Router()

router.get('/one', (request) => {
  return new responseOne('hello world');
});

router.get('/two', (request) => {
  return new responseTwo('hello world');
});

router.all('*', () => new Response('Not Found.', { status: 404 }))

const ittyServer = createServerAdapter( 
  (request, env, ctx) => router.handle(request, env, ctx).then(json).catch(error) 
)

const httpServer = createServer(ittyServer) 
httpServer.listen(3001) 

export default ittyServer