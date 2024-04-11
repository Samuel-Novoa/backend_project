import { getConfig } from "../config";

//imports
const config = getConfig();

//sync models up to date
export const syncModels = async (sequelize, model, options = {}) => {
  try {
    await model.sync(options);
  } catch (error) {
    console.error(`Error syncing the model ${model.name}:`, error);
  }
};

//generate random string
export const generateRandomString = (type, length) => {
  let characters;
  if (type === "numeric") {
    characters = "0123456789";
  } else if (type === "characters") {
    characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  } else {
    characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  }
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
};


// Función para calcular el porcentaje de humedad de un producto
export const calcularHumedad = (pesoInicial, pesoFinal) => {
  return ((pesoInicial - pesoFinal) / pesoInicial) * 100;
};

// Función para calcular el tiempo de secado en horas y minutos
export const calcularTiempoSecadoHorasMinutos = (pesoInicial, pesoFinal, porcentajePorHora, temperatura) => {
  const tiempoSecadoHoras = (pesoInicial - pesoFinal) / (porcentajePorHora / 100);
  const horas = Math.floor(tiempoSecadoHoras);
  const minutos = Math.round((tiempoSecadoHoras - horas) * 60);
  return { horas, minutos };
};
