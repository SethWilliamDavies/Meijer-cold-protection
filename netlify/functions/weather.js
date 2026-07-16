exports.handler = async (event) => {
  const lat = event.queryStringParameters?.lat;
  const lon = event.queryStringParameters?.lon;
  const apiKey = process.env.OPEN_METEO_API_KEY;

  if (!lat || !lon) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing lat or lon' })
    };
  }

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing OPEN_METEO_API_KEY environment variable' })
    };
  }

  const url =
    `https://customer-api.open-meteo.com/v1/forecast` +
    `?latitude=${encodeURIComponent(lat)}` +
    `&longitude=${encodeURIComponent(lon)}` +
    `&hourly=temperature_2m` +
    `&temperature_unit=fahrenheit` +
    `&forecast_days=2` +
    `&timezone=auto` +
    `&apikey=${encodeURIComponent(apiKey)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
