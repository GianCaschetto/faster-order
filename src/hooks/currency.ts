
export async function useCurrency(){
    const response = await fetch("https://pydolarvenezuela-api.vercel.app/api/v1/dollar?page=bcv");
    const data = await response.json();
    const tasaBCV = data.monitors.usd;
    return {tasaBCV};
}

