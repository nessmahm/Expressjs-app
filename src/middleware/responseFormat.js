const formatResponse = (status, data) => {
    return { status, data };
};

const customMiddleware = (request, response, next) => {

    try {
        const oldJSON = response.json;
        response.json = (data) => {
            if (data && data.then !== undefined) {
                return data.then((responseData) => {
                    const finalResponse = { data: responseData, status: response.statusCode==200 ? "success" :"fail" };
                    response.json = oldJSON;
                    return oldJSON.call(response, finalResponse);
                }).catch((error) => {
                    next(error);
                });
            } else {
                const finalResponse = { data: data, status: response.statusCode==200 ? "success" :"fail"  };
                response.json = oldJSON;
                return oldJSON.call(response, finalResponse);
            }
        };

        next();
    } catch (error) {
        next(error);
    }
};
module.exports = customMiddleware;