const axios = require("axios");

const STACK = ['backend', 'frontend'];
const LEVEL  = ['debug', 'info', 'warn', 'error', 'fatal'];

const PACKAGESForBoth = ['auth', 'config', 'middleware', 'utils'];

const PACKAGESForFrontEnd = ['cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service' , ...PACKAGESForBoth];
const PACKAGESForBAckEnd= ['api', 'component', 'hook', 'page', 'state', 'style' , ...PACKAGESForBoth];


async function LogMiddleware(stack, level, package, message) {
    
    if (!STACK.includes(stack)) {
        throw new Error(`Invalid stack: ${stack} stack must be in ${stack.join(",")}`);
    }

    if (!LEVEL.includes(level)) {
        throw new Error(`Invalid level: ${level}. level must be in: ${VALID_LEVELS.join(', ')}`);
    }

    if (stack == backend ) {
        if(!PACKAGESForBAckEnd.includes(package))
        throw new Error(`Invalid package ${package} for stack ${stack} it must be in ${PACKAGESForBAckEnd.join(",")}`);
    }
    else{
        if(!PACKAGESForFrontEnd.includes(package))
        throw new Error(`Invalid package ${package} for stack ${stack} it must be in ${PACKAGESForFrontEnd.join(",")}`);
    }

    const body = {
        stack,
        level,
        package,
        message
    };

    try {
        const response = await axios.post('http://20.244.56.144/evaluation-service/logs' , body)

        return await response.json();

    } catch (error) {
        console.error('Failed to send log:', error);
        throw error;
    }
}


module.exports = {LogMiddleware};