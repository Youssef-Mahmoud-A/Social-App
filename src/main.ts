import express from 'express'
import { authenticationController } from './modules';
import { globalErrorHandling } from './middleware';
import { PORT } from './config';
import { bootstrapDB } from './DB/connection.db';
import { sendEmail } from './common/utils/email';
import { EmailSubjectEnum } from './common/enum';


const app: express.Application = express()
app.use(express.json())
bootstrapDB(app, PORT)

app.all("/", (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    res.status(200).json({ message: "Done" })
})

app.use("/auth", authenticationController)
app.use(globalErrorHandling)
// sendEmail({subject:EmailSubjectEnum.CONFIRM_EMAIL, to:["youniesmahmoud8@gmail.com"], html:"Testing"})

