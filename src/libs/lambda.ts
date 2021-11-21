import middy from "@middy/core"
import middyJsonBodyParser from "@middy/http-json-body-parser"
import httpSecurityHeaders from "@middy/http-security-headers"
import cors from "@middy/http-cors"

export const middyfy = (handler) => {
  return middy(handler)
    .use(middyJsonBodyParser())
    .use(httpSecurityHeaders({
      hidePoweredBy: {
        setTo: 'Unknown'
      },
      hsts: {
        maxAge: 10886400
      }
    }))
    .use(cors({
      methods: 'POST, PUT, OPTIONS, DELETE, GET',
      origin: '*'
    }))
}
