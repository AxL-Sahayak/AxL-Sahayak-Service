import { createLogger, transports, format } from 'winston';
const { combine, timestamp, prettyPrint } = format;

const logger = createLogger({
    transports: [
        new transports.File({
            filename: 'errorLogs.log',
            level: 'error',
            format: combine(
                timestamp({ format: 'YYYY-MM-DDTHH:mm:ss' }),
                format.json(),
                prettyPrint()
            ),
        }),
        new transports.File({
            filename: 'infoLogs.log',
            level: 'info',
            format: combine(
                timestamp({ format: 'YYYY-MM-DDTHH:mm:ss' }),
                format.json(),
                prettyPrint()
            ),
        }),
    ],
});

export default logger;
