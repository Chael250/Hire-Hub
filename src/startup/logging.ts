import winston from "winston"

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        new winston.transports.File({filename:"logfile.log"})
    ]
})

function log() {
    logger.exceptions.handle(
        new winston.transports.Console({
            format: winston.format.timestamp()
        }),
        new winston.transports.File({filename:"uncaughtExceptions.log"})
    )

    logger.rejections.handle(
        new winston.transports.Console({
            format: winston.format.timestamp()
        }),
        new winston.transports.File({filename:"unhandledExceptions.log"})
    )
}

export { log , logger }