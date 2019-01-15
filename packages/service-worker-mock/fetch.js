module.exports = async (request) => {
  const response = new Response('Response from service-worker-mock/fetch.js', {
    status: 200,
    statusText: 'ok.'
  });
  response.url = request.url;
  return response;
};
