export const sendResponse = (data?: any, statusCode: number = 200) => {
  const response: Record<string, unknown> = {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };

  if (data) {
    response["body"] = JSON.stringify(data);
  }

  return response;
};
