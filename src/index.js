require("dotenv").config(); // env 파일에서 환경변수 불러오기

const koa = require("koa");
const Router = require("koa-router");

const app = new koa();
const router = new Router();
const api = require("./api");

const mongoose = require("mongoose");
const bodyParser = require("koa-bodyparser");

const { jwtMiddleware } = require("lib/token");

mongoose.Promise = global.Promise; //Node 의 네이티브 Promise 사용
//mongodb 연결
mongoose
  .connect(process.env.MONGO_URI, {
    promiseLibrary: global.Promise,
  })
  .then((res) => {
    console.log("Successfully connected to mongodb");
  })
  .catch((e) => {
    console.log(e);
  });

const port = process.env.PORT || 4000; // PORT값이 설정되어 있지 않다면 4000을 사용

app.use(bodyParser()); //바디파서 적용, 라우터 적용코드보다 상단에 있어야 한다.
app.use(jwtMiddleware);
router.use("/api", api.routes());

app.use(router.routes()).use(router.allowedMethods());
app.listen(4000, () => {
  console.log("heurm server is listening to port 4000");
});
