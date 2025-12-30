const DB_URI =
  process.env.MONGO_URI ||
  process.env.DB_URI ||
  "mongodb://localhost:27017/notes";
const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE || "your-api-identifier";
const AUTH0_ISSUER =
  process.env.AUTH0_ISSUER ||
  process.env.AUTH0_ISSUER_BASE_URL ||
  "https://your-domain.auth0.com/";

const APP_NAME = "Notes App";

const NOTE_COLORS = ["#FFEB3B", "#FFCDD2", "#C8E6C9", "#BBDEFB", "#D1C4E9"];

const NOTE_DEFAULT = {
  id: "",
  text: "",
  color: NOTE_COLORS[0],
  highlighted: false,
  height: 128,
  orderId: 0,
  title: "",
  isHtml: false,
};

module.exports = {
  DB_URI,
  AUTH0_AUDIENCE,
  AUTH0_ISSUER,
  APP_NAME,
  NOTE_DEFAULT,
  NOTE_COLORS,
};
