export const sendResponse = (data?: any, statusCode: number = 200) => {
  const response: Record<string, unknown> = {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
  };

  if (data) {
    response["body"] = JSON.stringify(data);
  }

  return response;
};
